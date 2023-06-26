import { usePath, useRoster, useSystem, useRosterErrors } from './Context'
import CostLimits from './CostLimits'
import RosterNotes from './RosterNotes'
import Force from './Force/Force'
import AddForce from './Force/AddForce'
import BugReport from './BugReport'
import SelectRoster from './SelectRoster'
import React from 'react'

const Roster = ({ currentForce, setCurrentForce }) => {
  const [roster] = useRoster()
  const errors = useRosterErrors()
  const gameData = useSystem()
  const [path] = usePath()
  window.roster = roster

  if (!roster || !gameData) {
    return <SelectRoster />
  }

  window.errors = errors

  return (
    <article>
      {errors[''] && (
        <ul className="errors">
          {errors[''].map((e, i) => (
            <li key={i}>{e instanceof Error ? <BugReport error={e} /> : e}</li>
          ))}
        </ul>
      )}
      {path === '' ? (
        <section>
          <CostLimits />
          <AddForce />
          <RosterNotes />
        </section>
      ) : (
        <Force />
      )}
    </article>
  )
}

export default Roster
