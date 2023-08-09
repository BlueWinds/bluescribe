import _ from 'lodash'

import { getEntry, countBy } from './validate'

export const randomId = () => {
  const hex = () => Math.floor(Math.random() * 16).toString(16)
  const hex4 = () => hex() + hex() + hex() + hex()
  return `${hex4()}-${hex4()}-${hex4()}-${hex4()}`
}

export const getCatalogue = (roster, path, gameData) => {
  const force = _.get(roster, path.replace(/forces.force.(\d+).*/, 'forces.force.$1'))
  if (!force) {
    return gameData.gameSystem
  }
  return gameData.catalogues[force.catalogueId]
}

export const gatherCatalogues = (catalogue, gameData, catalogues = [gameData.gameSystem]) => {
  if (catalogues.includes(catalogue)) {
    return catalogue
  }

  catalogues.push(catalogue)

  catalogue.catalogueLinks?.forEach((link) => {
    gatherCatalogues(gameData.catalogues[link.targetId], gameData, catalogues)
  })

  return catalogues
}

export const findId = (gameData, catalogue, id) => {
  if (gameData.gameSystem.ids[id]) {
    return gameData.gameSystem.ids[id]
  } else if (catalogue.ids[id]) {
    return catalogue.ids[id]
  } else {
    for (let cl of catalogue.catalogueLinks || []) {
      const found = findId(gameData, gameData.catalogues[cl.targetId], id)
      if (found) {
        return found
      }
    }
  }
}

export const sumCosts = (entry, costs = {}) => {
  if (entry.forces) {
    entry.forces?.force.forEach((force) => {
      sumCosts(force, costs)
    })
    return costs
  }

  ;(entry.costs?.cost || entry.costs)?.forEach((c) => {
    if (c.value !== 0) {
      costs[c.name] = (costs[c.name] | 0) + c.value
    }
  })
  entry.selections?.selection.forEach((selection) => {
    sumCosts(selection, costs)
  })

  return costs
}

export const selectionName = (selection) =>
  `${selection.customName ? selection.customName + ' - ' : ''}${selection.number > 1 ? `${selection.number}x ` : ''}${
    selection.name
  }`
export const costString = (costs) =>
  Object.keys(costs)
    .filter((c) => costs[c])
    .sort()
    .map((name) => `${costs[name]} ${name}`)
    .join(', ')

export const textProfile = (profiles) => {
  const a =
    Object.entries(profiles)
      .map(([name, profileList]) => {
        return `<div>
      <table>
        <thead>
          <th>${name}</th>
          ${profileList[0][1].characteristics?.map((c) => `<th>${c.name}</th>`).join('\n')}
        </thead>
        <tbody>
          ${profileList
            .map(
              ([number, profile]) => `<tr>
            <td>${number > 1 ? `x${number} ` : ''}${profile.name}</td>
            ${profile.characteristics?.map((c) => `<td>${c['#text']}</td>`).join('\n')}
          </tr>`,
            )
            .join('\n')}
        </tbody>
      </table>
    </div>`
      })
      .join('\n') || null
  return a
}

export const getMinCount = (entry) =>
  (!entry.hidden && entry.constraints?.find((c) => c.type === 'min' && c.scope === 'parent')?.value) ?? 0
export const getMaxCount = (entry) =>
  entry.constraints?.find((c) => c.type === 'max' && c.scope === 'parent')?.value ?? -1
export const isCollective = (entry) => entry.collective || entry.selectionEntries?.every(isCollective)

export const createRoster = (name, gameSystem) => {
  const roster = {
    id: randomId(),
    name: name,
    battleScribeVersion: '2.03',
    gameSystemId: gameSystem.id,
    gameSystemName: gameSystem.name,
    gameSystemRevision: gameSystem.revision,
    xmlns: 'http://www.battlescribe.net/schema/rosterSchema',
    __: {
      filename: name + '.rosz',
      updated: true,
    },
    costs: {
      cost:
        gameSystem.costTypes?.map((ct) => ({
          name: ct.name,
          typeId: ct.id,
          value: 0,
        })) || [],
    },
  }

  return roster
}

const getMinForceCount = (entry, roster) =>
  (!entry.hidden &&
    entry.constraints?.find(
      (c) =>
        c.type === 'min' &&
        (c.scope === 'force' || (c.scope === 'roster' && countBy(roster, entry.id, entry) < c.value)),
    )?.value) ??
  0

export const addForce = (roster, forceId, factionId, gameData) => {
  const entry = findId(gameData, gameData.catalogues[factionId], forceId)
  roster.forces = roster.forces || { force: [] }

  const force = {
    id: randomId(),
    name: entry.name,
    entryId: forceId,
    catalogueId: factionId,
    catalogueRevision: gameData.catalogues[factionId].revision,
    catalogueName: gameData.catalogues[factionId].name,
    publications: {
      publication: [
        ...(gameData.catalogues[factionId].publications || []).map((p) => _.pick(p, ['id', 'name'])),
        ...(gameData.gameSystem.publications || []).map((p) => _.pick(p, ['id', 'name'])),
        ..._.flatten(
          gameData.catalogues[factionId].catalogueLinks?.map(
            (cl) => gameData.catalogues[cl.targetId].publications || [],
          ),
        ).map((p) => _.pick(p, ['id', 'name'])),
      ],
    },
    categories: {
      category: [
        {
          id: randomId(),
          name: 'Uncategorised',
          entryId: '(No Category)',
          primary: 'false',
        },
        ...entry.categoryLinks.map((c) => ({
          id: c.id,
          name: c.name,
          entryId: c.targetId,
          primary: 'false',
        })),
      ],
    },
  }

  const path = `forces.force.${roster.forces.force.length}.selections.selection.10000`
  roster.forces.force.push(force)

  gatherCatalogues(gameData.catalogues[force.catalogueId], gameData).forEach((catalogue) => {
    catalogue.entryLinks?.forEach((selectionEntry) => {
      const entry = getEntry(roster, path, selectionEntry.id, gameData)
      if (getMinForceCount(entry, roster) === 1) {
        addSelection(force, entry, gameData, null, catalogue)
      }
    })

    catalogue.selectionEntries?.forEach((selectionEntry) => {
      const entry = getEntry(roster, path, selectionEntry.id, gameData)
      if (getMinForceCount(entry, roster) === 1) {
        addSelection(force, entry, gameData, null, catalogue)
      }
    })
  })
}

export const addSelection = (base, selectionEntry, gameData, entryGroup, catalogue, number = 1) => {
  base.selections = base.selections || { selection: [] }
  const collective = isCollective(selectionEntry)

  const newSelection = _.omitBy(
    {
      id: randomId(),
      name: selectionEntry.name,
      entryId: selectionEntry.id,
      from: selectionEntry.from,
      number: collective ? number : 1,
      page: selectionEntry.page,
      publicationId: selectionEntry.publicationId,
      type: selectionEntry.type,
      categories: { category: [] },
      costs: { cost: _.cloneDeep(selectionEntry.costs) || [] },
      profiles: { profile: [] },
      rules: { rule: [] },
    },
    _.isUndefined,
  )

  newSelection.costs.cost.forEach((c) => {
    c.value *= newSelection.number
  })

  if (entryGroup) {
    if (getMaxCount(entryGroup) === 1) {
      base.selections.selection = base.selections.selection.filter((s) => !s.entryGroupId?.endsWith(entryGroup.id))
    }

    newSelection.entryGroupId = entryGroup.id
  }

  addCategories(newSelection, selectionEntry, gameData, catalogue)
  addProfiles(newSelection, selectionEntry)
  addRules(newSelection, selectionEntry)

  selectionEntry.selectionEntries?.forEach((selection) => {
    const min = getMinCount(selection)
    if (min) {
      addSelection(newSelection, selection, gameData, null, catalogue, collective ? min * number : min)
    }
  })

  const handleGroup = (entryGroup) => {
    let minGroup = getMinCount(entryGroup)
    _.sortBy(entryGroup.selectionEntries, (e) => e.id !== entryGroup.defaultSelectionEntryId).forEach((selection) => {
      let max = getMaxCount(selection)
      if (max === -1) {
        max = 10000000
      }
      const min = Math.min(max, Math.max(getMinCount(selection), minGroup))

      if (min > 0) {
        addSelection(newSelection, selection, gameData, entryGroup, catalogue, collective ? min * number : min)
        minGroup -= min
      }
    })

    entryGroup.selectionEntryGroups?.forEach(handleGroup)
  }

  selectionEntry.selectionEntryGroups?.forEach(handleGroup)

  base.selections.selection.push(newSelection)
  if (!collective && number > 1) {
    addSelection(base, selectionEntry, gameData, entryGroup, catalogue, number - 1)
  }
}

const addCategories = (selection, selectionEntry, gameData, catalogue) => {
  selection.categories.category.push(
    ...(selectionEntry.categoryLinks || []).map((c) => ({
      id: randomId(),
      name: findId(gameData, catalogue, c.targetId).name,
      entryId: c.targetId,
      primary: c.primary,
    })),
  )
}

const addProfiles = (selection, selectionEntry) => {
  selection.profiles.profile.push(
    ...(selectionEntry.profiles || []).map((profile) => ({
      id: profile.id,
      name: profile.name,
      hidden: profile.hidden,
      typeId: profile.typeId,
      typeName: profile.typeName,
      publicationId: profile.publicationId,
      page: profile.page,
      characteristics: { characteristic: profile.characteristics || [] },
    })),
  )
}

const addRules = (selection, selectionEntry) => {
  selection.rules.rule.push(
    ...(selectionEntry.rules || []).map((rule) => ({
      id: rule.id,
      name: rule.name,
      hidden: rule.hidden,
      publicationId: rule.publicationId,
      page: rule.page,
      description: rule.description,
    })),
  )
}

export const refreshSelection = (roster, path, selection, gameData) => {
  const selectionEntry = getEntry(roster, path, selection.entryId, gameData, true)
  if (!selectionEntry) {
    return
  }

  _.assign(selection, {
    name: selectionEntry.name,
    type: selectionEntry.type,
    categories: { category: [] },
    costs: { cost: _.cloneDeep(selectionEntry.costs) || [] },
    profiles: { profile: [] },
    rules: { rule: [] },
  })

  if (selectionEntry.from) {
    selection.from = selectionEntry.from
  }

  selection.costs.cost.forEach((c) => {
    c.value *= selection.number
  })

  addCategories(selection, selectionEntry, gameData, getCatalogue(roster, path, gameData))
  addProfiles(selection, selectionEntry, gameData)
  addRules(selection, selectionEntry, gameData)

  if (selectionEntry.collective) {
    const min = getMinCount(selectionEntry)
    const max = getMaxCount(selectionEntry)
    if (min > selection.number) {
      selection.number = min
    }

    if (max !== -1 && max < selection.number) {
      selection.number = max
    }
  }

  selection.selections?.selection.forEach((subSelection, index) =>
    refreshSelection(roster, `${path}.selections.selection.${index}`, subSelection, gameData),
  )
}

export const refreshRoster = (roster, gameData) => {
  const newRoster = createRoster(roster.name, gameData.gameSystem)
  newRoster.__.filename = roster.__.filename
  newRoster.costLimits = roster.costLimits
  newRoster.customNotes = roster.customNotes

  roster.forces.force.forEach((force, index) => {
    addForce(newRoster, force.entryId, force.catalogueId, gameData)
    newRoster.forces.force[index].selections = { selection: [] }

    force.selections.selection.forEach((selection, selectionIndex) => {
      newRoster.forces.force[index].selections.selection.push(selection)
      refreshSelection(newRoster, `forces.force.${index}.selections.selection.${selectionIndex}`, selection, gameData)
    })
  })

  newRoster.costs = {
    cost: Object.entries(sumCosts(newRoster)).map(([name, value]) => ({
      name,
      value,
      typeId: gameData.gameSystem.costTypes.find((ct) => ct.name === name).id,
    })),
  }

  return newRoster
}

export const copySelection = (selection) => {
  const copy = _.cloneDeep(selection)

  function reId(x) {
    if (x.id) {
      x.id = randomId()
    }

    for (let attr in x) {
      if (typeof x[attr] === 'object') {
        reId(x[attr])
      }
    }
  }

  reId(copy)
  return copy
}
