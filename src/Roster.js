import { useEffect, useState } from 'react'
import BounceLoader from 'react-spinners/BounceLoader'
import useStorage from 'squirrel-gill'
import { FileDrop } from 'react-file-drop'

import { rosterFs } from './fs'
import { listRosters, loadRoster, importRoster, deleteRoster } from './repo/rosters'
import { validateRoster } from './validate'
import { useRoster, useSystem, RosterErrorsContext, useConfirm } from './Context'
import CostLimits from './CostLimits'
import Force from './Force/Force'
import AddForce from './Force/AddForce'
import BugReport from './BugReport'
import { createRoster } from './utils'

const SelectRoster = () => {
  const [, setRoster] = useRoster()
  const [rosters, setRosters] = useState(null)
  const [selected, setSelected] = useStorage(localStorage, 'selectedRoster', '')
  const [newName, setNewFilename] = useState('NewRoster')
  const gameData = useSystem()
  const confirmDelete = useConfirm(true, `Delete ${selected}?`)

  useEffect(() => {
    const load = async () => {
      const r = await listRosters(gameData.gameSystem, rosterFs)
      setRosters(r)
      if (!r[selected]) {
        setSelected(Object.keys(r)[0] || 'New')
      }
      if (r[newName]) {
        let i = 1
        while (r['NewRoster' + i]) {
          i++
        }
        setNewFilename('NewRoster' + i)
      }
    }

    if (!rosters && gameData) {
      load()
    }
  }, [rosters, gameData, newName, selected, setSelected])

  return (
    <>
      <h2>Select Roster</h2>
      <FileDrop
        onFrameDrop={async (event) => {
          if (event.dataTransfer?.items[0]?.kind === 'file') {
            const file = event.dataTransfer.items[0].getAsFile()
            await importRoster(file, rosterFs)
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
            await importRoster(e.target.files[0], rosterFs)
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
                  setRoster(await loadRoster('/' + selected, rosterFs), false)
                }}
              >
                Load
              </button>
              <button
                className="secondary outline"
                onClick={() =>
                  confirmDelete(async () => {
                    await deleteRoster(selected, rosterFs)
                    setRosters(null)
                  })
                }
              >
                Delete
              </button>
            </>
          )}
        </>
      ) : (
        <BounceLoader color="#36d7b7" className="loading" />
      )}
    </>
  )
}

const Roster = () => {
  const [roster] = useRoster()
  const gameData = useSystem()
  window.roster = roster

  if (!roster || !gameData) {
    return <SelectRoster />
  }

  const errors = validateRoster(roster, gameData)
  window.errors = errors

  return (
    <RosterErrorsContext.Provider value={errors}>
      <article>
        {errors[''] && (
          <ul className="errors">
            {errors[''].map((e, i) => (
              <li key={i}>{e instanceof Error ? <BugReport error={e} /> : e}</li>
            ))}
          </ul>
        )}
        <div>
          <CostLimits />
          {roster.forces?.force?.map((force, index) => (
            <Force key={force.id} path={`forces.force.${index}`} />
          ))}
          <AddForce />
        </div>
      </article>
    </RosterErrorsContext.Provider>
  )
}

export default Roster
