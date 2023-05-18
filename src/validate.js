import _ from 'lodash'
import an from 'indefinite'
import pluralize from 'pluralize'

import { randomId } from './utils'

const arrayMerge = (dest, source) => {
  Object.entries(source).forEach(([key, value]) => {
    dest[key] = dest[key] || []
    dest[key].push(...value.sort())
  })
}

export const validateRoster = (roster, gameData) => {
  const errors = {}

  try {
    if (!roster.forces || roster.forces.force.length < 1) {
      errors[''] = ['A roster requires at least one Force.']
      return errors
    }

    gameData.gameSystem.categoryEntries.forEach(categoryEntry => {
      const entry = getEntry(roster, '', categoryEntry._id, gameData)
      arrayMerge(errors, checkConstraints(roster, '', entry, gameData))
    })

    roster.forces?.force.forEach((force, index) => {
      arrayMerge(errors, validateForce(roster, `forces.force.${index}`, force, gameData))
    })
  } catch (e) {
    e.location = 'roster'
    errors[''] = errors[''] || []
    errors[''].push(e)
  }

  return errors
}

const validateForce = (roster, path, force, gameData) => {
  const errors = {}

  try {
    gameData.gameSystem.entryLinks.forEach(entryLink => {
      const entry = getEntry(roster, path, entryLink._id, gameData)
      arrayMerge(errors, checkConstraints(roster, path, entry, gameData))
    })

    const catalogue = gameData.ids[force._catalogueId]
    catalogue.entryLinks?.forEach(selectionEntry => {
      const entry = getEntry(roster, path, selectionEntry._id, gameData)
      arrayMerge(errors, checkConstraints(roster, path, entry, gameData))
    })

    const f = gameData.ids[force._entryId]
    f.categoryLinks?.forEach(categoryLink => {
      const entry = getEntry(roster, path, categoryLink._id, gameData)
      arrayMerge(errors, checkConstraints(roster, path, entry, gameData))
    })

    force.selections?.selection.forEach((selection, index) => {
      arrayMerge(errors, validateSelection(roster, `${path}.selections.selection.${index}`, selection, gameData))
    })
  } catch (e) {
    e.path = path
    e.location = force._name
    errors[''] = errors[''] || []
    errors[''].push(e)
  }

  return errors
}

const validateSelection = (roster, path, selection, gameData) => {
  const errors = {}
  const entry = getEntry(roster, path, selection._entryId, gameData)

  try {
    if (entry._hidden) {
      arrayMerge(errors, {
        [path]: [`${selection._name} is hidden and cannot be selected.`],
      })
    }

    const handleLink = link => {
      const linkEntry = getEntry(roster, path, link._id, gameData)
      arrayMerge(errors, checkConstraints(roster, path, linkEntry, gameData))
    }

    const handleSelection = selectionEntry => {
      arrayMerge(errors, checkConstraints(roster, `${path}.selections.selection.100000`, selectionEntry, gameData, true))
    }

    const handleGroup = group => {
      if (group._hidden) {
        if (selection.selections?.selection.some(s => s._entryGroupId === group._id)) {
          arrayMerge(errors, {
            [path]: [`${group._name} is hidden and cannot be selected.`],
          })
        }
      }
      arrayMerge(errors, checkConstraints(roster, `${path}.selections.selection.100000`, group, gameData, true))

      group.entryLinks?.forEach(handleLink)
      group.selectionEntries?.forEach(handleSelection)
      group.selectionEntryGroups?.forEach(handleGroup)
    }

    entry.entryLinks?.forEach(handleLink)
    entry.selectionEntries?.forEach(handleSelection)
    entry.selectionEntryGroups?.forEach(handleGroup)

    selection.selections?.selection.forEach((selection, index) => {
      arrayMerge(errors, validateSelection(roster, `${path}.selections.selection.${index}`, selection, gameData))
    })

  } catch (e) {
    e.path = path
    e.location = selection._name
    errors[''] = errors[''] || []
    errors[''].push(e)
    console.log(e)
  }

  return errors
}

const hasCategory = (subject, categoryId) => {
  return !!subject.categories?.category.some(c => c._entryId.includes(categoryId))
}

const countBy = (subject, entryId, entry, groupIds) => {
  if (!subject) { throw new Error('No subject while trying to countBy') }
  if (entry._shared) {
    entryId = _.last(entryId.split('::'))
  }

  if (subject._entryId?.includes(entryId) || subject._entryGroupId?.includes(entryId) || groupIds?.some(groupId => subject._entryGroupId === groupId) || subject._type === entryId || hasCategory(subject, entryId)) {
    return subject._number ?? 1
  }

  let count = subject.forces?.force.filter(force => force._entryId === entryId ).length ?? 0

  if (subject.forces) {
    if (entry._includeChildForces || entry._shared) {
      count += _.sum(subject.forces.force.map(force => countBy(force, entryId, entry, groupIds)))
    }
  }

  if (subject.selections) {
    if (entry._includeChildSelections || entry._shared) {
      count += _.sum(subject.selections.selection.map(selection => countBy(selection, entryId, entry, groupIds)))
    } else {
      count += _.sum(_.map(subject.selections.selection.filter(selection => {
        return selection._entryId.includes(entryId) || selection._entryGroupId?.includes(entryId)
      }), '_number'))
    }
  }

  if (_.isNaN(count)) { throw new Error('NaN while trying to countBy') }
  return count
}

const countByCategory = (subject, category, entry) => {
  const categoryId = _.last(category._id.split('::'))

  let count = (!subject._catalogueId && subject.categories?.category.some(c => c._entryId === categoryId)) ?? 0

  if (entry._includeChildSelections && subject.selections) {
    count += _.sum(subject.selections.selection.map(selection => countByCategory(selection, category, entry)))
  } else {
    count += subject.selections?.selection.filter(selection => {
      return selection.categories?.category.some(c => c._entryId === categoryId)
    }).length ?? 0
  }

  return count
}

const sumCost = (subject, entry, filterByCategory) => {
  let sum = 0

  // If we're a top-level roster, don't include the "costs" or we'll end up double-counting.
  if (!subject._gameSystemId) {
    if (!filterByCategory || subject.categories?.category.some(c => c._entryId === filterByCategory)) {
      sum += subject.costs?.cost.find(c => c._id === entry._field)?._value
    }
  }

  if (entry._includeChildForces && subject.forces) {
    sum += subject.forces.force.map(force => sumCost(force, entry, filterByCategory))
  }

  if (entry._includeChildSelections && subject.selections) {
    sum += subject.selections.selection.map(selection => sumCost(selection, entry, filterByCategory))
  }

  return sum
}

const collectGroupIds = (entry, ids = []) => {
  entry.selectionEntryGroups?.forEach(group => {
    ids.push(group._id)
    collectGroupIds(group, ids)
  })
  return ids
}

const checkConstraints = (roster, path, entry, gameData, group = false) => {
  const errors = []

  try {
    const groupIds = collectGroupIds(entry)
    if (entry.constraints) {
      entry.constraints?.forEach(constraint => {
        const subject = getSubject(roster, path, constraint)
        const occurances = entry._primary === undefined ? countBy(subject, entry._id, constraint, groupIds) : countByCategory(subject, entry, constraint)
        const value = constraint._value * (subject._number ?? 1)

        if (constraint._type === 'min' && value !== -1 && !entry._hidden && occurances < value) {
          if (value === 1) {
            errors.push(`${subject._name} must have ${an(pluralize.singular(entry._name))} selection`)
          } else {
            errors.push(`${subject._name} must have ${value - occurances} more ${pluralize(entry._name)}`)
          }
        }
        if (constraint._type === 'max' && value !== -1 && occurances > value * (subject._number ?? 1)) {
          if (value === 0) {
            errors.push(`${subject._name} cannot have ${an(pluralize.singular(entry._name))} selection`)
          } else {
            errors.push(`${subject._name} must have ${occurances - value} fewer ${pluralize(entry._name)}`)
          }
        }
      })
    }
  } catch (e) {
    e.path = path
    e.location = entry._name
    return {'': [e]}
  }

  return errors.length ? {[path]: errors} : {}
}

const applyModifiers = (roster, path, entry, gameData) => {
  const ids = {}
  function index(x, path = '') {
    if (typeof x == "object") {
      if (x._id) {
        ids[x._id] = path
      }
      if (x._typeId) {
        ids[x._typeId] = path
      }

      for (let attr in x) { index(x[attr], `${path}.${attr}`) }
    }
  }
  index(entry)

  const applyModifier = (modifier) => {
    if (!checkConditions(roster, path, modifier, gameData)) { return }

    const target = entry['_' + modifier._field] !== undefined ? `_${modifier._field}` : `${ids[modifier._field]}._value`.slice(1)
    if (modifier._type === 'set') {
      if (_.isNaN(modifier._value)) { throw new Error('NaN modifier._value') }
      _.set(entry, target, modifier._value)
    } else if (modifier._type === 'increment' || modifier._type === 'decrement') {
      let times = 1
      if (modifier.repeats) {
        let repeat = modifier.repeats[0]._repeats
        if (modifier._type === 'decrement') { repeat *= -1 }

        const subject = getSubject(roster, path, modifier.repeats[0])
        const value = subject ? countBy(subject, modifier.repeats[0]._childId, modifier.repeats[0]) : 0
        const round = modifier.repeats[0].roundUp ? Math.ceil : Math.floor

        times = repeat * round(value / modifier.repeats[0]._value)

      }

      _.set(entry, target, _.get(entry, target) + modifier._value * times)
    } else if (modifier._type === 'add') {
      if (modifier._field !== 'category') { throw new Error("modifier._type === 'add' while modifier._field !== 'category'") }

      entry.categoryLinks = entry.categoryLinks || []
      entry.categoryLinks.push({
        _id: randomId(),
        _hidden: false,
        _name: 'New CategoryLink',
        _primary: false,
        _targetId: modifier._value,
      })
    } else if (modifier._type === 'remove') {
      if (modifier._field !== 'category') { throw new Error("modifier._type === 'remove' while modifier._field !== 'category'") }

      entry.categoryLinks = entry.categoryLinks.filter(link => link._targetId !== modifier._value)
    } else if (modifier._type === 'append') {
      entry[modifier._field] += modifier._value
    } else if (modifier._type === 'set-primary' || modifier._type === 'unset-primary') {
      let category = entry.categoryLinks.find(cat => cat._targetId === modifier._value)
      if (category) {
        category._primary = modifier._type === 'set-primary'
      } else { entry.categoryLinks.push({
        _id: randomId(),
        _hidden: false,
        _name: 'New CategoryLink',
        _primary: modifier._type === 'set-primary',
        _targetId: modifier._value,
      })}
    } else {
      throw new Error(`Unknown modifier._type: ${modifier._type}`)
    }
  }

  const applyModifierGroup = (group) => {
    if (!checkConditions(roster, path, group, gameData)) { return }
    group.modifiers?.forEach(applyModifier)
    group.modifierGroups?.forEach(applyModifierGroup)
  }

  entry.modifiers?.forEach(applyModifier)
  entry.modifierGroups?.forEach(applyModifierGroup)
}

const checkConditions = (roster, path, entry, gameData) => {
  const results = [
    ...(entry.conditions?.map(c => checkCondition(roster, path, c, gameData)) || []),
    ...(entry.conditionGroups?.map(cg => checkConditions(roster, path, cg, gameData)) || []),
  ]

  if (entry._type === 'or') {
    return results.some(Boolean)
  }

  // Not a group, or _type === 'and'
  return results.every(Boolean)
}

const findByEntryId = (subject, entryId) => {
  if (typeof subject === "object") {
    if (subject._entryId?.includes(entryId)) { return subject }
    for (let attr in subject) {
      const found = findByEntryId(subject[attr], entryId)
      if (found) { return found }
    }
  }
}

const pathToForce = path => path.replace(/forces.force.(\d+).*/, 'forces.force.$1')
export const pathParent = path => path.replace(/.selections.selection.\d+$/, '')
const pathAncestors = path => {
  const ancestors = [path]
  while (pathParent(path) !== path) {
    path = pathParent(path)
    ancestors.push(path)
  }
  return ancestors
}

const getSubject = (roster, path, condition) => {
  switch (condition._scope) {
    case 'self': return _.get(roster, path)
    case 'parent': return _.get(roster, pathParent(path))
    case 'force': return path.length ? _.get(roster, pathToForce(path)) : roster
    case 'roster': return roster
    case 'ancestor': return pathAncestors(path).map(ancestor => _.get(roster, ancestor))
    case 'primary-catalogue': return { _entryId: _.get(roster, pathToForce(path) || 'forces.force.0')?._catalogueId }
    default: {
      const directAncestor = pathAncestors(path).find(startingPoint => _.get(roster, startingPoint)?._entryId?.includes(condition._scope))
      if (directAncestor) { return _.get(roster, directAncestor) }

      const startingPoint = condition._shared ? roster : _.get(roster, path)
      return findByEntryId(startingPoint, condition._scope)
    }
  }
}

const getValue = (condition, subject, gameData) => {
  const childId = gameData.ids[condition._childId]?._targetId || condition._childId

  if (!subject) { return NaN }
  switch (condition._field) {
    case 'selections': return subject.selections === undefined ? NaN : countBy(subject, childId, condition)
    case 'forces': return subject.forces === undefined ? NaN : countBy(subject, childId, condition)
    default: {
      let cost = sumCost(subject, condition, childId)
      if (condition._percentValue) {
        cost /= sumCost(subject, condition, false)
      }

      return cost
    }
  }
}

const checkCondition = (roster, path, condition, gameData) => {
  const subject = getSubject(roster, path, condition)

  switch (condition._type) {
    case 'greaterThan': return getValue(condition, subject, gameData) > condition._value
    case 'lessThan': return getValue(condition, subject, gameData) < condition._value
    case 'atMost': return getValue(condition, subject, gameData) <= condition._value
    case 'atLeast': return getValue(condition, subject, gameData) >= condition._value
    case 'equalTo': return getValue(condition, subject, gameData) === condition._value
    case 'instanceOf': return [].concat(subject).filter(Boolean).some(s => s._entryId?.endsWith(condition._childId) || hasCategory(s, condition._childId))
    case 'notInstanceOf': return !([].concat(subject).filter(Boolean).some(s => s._entryId?.endsWith(condition._childId) || hasCategory(s, condition._childId)))
    default: throw new Error('Unknown condition._type: ' + condition._type)
  }
}

let lastRoster
let cache = {}
window.cacheHits = 0
window.cacheMisses = 0

export const getEntry = (roster, path, _id, gameData, ignoreCache) => {
  const cachePath = `${path}-${_id}`
  if (roster !== lastRoster) {
    cache = {}
    lastRoster = roster
  } else if (!ignoreCache && cache[cachePath]) {
    window.cacheHits++
    return cache[cachePath]
  }

  const entry = _.cloneDeep(gameData.ids[_.last(_id.split('::'))])

  if (entry._targetId) {
    return getEntry(roster, path, `${_id}::${entry._targetId}`, gameData, ignoreCache)
  }

  const baseId = _id.split('::').slice(0, -1).join('::')

  const base = gameData.ids[_.last(baseId.split('::'))]
  if (base?._targetId === entry._id) {
    Object.keys(base).forEach(key => {
      if (entry[key] === undefined) {
        entry[key] = _.cloneDeep(base[key])
      } else if (entry[key] instanceof Array) {
        entry[key].push(..._.cloneDeep(base[key]))
      }
    })

    entry._hidden = base._hidden || entry._hidden
  }

  if (entry.modifiers || entry.modifierGroups) {
    applyModifiers(roster, path, entry, gameData)
  }

  entry._id = _id

  entry.entryLinks?.forEach(link => {
    switch (link._type) {
      case 'selectionEntry': {
        entry.selectionEntries = entry.selectionEntries || []
        entry.selectionEntries.push(link)
        return
      }
      case 'selectionEntryGroup': {
        entry.selectionEntryGroups = entry.selectionEntryGroups || []
        entry.selectionEntryGroups.push(link)
        return
      }
      default: throw new Error(`Unknown entryLink type: ${link._type}`)
    }
  })
  delete entry.entryLinks

  const handleLink = link => {
    switch (link._type) {
      case 'profile': {
        entry.profiles = entry.profiles || []
        entry.profiles.push(link)
        return
      }
      case 'rule': {
        entry.rules = entry.rules || []
        entry.rules.push(link)
        return
      }
      case 'infoGroup': {
        link = getEntry(roster, path, `${baseId}::${link._id}`, gameData)

        link.profiles?.forEach(profile => {
          entry.profiles = entry.profiles || []
          entry.profiles.push(profile)
        })

        link.rules?.forEach(rule => {
          entry.rules = entry.rules || []
          entry.rules.push(rule)
        })

        return
      }
      default: throw new Error(`Unknown infoLink _type: ${link._type}`)
    }
  }

  entry.infoLinks?.forEach(handleLink)
  delete entry.infoLinks

  entry.selectionEntries?.forEach((selectionEntry, index) => {
    Object.defineProperty(entry.selectionEntries, index, {
      get: () => getEntry(roster, `${path}.selections.selection.10000`, `${baseId}::${selectionEntry._id}`, gameData, ignoreCache)
    })
  })

  entry.selectionEntryGroups?.forEach((selectionEntryGroup, index) => {
    Object.defineProperty(entry.selectionEntryGroups, index, {
      get: () => getEntry(roster, path, `${baseId}::${selectionEntryGroup._id}`, gameData, ignoreCache)
    })
  })

  entry.profiles?.forEach((profile, index) => {
    Object.defineProperty(entry.profiles, index, {
      get: () => getEntry(roster, path, `${baseId}::${profile._id}`, gameData, ignoreCache)
    })
  })

  entry.rules?.forEach((rule, index) => {
    Object.defineProperty(entry.rules, index, {
      get: () => getEntry(roster, path, `${baseId}::${rule._id}`, gameData, ignoreCache)
    })
  })

  cache[cachePath] = entry

  window.cacheMisses++
  return entry
}
