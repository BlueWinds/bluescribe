import React from 'react'
import ReactDOM from 'react-dom/client'

import './index.css'
import App from './App'
import { FSContext } from './Context'

function determinePlatform() {
  if (window.__TAURI__ !== undefined) {
    return import('./platform-tauri.js')
  } else {
    // Default to web
    return import('./platform-web.js')
  }
}

determinePlatform().then(async ({ default: Platform }) => {
  const fs = Platform.fs

  try {
    await fs.promises.readdir(Platform.gameSystemPath)
  } catch (e) {
    await fs.promises.mkdir(Platform.gameSystemPath, { recursive: true })
  }

  try {
    await fs.promises.readdir(Platform.rosterPath)
  } catch (e) {
    await fs.promises.mkdir(Platform.rosterPath, { recursive: true })
  }

  const root = ReactDOM.createRoot(document.getElementById('root'))
  root.render(
    <React.StrictMode>
      <FSContext.Provider value={Platform}>
        <App />
      </FSContext.Provider>
    </React.StrictMode>,
  )
})
