import { useState } from 'react'
import _ from 'lodash'

import { useRoster, useSystem } from '../Context'
import { randomId } from '../utils'

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
          roster.forces = roster.forces || {force: []}
          roster.forces.force.push({
            _id: randomId(),
            _name: gameData.ids[force]._name,
            _entryId: force,
            _catalogueId: faction,
            _catalogueRevision: gameData.ids[faction]._revision,
            _catalogueName: gameData.ids[faction]._name,
            publications: {
              publication: [
                ...(gameData.ids[faction].publications || []).map(p => _.pick(p, ['_id', '_name'])),
                ...(gameData.gameSystem.publications || []).map(p => _.pick(p, ['_id', '_name'])),
                ...(_.flatten(gameData.ids[faction].catalogueLinks?.map(cl => gameData.ids[cl._targetId].publications || []))).map(p => _.pick(p, ['_id', '_name'])),
              ]
            },
            categories: {
              category: [
                {
                  _id: randomId(),
                  _name: "Uncategorised",
                  _entryId: "(No Category)",
                  _primary: "false",
                },
                ...gameData.ids[force].categoryLinks.map(c => ({
                  _id: c._id,
                  _name: c._name,
                  _entryId: c._targetId,
                  _primary: "false",
                }))
              ]
            }
          })
          setRoster(roster)
        }}>Add</button>
      </label>
    </div>
  </details>
}

export default AddForce
