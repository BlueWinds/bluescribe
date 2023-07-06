import React from 'react'
import ReactDOM from 'react-dom/client'

import './index.css'
import App from './App'
import { FSContext } from './Context'

import FS from '@isomorphic-git/lightning-fs'

const fs = new FS('bluescribedata')

const Platform = {
  fs,
  gameSystemPath: '/gameSystems',
  rosterPath: '/rosters',
}

;(async () => {
  const root = ReactDOM.createRoot(document.getElementById('root'))
  root.render(
    <React.StrictMode>
      <FSContext.Provider value={Platform}>
        <App />
      </FSContext.Provider>
    </React.StrictMode>,
  )
})()
