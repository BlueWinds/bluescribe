import FS from '@isomorphic-git/lightning-fs'

import { invoke } from '@tauri-apps/api/tauri'
import { createDir, metadata, readDir, readBinaryFile, removeDir, removeFile } from '@tauri-apps/plugin-fs'
import { appConfigDir, join } from '@tauri-apps/api/path'

const useLocalStorage = window.__TAURI__ === undefined

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

const fs = useLocalStorage ? new FS('fs') : Object.assign({}, OfflineFS)
fs.configDir = useLocalStorage ? '/' : (await join(await appConfigDir(), 'systems')) + '/'
export default fs

export const rosterFs = useLocalStorage ? new FS('rosters') : Object.assign({}, OfflineFS)
rosterFs.configDir = useLocalStorage ? '/' : (await join(await appConfigDir(), 'rosters')) + '/'
