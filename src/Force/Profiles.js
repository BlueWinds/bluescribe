import _ from 'lodash'

import { getMinCount } from '../utils'

const order = {
  Unit: 1,
  Weapon: 2,
  Abilities: 3,
}

const Profiles = ({ profiles, number }) => {
  console.log(profiles)
  return <>
    {_.sortBy(Object.keys(profiles), p => order[p] || p).map(type => <table className="profile" key={type}>
      <thead>
        <tr>
          <th>{type}</th>
          {profiles[type][0][1].characteristics.characteristic.map(c => <th key={c._name}>{c._name}</th>)}
        </tr>
      </thead>
      <tbody>
        {_.sortBy(profiles[type], '1._name').map(([number, profile]) => <tr key={profile._id}>
          <td>{number > 1 ? `x${number} ` : ''}{profile._name}</td>
          {profile.characteristics.characteristic.map(c => <td className="profile" key={c._name}>{c['#text']}</td>)}
        </tr>)}
      </tbody>
    </table>)}
  </>
}

export default Profiles

export const collectSelectionProfiles = (selection, gameData, profiles = {}) => {
  selection.profiles?.profile.forEach(profile => {
    profiles[profile._typeName] = profiles[profile._typeName] || []
    const previous = profiles[profile._typeName].find(p => p[1]._name === profile._name)
    if (previous) {
      previous[0] += selection._number
    } else {
      profiles[profile._typeName].push([selection._number, profile])
    }
  })

  selection.selections?.selection.forEach(s => collectSelectionProfiles(s, gameData, profiles))

  return profiles
}

export const collectEntryProfiles = (entry, gameData, profiles = {}, baseNumber) => {
  const number = getMinCount(entry) * (baseNumber || 1)
  entry.infoLinks?.forEach(infoLink => {
    if (infoLink._type !== 'profile') { return }
    const profile = gameData.ids[infoLink._targetId]
    profiles[profile._typeName] = profiles[profile._typeName] || []
    profiles[profile._typeName].push([number, profile])
  })

  entry.profiles?.forEach(profile => {
    profiles[profile._typeName] = profiles[profile._typeName] || []
    profiles[profile._typeName].push([number, profile])
  })

  entry.selectionEntries?.forEach(selection => collectEntryProfiles(selection, gameData, profiles, number))
  entry.selectionEntryGroups?.forEach(selection => collectEntryProfiles(selection, gameData, profiles, number))

  return profiles
}

