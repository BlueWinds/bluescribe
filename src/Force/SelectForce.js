import _ from 'lodash'

import { useRoster, useRosterErrors } from '../Context'

export const gatherForces = (parent, path = '', forces = []) => {
  parent.forces?.force.forEach((f, i) => {
    const p = path ? `${path}.forces.force.${i}` : `forces.force.${i}`
    forces.push(p)
    gatherForces(f, p, forces)
  })

  return forces
}

const SelectForce = ({ children, onChange, value }) => {
  const [roster] = useRoster()
  const errors = useRosterErrors()
  const forces = gatherForces(roster)

  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}>
      {children}
      {forces.map((path) => (
        <option value={path} key={path}>
          {'  '.repeat(path.split('.').length / 3)}
          {Object.keys(errors).find((p) => p.startsWith(path)) ? '!! ' : ''}
          {_.get(roster, path).catalogueName}
          {' - '}
          {_.get(roster, path).name}
        </option>
      ))}
    </select>
  )
}

export default SelectForce
