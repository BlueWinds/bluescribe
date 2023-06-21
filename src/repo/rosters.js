import containerTags from 'bsd-schema/containerTags.json'

import { readXML, xmlData } from './'

export const listRosters = async (gameSystem, fs) => {
  const rosters = {}
  const files = await fs.promises.readdir('/')
  await Promise.all(
    files.map(async (file) => {
      try {
        const roster = await loadRoster('/' + file, fs)
        if (roster.gameSystemId === gameSystem.id) {
          rosters[file] = roster.name
        }
      } catch (e) {
        rosters[file] = e
      }
    }),
  )
  return rosters
}

export const loadRoster = async (file, fs) => {
  const roster = await readXML(file, fs)
  roster.__ = {
    filename: file,
    updated: false,
  }

  function normalize(x) {
    for (let attr in x) {
      if (x[attr] === '') {
        delete x[attr]
      } else if (containerTags[attr] && x[attr][containerTags[attr]]) {
        x[attr][containerTags[attr]].forEach(normalize)
      }
    }
  }

  normalize(roster)

  return roster
}

export const saveRoster = async (roster, fs) => {
  const {
    __: { filename },
    ...contents
  } = roster

  const data = await xmlData({ roster: contents }, filename)
  await fs.promises.writeFile('/' + filename, data)
}

export const importRoster = async (file, fs) => {
  const data = await file.arrayBuffer()
  console.log('writing', '/' + file.name)
  await fs.promises.writeFile('/' + file.name, data)
}

export const downloadRoster = async (roster) => {
  const {
    __: { filename },
    ...contents
  } = roster

  const data = await xmlData({ roster: contents }, filename)
  const blob = new Blob([data], { type: 'application/xml' })

  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.setAttribute('href', url)
  a.download = filename
  a.style.display = 'none'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export const deleteRoster = async (file, fs) => {
  await fs.promises.unlink('/' + file)
}
