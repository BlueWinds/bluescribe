import _ from 'lodash'

import { findId } from '../../utils'
import { gatherFiles, useFile, useSystem } from '../EditSystem'
import { Comment, Checkbox, ReferenceSelect, Value } from './fields'

const Repeat = ({ entry, filename, modifier }) => {
  const [file, updateFile] = useFile(filename)
  const gameData = useSystem()
  const repeat = modifier.repeats[0]

  const files = gatherFiles(file, gameData)

  const scopeOptions = [
    { id: 'self', name: '-- Self' },
    { id: 'parent', name: '-- Parent' },
    { id: 'force', name: '-- Force' },
    { id: 'roster', name: '-- Roster' },
    { id: 'ancestor', name: '-- Ancestor' },
    { id: 'primary-catalogue', name: '-- Primary Catalogue' },
  ]
  files.forEach((file) =>
    scopeOptions.push(
      ...Object.values(file.ids).filter(
        (x) => x.__type === 'selectionEntry' || x.__type === 'selectionEntryGroup' || x.__type === 'entryLink',
      ),
    ),
  )

  const childIdOptions = []
  files.forEach((file) =>
    childIdOptions.push(
      ...Object.values(file.ids).filter(
        (x) => x.__type === 'selectionEntry' || x.__type === 'selectionEntryGroup' || x.__type === 'category',
      ),
    ),
  )

  return (
    <>
      <Comment entry={repeat} updateFile={updateFile} data-indent="2" />

      <tr data-indent="2">
        <td>
          <label htmlFor="scope">Scope</label>
        </td>
        <td>
          <ReferenceSelect
            name="scope"
            isClearable={false}
            value={scopeOptions.find((o) => o.id === repeat.scope)}
            options={scopeOptions}
            onChange={(option) => {
              repeat.scope = option.id
              updateFile()
            }}
          />
        </td>
      </tr>

      <tr data-indent="2">
        <td>
          <label htmlFor="field">Field</label>
        </td>
        <td>
          <select
            defaultValue={repeat.field}
            onChange={(e) => {
              repeat.field = e.target.value
              updateFile()
            }}
          >
            <option value="selections">Selections</option>
            <option value="forces">Forces</option>
            {_.flatten(
              files.map((f) =>
                f.costTypes?.map((ct) => (
                  <option key={ct.typeId} value={ct.typeId}>
                    {ct.name}
                  </option>
                )),
              ),
            )}
          </select>
        </td>
      </tr>

      <tr data-indent="2">
        <td>
          <label htmlFor="childId">Scope</label>
        </td>
        <td>
          <ReferenceSelect
            name="childId"
            isClearable={false}
            value={childIdOptions.find((o) => o.id === repeat.childId)}
            options={childIdOptions}
            onChange={(option) => {
              repeat.childId = option.id
              updateFile()
            }}
          />
        </td>
      </tr>

      <Checkbox
        entry={repeat}
        field="shared"
        label="Shared"
        updateFile={updateFile}
        defaultValue={true}
        data-indent="2"
      />
      <Checkbox
        entry={repeat}
        field="includeChildForces"
        label="Include child Forces"
        updateFile={updateFile}
        data-indent="2"
      />
      <Checkbox
        entry={repeat}
        field="includeChildSelections"
        label="Include child Selections"
        updateFile={updateFile}
        data-indent="2"
      />

      <tr data-indent="2">
        <td>
          <label htmlFor="repeats">Repeat</label>
        </td>
        <td>
          <input
            type="number"
            value={repeat.repeats}
            name="repeats"
            onChange={(e) => {
              repeat.repeats = e.target.value
              updateFile()
            }}
          />
        </td>
      </tr>
      <Value entry={repeat} updateFile={updateFile} />
      <Checkbox entry={repeat} field="percentValue" label="Percent" updateFile={updateFile} data-indent="2" />
      <Checkbox entry={repeat} field="roundUp" label="Round up" updateFile={updateFile} data-indent="2" />
    </>
  )
}

export default Repeat

export const repeatToString = (repeat, gameData, file) => {
  const extra = `${repeat.includeChildSelections ? ' including child selections' : ''}${
    repeat.roundUp ? ', rounding up' : ''
  }`

  if (repeat.percentValue) {
    const field =
      repeat.field === 'selections'
        ? 'selections'
        : repeat.field === 'forces'
        ? 'forces'
        : `${findId(gameData, file, repeat.field).name}`
    return `Repeat ${repeat.repeats} times for every ${repeat.value}% of the ${field} in ${
      findId(gameData, file, repeat.scope)?.name || repeat.scope
    } that are ${findId(gameData, file, repeat.childId).name}${extra}`
  } else {
    const field =
      repeat.field === 'selections'
        ? 'selection of'
        : repeat.field === 'forces'
        ? 'force matching'
        : `${findId(gameData, file, repeat.field).name} of`
    return `Repeat ${repeat.repeats} times for every ${repeat.value} ${field} ${
      findId(gameData, file, repeat.childId)?.name || ''
    } in ${findId(gameData, file, repeat.scope)?.name || repeat.scope}${extra}`
  }
}
