import React from 'react'
import _ from 'lodash'

import { Comment, Conditions, Modifiers, Repeats } from './fields'
import { useFile } from '../EditSystem'
import PropTypes from 'prop-types'

const ModifierGroup = ({ entry, on, filename, modifierGroup }) => {
  const [file, updateFile] = useFile(filename)

  return <details>
    <summary>
      <button className="add-entry outline" onClick={() => {
        if (on.modifierGroups.length === 1) {
          delete on.modifierGroups
        } else {
          on.modifierGroups = _.pull(on.modifierGroups, [modifierGroup])
        }
        updateFile()
      }}>-</button>
      {modifierGroup.comment || 'Modifier Group'}
    </summary>
    <table><tbody>
      <Comment entry={modifierGroup} updateFile={updateFile} />
      <Conditions entry={entry} on={modifierGroup} updateFile={updateFile} />
      <Repeats entry={entry} on={modifierGroup} updateFile={updateFile} />
      <Modifiers file={file} entry={entry} on={modifierGroup} />
    </tbody></table>
  </details>
}
ModifierGroup.propTypes = {
  entry: PropTypes.object.isRequired,
  on: PropTypes.object.isRequired,
  filename: PropTypes.string.isRequired,
  modifierGroup: PropTypes.object.isRequired,
}

export default ModifierGroup
