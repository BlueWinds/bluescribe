import FS from '@isomorphic-git/lightning-fs'

const fs = new FS('bluescribedata')

const Platform = {
  fs,
  gameSystemPath: '/gameSystems',
  rosterPath: '/rosters',
}

export default Platform
