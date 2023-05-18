import _ from 'lodash'

import { getEntry } from './validate'

export const randomId = () => {
  const hex = () => Math.floor(Math.random() * 16).toString(16)
  const hex4 = () => hex() + hex() + hex() + hex()
  return `${hex4()}-${hex4()}-${hex4()}-${hex4()}`
}

export const sumCosts = (entry, costs = {}) => {
  (entry.costs?.cost || entry.costs)?.forEach(c => {
    if (c._value !== 0) {
      costs[c._name] = (costs[c._name] | 0) + c._value
    }
  })
  entry.selections?.selection.forEach(selection => {
    sumCosts(selection, costs)
  })

  return costs
}

export const selectionName = selection => `${selection._customName ? selection._customName + ' - ' : ''}${selection._number > 1 ? `${selection._number}x ` : ''}${selection._name}`
export const costString = costs => Object.keys(costs).filter(c => costs[c]).sort().map(name => `${costs[name]} ${name}`).join(', ')

export const textProfile = profiles => {
  const a = Object.entries(profiles).map(([name, profileList]) => {
    return `<div>
      <table>
        <thead>
          <th>${name}</th>
          ${profileList[0][1].characteristics.map(c => `<th>${c._name}</th>`).join('\n')}
        </thead>
        <tbody>
          ${profileList.map(([number, profile]) => `<tr>
            <td>${number > 1 ? `x${number} ` : ''}${profile._name}</td>
            ${profile.characteristics.map(c => `<td>${c['#text']}</td>`).join('\n')}
          </tr>`).join('\n')}
        </tbody>
      </table>
    </div>`
  }).join('\n') || null
  return a
}

export const getMinCount = (entry) => (!entry._hidden && entry.constraints?.find(c => c._type === 'min' && c._scope === 'parent')?._value) ?? 0
export const getMaxCount = (entry) => entry.constraints?.find(c => c._type === 'max' && c._scope === 'parent')?._value ?? -1
export const isCollective = (entry) => entry._collective || entry.selectionEntries?.every(isCollective)

export const createRoster = (name, gameSystem) => {
  const roster = {
    _id: randomId(),
    _name: name,
    _battleScribeVersion: "2.03",
    _gameSystemId: gameSystem._id,
    _gameSystemName: gameSystem._name,
    _gameSystemRevision: gameSystem._revision,
    _xmlns: "http://www.battlescribe.net/schema/rosterSchema",
    __: {
      filename: name + '.rosz',
      updated: true,
    }
  }

  return roster
}

export const addForce = (roster, forceId, factionId, gameData) => {
  roster.forces = roster.forces || {force: []}
  roster.forces.force.push({
    _id: randomId(),
    _name: gameData.ids[forceId]._name,
    _entryId: forceId,
    _catalogueId: factionId,
    _catalogueRevision: gameData.ids[factionId]._revision,
    _catalogueName: gameData.ids[factionId]._name,
    publications: {
      publication: [
        ...(gameData.ids[factionId].publications || []).map(p => _.pick(p, ['_id', '_name'])),
        ...(gameData.gameSystem.publications || []).map(p => _.pick(p, ['_id', '_name'])),
        ...(_.flatten(gameData.ids[factionId].catalogueLinks?.map(cl => gameData.ids[cl._targetId].publications || []))).map(p => _.pick(p, ['_id', '_name'])),
      ]
    },
    categories: {
      category: [
        {
          _id: randomId(),
          _name: "Uncategorised",
          _entryId: "(No Category)",
          _primary: "false",
        },
        ...gameData.ids[forceId].categoryLinks.map(c => ({
          _id: c._id,
          _name: c._name,
          _entryId: c._targetId,
          _primary: "false",
        }))
      ]
    }
  })
}

export const addSelection = (base, selectionEntry, gameData, entryGroup, number = 1) => {
  base.selections = base.selections || {selection: []}
  const collective = isCollective(selectionEntry)

  const newSelection = _.omitBy({
    _id: randomId(),
    _name: selectionEntry._name,
    _entryId: selectionEntry._id,
    _number: collective ? number : 1,
    _page: selectionEntry._page,
    _publicationId: selectionEntry._publicationId,
    _type: selectionEntry._type,
    categories: {category: []},
    costs: {cost: _.cloneDeep(selectionEntry.costs)},
    profiles: {profile: []},
    rules: {rule: []},
  }, _.isUndefined)

  newSelection.costs.cost.forEach(c => {
    c._value *= newSelection._number
  })

  if (entryGroup) {
    if (getMaxCount(entryGroup) === 1) {
      base.selections.selection = base.selections.selection.filter(s => !s._entryGroupId?.endsWith(entryGroup._id))
    }

    newSelection._entryGroupId = entryGroup._id
  }

  addCategories(newSelection, selectionEntry, gameData)
  addProfiles(newSelection, selectionEntry)
  addRules(newSelection, selectionEntry)

  selectionEntry.selectionEntries?.forEach(selection => {
    const min = getMinCount(selection)
    if (min) {
      addSelection(newSelection, selection, gameData, null, collective ? min * number : min)
    }
  })

  const handleGroup = entryGroup => {
    entryGroup.selectionEntries?.forEach(selection => {
      let min = getMinCount(selection)

      if (min) {
        addSelection(newSelection, selection, gameData, entryGroup, collective ? min : min * number)
      } else if (getMinCount(entryGroup) && entryGroup._defaultSelectionEntryId && selection._id.includes(entryGroup._defaultSelectionEntryId)) {
        min = getMinCount(entryGroup)
        addSelection(newSelection, selection, gameData, entryGroup, collective ? min : min * number)
      }
    })

    entryGroup.selectionEntryGroups?.forEach(handleGroup)
  }

  selectionEntry.selectionEntryGroups?.forEach(handleGroup)

  base.selections.selection.push(newSelection)
  if (!collective && number > 1) {
    addSelection(base, selectionEntry, gameData, entryGroup, number - 1)
  }
}

const addCategories = (selection, selectionEntry, gameData) => {
  selection.categories.category.push(...(selectionEntry.categoryLinks || []).map(c => ({
    _id: randomId(),
    _name: gameData.ids[c._targetId]._name,
    _entryId: c._targetId,
    _primary: c._primary,
  })))
}

const addProfiles = (selection, selectionEntry) => {
  selection.profiles.profile.push(...(selectionEntry.profiles || []).map(profile => ({
    _id: profile._id,
    _name: profile._name,
    _hidden: profile._hidden,
    _typeId: profile._typeId,
    _typeName: profile._typeName,
    _publicationId: profile._publicationId,
    _page: profile._page,
    characteristics: {characteristic: profile.characteristics},
  })))
}

const addRules = (selection, selectionEntry) => {
  selection.rules.rule.push(...(selectionEntry.rules || []).map(rule => ({
    _id: rule._id,
    _name: rule._name,
    _hidden: rule._hidden,
    _publicationId: rule._publicationId,
    _page: rule._page,
    description: rule.description,
  })))
}

export const refreshSelection = (roster, path, selection, gameData) => {
  const selectionEntry = getEntry(roster, path, selection._entryId, gameData, true)

  _.assign(selection, {
    _name: selectionEntry._name,
    _type: selectionEntry._type,
    categories: {category: []},
    costs: {cost: _.cloneDeep(selectionEntry.costs)},
    profiles: {profile: []},
    rules: {rule: []},
  })

  selection.costs.cost.forEach(c => {
    c._value *= selection._number
  })

  addCategories(selection, selectionEntry, gameData)
  addProfiles(selection, selectionEntry, gameData)
  addRules(selection, selectionEntry, gameData)

  selection.selections?.selection.forEach((subSelection, index) => refreshSelection(roster, `${path}.selections.selection.${index}`, subSelection, gameData))
}

export const refreshRoster = (roster, gameData) => {
  const newRoster = createRoster(roster._name, gameData.gameSystem)
  newRoster.__.filename = roster.__.filename
  newRoster.costLimits = roster.costLimits
  newRoster.customNotes = roster.customNotes

  roster.forces.force.forEach((force, index) => {
    addForce(newRoster, force._entryId, force._catalogueId, gameData)
    newRoster.forces.force[index].selections = {selection: []}

    force.selections.selection.forEach((selection, selectionIndex) => {
      newRoster.forces.force[index].selections.selection.push(selection)
      refreshSelection(newRoster, `forces.force.${index}.selections.selection.${selectionIndex}`, selection, gameData)
    })
  })

  return newRoster
}

export const copySelection = (selection) => {
  const copy = _.cloneDeep(selection)

  function reId(x) {
    if (x._id) {
      x._id = randomId()
    }

    for (let attr in x) {
      if (typeof x[attr] === 'object') { reId(x[attr]) }
    }
  }

  reId(copy)
  return copy
}
