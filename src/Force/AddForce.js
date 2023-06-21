import { useState } from 'react'
import _ from 'lodash'

import { usePath, useRoster, useRosterErrors, useSystem } from '../Context'
import { addForce, costString, sumCosts } from '../utils'
import { gatherForces } from './SelectForce'

const AddForce = () => {
  const gameData = useSystem()
  const errors = useRosterErrors()
  const catalogues = _.sortBy(gameData.catalogues, 'name').filter((c) => !c.library)

  const [faction, setFaction] = useState(catalogues[0].id)
  const [force, setForce] = useState(_.sortBy(gameData.gameSystem.forceEntries, 'name')[0].id)
  const [roster, setRoster] = useRoster()
  const [, setPath] = usePath()

  const forces = gatherForces(roster)

  return (
    <div className="grid">
      <div>
        <h5>Forces</h5>
        {forces.map((path) => {
          const force = _.get(roster, path)
          const forceErrors = _.flatten(
            Object.keys(errors)
              .filter((p) => p.startsWith(path))
              .map((p) => errors[p]),
          )
          const cost = costString(sumCosts(force))
          return (
            <h6 key={path} className="left">
              <span
                onClick={() => setPath(path)}
                role="link"
                data-tooltip-id="tooltip"
                data-tooltip-html={cost || undefined}
              >
                {force.catalogueName}
                <small>{force.name}</small>
              </span>
              {forceErrors.length ? (
                <span className="errors" data-tooltip-id="tooltip" data-tooltip-html={forceErrors.join('<br />')}>
                  Validation errors
                </span>
              ) : (
                ''
              )}
            </h6>
          )
        })}
      </div>
      <div>
        <h6>Add Force</h6>
        <label>
          Faction
          <select onChange={(e) => setFaction(e.target.value)}>
            {catalogues.map((f, index) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Detachment
          <select onChange={(e) => setForce(e.target.value)}>
            {_.sortBy(gameData.gameSystem.forceEntries, 'name').map((f, index) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          &nbsp;
          <button
            onClick={() => {
              addForce(roster, force, faction, gameData)
              setRoster(roster)
            }}
          >
            Add
          </button>
        </label>
      </div>
    </div>
  )
}

export default AddForce
