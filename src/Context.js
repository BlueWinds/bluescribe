import { createContext, useContext } from 'react'
import _ from 'lodash'

import { sumCosts } from './utils'

export const GameContext = createContext(null)
export const RosterContext = createContext(null)
export const RosterErrorsContext = createContext([])
export const SetRosterContext = createContext(null)
export const OpenCategoriesContext = createContext({})
export const SetOpenCategoriesContext = createContext(null)

export const useConfirm = (shouldPrompt, message) => {
  return (callback) => {
    if (shouldPrompt && !window.confirm(message)) {
      return
    }
    callback()
  }
}

export const useRoster = () => {
  const roster = useContext(RosterContext)
  const setRoster = useContext(SetRosterContext)
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

export const useSystem = () => useContext(GameContext)

export const useRosterErrors = () => useContext(RosterErrorsContext)

export const useOpenCategories = () => {
  const openCategories = useContext(OpenCategoriesContext)
  const setOpenCategories = useContext(SetOpenCategoriesContext)

  return [openCategories, setOpenCategories]
}
