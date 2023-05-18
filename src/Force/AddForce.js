import { useState } from 'react'
import _ from 'lodash'

import { useRoster, useSystem } from '../Context'
import { addForce } from '../utils'

const AddForce = () => {
  const gameData = useSystem()
  const catalogues = _.sortBy(gameData.catalogues, '_name')

  const [faction, setFaction] = useState(catalogues[0]._id)
  const [force, setForce] = useState(_.sortBy(gameData.gameSystem.forceEntries, '_name')[0]._id)
  const [roster, setRoster] = useRoster()

  return <details open={!roster.forces?.force?.length}>
    <summary>Add Force</summary>
    <div className="grid">
      <label>
        Faction
        <select onChange={e => setFaction(e.target.value)}>
          {catalogues.map((f, index) => <option key={f._id} value={f._id}>{f._name}</option>)}
        </select>
      </label>
      <label>
        Detachment
        <select onChange={e => setForce(e.target.value)}>
          {_.sortBy(gameData.gameSystem.forceEntries, '_name').map((f, index) => <option key={f._id} value={f._id}>{f._name}</option>)}
        </select>
        </label>
      <label>
        &nbsp;
        <button onClick={() => {
          addForce(roster, force, faction, gameData)
          setRoster(roster)
        }}>Add</button>
      </label>
    </div>
  </details>
}

export default AddForce
