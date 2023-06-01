const Categories = ({ categories }) => {
  const string = Object.keys(categories).sort().join(', ')
  if (!string) { return null }

  return <article>
    <strong>Categories: </strong>
    <em>{string}</em>
  </article>
}

export default Categories

export const collectCategories = (entry, gameData, categories = {}) => {
  entry.categories?.category.forEach(c => categories[gameData.ids[c.entryId].name] = true)
  entry.selections?.selection.forEach(e => collectCategories(e, gameData, categories))

  return categories
}
