import _ from 'lodash'

import { useRoster, useSystem, useUpdateRoster } from './Context'

const CostLimits = () => {
  const gameData = useSystem()
  const [roster, setRoster] = useRoster()
  const updateRoster = useUpdateRoster()

  return (
    <>
      <h6>Cost Limits</h6>
      <div className="grid">
        {gameData.gameSystem.costTypes?.map((type) => {
          const index = _.findIndex(roster.costLimits?.costLimit, ['typeId', type.id])
          if (index !== -1) {
            return (
              <label key={type.id}>
                {type.name}
                <input
                  type="number"
                  min="-1"
                  value={roster.costLimits.costLimit[index].value}
                  step="1"
                  onChange={(e) => {
                    if (e.target.value > -1) {
                      updateRoster(`costLimits.costLimit.${index}.value`, e.target.value)
                    } else {
                      roster.costLimits.costLimit.splice(index, 1)
                      setRoster(roster)
                    }
                  }}
                />
              </label>
            )
          }
          return (
            <label key={type.id}>
              {type.name}
              <input
                type="number"
                min="-1"
                value="-1"
                step="1"
                onChange={(e) => {
                  roster.costLimits = roster.costLimits || { costLimit: [] }
                  roster.costLimits.costLimit.push({
                    typeId: type.id,
                    name: type.name,
                    value: e.target.value,
                  })
                  setRoster(roster)
                }}
              />
            </label>
          )
        })}
      </div>
    </>
  )
}

export default CostLimits
