// Bundles every content/dnd/<campaign>/cover.jpg so pages can look one up by slug.
const covers = require.context('../../../content/dnd', true, /^\.\/[^/]+\/cover\.jpg$/)

export const coverFor = slug => {
  const key = `./${slug}/cover.jpg`
  if (!covers.keys().includes(key)) return null
  const file = covers(key)
  return file.default || file
}
