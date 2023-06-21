import _ from 'lodash'
import { Fragment } from 'react'
import pluralize from 'pluralize'

import { useRoster, useRosterErrors, useSystem, useOpenCategories } from '../Context'
import { costString, addSelection, findId, gatherCatalogues, getCatalogue, getMaxCount } from '../utils'
import { getEntry } from '../validate'

const hasMatchingError = (errors, name) => {
  return errors?.find(
    (e) =>
      e.includes(' have ') && (e.includes(name) || e.includes(pluralize(name)) || e.includes(pluralize.singular(name))),
  )
}

const sumDefaultCosts = (entry, costs = {}) => {
  entry.costs?.forEach((cost) => (costs[cost.name] = (costs[cost.name] | 0) + cost.value))

  entry.selectionEntries?.forEach((selection) => {
    const count = selection.constraints?.find((c) => c.type === 'min' && c.scope === 'parent')?.value | 0
    selection.costs?.forEach((cost) => {
      if (cost.value && count) {
        costs[cost.name] = (costs[cost.name] | 0) + count * cost.value
      }
    })
  })

  entry.selectionEntryGroups?.forEach((selectionGroup) => {
    if (selectionGroup.defaultSelectionEntryId) {
      const count = selectionGroup.constraints?.find((c) => c.type === 'min' && c.scope === 'parent')?.value | 0
      const defaultEntry = selectionGroup.selectionEntries.find((e) =>
        e.id.includes(selectionGroup.defaultSelectionEntryId),
      )
      defaultEntry.costs?.forEach((cost) => {
        if (cost.value && count) {
          costs[cost.name] = (costs[cost.name] | 0) + count * cost.value
        }
      })
    }
  })

  return costs
}

const AddUnit = ({ path, setSelectedPath }) => {
  const gameData = useSystem()
  const [roster, setRoster] = useRoster()
  const rosterErrors = useRosterErrors()
  const [openCategories, setOpenCategories] = useOpenCategories()

  const force = _.get(roster, path)
  const catalogue = getCatalogue(roster, path, gameData)

  const entries = {}
  const categoryErrors = []
  const parseEntry = (entryLink) => {
    try {
      const entry = getEntry(roster, path, entryLink.id, gameData)

      if (!entry.hidden && getMaxCount(entry) !== 0) {
        let primary = _.find(entry.categoryLinks, 'primary')?.targetId
        if (!primary) {
          primary = '(No Category)'
        }
        entries[primary] = entries[primary] || []
        entries[primary].push(entry)
      }
    } catch {}
  }

  gatherCatalogues(catalogue, gameData).forEach((c) => {
    c.entryLinks?.forEach(parseEntry)
    c.selectionEntries?.forEach(parseEntry)
  })

  const categories = force.categories.category.map((category) => {
    if (!entries[category.entryId]) {
      return null
    }

    const catEntries = _.sortBy(entries[category.entryId], 'name')
    category = findId(gameData, catalogue, category.entryId) || category

    const open = openCategories[category.name]
    const error = hasMatchingError(rosterErrors[path], category.name)
    return (
      <Fragment key={category.name}>
        <tr has-error={error} className="category">
          <th
            colSpan="2"
            data-tooltip-id="tooltip"
            data-tooltip-html={error}
            open={open}
            onClick={() =>
              setOpenCategories({
                ...openCategories,
                [category.name]: !open,
              })
            }
          >
            {category.name}
          </th>
        </tr>
        {open &&
          catEntries.map((entry) => {
            const error = hasMatchingError(rosterErrors[path], entry.name)
            return (
              <tr
                has-error={error}
                key={entry.id}
                className="add-unit"
                onClick={() => {
                  addSelection(force, entry, gameData, null, catalogue)
                  setRoster(roster)
                  setSelectedPath(`${path}.selections.selection.${force.selections.selection.length - 1}`)
                }}
              >
                <td data-tooltip-id="tooltip" data-tooltip-html={error}>
                  {entry.name}
                </td>
                <td className="cost">{costString(sumDefaultCosts(entry))}</td>
              </tr>
            )
          })}
      </Fragment>
    )
  })

  return (
    <div className="selections">
      <h6>Add Unit</h6>
      {categoryErrors.length > 0 && <ul className="errors">{categoryErrors}</ul>}
      <table role="grid">
        <tbody>{categories}</tbody>
      </table>
    </div>
  )
}

export default AddUnit
