import { DebounceInput } from 'react-debounce-input'

import { usePath, useRoster, useSystem, useRosterErrors, useUpdateRoster } from './Context'
import CostLimits from './CostLimits'
import RosterNotes from './RosterNotes'
import Force from './Force/Force'
import AddForce from './Force/AddForce'
import BugReport from './BugReport'
import SelectRoster from './SelectRoster'

const Roster = ({ currentForce, setCurrentForce }) => {
  const [roster] = useRoster()
  const updateRoster = useUpdateRoster()
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
          <DebounceInput
            minLength={2}
            debounceTimeout={300}
            value={roster.name}
            onChange={(e) => updateRoster('name', e.target.value)}
          />
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
