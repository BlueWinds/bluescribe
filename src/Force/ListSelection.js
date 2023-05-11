import _ from 'lodash'

import { costString, sumCosts, selectionName } from '../utils'
import { useRoster, useRosterErrors } from '../Context'
import { pathParent } from '../validate'

const ListSelection = ({ indent, path, selection, selectedPath, setSelectedPath }) => {
  const rosterErrors = useRosterErrors()
  const [roster, setRoster] = useRoster()
  const selected = selectedPath === path ? 'selected' : ''

  const selectionErrors = _.flatten(Object.entries(useRosterErrors()).filter(([key, value]) => key === path || key.startsWith(path + '.')).map(([key, value]) => value))

  const upgrades = (selection.selections?.selection.filter(s => !s.selections) || []).map(selectionName).sort().join(', ')

  return <>
    <tr has-error={selectionErrors.length || undefined} className={selected} onClick={() => setSelectedPath(path)} data-indent={indent}>
      <td data-tooltip-id="tooltip" data-tooltip-html={selectionErrors.join('<br />') || undefined}>
        {selectionName(selection)}
        {!!upgrades && <small>{' - ' + upgrades}</small>}
      </td>
      <td className="cost">{costString(sumCosts(selection))}</td>
      <td onClick={(e) => {
        const parent = _.get(roster, pathParent(path))
        parent.selections.selection.splice(_.last(path.split('.')), 1)
        setRoster(roster)

        if (selected) {
          selectedPath = selectedPath.split('.').slice(0, -3).join('.')
        }

        while (!_.get(roster, selectedPath)) {
          selectedPath = selectedPath.split('.').slice(0, -3).join('.')
        }
        setSelectedPath(selectedPath)

        e.stopPropagation()
        e.preventDefault()
      }}><span role="link">x</span></td>
    </tr>
    {_.sortBy(selection.selections?.selection, '_name').filter((s, i) => s.selections || rosterErrors[`${path}.selections.selection.${selection.selections.selection.indexOf(s)}`]).map(subSelection =>  <ListSelection
      key={subSelection._id}
      indent={indent + 1}
      selection={subSelection}
      path={`${path}.selections.selection.${selection.selections.selection.indexOf(subSelection)}`}
      selectedPath={selectedPath}
      setSelectedPath={setSelectedPath}
    />)}
  </>
}

export default ListSelection
