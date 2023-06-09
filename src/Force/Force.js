import _ from 'lodash'
import { Fragment, useState } from 'react'

import { useRoster, useRosterErrors, useConfirm } from '../Context'
import AddUnit from './AddUnit'
import Selection from './Selection'
import ListSelection from './ListSelection'
import { costString, sumCosts } from '../utils'

const Force = ({ path }) => {
  const [roster, setRoster] = useRoster()
  const force = _.get(roster, path)
  window.force = force
  const confirmDelete = useConfirm(true, `Delete ${force.name}?`)

  const [selectedPath, setSelectedPath] = useState(path)

  const [openSections, setOpenSections] = useState({})

  const errors = useRosterErrors()[path]

  const selections = {}
  const parseSelection = selection => {
    const primary = _.find(selection.categories.category, 'primary')?.entryId || '(No Category)'
    selections[primary] = selections[primary] || []
    selections[primary].push(selection)
  }

  force.selections?.selection.forEach(parseSelection)

  const categories = force.categories.category.map(category => {
    if (!selections[category.entryId]) { return null }
    const open = openSections[category.name] || openSections[category.name] === undefined

    return <Fragment key={category.name}>
      <tr className="category" onClick={() => setOpenSections({
        ...openSections,
        [category.name]: !open,
      })}>
        <th colSpan="3" open={open}>{category.name}</th>
      </tr>
      {open && _.sortBy(selections[category.entryId], 'name').map(selection => {
        return <ListSelection
          key={selection.id}
          indent={1}
          selection={selection}
          selectedPath={selectedPath}
          setSelectedPath={setSelectedPath}
          path={`${path}.selections.selection.${force.selections.selection.indexOf(selection)}`}
        />
      })}
    </Fragment>
  })

  const globalErrors = errors?.filter(e => !e.includes('must have'))

  return (<details key={force.id} open>
    <summary>
      {force.catalogueName}
      <small>{force.name}</small>
      <small>{costString(sumCosts(force))}</small>
      {errors && <span className="errors" data-tooltip-id="tooltip" data-tooltip-html={errors.join('<br />')}>Validation errors</span>}
      <span role="link" className="outline" onClick={() => {
        confirmDelete(() => {
          roster.forces.force.splice(_.last(path.split('.')), 1)
          setRoster(roster)
        })
      }}>Remove</span>
    </summary>
    {!!globalErrors?.length && <ul className="errors">{globalErrors.map(e => <li key={e}>{e}</li>)}</ul>}
    <div className="grid columns">
      <div className="selections">
        <h6>Selections</h6>
        <table><tbody>
          <tr onClick={() => setSelectedPath(path)}><th colSpan="3">Add Unit</th></tr>
          {categories}
        </tbody></table>
      </div>
      {selectedPath === path ? (
        <AddUnit path={path} errors={errors} setSelectedPath={setSelectedPath} />
      ) : (
        <Selection path={selectedPath} errors={errors} setSelectedPath={setSelectedPath} />
      )}
    </div>
  </details>)
}

export default Force
