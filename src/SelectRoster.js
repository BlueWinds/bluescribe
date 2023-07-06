import { useEffect, useState } from 'react'
import BounceLoader from 'react-spinners/BounceLoader'
import useStorage from 'squirrel-gill'
import { FileDrop } from 'react-file-drop'

import { listRosters, loadRoster, importRoster, deleteRoster } from './repo/rosters'
import { useFs, useOffline, useRoster, useSystem, useConfirm } from './Context'
import { createRoster } from './utils'

const SelectRoster = () => {
  const [, setRoster] = useRoster()
  const [rosters, setRosters] = useState(null)
  const [selected, setSelected] = useStorage(localStorage, 'selectedRoster', '')
  const [newName, setNewFilename] = useState('Roster')
  const gameData = useSystem()
  const confirmDelete = useConfirm(true, `Delete ${selected}?`)
  const { fs, rosterPath } = useFs()
  const { shellOpen } = useOffline()

  useEffect(() => {
    const load = async () => {
      const r = await listRosters(gameData.gameSystem, fs, rosterPath)
      setRosters(r)
      if (!r[selected]) {
        setSelected(Object.keys(r)[0] || 'New')
      }
      if (r[newName]) {
        let i = 1
        while (r['Roster ' + i]) {
          i++
        }
        setNewFilename('Roster ' + i)
      }
    }

    if (!rosters && gameData) {
      load()
    }
  }, [rosters, gameData, newName, selected, setSelected, fs, rosterPath])

  return (
    <>
      <h2>Select Roster</h2>
      <FileDrop
        onFrameDrop={async (event) => {
          if (event.dataTransfer?.items[0]?.kind === 'file') {
            const file = event.dataTransfer.items[0].getAsFile()
            await importRoster(file, fs, rosterPath)
            setSelected(file.name)
            setRosters(null)
          }
        }}
      >
        <p>
          To import a <code>.rosz</code> file, drop it anywhere on the page, or{' '}
          <span role="link" onClick={() => document.getElementById('import-roster').click()}>
            click here to select one
          </span>
          .
        </p>
        <input
          type="file"
          accept=".rosz,.ros"
          id="import-roster"
          onChange={async (e) => {
            await importRoster(e.target.files[0], fs, rosterPath)
            setSelected(e.target.files[0].name)
            setRosters(null)
          }}
        />
      </FileDrop>
      {rosters ? (
        <>
          <select onChange={(e) => setSelected(e.target.value)} value={selected}>
            {Object.entries(rosters).map(([roster, name]) => (
              <option key={roster} value={roster}>
                {roster} - {typeof name === 'string' ? name : 'Error'}
              </option>
            ))}
            <option key="new" value="New">
              New
            </option>
          </select>
          {selected === 'New' ? (
            <>
              <label>
                Filename
                <input value={newName} onChange={(e) => setNewFilename(e.target.value)} />
              </label>
              <button
                onClick={async () => {
                  const roster = await createRoster(newName, gameData.gameSystem)
                  setRoster(roster)
                }}
              >
                Create <code>{newName}.rosz</code>
              </button>
            </>
          ) : (
            <>
              {typeof rosters[selected] !== 'string' && (
                <ul>
                  BlueScribe is having trouble parsing <code>{selected}</code>. It may not be a valid roster file, or
                  this could be a bug.
                </ul>
              )}
              <button
                disabled={typeof rosters[selected] !== 'string'}
                onClick={async () => {
                  setRoster(await loadRoster(selected, fs, rosterPath), false)
                }}
              >
                Load
              </button>
              <button
                className="secondary outline"
                onClick={() =>
                  confirmDelete(async () => {
                    await deleteRoster(selected, fs, rosterPath)
                    setRosters(null)
                  })
                }
              >
                Delete
              </button>
            </>
          )}
          {!!shellOpen && (
            <button
              className="secondary outline"
              onClick={async () => {
                await shellOpen(rosterPath)
              }}
            >
              Open roster directory
            </button>
          )}
        </>
      ) : (
        <BounceLoader color="#36d7b7" className="loading" />
      )}
    </>
  )
}

export default SelectRoster
