import _ from 'lodash'

import { costString, sumCosts, selectionName } from '../utils'
import { useRoster, useRosterErrors, usePath, useSystem } from '../Context'
import { getEntry, pathParent } from '../validate'

const ListSelection = ({ indent, selectionPath, selection }) => {
  const gameData = useSystem()
  const rosterErrors = useRosterErrors()
  const [roster, setRoster] = useRoster()
  const [path, setPath] = usePath()
  const selected = selectionPath === path ? 'selected' : ''

  const selectionErrors = _.flatten(
    Object.entries(useRosterErrors())
      .filter(([key, value]) => key === selectionPath || key.startsWith(selectionPath + '.'))
      .map(([key, value]) => value),
  )

  const upgrades = (
    selection.selections?.selection.filter((s, i) => {
      const entry = getEntry(roster, `${selectionPath}.selections.selection.${i}`, s.entryId, gameData)
      return entry && !entry.selectionEntries && !entry.selectionEntryGroups && !s.selections
    }) || []
  )
    .map(selectionName)
    .sort()
    .join(', ')

  return (
    <>
      <tr
        has-error={selectionErrors.length || undefined}
        className={selected}
        onClick={() => setPath(selectionPath)}
        data-indent={indent}
      >
        <td data-tooltip-id="tooltip" data-tooltip-html={selectionErrors.join('<br />') || undefined}>
          {selectionName(selection)}
          {!!upgrades && <small>{' - ' + upgrades}</small>}
        </td>
        <td className="cost">{costString(sumCosts(selection))}</td>
        <td
          onClick={(e) => {
            const parent = _.get(roster, pathParent(selectionPath))
            _.pull(parent.selections.selection, selection)
            setRoster(roster)

            if (selected) {
              // If this entry was currently selected, the path might still be valid, but
              // now pointing to a different entry. Thus, we hop one level up.
              selectionPath = pathParent(selectionPath)
            }

            while (!_.get(roster, selectionPath)) {
              selectionPath = pathParent(selectionPath)
            }
            setPath(selectionPath)

            e.stopPropagation()
            e.preventDefault()
          }}
        >
          <span role="link">x</span>
        </td>
      </tr>
      {_.sortBy(selection.selections?.selection, 'name')
        .filter((s, i) => {
          const entry = getEntry(roster, `${selectionPath}.selections.selection.${i}`, s.entryId, gameData)
          return (
            entry &&
            (entry.selectionEntries ||
              entry.selectionEntryGroups ||
              s.selections ||
              rosterErrors[`${selectionPath}.selections.selection.${selection.selections.selection.indexOf(s)}`])
          )
        })
        .map((subSelection) => (
          <ListSelection
            key={subSelection.id}
            indent={indent + 1}
            selection={subSelection}
            selectionPath={`${selectionPath}.selections.selection.${selection.selections.selection.indexOf(
              subSelection,
            )}`}
          />
        ))}
    </>
  )
}

export default ListSelection
