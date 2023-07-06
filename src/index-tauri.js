import React from 'react'
import ReactDOM from 'react-dom/client'

import { invoke } from '@tauri-apps/api/tauri'
import { appDataDir, homeDir, join } from '@tauri-apps/api/path'
import { open as openDialog } from '@tauri-apps/plugin-dialog'
import { createDir, metadata, readDir, readBinaryFile, removeDir, removeFile } from '@tauri-apps/plugin-fs'
import { open as shellOpen } from '@tauri-apps/plugin-shell'

import './index.css'
import App from './App'
import { FSContext, NativeContext } from './Context'

// Emulate the parts of the metadata object that we use
class offlineMetadata {
  constructor(metadata) {
    this.metadata = metadata
  }

  async isDirectory() {
    return this.metadata.isDir
  }
}

const OfflineFS = {
  promises: {
    mkdir: createDir,
    async stat(path) {
      return new offlineMetadata(await metadata(path))
    },
    async readdir(path) {
      return (await readDir(path)).map((f) => f.name)
    },
    async readFile(path) {
      return Buffer.from(await readBinaryFile(path))
    },
    rmdir: removeDir,
    unlink: removeFile,
    // Workaround for https://github.com/tauri-apps/plugins-workspace/pull/454
    //   blocks using writeBinaryFile directly, so we essentially reimplement it
    // writeFile: writeBinaryFile,
    async writeFile(path, data) {
      if (typeof data === 'string') {
        data = new TextEncoder().encode(data)
      }
      if (typeof data === 'object') {
        data = Array.from(new Uint8Array(data))
      }
      await invoke('plugin:fs|write_file', {
        path: path,
        contents: data,
        options: undefined,
      })
    },
  },
}

const fs = Object.assign({}, OfflineFS)
const gameSystemPath = await join(await appDataDir(), 'gameSystems')
const rosterPath = await join(await appDataDir(), 'rosters')

const Platform = {
  fs,
  gameSystemPath,
  rosterPath,
}

const selectDirectory = async () => {
  return await openDialog({
    directory: true,
    defaultPath: await homeDir(),
  })
}

const readFilesNative = async (dir, gameSystemPath) => {
  return await invoke('fast_cache', { dir, gameSystemPath })
}

const Native = {
  shellOpen,
  selectDirectory,
  readFilesNative,
}

;(async () => {
  const root = ReactDOM.createRoot(document.getElementById('root'))
  root.render(
    <React.StrictMode>
      <FSContext.Provider value={Platform}>
        <NativeContext.Provider value={Native}>
          <App />
        </NativeContext.Provider>
      </FSContext.Provider>
    </React.StrictMode>,
  )
})()
