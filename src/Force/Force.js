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
  const confirmDelete = useConfirm(true, `Delete ${force._name}?`)

  const [selectedPath, setSelectedPath] = useState(path)

  const [openSections, setOpenSections] = useState({})

  const errors = useRosterErrors()[path]

  const selections = {}
  const parseSelection = selection => {
    const primary = _.find(selection.categories.category, '_primary')._entryId
    selections[primary] = selections[primary] || []
    selections[primary].push(selection)
  }

  force.selections?.selection.forEach(parseSelection)

  const categories = force.categories.category.map(category => {
    if (!selections[category._entryId]) { return null }
    const open = openSections[category._name] || openSections[category._name] === undefined

    return <Fragment key={category._name}>
      <tr className="category" onClick={() => setOpenSections({
        ...openSections,
        [category._name]: !open,
      })}>
        <th colSpan="3" open={open}>{category._name}</th>
      </tr>
      {open && _.sortBy(selections[category._entryId], '_name').map(selection => {
        return <ListSelection
          key={selection._id}
          indent={1}
          selection={selection}
          selectedPath={selectedPath}
          setSelectedPath={setSelectedPath}
          path={`${path}.selections.selection.${force.selections.selection.indexOf(selection)}`}
        />
      })}
    </Fragment>
  })

  return (<details key={force._id} open>
    <summary>
      {force._catalogueName}
      <small>{force._name}</small>
      <small>{costString(sumCosts(force))}</small>
      {errors && <span className="errors" data-tooltip-id="tooltip" data-tooltip-html={errors.join('<br />')}>Validation errors</span>}
      <a className="outline" href="/#" onClick={() => {
        confirmDelete(() => {
          roster.forces.force.splice(_.last(path.split('.')), 1)
          setRoster(roster)
        })
      }}>Remove</a>
    </summary>
    <ul className="errors">{errors?.filter(e => !e.includes('must have')).map(e => <li key={e}>{e}</li>)}</ul>
    <div className="grid columns">
      <div className="selections">
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
