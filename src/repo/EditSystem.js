import { useState, useEffect, createContext, useContext } from 'react'
import BounceLoader from 'react-spinners/BounceLoader'
import { Tooltip } from 'react-tooltip'
import _ from 'lodash'

import { readRawFiles } from './index'

export const SystemContext = createContext(null)
export const useSystem = () => { useContext(SystemContext) }

const AddFile = () => {
  return null
}

const EditFile = ({ filename }) => {
  return null
}

const EditSystem = ({ systemInfo, setSystemInfo }) => {
  const [gameData, setGameData] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)

  useEffect(() => {
    if (!gameData) {
      readRawFiles('/' + systemInfo.name).then(data => {
        setGameData(data)
        setSelectedFile(data.gameSystem)
      })
    }
  }, [systemInfo, gameData])

  return <SystemContext.Provider value={gameData}><div className='container'>
    <Tooltip id="tooltip" />
    <header>
      <nav>
        <ul>
          <li><strong>BlueScribe</strong></li>
          {gameData && <li>
            <select>
              <option value={gameData.gameSystem}>{gameData[gameData.gameSystem].name}</option>
              <option value="addNew">Add New Catalogue</option>
              {Object.keys(_.omit(gameData, ['gameSystem', gameData.gameSystem])).sort().map(filename => <option key={filename}>&nbsp;&nbsp;&nbsp;&nbsp;{gameData[filename].name}</option>)}
            </select>
          </li>}
        </ul>
        <ul>
          <li>
            <details role="list" dir="rtl">
              <summary aria-haspopup="listbox" role="link">≡</summary>
              <ul role="listbox">
                <li data-tooltip-id="tooltip" data-tooltip-html="Change game system"><span role="link" onClick={() => setSystemInfo({})}>{systemInfo.name}</span></li>
              </ul>
            </details>
          </li>
        </ul>
      </nav>
    </header>
    {!gameData ? <BounceLoader color="#36d7b7" className='loading' /> : (selectedFile === 'addNew' ? <AddFile /> : <EditFile filename={selectedFile} />)}
  </div></SystemContext.Provider>
}

export default EditSystem
