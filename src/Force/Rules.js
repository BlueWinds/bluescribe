import React from 'react'
import { findId } from '../utils'
import { useSystem } from '../Context'
import PropTypes from 'prop-types'

const Rules = ({ catalogue, rules }) => {
  const gameData = useSystem()

  return <>
    {Object.keys(rules).sort().map(name => <details key={name} className="rule">
      <summary>
        {name}{rules[name].publicationId ? ` (${findId(gameData, catalogue, rules[name].publicationId).shortName || findId(gameData, catalogue, rules[name].publicationId).name})` : ''}
      </summary>
      {rules[name].description}
    </details>)}
  </>
}
Rules.propTypes = {
  catalogue: PropTypes.object.isRequired,
  rules: PropTypes.object.isRequired,
}

export default Rules

export const collectRules = (entry, rules = {}) => {
  entry.rules?.rule.forEach(r => rules[r.name] = r)
  entry.selections?.selection.forEach(e => collectRules(e, rules))

  return rules
}
