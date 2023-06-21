import { useState } from 'react'
import _ from 'lodash'

import { useFile } from './EditSystem'
import Category from './entryTypes/Category'

const gameSystemTypes = {
  categoryEntries: 'Categories',
  costTypes: 'Cost Types',
  entryLinks: 'Entry Links',
  forceEntries: 'Forces',
  profileTypes: 'Profile Types',
  publications: 'Publications',
  sharedProfiles: 'Shared Profiles',
  sharedRules: 'Shared Rules',
  sharedSelectionEntries: 'Shared Selections',
  sharedSelectionEntryGroups: 'Shared Selection Groups',
}

const catalogueTypes = {
  categoryEntries: 'Categories',
  catalogueLinks: 'Catalogue Links',
  entryLinks: 'Entry Links',
  forceEntries: 'Forces',
  publications: 'Publications',
  sharedProfiles: 'Shared Profiles',
  sharedRules: 'Shared Rules',
  sharedSelectionEntries: 'Shared Selections',
  sharedSelectionEntryGroups: 'Shared Selection Groups',
}

const singular = {
  ..._.mapValues(gameSystemTypes, (v) => v.slice(0, -1)),
  categoryEntries: 'Category',
}

const FileContents = ({ filename }) => {
  const [file] = useFile(filename)
  const [entryType, setEntryType] = useState('categoryEntries')
  const [selectedPath, setSelectedPath] = useState('')

  return (
    <details open={true} className="edit-file">
      <summary>{file.type === 'gameSystem' ? 'Game System' : 'Catalogue'}</summary>
      <div className="grid columns">
        <div className="selections">
          <select onChange={(e) => setEntryType(e.target.value)} defaultValue={entryType}>
            {Object.entries(file.type === 'gameSystem' ? gameSystemTypes : catalogueTypes).map(([type, name]) => (
              <option key={type} value={type}>
                {name}
              </option>
            ))}
          </select>
          <table>
            <tbody>
              <tr onClick={() => setSelectedPath(entryType)} className={entryType === selectedPath ? 'selected' : ''}>
                <th>Add {singular[entryType]}</th>
              </tr>
              {(file[entryType] || []).map((entry, index) => (
                <tr
                  key={entry.id}
                  onClick={(e) => setSelectedPath(`${entryType}.${index}`)}
                  className={selectedPath === `${entryType}.${index}` ? 'selected' : ''}
                >
                  <td>
                    <span data-tooltip-id="tooltip" data-tooltip-html={entry.comment}>
                      {entry.name}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="edit-entry">{entryElement(file, filename, selectedPath)}</div>
      </div>
    </details>
  )
}

const entryElement = (file, filename, selectedPath) => {
  const entry = _.get(file, selectedPath)

  switch (selectedPath.split('.')[0]) {
    case 'categoryEntries':
      return <Category filename={filename} category={entry} />
    default:
      return `unsupported entryType: ${selectedPath}`
  }
}

export default FileContents
