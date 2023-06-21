import Select from 'react-select'
import _ from 'lodash'

import { findId, randomId } from '../../utils'
import { useFile, useSystem } from '../EditSystem'
import Profile from './Profile'
import Modifier from './Modifier'
import ModifierGroup from './ModifierGroup'
import Repeat, { repeatToString } from './Repeat'

export const Checkbox = ({ entry, field, label, updateFile, defaultValue = false, ...props }) => (
  <tr {...props}>
    <td>
      <label htmlFor={field}>{label}</label>
    </td>
    <td>
      <input
        type="checkbox"
        checked={entry[field] ?? defaultValue}
        name={field}
        onChange={(e) => {
          if (e.target.checked === defaultValue) {
            delete entry[field]
          } else {
            entry[field] = e.target.checked
          }
          updateFile()
        }}
      />
    </td>
  </tr>
)

export const Text = ({ entry, field, label, updateFile, ...props }) => (
  <tr {...props}>
    <td>
      <label htmlFor={field}>{label}</label>
    </td>
    <td>
      <input
        value={entry[field] || ''}
        name={field}
        onChange={(e) => {
          entry[field] = e.target.value
          updateFile()
        }}
      />
    </td>
  </tr>
)

export const Name = ({ entry, updateFile, children, ...props }) => (
  <tr {...props}>
    <td colSpan="2">
      {children}
      <h6>
        <input
          value={entry.name || ''}
          onChange={(e) => {
            entry.name = e.target.value
            updateFile()
          }}
        />
      </h6>
    </td>
  </tr>
)

export const Id = ({ entry, updateFile, ...props }) => (
  <tr {...props}>
    <td>Id</td>
    <td>
      <button
        className="refresh-id outline"
        onClick={() => {
          entry.id = randomId()
          updateFile()
        }}
        data-tooltip-id="tooltip"
        data-tooltip-html="Generate new id"
      >
        ⟳
      </button>
      <input value={entry.id} disabled={true} />
    </td>
  </tr>
)

export const Hidden = ({ entry, updateFile, ...props }) => (
  <Checkbox entry={entry} field="hidden" label="Hidden" updateFile={updateFile} {...props} />
)

export const Comment = ({ entry, updateFile, ...props }) => (
  <Text field="comment" label="Comment" entry={entry} updateFile={updateFile} {...props} />
)

export const Value = ({ entry, updateFile, ...props }) => (
  <tr {...props}>
    <td>
      <label htmlFor="value">Value</label>
    </td>
    <td>
      <input
        type="number"
        value={entry.value}
        name="value"
        onChange={(e) => {
          entry.value = e.target.value
          updateFile()
        }}
      />
    </td>
  </tr>
)

export const ReferenceSelect = ({ value, options, onChange, isClearable = true, isSearchable = true }) => {
  return (
    <Select
      className="react-select publication"
      classNamePrefix="react-select"
      unstyled={true}
      isClearable={isClearable}
      isSearchable={isSearchable}
      getOptionLabel={(o) => o.name}
      getOptionValue={(o) => o.id}
      options={_.sortBy(_.uniq(_.flatten(options)), 'name')}
      value={value}
      name="publication"
      onChange={onChange}
    />
  )
}

export const Publication = ({ file, entry, updateFile, ...props }) => {
  const gameData = useSystem()

  const options = [
    ...(file.publications || []),
    ...(gameData[gameData.gameSystem].publications || []),
    ...(file.catalogueLinks?.map((link) => gameData.catalogues[link.targetId].publications) || []),
  ]

  return (
    <tr {...props}>
      <td>
        <label htmlFor="publication">Publication</label>
      </td>
      <td>
        <input
          className="page"
          value={entry.page}
          name="page"
          placeholder="Page"
          onChange={(e) => {
            entry.page = e.target.value
            updateFile()
          }}
        />
        <ReferenceSelect
          value={findId(gameData, file, entry.publicationId)}
          options={options}
          onChange={(publication) => {
            entry.publicationId = publication?.id
            updateFile()
          }}
        />
      </td>
    </tr>
  )
}

export const Profiles = ({ filename, entry, updateFile, ...props }) => {
  const gameData = useSystem()
  const system = gameData[gameData.gameSystem]

  return (
    <>
      <tr {...props}>
        <th colSpan="2">
          <button
            className="add-entry outline"
            disabled={!(system.profileTypes?.length > 0)}
            onClick={() => {
              entry.profiles = entry.profiles || []
              entry.profiles.push({
                id: randomId(),
                typeId: system.profileTypes[0].id,
                typeName: system.profileTypes[0].name,
              })
              updateFile()
            }}
            data-tooltip-id="tooltip"
            data-tooltip-html="Add profile"
          >
            +
          </button>
          Profiles
        </th>
      </tr>
      {entry.profiles?.map((profile) => (
        <tr key={profile.id} {...props}>
          <td colSpan="2">
            <Profile profile={profile} filename={filename} on={entry} />
          </td>
        </tr>
      ))}
    </>
  )
}

export const Modifiers = ({ filename, entry, on = entry, ...props }) => {
  const [, updateFile] = useFile(filename)
  return (
    <>
      <tr {...props}>
        <th colSpan="2">
          <button
            className="add-entry outline"
            onClick={() => {
              entry.modifierGroups = entry.modifierGroups || []
              entry.modifierGroups.push({})
              updateFile()
            }}
            data-tooltip-id="tooltip"
            data-tooltip-html="Add modifier group"
          >
            ±
          </button>
          <button
            className="add-entry outline"
            onClick={() => {
              entry.modifiers = entry.modifiers || []
              entry.modifiers.push({
                field: 'hidden',
                type: 'set',
                value: true,
              })
              updateFile()
            }}
            data-tooltip-id="tooltip"
            data-tooltip-html="Add modifier"
          >
            +
          </button>
          Modifiers
        </th>
      </tr>
      {on.modifiers?.map((modifier, i) => (
        <tr key={i} {...props}>
          <td colSpan="2">
            <Modifier entry={entry} on={on} modifier={modifier} filename={filename} />
          </td>
        </tr>
      ))}
      {on.modifierGroups?.map((modifierGroup, i) => (
        <tr key={'group-' + i} {...props}>
          <td colSpan="2">
            <ModifierGroup entry={entry} on={on} modifierGroup={modifierGroup} filename={filename} />
          </td>
        </tr>
      ))}
    </>
  )
}

export const Conditions = () => {
  // TODO, conditions and conditionGroups
  return null
}

export const Repeats = ({ entry, filename, modifier, updateFile, ...props }) => {
  const [file] = useFile(filename)
  const gameData = useSystem()
  return (
    <>
      <tr {...props}>
        <th colSpan="2">
          <button
            className="add-entry outline"
            onClick={() => {
              if (entry.repeats) {
                delete entry.repeats
              } else {
                entry.repeats = [
                  {
                    scope: 'self',
                    field: 'selections',
                    value: 1,
                  },
                ]
              }
              updateFile()
            }}
            data-tooltip-id="tooltip"
            data-tooltip-html="Make modifier repeatable"
          >
            {entry.repeats ? '-' : '+'}
          </button>
          {entry.repeats ? repeatToString(entry.repeats[0], gameData, file) : 'Does not repeat'}
        </th>
      </tr>
      {entry.repeats?.length && <Repeat entry={entry} filename={filename} modifier={modifier} {...props} />}
    </>
  )
}
