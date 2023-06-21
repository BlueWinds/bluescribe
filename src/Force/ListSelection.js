import React from 'react'
import _ from 'lodash'

import { costString, sumCosts, selectionName } from '../utils'
import { useRoster, useRosterErrors } from '../Context'
import { pathParent } from '../validate'
import PropTypes from 'prop-types'

const ListSelection = ({ indent, path, selection, selectedPath, setSelectedPath }) => {
  const rosterErrors = useRosterErrors()
  const [roster, setRoster] = useRoster()
  const selected = selectedPath === path ? 'selected' : ''

  const selectionErrors = _.flatten(Object.entries(useRosterErrors()).filter(([key]) => key === path || key.startsWith(path + '.')).map(([value]) => value))

  const upgrades = (selection.selections?.selection.filter(s => !s.selections) || []).map(selectionName).sort().join(', ')

  return <>
    <tr data-has-error={selectionErrors.length || undefined} className={selected} onClick={() => setSelectedPath(path)} data-indent={indent}>
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
    {_.sortBy(selection.selections?.selection, 'name').filter((s) => s.selections || rosterErrors[`${path}.selections.selection.${selection.selections.selection.indexOf(s)}`]).map(subSelection =>  <ListSelection
      key={subSelection.id}
      indent={indent + 1}
      selection={subSelection}
      path={`${path}.selections.selection.${selection.selections.selection.indexOf(subSelection)}`}
      selectedPath={selectedPath}
      setSelectedPath={setSelectedPath}
    />)}
  </>
}
ListSelection.propTypes = {
  indent: PropTypes.number.isRequired,
  path: PropTypes.string.isRequired,
  selection: PropTypes.object.isRequired,
  selectedPath: PropTypes.string.isRequired,
  setSelectedPath: PropTypes.func.isRequired,
}

export default ListSelection
