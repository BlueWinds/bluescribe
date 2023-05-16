import _ from 'lodash'
import { useState } from 'react'
import pluralize from 'pluralize'
import { Tooltip } from 'react-tooltip'
import { DebounceInput } from 'react-debounce-input'

import { useSystem, useRoster, useRosterErrors } from '../Context'
import { getEntry } from '../validate'
import { costString, sumCosts, textProfile, addSelection, refreshSelection, getMinCount, getMaxCount, isCollective, selectionName, copySelection } from '../utils'
import Profiles, { collectSelectionProfiles, collectEntryProfiles } from './Profiles'
import Rules, { collectRules } from './Rules'
import Categories, { collectCategories } from './Categories'
import SelectionModal from './SelectionModal'
import { pathParent } from '../validate'

const Selection = ({ path, setSelectedPath }) => {
  const gameData = useSystem()
  const [roster, setRoster] = useRoster()
  const [open, setOpen] = useState(false)

  const selection = _.get(roster, path)
  const selectionEntry = getEntry(roster, path, selection._entryId, gameData)
  const parentPath = path.split('.').slice(0, -3).join('.')
  const parent = _.get(roster, parentPath)

  return <div className="selection">
    <nav>
      <button className="outline" onClick={() => setSelectedPath(parentPath)} data-tooltip-id="tooltip" data-tooltip-html={parent._name}>^</button>
      <button className="outline" data-tooltip-id="clickable-tooltip">✍</button>
      <Tooltip id="clickable-tooltip" openOnClick={true} clickable={true}>
        <label>
          Custom Name
          <DebounceInput
            minLength={2}
            debounceTimeout={300}
            value={selection._customName}
            onChange={e => {
              selection._customName = e.target.value
              setRoster(roster)
            }}
          />
        </label>
      </Tooltip>

      <button className="outline" onClick={() => {
        const parent = _.get(roster, pathParent(path))
        parent.selections.selection.push(copySelection(selection))
        setRoster(roster)
      }} data-tooltip-id="tooltip" data-tooltip-html="Duplicate">⎘</button>
      <button className="outline" onClick={(e) => {
        const parent = _.get(roster, pathParent(path))
        parent.selections.selection.splice(_.last(path.split('.')), 1)
        setRoster(roster)

        setSelectedPath(path.split('.').slice(0, -3).join('.'))

        e.stopPropagation()
        e.preventDefault()
      }} data-tooltip-id="tooltip" data-tooltip-html="Remove">x</button>
    </nav>
    <h6 onClick={() => setOpen(true)}>{selectionName(selection)}</h6>
    {selectionEntry.selectionEntries && <article>
      {_.sortBy(selectionEntry.selectionEntries, '_name').map(entry => <Entry key={entry._id} entry={entry} path={path} selection={selection} selectionEntry={selectionEntry} entryGroup={null} />)}
    </article>}
    {selectionEntry.selectionEntryGroups && _.sortBy(selectionEntry.selectionEntryGroups, '_name').map(entryGroup => <EntryGroup key={entryGroup._id} path={path} entryGroup={entryGroup} selection={selection} selectionEntry={selectionEntry} />)}
    <SelectionModal open={open} setOpen={setOpen}>
      {open && <><header>
        <h6>{selection._name}</h6>
      </header>
      <Categories categories={collectCategories(selection, gameData)} />
      <Profiles profiles={collectSelectionProfiles(selection, gameData)} number={selection._number} />
      <Rules rules={collectRules(selection)} /></>}
    </SelectionModal>
  </div>
}

export default Selection


const useOnSelect = (path, selection, entryGroup) => {
  const gameData = useSystem()
  const [roster, setRoster] = useRoster()

  return (option, number) => {
    selection.selections = selection.selections || {selection: []}

    const cs = selection.selections.selection
    let current = cs.filter(s => s._entryId === option._id)

    if (number < current.length) {
      while (current.length > number) {
        cs.splice(cs.indexOf(_.last(current)), 1)
        current = cs.filter(s => s._entryId === option._id)
      }
    } else if (isCollective(option) && current.length) {
      current[0].selections?.selection.forEach(s => s._number = s._number / current[0]._number * number )
      current[0]._number = number
    } else {
      addSelection(selection, option, gameData, entryGroup, number - current.length)
    }

    refreshSelection(roster, path, selection, gameData)
    setRoster(roster)
  }
}

const Entry = ({ entry, path, selection, selectionEntry, entryGroup }) => {
  const onSelect = useOnSelect(path, selection, entryGroup)

  const min = getMinCount(entry) * selection._number
  const max = getMaxCount(entry) * selection._number

  if (entry._hidden) { return null }

  return max === 1 ? <Checkbox selection={selection} option={entry} onSelect={onSelect} entryGroup={entryGroup} /> : <Count selection={selection} option={entry} onSelect={onSelect} min={min} max={max} entryGroup={entryGroup} />
}

const EntryGroup = ({ path, entryGroup, selection, selectionEntry }) => {
  const gameData = useSystem()
  const onSelect = useOnSelect(path, selection, entryGroup)
  const selectionErrors = _.flatten(Object.entries(useRosterErrors()).filter(([key, value]) => key === path || key.startsWith(path + '.')).map(([key, value]) => value))
  const min = getMinCount(entryGroup) * selection._number
  const max = getMaxCount(entryGroup) * selection._number

  if (entryGroup._hidden || entryGroup.selectionEntries?.filter(e => !e._hidden).length === 0) { return null }

  return <article>
    <header data-tooltip-id="tooltip" data-tooltip-html={selectionErrors?.filter(e => e.includes(entryGroup._name) || entryGroup.selectionEntries?.some(se => e.includes(se._name))).join('<br />') || null}>
      {entryGroup._name}
      {min > 1 && ` - min ${min}`}
      {max > 1 && ` - max ${max}`}
      {entryGroup._publicationId && <small>{gameData.ids[entryGroup._publicationId]._name}, {entryGroup._page}</small>}
    </header>
    {max === 1 && !entryGroup.selectionEntryGroups ?
      <Radio selection={selection} entryGroup={entryGroup} onSelect={onSelect} />
    :
      _.sortBy(entryGroup.selectionEntries || [], '_name').map(subEntry => <Entry key={subEntry._id} entry={subEntry} path={path} selection={selection} selectionEntry={selectionEntry} entryGroup={entryGroup} />)
    }
    {entryGroup.selectionEntryGroups?.map(subGroup => <EntryGroup key={subGroup._id} path={path} entryGroup={subGroup} selection={selection} selectionEntry={selectionEntry} />)}
  </article>
}

const Radio = ({ selection, entryGroup, onSelect }) => {
  const gameData = useSystem()
  const min = getMinCount(entryGroup)
  const max = getMaxCount(entryGroup)
  const entries = entryGroup.selectionEntries

  const selectedOption = selection.selections?.selection.find(s => s._entryGroupId === entryGroup._id)

  return <>
    {min === 0 && max === 1 && <label>
      <input type="radio" name={entryGroup._id} onChange={() => onSelect(entries.find(e => e._id === selectedOption._entryId), 0)} checked={!selectedOption} />
      (None)
    </label>}
    {_.sortBy(entries, '_name').map((option, index) => {
      const cost = costString(sumCosts(option))
      const checked = selectedOption?._entryId === option._id
      if (option._hidden && !checked) { return null }
      return <label key={option._id}>
        <input
          type={max === 1 && entries.length > 1 ? 'radio' : 'checkbox'}
          name={entryGroup._id}
          checked={checked}
          onChange={() => onSelect(option, (max !== 1 || entries.length > 1) && checked ? 0 : 1)}
        />
        <span data-tooltip-id="tooltip" data-tooltip-html={textProfile(collectEntryProfiles(option, gameData))}>
          {option._name}
        </span>
        {cost && ` (${cost})`}
      </label>
    })}
  </>
}

const Checkbox = ({ selection, option, onSelect, entryGroup }) => {
  const gameData = useSystem()

  const cost = costString(sumCosts(option))
  const checked = !!selection.selections?.selection.find(s => s._entryId === option._id)
  const min = getMinCount(option)

  if (checked && min === 1) { return null }

  return <label>
    <input
      type="checkbox"
      checked={checked}
      onChange={() => onSelect(option, checked ? 0 : 1)}
      disabled={checked && min === 1}
    />
    <span data-tooltip-id="tooltip" data-tooltip-html={textProfile(collectEntryProfiles(option, gameData))}>
      {option._name}
    </span>
    {cost && ` (${cost})`}
  </label>
}

const Count = ({ selection, option, min, max, onSelect, entryGroup }) => {
  const gameData = useSystem()

  const value = _.sum(selection.selections?.selection.map(s => s._entryId === option._id ? s._number : 0)) || 0
  if (value === min && value === max) { return null }

  const cost = costString(sumCosts(option))

  const numberTip = min === max ? `${min} ${pluralize(option._name)}` : `${min}-${max} ${pluralize(option._name)}`

  return <label>
    <input
      type="number"
      value={value}
      min={min}
      max={max === -1 ? 1000 : max}
      step="1"
      onChange={(e) => onSelect(option, parseInt(e.target.value, 10))}
      data-tooltip-id="tooltip"
      data-tooltip-html={numberTip}
    />
    <span data-tooltip-id="tooltip" data-tooltip-html={textProfile(collectEntryProfiles(option, gameData))}>
      {option._name}
    </span>
    {cost && ` (${cost})`}
  </label>
}