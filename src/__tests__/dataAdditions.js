import path from 'path'
import fs from 'fs'
import 'web-streams-polyfill/es2018'

import { getEntry, validateRoster } from '../validate'
import { addForce, addSelection, createRoster } from '../utils'
import { readFiles } from '../repo'
import { loadRoster } from '../repo/rosters'
import { viewSelectionText } from '../ViewRoster'

describe('defaultSelectionEntryId modifiers', () => {
  const gameSystemDir = path.join(__dirname, 'gameSystems', 'defaultSelectionEntryId')

  let gameData
  beforeAll(async () => {
    gameData = await readFiles(gameSystemDir, fs)
  })

  it('should behave as expected', () => {
    const catalogue = gameData.catalogues['842a-830c-10b0-37eb']
    const roster = createRoster('test', gameData)
    addForce(roster, '9ac4-bc9e-d214-8a7b', '842a-830c-10b0-37eb', gameData)

    const mainSelection = roster.forces.force[0].selections.selection[0]
    let mainSelectionEntry = getEntry(
      roster,
      'forces.force.0.selections.selection.0',
      '2796-9085-215b-dfa3',
      gameData,
      true,
    )
    const se = mainSelectionEntry.selectionEntries

    // Should Select Gun If Prefer Gun
    addSelection(mainSelection, se[0], gameData, null, catalogue)

    // Should Select Gun (Sword with max 0)
    addSelection(mainSelection, se[2], gameData, null, catalogue)

    // Prefer Gun
    addSelection(mainSelection, se[3], gameData, null, catalogue)
    // Now we refresh the entry, because prefer gun should apply a modifier to the default selection
    mainSelectionEntry = getEntry(
      roster,
      'forces.force.0.selections.selection.0',
      '2796-9085-215b-dfa3',
      gameData,
      true,
    )

    // Should Select Sword
    addSelection(mainSelection, se[1], gameData, null, catalogue)

    // Should Select Gun If Prefer Gun (again, now that "Prefer Gun" has been added)
    addSelection(mainSelection, se[0], gameData, null, catalogue)

    expect(viewSelectionText(mainSelection, 6)).toEqual(`Main Entry
      Should Select Gun If Prefer Gun
        Sword
      Should Select Gun (Sword with max 0)
        Gun
      Prefer Gun
      Should Select Sword
        Sword
      Should Select Gun If Prefer Gun
        Gun`)
  })
})

describe('exactly constraint', () => {
  const gameSystemDir = path.join(__dirname, 'gameSystems', 'exactly')

  let gameData
  beforeAll(async () => {
    gameData = await readFiles(gameSystemDir, fs)
  })

  it('should have error if fewer than exactly', async () => {
    const file = await loadRoster('InvalidRoster.ros', fs, gameSystemDir)
    const errors = validateRoster(file, gameData)

    expect(errors).toEqual({
      'forces.force.0': ['Roster must have 2 Exactly, but has 1'],
    })
  })

  it('should not error if the right number of selections', async () => {
    const file = await loadRoster('ValidRoster.ros', fs, gameSystemDir)
    const errors = validateRoster(file, gameData)

    expect(errors).toEqual({})
  })
})
