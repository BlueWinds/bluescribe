import _ from 'lodash'

import { useFile } from '../EditSystem'
import { Comment, Hidden, Id, Modifiers, Name, Profiles, Publication } from './fields'

const Category = ({ filename, category }) => {
  const [file, updateFile] = useFile(filename)

  /*
        "constraints": { "$ref": "#/definitions/constraints" },
        "infoLinks": { "$ref": "#/definitions/infoLinks" },
        "infoGroups": { "$ref": "#/definitions/infoGroups" },
        "modifiers": { "$ref": "#/definitions/modifiers" },
        "modifierGroups": { "$ref": "#/definitions/modifierGroups" },
        "rules": { "$ref": "#/definitions/rules" }
*/

  return (
    <>
      <table>
        <tbody>
          <Name entry={category} updateFile={updateFile}>
            <button
              className="add-entry outline"
              onClick={() => {
                if (file.categories.length === 1) {
                  delete file.categories
                } else {
                  file.categories = _.pull(file.categories, [category])
                }
                updateFile()
              }}
            >
              -
            </button>
          </Name>
          <Id entry={category} updateFile={updateFile} />
          <Comment entry={category} updateFile={updateFile} />
          <Hidden entry={category} updateFile={updateFile} />
          <Publication file={file} entry={category} updateFile={updateFile} />
          <Profiles filename={filename} entry={category} updateFile={updateFile} />
          <Modifiers filename={filename} entry={category} />
        </tbody>
      </table>
    </>
  )
}

export default Category
