import { useEffect, useState } from 'react'
import BounceLoader from 'react-spinners/BounceLoader'
import 'react-tooltip/dist/react-tooltip.css'
import { Tooltip } from 'react-tooltip'
import { DebounceInput } from 'react-debounce-input'

import '@picocss/pico'
import './App.css';
import { readFiles } from './repo'
import SelectSystem from './repo/SelectSystem'
import Roster from './Roster'
import { saveRoster, downloadRoster } from './repo/rosters'
import { GameContext, RosterContext, SetRosterContext, OpenCategoriesContext, SetOpenCategoriesContext, useConfirm, useRoster, useUpdateRoster, useSystem } from './Context'
import SelectionModal from './Force/SelectionModal'
import ViewRoster from './ViewRoster'

const Body = ({ children, systemInfo, setSystemInfo }) => {
  const [roster, setRoster] = useRoster()
  const updateRoster = useUpdateRoster()
  const confirmLeaveRoster = useConfirm(roster?.__.updated, `${roster?.__.filename} has not been saved. Are you sure you want to close it?`)
  const system = useSystem()

  const [open, setOpen] = useState(false)

  return (<div className='container'>
    <header>
      <nav>
        <ul>
          <li><strong>BlueScribe</strong></li>
          {roster && <li>
            <DebounceInput
              minLength={2}
              debounceTimeout={300}
              value={roster._name}
              onChange={e => updateRoster('_name', e.target.value)}
            />
          </li>}
        </ul>
        {system && <ul>
          {roster && <li><button className="outline" onClick={() => setOpen(!open)}>View</button></li>}
          {roster && <li><button className="outline" onClick={() => downloadRoster(roster)}>Download</button></li>}
          {roster && <li><button className="outline" disabled={!roster.__.updated} onClick={async () => {
            await saveRoster(roster)
            setRoster(roster, false)
          }}>Save</button></li>}
          <li>
            <details role="list" dir="rtl">
              <summary aria-haspopup="listbox" role="link">≡</summary>
              <ul role="listbox">
                {roster && <li><a href="/#" onClick={() => confirmLeaveRoster(setRoster)}>{roster.__.filename}</a></li>}
                <li><a href="/#" onClick={() => confirmLeaveRoster(() => setSystemInfo({}))}>{system?.gameSystem._name}</a></li>
              </ul>
            </details>
          </li>
        </ul>}
      </nav>
    </header>
    {children}
    <SelectionModal open={open} setOpen={setOpen}>
      {roster && open && <ViewRoster />}
    </SelectionModal>
  </div>)
}

function App() {
  const [loading, setLoading] = useState(false)
  const [gameData, setGameData] = useState(null)

  const [systemInfo, setInfo] = useState((JSON.parse(localStorage.system || '{}')))
  const setSystemInfo = (info) => { localStorage.system = JSON.stringify(info); setInfo(info) }

  const [roster, setRoster] = useState(null)
  const [openCategories, setOpenCategories] = useState({})

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setGameData(await readFiles('/' + systemInfo.name))
      setLoading(false)
    }

    if (systemInfo.name) { load() }
  }, [systemInfo])

  window.gameData = gameData

  if (loading) {
    return <Body systemInfo={systemInfo} setSystemInfo={setSystemInfo}>
      <BounceLoader color="#36d7b7" className='loading' />
    </Body>
  }

  if (!systemInfo.name) {
    return <Body systemInfo={systemInfo} setSystemInfo={setSystemInfo}>
      <SelectSystem setSystemInfo={setSystemInfo} />
    </Body>
  }

  return <GameContext.Provider value={gameData}><RosterContext.Provider value={roster}><SetRosterContext.Provider value={setRoster}><OpenCategoriesContext.Provider value={openCategories}><SetOpenCategoriesContext.Provider value={setOpenCategories}>
    <Body systemInfo={systemInfo} setSystemInfo={setSystemInfo}>
      <Tooltip id="tooltip" />
      <Roster />
    </Body>
  </SetOpenCategoriesContext.Provider></OpenCategoriesContext.Provider></SetRosterContext.Provider></RosterContext.Provider></GameContext.Provider>
}

export default App;
