import { useState } from 'react'
import _ from 'lodash'

import { usePath, useRoster, useRosterErrors, useSystem } from '../Context'
import { addForce, costString, gatherCatalogues, sumCosts } from '../utils'
import { gatherForces } from './SelectForce'

const gatherForceEntries = (faction, gameData) =>
  _.sortBy(_.flatten(gatherCatalogues(gameData.catalogues[faction], gameData).map((c) => c.forceEntries || [])), 'name')

const AddForce = () => {
  const gameData = useSystem()
  const errors = useRosterErrors()
  const catalogues = _.sortBy(gameData.catalogues, 'name').filter((c) => !c.library)

  const [faction, setFaction] = useState(catalogues[0].id)
  const forceEntries = gatherForceEntries(faction, gameData)

  const [force, setForce] = useState(forceEntries[0].id)
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
              {forceErrors.length ? (
                <span className="errors" data-tooltip-id="tooltip" data-tooltip-html={forceErrors.join('<br />')}>
                  !!
                </span>
              ) : (
                ''
              )}
              <span
                onClick={() => setPath(path)}
                role="link"
                data-tooltip-id="tooltip"
                data-tooltip-html={cost || undefined}
              >
                {force.catalogueName}
                <small>{force.name}</small>
              </span>
            </h6>
          )
        })}
      </div>
      <div>
        <h6>Add Force</h6>
        <label>
          Faction
          <select
            onChange={(e) => {
              setFaction(e.target.value)
              setForce(gatherForceEntries(e.target.value, gameData)[0].id)
            }}
          >
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
            {forceEntries.map((f, index) => (
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
              setPath(`forces.force.${roster.forces.force.length - 1}`)
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
