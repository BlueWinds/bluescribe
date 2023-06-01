import { useEffect, useState } from 'react'
import BounceLoader from 'react-spinners/BounceLoader'

import { listGameSystems, listAvailableGameSystems, addGameSystem, clearGameSystem } from './'

const SelectSystem = ({setSystemInfo, setMode}) => {
  const [systems, setSystems] = useState(null)
  const [available, setAvailable] = useState(null)
  const [selectedAvailable, setSelectedAvailable] = useState(0)
  const [selected, setSelected] = useState(null)
  const [updatingSystem, setUpdatingSystem] = useState(false)

  useEffect(() => {
    const load = async () => {
      const s = await listGameSystems()
      setSystems(s)
      setSelected(Object.keys(s)[0] || 'Add New')
    }

    if (!systems) {
      load()
    }
  }, [systems])

  useEffect(() => {
    if (selected === 'Add New' && !available) {
      listAvailableGameSystems().then(a => {
        setAvailable(a)
        setSelectedAvailable(0)
      })
    }
  }, [selected, available])

  return <div>
    <h2>Select Game System</h2>
    {systems ? <>
      <select onChange={e => {
        setSelected(e.target.value)
      }}>
        {Object.keys(systems).map(system => (<option key={system} value={system}>{systems[system].description} - {systems[system].version}</option>))}
        <option key="add">Add New</option>
      </select>
      {selected === 'Add New' ? <label>
        {available ? <>
          <select onChange={e => setSelectedAvailable(e.target.value)}>
            {available.map((system, index) => (<option key={system.name} value={index}>{system.description}</option>))}
          </select>
        </> : <BounceLoader color="#36d7b7" className="loading" />}
      </label> : <>
        <article>
          <header>{systems[selected].description}</header>
          <p>Version {systems[selected].version} - {systems[selected].lastUpdateDescription}</p>
          <p>
            Last updated {new Date(Date.parse(systems[selected].lastUpdated)).toLocaleDateString()}.
            {' '}<a target="_blank" rel="noreferrer" href={systems[selected].bugTrackerUrl}>Repository</a>
            {' | '}<a target="_blank" rel="noreferrer" href={systems[selected].reportBugUrl}>Report a bug</a>
            {' | '}<a href="/#" onClick={() => {
              clearGameSystem(systems[selected]).then(() => {
                setSystems(null)
              })
            }}>Clear data</a>
          </p>
        </article>
      </>}
      <button disabled={updatingSystem ? true : undefined} onClick={async () => {
        setMode('editRoster')
        if (selected === 'Add New') {
          if (updatingSystem) { return }

          const queue = await addGameSystem(available[selectedAvailable])
          let done = 0
          setUpdatingSystem({done})
          queue.start()
          queue.on('completed', () => {
            done++
            setUpdatingSystem({done})
          })

          await queue.onIdle()

          setSystemInfo(available[selectedAvailable])
          setUpdatingSystem(false)
        } else {
          setSystemInfo(systems[selected])
        }
      }}>{updatingSystem ? `${updatingSystem.done} files downloaded` : 'Load'}</button>
      {selected !== 'Add New' && !updatingSystem && <button onClick={async () => {
        if (updatingSystem) { return }
        const queue = await addGameSystem(systems[selected])

        const count = queue.size
        let done = 0
        setUpdatingSystem({count, done})
        queue.start()
        queue.on('completed', () => {
          done++
          setUpdatingSystem({count: queue.size, done})
        })

        await queue.onIdle()

        setSystems(null)
        setUpdatingSystem(false)
      }} className="outline">Update data</button>}
      {selected !== 'Add New' && !updatingSystem && <button onClick={async () => {
        setMode('editSystem')
        setSystemInfo(systems[selected])
      }} className="outline">Edit data</button>}
    </> : <BounceLoader color="#36d7b7" className="loading" />}
  </div>
}

export default SelectSystem
