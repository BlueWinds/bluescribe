import FS from '@isomorphic-git/lightning-fs'
import fxparser from 'fast-xml-parser'
import {
  BlobReader,
  BlobWriter,
  TextReader,
  TextWriter,
  ZipReader,
  ZipWriter,
} from '@zip.js/zip.js'
import _ from 'lodash'
import axios from 'axios'
import PQueue from 'p-queue'

import { parseXML } from 'bsd-schema'

export const fs = new FS("data")
const pfs = fs.promises

export const readXML = async (path, fs) => {
  let buffer = await fs.promises.readFile(path)
  if (path.endsWith('z')) {
    const blob = new Blob([buffer])
    const zipFileReader = new BlobReader(blob)
    const zipReader = new ZipReader(zipFileReader)
    const firstEntry = (await zipReader.getEntries()).shift()
    const textWriter = new TextWriter()

    buffer = await firstEntry.getData(textWriter)

    await zipReader.close()
  }

  return parseXML(buffer.toString())
}

const builder = new fxparser.XMLBuilder({
  attributeNamePrefix: '',
  ignoreAttributes: false,
  format: true,
  indentBy: '  ',
  processEntities: true,
  suppressBooleanAttributes: false,
  suppressUnpairedNode: false,
  unpairedTags: [
    'publication',
    'category',
    'cost',
    'characteristic',
  ],
})

export const xmlData = async (contents,  filename = '') => {
  contents = _.cloneDeep(contents)

  const prune = (target) => {
    Object.entries(target).forEach(([key, value]) => {
      if (typeof value === 'object') {
        if (Object.keys(value).length === 1 && value[Object.keys(value)[0]].length === 0) {
          delete target[key]
        } else {
          prune(value)
        }
      }
    })
  }

  prune(contents)

  let data = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n' + builder.build(contents)

  if (filename.endsWith('z')) {
    const zipFileWriter = new BlobWriter()
    const textReader = new TextReader(data)
    const zipWriter = new ZipWriter(zipFileWriter)
    await zipWriter.add(filename.replace(/z$/, ''), textReader)
    await zipWriter.close()
    const zipFileBlob = await zipFileWriter.getData()
    data = await zipFileBlob.arrayBuffer()
  }

  return data
}

export const listAvailableGameSystems = async () => {
  const data = await axios.get('https://corsproxy.io/?https://battlescribedata.appspot.com/repos')

  return data.data.repositories
}

export const listGameSystems = async () => {
  const systems = {}
  const dirs = await pfs.readdir('/')
  await Promise.all(dirs.map(async dir => {
    try {
      systems[dir] = (await JSON.parse((await pfs.readFile('/' + dir + '/system.json')).toString()))
    } catch {
      await clearGameSystem({name: dir})
    }
  }))
  return systems
}

const htmlDecode = (str) => {
  const doc = new DOMParser().parseFromString(str, "text/html")
  return doc.documentElement.textContent
}

export const addGameSystem = async (system) => {
  const dirs = await pfs.readdir('/')
  if (dirs.indexOf(system.name) !== -1) {
    const files = await pfs.readdir('/' + system.name)
    await Promise.all(files.map(f => pfs.unlink('/' + system.name + '/' + f)))
    await pfs.rmdir('/' + system.name)
  }

  await pfs.mkdir('/' + system.name)
  await pfs.writeFile('/' + system.name + '/system.json', JSON.stringify(system))

  const index = await axios.get(`https://cdn.jsdelivr.net/gh/BSData/${system.name}@${system.version.replace('v', '')}/`)

  const files = (await index.data).match(/href="(.+\.(?:cat|gst))"/g).map(m => htmlDecode(m.replace('href="', '').slice(0, -1)))

  const q = new PQueue({ concurency: 3, throwOnTimeout: true, timeout: 60000, autostart: false })

  files.forEach(filename => q.add(async () => {
    const file = await axios(`https://cdn.jsdelivr.net${filename}`)
    await pfs.writeFile('/' + system.name + '/' + _.last(filename.split('/')), file.data)
  }))

  return q
}

export const clearGameSystem = async (system) => {
  const files = await pfs.readdir('/' + system.name)
  await Promise.all(files.map(f => pfs.unlink('/' + system.name + '/' + f)))
  await pfs.rmdir('/' + system.name)
}

export const clearCache = async (dir) => {
  await pfs.unlink(dir + '/cache.json')
}

export const listFiles = async (dir) => {
  const files = await pfs.readdir(dir)
  const paths = files
    .filter(f => f.endsWith('.cat') || f.endsWith('.gst'))
    .map(f => dir + '/' + f)

  return paths
}

const cacheVersion = 2

export const readFiles = async (dir) => {
  try {
    if (await pfs.stat(dir + '/cache.json')) {
      console.log('Leading cache')
      const cache = JSON.parse(await pfs.readFile(dir + '/cache.json'))
      if (cache.gameSystem && cache.version === cacheVersion) {
        console.log(`Cache v${cacheVersion} looks valid`)
        return cache
      }
      console.log(`Found cache v${cache.version || 1}, wanted v${cacheVersion}. Reparsing raw files`)
    }
  } catch {
    console.log("No cache found. Reparsing raw files.")
  }

  const parsed = {
    version: cacheVersion,
    ids: {},
    catalogues: [],
  }

  function index(x) {
    if (x.id) {
      parsed.ids[x.id] = x
    }

    delete x.import
    for (let attr in x) {
      if (x[attr] === '') { delete x[attr] }

      if (x[attr] instanceof Array) {
        x[attr].forEach(index)

        if (attr.startsWith('shared')) {
          delete x[attr]
        }
      }
    }
  }

  const paths = await listFiles(dir)
  await Promise.all(paths.map(async (path) => {
    const data = await readXML(path, fs)
    index(data)

    if (data.type === 'gameSystem') { parsed.gameSystem = data }
    else if (data.type === 'catalogue') {
      parsed.catalogues.push(data)
    }
    else { throw new Error('Wut?') }
  }))

  parsed.catalogues = parsed.catalogues.filter(c => !c.library)

  try {
    await pfs.unlink(dir + '/cache.json')
  } catch {}

  await pfs.writeFile(dir + '/cache.json', JSON.stringify(parsed))

  return parsed
}

export const readRawFiles = async (dir) => {
  const files = {}

  const paths = await listFiles(dir)
  await Promise.all(paths.map(async (path) => {
    const data = await readXML(path, fs)
    const filename = _.last(path.split('/'))

    files[filename] = data

    if (data.type === 'gameSystem') {
      files.gameSystem = filename
    }
  }))

  return files
}
