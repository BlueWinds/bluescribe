import FS from '@isomorphic-git/lightning-fs'

import { createDir, metadata, readDir, readTextFile, removeDir, removeFile, writeTextFile } from '@tauri-apps/plugin-fs'
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
    readFile: readTextFile,
    rmdir: removeDir,
    unlink: removeFile,
    writeFile: writeTextFile,
  },
}

const configDir = useLocalStorage ? '/' : await join(await appConfigDir(), 'systems')

const fs = useLocalStorage ? new FS('fs') : OfflineFS
fs.configDir = configDir
export default fs

export const rosterFs = new FS('rosters')
