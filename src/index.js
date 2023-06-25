import React from 'react'
import ReactDOM from 'react-dom/client'
import FS from '@isomorphic-git/lightning-fs'

import './index.css'
import App from './App'
import { FSContext } from './Context'

const fs = new FS('bluescribedata')

;(async () => {
  try {
    await fs.promises.readdir('/gameSystems')
  } catch (e) {
    await fs.promises.mkdir('/gameSystems')
  }

  try {
    await fs.promises.readdir('/rosters')
  } catch (e) {
    await fs.promises.mkdir('/rosters')
  }

  const root = ReactDOM.createRoot(document.getElementById('root'))
  root.render(
    <React.StrictMode>
      <FSContext.Provider value={{ fs, gameSystemPath: '/gameSystems', rosterPath: '/rosters' }}>
        <App />
      </FSContext.Provider>
    </React.StrictMode>,
  )
})()
