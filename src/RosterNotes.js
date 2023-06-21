import { DebounceInput } from 'react-debounce-input'

import { useRoster } from './Context'

const RosterNotes = () => {
  const [roster, setRoster] = useRoster()
  return (
    <label>
      <h6>Notes</h6>
      <DebounceInput
        debounceTimeout={300}
        value={roster.customNotes}
        element="textarea"
        onChange={(e) => {
          roster.customNotes = e.target.value
          setRoster(roster)
        }}
      />
    </label>
  )
}

export default RosterNotes
