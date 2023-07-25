import _ from 'lodash'
import { useState } from 'react'
import pluralize from 'pluralize'
import { Tooltip } from 'react-tooltip'
import { DebounceInput } from 'react-debounce-input'

import { useSystem, useRoster, useRosterErrors, usePath } from '../Context'
import { getEntry, pathToForce } from '../validate'
import SelectForce from './SelectForce'
import {
  costString,
  findId,
  getCatalogue,
  sumCosts,
  textProfile,
  addSelection,
  refreshSelection,
  getMinCount,
  getMaxCount,
  isCollective,
  selectionName,
  copySelection,
} from '../utils'
import Profiles, { collectSelectionProfiles, collectEntryProfiles } from './Profiles'
import Rules, { collectRules } from './Rules'
import Categories, { collectCategories } from './Categories'
import SelectionModal from './SelectionModal'
import { pathParent } from '../validate'

const Selection = () => {
  const gameData = useSystem()
  const [roster, setRoster] = useRoster()
  const [path, setPath] = usePath()
  const [open, setOpen] = useState(false)

  const catalogue = getCatalogue(roster, path, gameData)
  const selection = _.get(roster, path)
  const selectionEntry = getEntry(roster, path, selection.entryId, gameData)
  const forcePath = pathToForce(path)

  return (
    <div className="selection">
      <nav>
        <Tooltip id="move-tooltip" openOnClick={true} clickable={true}>
          <label>
            Move to different force
            <SelectForce
              value={forcePath}
              onChange={(newPath) => {
                const oldForce = _.get(roster, forcePath)
                _.pull(oldForce.selections.selection, selection)

                const newForce = _.get(roster, newPath)
                newForce.selections = newForce.selections || { selection: [] }
                newForce.selections.selection.push(selection)

                setRoster(roster)
                setPath(forcePath)
              }}
            />
          </label>
        </Tooltip>
        <button className="outline" data-tooltip-id="move-tooltip">
          <span data-tooltip-id="tooltip" data-tooltip-html="Move to different force">
            ->
          </span>
        </button>
        <button className="outline" data-tooltip-id="custom-name-tooltip">
          <span data-tooltip-id="tooltip" data-tooltip-html="Customize">
            ✍
          </span>
        </button>
        <Tooltip
          id="custom-name-tooltip"
          openOnClick={true}
          clickable={true}
          afterShow={(e) => {
            setTimeout(
              () => document.getElementById('custom-name-tooltip').getElementsByTagName('input')[0].focus(),
              10,
            )
          }}
        >
          <label>
            Custom Name
            <DebounceInput
              minLength={2}
              debounceTimeout={300}
              value={selection.customName}
              onChange={(e) => {
                selection.customName = e.target.value
                setRoster(roster)
              }}
            />
          </label>
        </Tooltip>

        <button
          className="outline"
          onClick={() => {
            const parent = _.get(roster, pathParent(path))
            parent.selections.selection.push(copySelection(selection))
            setRoster(roster)
          }}
          data-tooltip-id="tooltip"
          data-tooltip-html="Duplicate"
        >
          ⎘
        </button>
        <button
          className="outline"
          onClick={(e) => {
            const parent = _.get(roster, pathParent(path))
            _.pull(parent.selections.selection, selection)
            setRoster(roster)

            setPath(pathParent(path))

            e.stopPropagation()
            e.preventDefault()
          }}
          data-tooltip-id="tooltip"
          data-tooltip-html="Remove"
        >
          x
        </button>
      </nav>
      <h6 onClick={() => setOpen(true)}>{selectionName(selection)}</h6>
      {selectionEntry ? (
        <>
          {selectionEntry.selectionEntries && (
            <article>
              {_.sortBy(selectionEntry.selectionEntries, 'name').map((entry) => (
                <Entry
                  key={entry.id}
                  entry={entry}
                  path={path}
                  selection={selection}
                  selectionEntry={selectionEntry}
                  entryGroup={null}
                  catalogue={catalogue}
                />
              ))}
            </article>
          )}
          {selectionEntry.selectionEntryGroups &&
            _.sortBy(selectionEntry.selectionEntryGroups, 'name').map((entryGroup) => (
              <EntryGroup
                key={entryGroup.id}
                path={path}
                entryGroup={entryGroup}
                selection={selection}
                selectionEntry={selectionEntry}
              />
            ))}
          <SelectionModal open={open} setOpen={setOpen}>
            {open && (
              <>
                <header>
                  <h6>{selection.name}</h6>
                </header>
                <Categories categories={collectCategories(selection, gameData, catalogue)} />
                <Profiles profiles={collectSelectionProfiles(selection, gameData)} number={selection.number} />
                <Rules catalogue={catalogue} rules={collectRules(selection)} />
              </>
            )}
          </SelectionModal>
        </>
      ) : (
        <>{selectionName(selection)} does not exist in the game data. It may have been removed in a data update.</>
      )}
    </div>
  )
}

export default Selection

const useOnSelect = (path, selection, entryGroup) => {
  const gameData = useSystem()
  const [roster, setRoster] = useRoster()

  return (option, number) => {
    selection.selections = selection.selections || { selection: [] }

    const cs = selection.selections.selection
    let current = cs.filter((s) => s.entryId === option.id)

    if (number < current.length) {
      while (current.length > number) {
        cs.splice(cs.indexOf(_.last(current)), 1)
        current = cs.filter((s) => s.entryId === option.id)
      }
    } else if (isCollective(option) && current.length) {
      current[0].selections?.selection.forEach((s) => (s.number = (s.number / current[0].number) * number))
      current[0].number = number
    } else {
      addSelection(
        selection,
        option,
        gameData,
        entryGroup,
        getCatalogue(roster, path, gameData),
        number - current.length,
      )
    }

    refreshSelection(roster, path, selection, gameData)
    setRoster(roster)
  }
}

const Entry = ({ catalogue, entry, path, selection, selectionEntry, entryGroup }) => {
  const onSelect = useOnSelect(path, selection, entryGroup)

  const min = getMinCount(entry) * selection.number
  const max = getMaxCount(entry) * selection.number

  if (entry.hidden) {
    return null
  }

  return max === 1 ? (
    <Checkbox selection={selection} option={entry} onSelect={onSelect} entryGroup={entryGroup} catalogue={catalogue} />
  ) : (
    <Count
      selection={selection}
      option={entry}
      onSelect={onSelect}
      min={min}
      max={max}
      entryGroup={entryGroup}
      catalogue={catalogue}
    />
  )
}

const EntryGroup = ({ path, entryGroup, selection, selectionEntry }) => {
  const gameData = useSystem()
  const [roster] = useRoster()
  const onSelect = useOnSelect(path, selection, entryGroup)

  const catalogue = getCatalogue(roster, path, gameData)
  const selectionErrors = _.flatten(
    Object.entries(useRosterErrors())
      .filter(([key, value]) => key === path || key.startsWith(path + '.'))
      .map(([key, value]) => value),
  )
  const min = getMinCount(entryGroup) * selection.number
  const max = getMaxCount(entryGroup) * selection.number

  if (entryGroup.hidden || entryGroup.selectionEntries?.filter((e) => !e.hidden).length === 0) {
    return null
  }

  return (
    <article>
      <header
        data-tooltip-id="tooltip"
        data-tooltip-html={
          selectionErrors
            ?.filter(
              (e) => e.includes(entryGroup.name) || entryGroup.selectionEntries?.some((se) => e.includes(se.name)),
            )
            .join('<br />') || null
        }
      >
        {entryGroup.name}
        {min > 1 && ` - min ${min}`}
        {max > 1 && ` - max ${max}`}
        {entryGroup.publicationId && (
          <small>
            {findId(gameData, catalogue, entryGroup.publicationId).name}, {entryGroup.page}
          </small>
        )}
      </header>
      {max === 1 && !entryGroup.selectionEntryGroups ? (
        <Radio selection={selection} entryGroup={entryGroup} onSelect={onSelect} catalogue={catalogue} />
      ) : (
        _.sortBy(entryGroup.selectionEntries || [], 'name').map((subEntry) => (
          <Entry
            key={subEntry.id}
            entry={subEntry}
            path={path}
            selection={selection}
            selectionEntry={selectionEntry}
            entryGroup={entryGroup}
            catalogue={catalogue}
          />
        ))
      )}
      {entryGroup.selectionEntryGroups?.map((subGroup) => (
        <EntryGroup
          key={subGroup.id}
          path={path}
          entryGroup={subGroup}
          selection={selection}
          selectionEntry={selectionEntry}
        />
      ))}
    </article>
  )
}

const Radio = ({ catalogue, selection, entryGroup, onSelect }) => {
  const gameData = useSystem()
  const min = getMinCount(entryGroup)
  const max = getMaxCount(entryGroup)
  const entries = entryGroup.selectionEntries

  const selectedOption = selection.selections?.selection.find((s) => s.entryGroupId === entryGroup.id)

  return (
    <>
      {min === 0 && max === 1 && (
        <label>
          <input
            type="radio"
            name={entryGroup.id}
            onChange={() =>
              onSelect(
                entries.find((e) => e.id === selectedOption.entryId),
                0,
              )
            }
            checked={!selectedOption}
          />
          (None)
        </label>
      )}
      {_.sortBy(entries, 'name').map((option, index) => {
        const cost = costString(sumCosts(option))
        const checked = selectedOption?.entryId === option.id
        if (option.hidden && !checked) {
          return null
        }
        return (
          <label key={option.id}>
            <input
              type={max === 1 && entries.length > 1 ? 'radio' : 'checkbox'}
              name={entryGroup.id}
              checked={checked}
              onChange={() => onSelect(option, (max !== 1 || entries.length > 1) && checked ? 0 : 1)}
            />
            <span
              data-tooltip-id="tooltip"
              data-tooltip-html={textProfile(collectEntryProfiles(option, gameData, catalogue))}
            >
              {option.name}
            </span>
            {cost && ` (${cost})`}
          </label>
        )
      })}
    </>
  )
}

const Checkbox = ({ catalogue, selection, option, onSelect, entryGroup }) => {
  const gameData = useSystem()

  const cost = costString(sumCosts(option))
  const checked = !!selection.selections?.selection.find(
    (s) => _.last(s.entryId.split('::')) === _.last(option.id.split('::')),
  )
  const min = getMinCount(option)

  if (checked && min === 1) {
    return null
  }

  if (option.name === 'Litany of Hate (Aura)') {
    debugger
  }

  return (
    <label>
      <input
        type="checkbox"
        checked={checked}
        onChange={() => onSelect(option, checked ? 0 : 1)}
        disabled={checked && min === 1}
      />
      <span
        data-tooltip-id="tooltip"
        data-tooltip-html={textProfile(collectEntryProfiles(option, gameData, catalogue))}
      >
        {option.name}
      </span>
      {cost && ` (${cost})`}
    </label>
  )
}

const Count = ({ catalogue, selection, option, min, max, onSelect, entryGroup }) => {
  const gameData = useSystem()

  const value = _.sum(selection.selections?.selection.map((s) => (s.entryId === option.id ? s.number : 0))) || 0
  const cost = costString(sumCosts(option))

  const numberTip =
    min === max ? `${min} ${pluralize(option.name)}` : max === -1 ? '' : `${min}-${max} ${pluralize(option.name)}`

  return (
    <label>
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
      <span
        data-tooltip-id="tooltip"
        data-tooltip-html={textProfile(collectEntryProfiles(option, gameData, catalogue))}
      >
        {option.name}
      </span>
      {cost && ` (${cost})`}
    </label>
  )
}
