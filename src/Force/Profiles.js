import _ from 'lodash'

import { findId, getMinCount } from '../utils'
import { useSystem } from '../Context'

const Profiles = ({ profiles, number }) => {
  const gameData = useSystem()

  return (
    <>
      {gameData.gameSystem.profileTypes?.map(({ name, characteristicTypes = [] }) =>
        profiles[name] ? (
          <table className="profile" key={name}>
            <thead>
              <tr>
                <th>{name}</th>
                {characteristicTypes.map((ct) => (
                  <th key={ct.name}>{ct.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {_.sortBy(profiles[name], '1.name').map(([number, profile]) => (
                <tr key={profile.id}>
                  <td>
                    {number > 1 ? `x${number} ` : ''}
                    {profile.name}
                  </td>
                  {profile.characteristics?.characteristic.map((c) => (
                    <td className="profile" key={c.name}>
                      {c['#text']}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : null,
      )}
    </>
  )
}

export default Profiles

export const collectSelectionProfiles = (selection, gameData, profiles = {}) => {
  selection.profiles?.profile.forEach((profile) => {
    profiles[profile.typeName] = profiles[profile.typeName] || []
    const previous = profiles[profile.typeName].find((p) => p[1].name === profile.name)
    if (previous) {
      previous[0] += selection.number
    } else {
      profiles[profile.typeName].push([selection.number, profile])
    }
  })

  selection.selections?.selection.forEach((s) => collectSelectionProfiles(s, gameData, profiles))

  return profiles
}

export const collectEntryProfiles = (entry, gameData, catalogue, profiles = {}, baseNumber) => {
  const number = getMinCount(entry) * (baseNumber || 1)
  entry.infoLinks?.forEach((infoLink) => {
    if (infoLink.type !== 'profile') {
      return
    }
    const profile = findId(gameData, catalogue, infoLink.targetId)
    profiles[profile.typeName] = profiles[profile.typeName] || []
    profiles[profile.typeName].push([number, profile])
  })

  entry.profiles?.forEach((profile) => {
    profiles[profile.typeName] = profiles[profile.typeName] || []
    profiles[profile.typeName].push([number, profile])
  })

  entry.selectionEntries?.forEach((selection) => collectEntryProfiles(selection, gameData, catalogue, profiles, number))
  entry.selectionEntryGroups?.forEach((selection) =>
    collectEntryProfiles(selection, gameData, catalogue, profiles, number),
  )

  return profiles
}
