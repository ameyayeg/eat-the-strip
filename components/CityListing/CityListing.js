import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { useMemo } from 'react'
import { useRouter } from 'next/router'
import styles from './CityListing.module.css'
import Pagination from '../Pagination/Pagination'
import ArchiveNote from '../ArchiveNote'
import FilterChips from '../FilterChips/FilterChips'
import { WritersPickIcon } from '../PostSummary/PostSummary'
import { getCityById, cityPath } from '../../utils/cities'
import { absoluteUrl, SITE_NAME } from '../../utils/seo'
import { pageCount, pageItems, pagePath } from '../../utils/pagination'
import { normalizeSearchText } from '../../utils/searchText'

// Cards in the first row (three columns on desktop) load right away;
// the rest load lazily as the reader scrolls.
const PRIORITY_CARDS = 3

// Price chips: the CMS values, with short keys for the address (?price=).
const PRICES = [
  { key: 'under-15', label: 'Under $15' },
  { key: '15-25', label: '$15–$25' },
  { key: 'over-25', label: 'Over $25' },
]

// How many cuisines get a chip; the rest are in the "More cuisines" list.
const CUISINE_CHIPS = 7

// A cuisine as a short key for the address (?cuisine=), ignoring case,
// accents and spacing: " Ethiopian " -> "ethiopian".
const cuisineKey = (value) =>
  normalizeSearchText(String(value ?? '').trim())
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

// "a,b" from the address as a list.
const readList = (value) =>
  typeof value === 'string' && value
    ? value.split(',').map((item) => item.trim()).filter(Boolean)
    : []

// The listing page for one city: heading, filter chips and restaurant cards.
// The search box lives in the header and puts the search in the address
// (?q=); the chips do the same (?cuisine=, ?area=, ?price=). `blogs` is the whole city so
// search and filters cover every restaurant; with neither, only this page's
// cards show, with page numbers below.
const CityListing = ({ cityId, blogs, page = 1 }) => {
  const city = getCityById(cityId)
  const basePath = cityPath(city)
  const count = pageCount(blogs.length)
  const router = useRouter()
  // Read ?q= only once the router is ready, so the first render matches the
  // pre-built page (no flash, no hydration mismatch).
  const query =
    router.isReady && typeof router.query.q === 'string' ? router.query.q : ''
  // Each restaurant's title, cuisine, address and area, normalized once for
  // matching (accents and apostrophes ignored). Built in the browser.
  const searchable = useMemo(
    () =>
      blogs.map((blog) =>
        normalizeSearchText(
          [blog.title, blog.cuisine, blog.address, blog.area].join('\n')
        )
      ),
    [blogs]
  )
  const normalizedQuery = normalizeSearchText(query.trim())
  const searching = normalizedQuery !== ''
  const textMatches = searching
    ? blogs.filter((_, i) => searchable[i].includes(normalizedQuery))
    : blogs

  // Filter groups, only in cities with `filters: true` (utils/cities.js):
  // Cuisine, Neighbourhood (area) and Price, each only if the city has that
  // data. Options are ordered by how many open restaurants each has across
  // the city, a fixed order, so chips never move as you filter. Each group's
  // `valueOf` gives a restaurant's value in that group.
  const cuisineOf = useMemo(
    () => Object.fromEntries(blogs.map((blog) => [blog.slug, cuisineKey(blog.cuisine)])),
    [blogs]
  )
  const defs = useMemo(() => {
    if (!city.filters) return []
    const open = blogs.filter((blog) => !blog.closed)
    // Cuisine is typed by hand, so values are grouped ignoring case and
    // spaces; each is shown with its most common spelling.
    const cuisines = {}
    open.forEach((blog) => {
      const key = cuisineOf[blog.slug]
      if (!key) return
      const entry = (cuisines[key] = cuisines[key] || { count: 0, spellings: {} })
      const spelling = String(blog.cuisine).trim()
      entry.count += 1
      entry.spellings[spelling] = (entry.spellings[spelling] || 0) + 1
    })
    const cuisineOptions = Object.keys(cuisines)
      .map((key) => {
        const { count, spellings } = cuisines[key]
        const label = Object.keys(spellings).sort((a, b) => spellings[b] - spellings[a])[0]
        return { value: key, label, total: count }
      })
      .sort((a, b) => b.total - a.total || a.label.localeCompare(b.label))

    const areas = {}
    open.forEach((blog) => {
      if (blog.area) areas[blog.area] = (areas[blog.area] || 0) + 1
    })
    const areaOptions = Object.keys(areas)
      .sort((a, b) => areas[b] - areas[a] || a.localeCompare(b))
      .map((area) => ({ value: area, label: area }))

    // Price only once every open restaurant in the city has one, so choosing
    // a price never quietly hides restaurants that just haven't been priced.
    const priced = open.length > 0 && open.every((blog) => blog.price)
    const priceOptions = priced
      ? PRICES.filter((p) => open.some((blog) => blog.price === p.label)).map((p) => ({
          value: p.key,
          label: p.label,
        }))
      : []

    return [
      {
        id: 'cuisine',
        label: 'Cuisine',
        options: cuisineOptions,
        valueOf: (blog) => cuisineOf[blog.slug],
        // The most common cuisines as chips, the rest in a drop-down.
        top: CUISINE_CHIPS,
        moreLabel: 'More cuisines',
      },
      {
        id: 'area',
        label: 'Neighbourhood',
        options: areaOptions,
        valueOf: (blog) => blog.area,
      },
      {
        id: 'price',
        label: 'Price',
        options: priceOptions,
        valueOf: (blog) => (PRICES.find((p) => p.label === blog.price) || {}).key,
      },
    ].filter((def) => def.options.length)
  }, [blogs, city.filters, cuisineOf])

  // The selection lives in the address (?cuisine=…&area=…&price=…), read
  // once the router is ready, like ?q=, so going back from a post keeps it.
  const selected = {}
  defs.forEach((def) => {
    selected[def.id] = router.isReady
      ? readList(router.query[def.id]).filter((value) =>
          def.options.some((option) => option.value === value)
        )
      : []
  })
  const activeCount = defs.reduce((sum, def) => sum + selected[def.id].length, 0)
  const filtering = activeCount > 0
  // Options within a group combine with OR, groups with AND, all on top of
  // the text search. Closed restaurants are left out of filtered results and
  // counts (they still show unfiltered and in search). A chip's count uses
  // every other group's selection, so it says what pressing it would add.
  const inGroups = (blog, skipId) =>
    defs.every(
      (def) =>
        def.id === skipId ||
        !selected[def.id].length ||
        selected[def.id].includes(def.valueOf(blog))
    )
  const openMatches = textMatches.filter((blog) => !blog.closed)

  const setFilters = (next) => {
    const query = { ...router.query }
    defs.forEach((def) => {
      const values = next[def.id] || []
      if (values.length) query[def.id] = values.join(',')
      else delete query[def.id]
    })
    router.replace({ pathname: router.pathname, query }, undefined, {
      shallow: true,
      scroll: false,
    })
  }
  const toggle = (list, value) =>
    list.includes(value) ? list.filter((v) => v !== value) : [...list, value]

  const groups = defs.map((def) => {
    const others = openMatches.filter((blog) => inGroups(blog, def.id))
    return {
      id: def.id,
      label: def.label,
      top: def.top,
      moreLabel: def.moreLabel,
      onToggle: (value) =>
        setFilters({ ...selected, [def.id]: toggle(selected[def.id], value) }),
      options: def.options.map((option) => ({
        value: option.value,
        label: option.label,
        selected: selected[def.id].includes(option.value),
        count: others.filter((blog) => def.valueOf(blog) === option.value).length,
      })),
    }
  })

  const restaurants = filtering
    ? openMatches.filter((blog) => inGroups(blog))
    : searching
    ? textMatches
    : pageItems(blogs, page)
  const status =
    filtering || searching
      ? `${restaurants.length} ${
          restaurants.length === 1 ? 'restaurant matches' : 'restaurants match'
        }`
      : ''
  const pageLabel = page > 1 ? ` – Page ${page}` : ''

  return (
    <>
      <Head>
        <title>{`${city.name} restaurants${pageLabel} | ${SITE_NAME}`}</title>
        <link rel="canonical" href={absoluteUrl(pagePath(basePath, page))} />
      </Head>

      <section className={styles.pageHeading}>
        <div className={styles.headingInner}>
          <ArchiveNote city={city} />
          <p className={styles.headingTag}>{city.name}</p>
          <h1>{city.heading}</h1>
          <p>{city.intro}</p>
          <FilterChips
            groups={groups}
            activeCount={activeCount}
            onClear={() => setFilters({})}
            status={status}
          />
        </div>
      </section>

      <section className={styles.container}>
        {restaurants.length === 0 && (
          <p className={styles.noResults}>
            {filtering
              ? 'No open restaurants match. Try clearing a filter.'
              : city.noResults}
          </p>
        )}

        <div className={styles.restaurantGrid}>
          {restaurants.map((blog, index) => (
            <Link href={`/blog/${blog.slug}`} key={blog.slug}>
              <a className={styles.card}>
                <div className={styles.cardImage}>
                  <Image
                    src={blog.thumbnail}
                    alt={blog.title}
                    layout="fill"
                    objectFit="cover"
                    objectPosition="center"
                    priority={index < PRIORITY_CARDS}
                  />
                  <span className={styles.cardBadge}>{blog.cuisine}</span>
                  {blog.closed && (
                    <span
                      className={`${styles.cardBadge} ${styles.cardClosed}`}
                    >
                      Closed
                    </span>
                  )}
                </div>
                <div className={styles.cardCopy}>
                  {blog.favourite ? (
                    <div className={styles.cardTitle}>
                      <h2>{blog.title}</h2>
                      <span className={styles.cardStar}>
                        <WritersPickIcon />
                      </span>
                    </div>
                  ) : (
                    <h2>{blog.title}</h2>
                  )}
                  <p>{blog.address}</p>
                </div>
              </a>
            </Link>
          ))}
        </div>

        {!searching && !filtering && (
          <Pagination page={page} count={count} basePath={basePath} />
        )}
      </section>
    </>
  )
}

export default CityListing
