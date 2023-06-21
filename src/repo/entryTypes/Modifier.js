import _ from 'lodash'

import { Checkbox, Comment, Conditions, Repeats, Text, Value } from './fields'
import { gatherFiles, useFile, useSystem } from '../EditSystem'

const types = {
  set: 'Set',
  decrement: 'Decrement',
  increment: 'Increment',
  append: 'Append',
  add: 'Add Category',
  remove: 'Remove Category',
  'set-primary': 'Set Category Primary',
  'unset-primary': 'Unset Category Primary',
}

const typeStrings = {
  set: (m) => `Set ${m.field} to ${m.value}`,
  increment: (m) => `Increment ${m.field} by ${m.value.toString()}${m.repeats ? ' repeatedly' : ''}`,
  decrement: (m) => `Decrement ${m.field} by ${m.value.toString()}${m.repeats ? ' repeatedly' : ''}`,
  append: (m) => `Append '${m.value}' to ${m.field}`,
  add: (m, gd) => `Add category ${gd.ids[m.value].name}`,
  remove: (m, gd) => `Remove category ${gd.ids[m.value].name}`,
  'set-primary': (m, gd) => `Set ${gd.ids[m.value].name} as primary category`,
  'unset-primary': (m, gd) => `Unset ${gd.ids[m.value].name} as primary category`,
}

const defaultValues = {
  boolean: false,
  number: 0.0,
  string: '',
}

const Modifier = ({ entry, on, filename, modifier }) => {
  const [file, updateFile] = useFile(filename)
  const gameData = useSystem()

  const fields = {
    hidden: { label: 'Hidden', value: 'boolean', type: ['set'] },
    name: { label: 'Name', value: 'string', type: ['append'] },
  }

  gatherFiles(file, gameData).forEach((f) =>
    f.costTypes?.forEach(
      (ct) =>
        (fields[ct.name] = {
          label: ct.name,
          value: 'number',
          type: ['set', 'increment', 'decrement'],
        }),
    ),
  )

  entry.constraints?.forEach(
    (c) =>
      (fields[c.id] = {
        label: `Constraint: ${c.scope} ${c.field} ${c.type} ${c.value}`,
        value: 'number',
        type: ['set', 'increment', 'decrement'],
      }),
  )

  // TODO: field for categories / set-primary

  console.log(fields, modifier)
  return (
    <details>
      <summary>
        <button
          className="add-entry outline"
          onClick={() => {
            if (on.modifiers.length === 1) {
              delete on.modifiers
            } else {
              on.modifiers = _.pull(on.modifiers, [modifier])
            }
            updateFile()
          }}
        >
          -
        </button>
        {typeStrings[modifier.type](modifier, gameData)}
      </summary>
      <table>
        <tbody>
          <Comment entry={modifier} updateFile={updateFile} />
          <Conditions entry={entry} on={modifier} updateFile={updateFile} />
          <tr>
            <td>
              <label htmlFor="type">Type</label>
            </td>
            <td>
              <select
                defaultValue={modifier.type}
                name="type"
                onChange={(e) => {
                  if (!fields[modifier.field].type.includes(e.target.value)) {
                    modifier.field = Object.keys(fields).find((f) => fields[f].type.includes(e.target.value))
                    modifier.value = defaultValues[fields[modifier.field].value]
                  }
                  if (e.target.value !== 'increment' && e.target.value !== 'decrement') {
                    delete modifier.repeats
                  }
                  modifier.type = e.target.value
                  updateFile()
                }}
              >
                {Object.entries(types).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </td>
          </tr>
          <tr>
            <td>
              <label htmlFor="field">Field</label>
            </td>
            <td>
              <select
                name="field"
                defaultValue={modifier.field}
                onChange={(e) => {
                  if (fields[modifier.field].value !== fields[e.target.value].value) {
                    modifier.value = defaultValues[fields[e.target.value].value]
                  }
                  modifier.field = e.target.value
                  updateFile()
                }}
              >
                {Object.keys(fields).map(
                  (field) =>
                    fields[field].type.includes(modifier.type) && (
                      <option key={field} value={field}>
                        {fields[field].label}
                      </option>
                    ),
                )}
              </select>
            </td>
          </tr>
          {fields[modifier.field].value === 'number' ? (
            <Value entry={modifier} updateFile={updateFile} />
          ) : fields[modifier.field].value === 'boolean' ? (
            <Checkbox entry={modifier} field="value" label="Value" updateFile={updateFile} />
          ) : (
            <Text field="value" label="Value" entry={entry} updateFile={updateFile} />
          )}
          {(modifier.type === 'increment' || modifier.type === 'decrement') && (
            <Repeats entry={entry} modifier={modifier} updateFile={updateFile} filename={filename} />
          )}
        </tbody>
      </table>
    </details>
  )
}

export default Modifier
