import _ from 'lodash'

import { findId } from '../../utils'
import { Comment, Hidden, Id, Modifiers, Name, Publication, ReferenceSelect } from './fields'
import { useFile, useSystem, gatherFiles } from '../EditSystem'

const Profile = ({ filename, on, profile }) => {
  const [file, updateFile] = useFile(filename)
  const gameData = useSystem()

  const options = []
  gatherFiles(file, gameData).forEach((file) => options.push(...(file.profileTypes || [])))

  const type = findId(gameData, file, profile.typeId)

  return (
    <details>
      <summary>{profile.name || profile.typeName}</summary>
      <table>
        <tbody>
          <Name entry={profile} updateFile={updateFile}>
            <button
              className="add-entry outline"
              onClick={() => {
                if (on.profiles.length === 1) {
                  delete on.profiles
                } else {
                  on.profiels = _.pull(on.profiles, [profile])
                }
                updateFile()
              }}
            >
              -
            </button>
          </Name>
          <Id entry={profile} updateFile={updateFile} />
          <Comment entry={profile} updateFile={updateFile} />
          <tr>
            <td>
              <label htmlFor="profileType">Profile Type</label>
            </td>
            <td>
              <ReferenceSelect
                isClearable={false}
                value={findId(gameData, file, profile.typeId)}
                options={options}
                onChange={(profileType) => {
                  profile.typeId = profileType.id
                  profile.typeName = profileType.name
                  profile.characteristics = []
                  updateFile()
                }}
              />
            </td>
          </tr>
          <Hidden entry={profile} updateFile={updateFile} />
          <Publication file={file} entry={profile} updateFile={updateFile} />
          <tr>
            <th colSpan="2">Characteristics</th>
          </tr>
          {type.characteristicTypes.map((ct) => {
            const characteristic = profile.characteristics?.find((c) => c.typeId === ct.id)
            return (
              <tr data-indent="2">
                <td>
                  <label data-tooltip-id="tooltip" data-tooltip-html={ct.comment} htmlFor={ct.typeId}>
                    {ct.name}
                  </label>
                </td>
                <td>
                  <input
                    value={characteristic ? characteristic['#text'] : ''}
                    name={ct.typeId}
                    onChange={(e) => {
                      if (characteristic) {
                        characteristic['#text'] = e.target.value
                      } else {
                        profile.characteristics = profile.characteristics || []
                        profile.characteristics.push({
                          name: ct.name,
                          typeId: ct.id,
                          '#text': e.target.value,
                        })
                      }
                      updateFile()
                    }}
                  />
                </td>
              </tr>
            )
          })}
          <Modifiers file={file} entry={profile} updateFile={updateFile} />
        </tbody>
      </table>
    </details>
  )
}

export default Profile
