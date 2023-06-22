import FS from '@isomorphic-git/lightning-fs'

import { createDir, exists, readDir, readTextFile, removeDir, removeFile, writeTextFile } from '@tauri-apps/plugin-fs'

class ScribeFS {
  constructor(name) {
    this.name = name
    this.fs = new FS(name)
  }

  async createDir(path) {
    try {
      await this.fs.promises.mkdir(path)
    } catch (err) {
      await createDir(path)
    }
  }
  async exists(path) {
    try {
      await this.fs.promises.stat(path)
    } catch (err) {
      return await exists(path)
    }
  }
  async readDir(path) {
    try {
      return await this.fs.promises.readdir(path)
    } catch (err) {
      return (await readDir(path)).map((f) => f.name)
    }
  }
  async readTextFile(path) {
    try {
      return await this.fs.promises.readFile(path)
    } catch (err) {
      return await readTextFile(path)
    }
  }
  async removeDir(path) {
    try {
      return await this.fs.promises.rmdir(path)
    } catch (err) {
      return await removeDir(path)
    }
  }
  async removeFile(path) {
    try {
      await this.fs.promises.unlink(path)
    } catch (err) {
      await removeFile(path)
    }
  }
  async writeTextFile(path, data) {
    try {
      await this.fs.promises.writeFile(path, data)
    } catch (err) {
      await writeTextFile(path, data)
    }
  }
}

const fs = new ScribeFS('data')
export default fs
export const rosterFs = new FS('rosters')
