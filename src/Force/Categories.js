import React from 'react'
import { findId } from '../utils'
import PropTypes from 'prop-types'

const Categories = ({ categories }) => {
  const string = Object.keys(categories).sort().join(', ')
  if (!string) { return null }

  return <article>
    <strong>Categories: </strong>
    <em>{string}</em>
  </article>
}
Categories.propTypes = {
  categories: PropTypes.object.isRequired,
}
export default Categories

export const collectCategories = (entry, gameData, catalogue, categories = {}) => {
  entry.categories?.category.forEach(c => categories[findId(gameData, catalogue, c.entryId).name] = true)
  entry.selections?.selection.forEach(e => collectCategories(e, gameData, catalogue, categories))

  return categories
}
