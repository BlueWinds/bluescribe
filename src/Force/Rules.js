import { useSystem } from '../Context'

const Rules = ({ rules }) => {
  const gameData = useSystem()

  return <>
    {Object.keys(rules).sort().map(name => <details key={name} className="rule">
      <summary>
        {name}{rules[name].publicationId ? ` (${gameData.ids[rules[name].publicationId].shortName || gameData.ids[rules[name].publicationId].name})` : ''}
      </summary>
      {rules[name].description}
    </details>)}
  </>
}

export default Rules

export const collectRules = (entry, rules = {}) => {
  entry.rules?.rule.forEach(r => rules[r.name] = r)
  entry.selections?.selection.forEach(e => collectRules(e, rules))

  return rules
}
