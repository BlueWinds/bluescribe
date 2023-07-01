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

determinePlatform().then(async ({ default: platform }) => {
  const fs = platform.fs

  console.log(platform)

  try {
    await fs.promises.readdir(platform.gameSystemPath)
  } catch (e) {
    await fs.promises.mkdir(platform.gameSystemPath, { recursive: true })
  }

  try {
    await fs.promises.readdir(platform.rosterPath)
  } catch (e) {
    await fs.promises.mkdir(platform.rosterPath, { recursive: true })
  }

  const root = ReactDOM.createRoot(document.getElementById('root'))
  root.render(
    <React.StrictMode>
      <FSContext.Provider value={platform}>
        <App />
      </FSContext.Provider>
    </React.StrictMode>,
  )
})
