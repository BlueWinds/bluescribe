import _ from 'lodash'
import { Fragment } from 'react'
import pluralize from 'pluralize'

import { useRoster, useRosterErrors, useSystem, useOpenCategories } from '../Context'
import { costString, addSelection } from '../utils'
import { getEntry } from '../validate'

const hasMatchingError = (errors, name) => {
  return errors?.find(e => e.includes(' have ') && (e.includes(name) || e.includes(pluralize(name))))
}

const sumDefaultCosts = (entry, costs = {}) => {
  entry.costs?.forEach(cost => costs[cost._name] = (costs[cost._name] | 0) + cost._value)

  entry.selectionEntries?.forEach(selection => {
    const count = selection.constraints?.find(c => c._type === 'min' && c._scope === 'parent')?._value | 0
    selection.costs.forEach(cost => {
      if (cost._value && count) {
        costs[cost._name] = (costs[cost._name] | 0) + count * cost._value
      }
    })
  })

  entry.selectionEntryGroups?.forEach(selectionGroup => {
    if (selectionGroup._defaultSelectionEntryId) {
      const count = selectionGroup.constraints?.find(c => c._type === 'min' && c._scope === 'parent')?._value | 0
      const defaultEntry = selectionGroup.selectionEntries.find(e => e._id.includes(selectionGroup._defaultSelectionEntryId))
      defaultEntry.costs.forEach(cost => {
        if (cost._value && count) {
          costs[cost._name] = (costs[cost._name] | 0) + count * cost._value
        }
      })
    }
  })

  return costs
}

const AddUnit = ({ path, setSelectedPath }) => {
  // TODO: On add, setSelectedPath
  const gameData = useSystem()
  const [roster, setRoster] = useRoster()
  const rosterErrors = useRosterErrors()
  const [openCategories, setOpenCategories] = useOpenCategories()

  const force = _.get(roster, path)

  const entries = {}
  const parseEntry = entryLink => {
    const entry = getEntry(roster, path, entryLink._id, gameData)

    if (!entry._hidden) {
      if (! _.find(entry.categoryLinks, '_primary')) { debugger }
      const primary = _.find(entry.categoryLinks, '_primary')._targetId
      entries[primary] = entries[primary] || []
      entries[primary].push(entry)
    }
  }

  gameData.ids[force._catalogueId].entryLinks.forEach(parseEntry)
  gameData.gameSystem.entryLinks.forEach(parseEntry)

  const categories = force.categories.category.map(category => {
    if (!entries[category._entryId]) { return null }

    const open = openCategories[category._name]
    const error = hasMatchingError(rosterErrors[path], category._name)
    return <Fragment key={category._name}>
      <tr has-error={error} className="category">
        <th colSpan="2"  data-tooltip-id="tooltip" data-tooltip-html={error} open={open} onClick={() => setOpenCategories({
          ...openCategories,
          [category._name]: !open,
        })}>
          {category._name}
        </th>
      </tr>
      {open && _.sortBy(entries[category._entryId], '_name').map(entry => {
        const error = hasMatchingError(rosterErrors[path], entry._name)
        return <tr has-error={error} key={entry._id} className="add-unit" onClick={() => {
          addSelection(force, entry, gameData)
          setRoster(roster)
          setSelectedPath(`${path}.selections.selection.${force.selections.selection.length - 1}`)
        }}>
          <td data-tooltip-id="tooltip" data-tooltip-html={error}>{entry._name}</td>
          <td className="cost">{costString(sumDefaultCosts(entry))}</td>
        </tr>
      })}
    </Fragment>
  })

  return <div className="selections">
    <h6>Add Unit</h6>
    <table role="grid"><tbody>
      {categories}
    </tbody></table>
  </div>
}

export default AddUnit
