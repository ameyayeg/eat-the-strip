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

// "a,b" from the address as a list.
const readList = (value) =>
  typeof value === 'string' && value
    ? value.split(',').map((item) => item.trim()).filter(Boolean)
    : []

// The listing page for one city: heading, filter chips and restaurant cards.
// The search box lives in the header and puts the search in the address
// (?q=); the chips do the same (?area=, ?price=). `blogs` is the whole city so
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

  // Filter chips: Neighbourhood (area) and Price, each only if this city has
  // that data. Neighbourhoods are ordered by how many open restaurants each
  // has across the city, a fixed order, so chips never move as you filter.
  const areaOptions = useMemo(() => {
    const counts = {}
    blogs.forEach((blog) => {
      if (blog.area && !blog.closed) counts[blog.area] = (counts[blog.area] || 0) + 1
    })
    return Object.keys(counts).sort(
      (a, b) => counts[b] - counts[a] || a.localeCompare(b)
    )
  }, [blogs])
  const priceOptions = useMemo(
    () => PRICES.filter((p) => blogs.some((blog) => blog.price === p.label)),
    [blogs]
  )
  // The selection lives in the address (?area=…&price=…), read once the
  // router is ready, like ?q=, so going back from a post keeps it.
  const selectedAreas = router.isReady
    ? readList(router.query.area).filter((a) => areaOptions.includes(a))
    : []
  const selectedPrices = router.isReady
    ? readList(router.query.price)
        .map((key) => priceOptions.find((p) => p.key === key))
        .filter(Boolean)
        .map((p) => p.label)
    : []
  const filtering = selectedAreas.length > 0 || selectedPrices.length > 0
  // Neighbourhoods combine with OR, prices with OR, the two groups with AND,
  // all on top of the text search. Closed restaurants are left out of
  // filtered results and counts (they still show unfiltered and in search).
  const inAreas = (blog) =>
    !selectedAreas.length || selectedAreas.includes(blog.area)
  const inPrices = (blog) =>
    !selectedPrices.length || selectedPrices.includes(blog.price)
  const openMatches = textMatches.filter((blog) => !blog.closed)

  const setFilters = (areas, prices) => {
    const next = { ...router.query }
    if (areas.length) next.area = areas.join(',')
    else delete next.area
    const keys = prices.map((label) => PRICES.find((p) => p.label === label).key)
    if (keys.length) next.price = keys.join(',')
    else delete next.price
    router.replace({ pathname: router.pathname, query: next }, undefined, {
      shallow: true,
      scroll: false,
    })
  }
  const toggle = (list, value) =>
    list.includes(value) ? list.filter((v) => v !== value) : [...list, value]

  const groups = []
  if (areaOptions.length) {
    groups.push({
      id: 'area',
      label: 'Neighbourhood',
      onToggle: (value) => setFilters(toggle(selectedAreas, value), selectedPrices),
      options: areaOptions.map((area) => ({
        value: area,
        label: area,
        selected: selectedAreas.includes(area),
        count: openMatches.filter((b) => b.area === area && inPrices(b)).length,
      })),
    })
  }
  if (priceOptions.length) {
    groups.push({
      id: 'price',
      label: 'Price (where noted)',
      onToggle: (value) => setFilters(selectedAreas, toggle(selectedPrices, value)),
      options: priceOptions.map((p) => ({
        value: p.label,
        label: p.label,
        selected: selectedPrices.includes(p.label),
        count: openMatches.filter((b) => b.price === p.label && inAreas(b)).length,
      })),
    })
  }

  const restaurants = filtering
    ? openMatches.filter((blog) => inAreas(blog) && inPrices(blog))
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
            activeCount={selectedAreas.length + selectedPrices.length}
            onClear={() => setFilters([], [])}
            note={
              selectedPrices.length
                ? 'Only restaurants with a price noted are shown. We’re still filling it in.'
                : null
            }
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
