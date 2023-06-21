import React from 'react'
import _ from 'lodash'
import { DebounceInput } from 'react-debounce-input'

import { useRoster, useSystem, useUpdateRoster } from './Context'

const CostLimits = () => {
  const gameData = useSystem()
  const [roster, setRoster] = useRoster()
  const updateRoster = useUpdateRoster()

  return <details open={!roster.forces?.force.length}>
    <summary>
      Cost Limits: {roster.costLimits?.costLimit.map((limit) => {
        return `${limit.value} ${limit.name}`
      }).join(', ') || 'None'}
      <span>{roster.customNotes?.length > 50 || roster.customNotes?.includes('\n') ? _.first(roster.customNotes.split('\n')).slice(0, 50) + '...' : roster.customNotes}</span>
    </summary>
    <div className="grid">
      {gameData.gameSystem.costTypes.map((type) => {
        const index = _.findIndex(roster.costLimits?.costLimit, ['typeId', type.id])
        if (index !== -1) {
          return <label key={type.id}>
            {type.name}
            <input type="number" min="-1" value={roster.costLimits.costLimit[index].value} step="1" onChange={e => {
              if (e.target.value > -1) {
                updateRoster(`costLimits.costLimit.${index}.value`, e.target.value)
              } else {
                roster.costLimits.costLimit.splice(index, 1)
                setRoster(roster)
              }
            }} />
          </label>
        }
        return <label key={type.id}>
          {type.name}
          <input type="number" min="-1" value="-1" step="1" onChange={e => {
            roster.costLimits = roster.costLimits || {costLimit: []}
            roster.costLimits.costLimit.push({
              typeId: type.id,
              name: type.name,
              value: e.target.value,
            })
            setRoster(roster)
          }} />
        </label>
      })}
    </div>
    <label>
      Notes
      <DebounceInput
        debounceTimeout={300}
        value={roster.customNotes}
        element="textarea"
        onChange={e => {
          roster.customNotes = e.target.value
          setRoster(roster)
        }}
      />
    </label>
  </details>
}

export default CostLimits
