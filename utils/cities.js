// The cities the site lists. The default city lives at /home; every other
// city at /home/<slug>.
//
// To add a city:
// 1. Add an entry here (with a lowercase `slug`, and `name` in its `values`).
// 2. Add its `name` to the City options in public/admin/config.yml.
// Its listing pages, pagination, menu and footer link, map button, post
// titles, map centre and sitemap entries all follow from this entry.
//
// `values` are the front matter `city` values that belong to the city
// (compared case-insensitively). Posts with no city (blank or null) belong
// to the default city. 'Ottawa' was the CMS option's earlier name; no post
// uses it, but it's kept so it can never become an unknown city. A post
// whose city matches no entry stops the build (utils/mdx.js).
const cities = [
  {
    id: 'ottawa-gatineau',
    name: 'Ottawa-Gatineau',
    isDefault: true,
    values: ['Ottawa-Gatineau', 'Ottawa'],
    heading: 'Explore the best local food in the capital region',
    intro:
      'Search food, cuisine, or address to discover the latest Ottawa-Gatineau spots.',
    noResults:
      'No restaurants matched that search. Try another cuisine or reset the search.',
    mapCenter: [45.4215, -75.6972],
    // Show the Cuisine, Neighbourhood and Price filters on its listing.
    filters: true,
  },
  {
    id: 'fredericton',
    slug: 'fredericton',
    name: 'Fredericton',
    values: ['Fredericton'],
    heading: 'Fredericton’s best small spots',
    intro:
      'Search food, cuisine, or address to find Fredericton’s hidden gems.',
    noResults:
      'No Fredericton restaurants matched that search. Try something broader.',
    mapCenter: [45.9636, -66.6431],
    // No longer updated: the listing and posts show an archive note
    // (components/ArchiveNote.js). The range of the posts' dates.
    archive: { from: 'August 2025', to: 'June 2026' },
  },
]

// Slugs that would clash with routes under /home.
const RESERVED_SLUGS = ['page']

// Fail the build early if the list is set up wrong.
const defaults = cities.filter((city) => city.isDefault)
if (defaults.length !== 1) {
  throw new Error('utils/cities.js: exactly one city must have isDefault: true')
}
cities.forEach((city) => {
  if (city.isDefault) return
  if (!/^[a-z0-9-]+$/.test(city.slug || '')) {
    throw new Error(`utils/cities.js: "${city.name}" needs a lowercase slug`)
  }
  if (RESERVED_SLUGS.includes(city.slug)) {
    throw new Error(
      `utils/cities.js: the slug "${city.slug}" clashes with a route; pick another`
    )
  }
})
if (new Set(cities.map((city) => city.slug)).size !== cities.length) {
  throw new Error('utils/cities.js: city slugs must be unique')
}

export const defaultCity = defaults[0]
export const otherCities = cities.filter((city) => !city.isDefault)

export function cityPath(city) {
  return city.isDefault ? '/home' : `/home/${city.slug}`
}

export function getCityById(id) {
  return cities.find((city) => city.id === id) || null
}

export function getCityBySlug(slug) {
  return otherCities.find((city) => city.slug === slug) || null
}

// The city a post belongs to, from its front matter `city` value.
// Blank or null means the default city; an unknown value returns null.
export function cityForPost(value) {
  const normalized = String(value ?? '')
    .trim()
    .toLowerCase()
  if (!normalized) return defaultCity
  return (
    cities.find((city) =>
      city.values.some((v) => v.toLowerCase() === normalized)
    ) || null
  )
}

export default cities
