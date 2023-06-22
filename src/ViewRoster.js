import { Fragment } from 'react'
import _ from 'lodash'
import useStorage from 'squirrel-gill'

import { useRoster, useSystem } from './Context'
import { costString, sumCosts } from './utils'
import Profiles, { collectSelectionProfiles } from './Force/Profiles'
import Rules, { collectRules } from './Force/Rules'
import Categories, { collectCategories } from './Force/Categories'

const ViewRoster = () => {
  const [roster] = useRoster()
  const [type, setType] = useStorage(localStorage, 'viewRosterType', 'full')

  // <label>
  //   <input type="radio" checked={type === 'compact'} onChange={() => setType('compact')} />
  //   Compact
  // </label>
  return (
    <>
      <fieldset>
        <span>View roster as</span>
        <label>
          <input type="radio" checked={type === 'full'} onChange={() => setType('full')} />
          Full
        </label>
        <label>
          <input type="radio" checked={type === 'text'} onChange={() => setType('text')} />
          Text
        </label>
      </fieldset>
      {type === 'text' && (
        <code className="text-roster">
          +++ {roster.name} ({roster.gameSystemName}) [{costString(sumCosts(roster))}] +++
          {roster.forces?.force.map((force) => (
            <ViewForceText force={force} key={force.id} />
          ))}
        </code>
      )}
      {type === 'full' && (
        <div className="view-roster">
          <h4>
            {roster.name} ({roster.gameSystemName}) [{costString(sumCosts(roster))}]
          </h4>
          {roster.forces?.force.map((force) => (
            <ViewForce force={force} key={force.id} />
          ))}
        </div>
      )}
    </>
  )
}

const ViewForce = ({ force }) => {
  const gameData = useSystem()
  return (
    <>
      <h5>
        {force.name} ({force.catalogueName}){maybeCost(force)}
      </h5>
      {force.selections?.selection.map((selection) => (
        <ViewSelection selection={selection} catalogue={gameData.catalogues[force.catalogueId]} />
      ))}
    </>
  )
}

const ViewSelection = ({ catalogue, selection }) => {
  const gameData = useSystem()

  return (
    <article>
      <header>
        <h6>{selection.name}</h6>
      </header>
      <Categories categories={collectCategories(selection, gameData, catalogue)} />
      <Profiles profiles={collectSelectionProfiles(selection, gameData)} number={selection.number} />
      <Rules catalogue={catalogue} rules={collectRules(selection)} />
    </article>
  )
}

const ViewForceText = ({ force }) => {
  const selections = {}
  const parseSelection = (selection) => {
    const primary = _.find(selection.categories?.category, 'primary')?.entryId || '(No Category)'
    console.log(primary, selection)
    selections[primary] = selections[primary] || []
    selections[primary].push(selection)
  }

  force.selections?.selection.forEach(parseSelection)

  return (
    <Fragment key={force.id}>
      {'\n\n'}
      {'++ '}
      {force.name} ({force.catalogueName}){maybeCost(force)} ++
      {force.categories?.category.map((category) => {
        if (!selections[category.entryId]) {
          return null
        }

        const fakeSelection = {
          selections: { selection: selections[category.entryId] },
        }

        return (
          <Fragment key={category.id}>
            {'\n\n'}
            {'  + '}
            {category.name}
            {maybeCost(fakeSelection)} +{'\n\n'}
            {_.sortBy(selections[category.entryId], 'name')
              .map((s) => '    ' + viewSelectionText(s, 6))
              .join('\n\n')}
          </Fragment>
        )
      })}
    </Fragment>
  )
}

const maybeCost = (selection) => {
  const cost = costString(sumCosts(selection))
  return cost && ' [' + cost + ']'
}

const viewSelectionText = (selection, indent) => {
  return [
    `${selection.name}${maybeCost(selection)}`,
    ...(selection.selections?.selection.map((s) => viewSelectionText(s, indent + 2)) || []),
  ].join('\n' + _.repeat(' ', indent))
}

export default ViewRoster
