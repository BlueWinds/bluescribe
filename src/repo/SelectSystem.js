import { useEffect, useState } from 'react'
import path from 'path-browserify'
import BounceLoader from 'react-spinners/BounceLoader'
import _ from 'lodash'

import {
  listGameSystems,
  listAvailableGameSystems,
  addGameSystem,
  addLocalGameSystem,
  addExternalGameSystem,
  clearGameSystem,
} from './'
import { useFs, useNative } from '../Context'

const SelectSystem = ({ setSystemInfo, setMode, previouslySelected, error }) => {
  const [systems, setSystems] = useState(null)
  const [available, setAvailable] = useState(null)
  const [selectedAvailable, setSelectedAvailable] = useState(0)
  const [selected, setSelected] = useState(null)
  const [updatingSystem, setUpdatingSystem] = useState(false)
  const { fs, gameSystemPath } = useFs()

  const { selectDirectory } = useNative()

  const isOffline = !!selectDirectory

  useEffect(() => {
    const load = async () => {
      const s = await listGameSystems(fs, gameSystemPath)
      setSystems(s)
      setSelected(
        previouslySelected?.name || _.reverse(_.sortBy(Object.values(s), 'lastUpdated'))[0]?.name || 'Add New',
      )
    }

    if (!systems) {
      load()
    }
  }, [systems, previouslySelected, fs, gameSystemPath])

  useEffect(() => {
    if (selected === 'Add New' && !available) {
      listAvailableGameSystems().then((a) => {
        setAvailable(a)
        setSelectedAvailable(0)
      })
    }
  }, [selected, available])

  return (
    <div>
      <h2>Select Game System</h2>
      {systems ? (
        <>
          <select
            value={selected}
            onChange={(e) => {
              setSelected(e.target.value)
            }}
          >
            {_.reverse(_.sortBy(Object.values(systems), 'lastUpdated')).map((system) => (
              <option key={system.name} value={system.name}>
                {system.description} - {system.version}
              </option>
            ))}
            <option key="add">Add New</option>
          </select>
          {selected === 'Add New' ? (
            <label>
              {available ? (
                <>
                  <select onChange={(e) => setSelectedAvailable(e.target.value)}>
                    {available.map((system, index) => (
                      <option key={system.name} value={index}>
                        {system.description}
                      </option>
                    ))}
                  </select>
                  <p>
                    Or{' '}
                    <span role="link" onClick={() => document.getElementById('import-system').click()}>
                      select a folder
                    </span>{' '}
                    containing a <code>.gst</code> and <code>.cat</code> files.
                  </p>
                  {!isOffline ? (
                    <input
                      type="file"
                      id="import-system"
                      webkitdirectory="true"
                      onChange={async (e) => {
                        const system = await addLocalGameSystem([...e.target.files], fs, gameSystemPath)
                        setSystemInfo(system)
                      }}
                    />
                  ) : (
                    <div
                      id="import-system"
                      onClick={async (e) => {
                        const externalDir = await selectDirectory()
                        if (externalDir === null) {
                          return null
                        }
                        const system = await addExternalGameSystem(externalDir, fs, gameSystemPath)
                        if (system) {
                          setSystemInfo(system)
                        }
                      }}
                    />
                  )}
                </>
              ) : (
                <BounceLoader color="#36d7b7" className="loading" />
              )}
            </label>
          ) : (
            <>
              {error && previouslySelected.name === selected && (
                <article className="errors">
                  <p className="errors">
                    BlueScribe is having an issue loading this data. This is a bug; please report it.{' '}
                    <span role="link" onClick={() => console.log(error)}>
                      Log error to console.
                    </span>
                  </p>
                  <details>
                    <summary>{error.message}</summary>
                    <code>{error.stack}</code>
                  </details>
                </article>
              )}
              <article>
                <header>{systems[selected].description}</header>
                <p>
                  Version {systems[selected].version} - {systems[selected].lastUpdateDescription}
                </p>
                <p>
                  Last updated {new Date(Date.parse(systems[selected].lastUpdated)).toLocaleDateString()}.{' '}
                  {systems[selected].bugTrackerUrl && (
                    <>
                      <a target="_blank" rel="noreferrer" href={systems[selected].bugTrackerUrl}>
                        Repository
                      </a>
                      {' | '}
                    </>
                  )}
                  {systems[selected].reportBugUrl && (
                    <>
                      <a target="_blank" rel="noreferrer" href={systems[selected].reportBugUrl}>
                        Report a bug
                      </a>
                      {' | '}
                    </>
                  )}
                  <span
                    role="link"
                    onClick={() => {
                      clearGameSystem(systems[selected], fs, gameSystemPath).then(() => {
                        setSystems(null)
                      })
                    }}
                  >
                    Clear data
                  </span>
                </p>
              </article>
            </>
          )}
          <button
            disabled={updatingSystem ? true : undefined}
            onClick={async () => {
              setMode('editRoster')
              if (selected === 'Add New') {
                if (updatingSystem) {
                  return
                }

                const queue = await addGameSystem(available[selectedAvailable], fs, gameSystemPath)
                let done = 0
                setUpdatingSystem({ done })
                queue.start()
                queue.on('completed', () => {
                  done++
                  setUpdatingSystem({ done })
                })

                await queue.onIdle()

                setSystemInfo(available[selectedAvailable])
                setUpdatingSystem(false)
              } else {
                setSystemInfo(systems[selected])
              }
            }}
          >
            {updatingSystem ? `${updatingSystem.done} files downloaded` : 'Load'}
          </button>
          {selected !== 'Add New' && !updatingSystem && !systems[selected].externalPath && (
            <button
              onClick={async () => {
                if (updatingSystem) {
                  return
                }
                const queue = await addGameSystem(systems[selected], fs, gameSystemPath)

                const count = queue.size
                let done = 0
                setUpdatingSystem({ count, done })
                queue.start()
                queue.on('completed', () => {
                  done++
                  setUpdatingSystem({ count: queue.size, done })
                })

                await queue.onIdle()

                setSystems(null)
                setUpdatingSystem(false)
              }}
              className="outline"
            >
              Update data
            </button>
          )}
          {selected !== 'Add New' && !updatingSystem && (
            <button
              onClick={async () => {
                try {
                  const cacheFile = path.join(gameSystemPath, systems[selected].name, 'cache.json')
                  await fs.promises.unlink(cacheFile)
                } catch {
                  // Cache file doesn't exist
                }
              }}
              className="outline"
            >
              Clear cache
            </button>
          )}
          {false && selected !== 'Add New' && !updatingSystem && (
            <button
              onClick={async () => {
                setMode('editSystem')
                setSystemInfo(systems[selected])
              }}
              className="outline"
            >
              Edit data
            </button>
          )}
        </>
      ) : (
        <BounceLoader color="#36d7b7" className="loading" />
      )}
    </div>
  )
}

export default SelectSystem
