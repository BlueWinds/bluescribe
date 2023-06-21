import { useFile, useSystem, useSetSystem } from './EditSystem'
import FileContents from './FileContents'

const EditFile = ({ filename, setSelectedFile }) => {
  return (
    <article>
      <FileDetails filename={filename} setSelectedFile={setSelectedFile} />
      <FileContents filename={filename} />
    </article>
  )
}

export default EditFile

const FileDetails = ({ filename, setSelectedFile }) => {
  const [file, updateFile] = useFile(filename)
  const system = useSystem()
  const setSystem = useSetSystem()

  return (
    <details open={false}>
      <summary>
        {filename}
        <span data-tooltip-id="tooltip" data-tooltip-html="Revision is automatically updated when a file is saved">
          Revision {file.revision}
        </span>
      </summary>
      <div className="grid">
        <div>
          <label>
            Filename
            <input
              value={filename}
              onChange={(e) => {
                delete system[filename]
                file.__updated = true
                system[e.target.value] = file
                if (file.type === 'gameSystem') {
                  system.gameSystem = e.target.value
                }
                setSystem({ ...system })
                setSelectedFile(e.target.value)
              }}
            />
          </label>
          <label>
            {file.type === 'gameSystem' ? (
              'Game System'
            ) : (
              <>
                Catalogue - Library?{' '}
                <input
                  type="checkbox"
                  value={file.library}
                  onChange={(e) => {
                    file.library = e.target.checked
                    updateFile()
                  }}
                />
              </>
            )}
            <input
              value={file.name}
              onChange={(e) => {
                file.name = e.target.value
                updateFile()
              }}
            />
          </label>
          <label>
            Readme
            <input
              value={file.readme}
              onChange={(e) => {
                file.readme = e.target.value
                updateFile()
              }}
            />
          </label>
        </div>
        <div>
          <label>
            Author Name
            <input
              value={file.authorName}
              onChange={(e) => {
                file.authorName = e.target.value
                updateFile()
              }}
            />
          </label>
          <label>
            Author Contact
            <input
              value={file.authorContact}
              onChange={(e) => {
                file.authorContact = e.target.value
                updateFile()
              }}
            />
          </label>
          <label>
            Author Url
            <input
              value={file.authorUrl}
              onChange={(e) => {
                file.authorUrl = e.target.value
                updateFile()
              }}
            />
          </label>
        </div>
      </div>
    </details>
  )
}
