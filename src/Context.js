import { createContext, useContext } from 'react'
import _ from 'lodash'

import { sumCosts } from './utils'

export const FSContext = createContext(null)
export const NativeContext = createContext([])

export const GameContext = createContext(null)
export const RosterContext = createContext([])
export const RosterErrorsContext = createContext([])
export const OpenCategoriesContext = createContext([])
export const PathContext = createContext([])

export const useConfirm = (shouldPrompt, message) => {
  return async (callback) => {
    if (shouldPrompt && !(await window.confirm(message))) {
      return
    }
    callback()
  }
}

export const useRoster = () => {
  const [roster, setRoster] = useContext(RosterContext)
  const gameData = useContext(GameContext)

  return [
    roster,
    (r, updated = true) =>
      setRoster(
        r && {
          ...r,
          __: { ...r.__, updated },
          costs: {
            cost: Object.entries(sumCosts(r)).map(([name, value]) => ({
              name,
              value,
              typeId: gameData.gameSystem.costTypes.find((ct) => ct.name === name).id,
            })),
          },
        },
      ),
  ]
}

export const useUpdateRoster = () => {
  const [roster, setRoster] = useRoster()

  return (path, value) => {
    setRoster(_.set(roster, path, value))
  }
}

export const useFs = () => useContext(FSContext)
export const useNative = () => useContext(NativeContext)

export const useSystem = () => useContext(GameContext)
export const usePath = () => useContext(PathContext)
export const useRosterErrors = () => useContext(RosterErrorsContext)
export const useOpenCategories = () => useContext(OpenCategoriesContext)
