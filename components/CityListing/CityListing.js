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
// (?q=); the price chips do the same (?price=). `blogs` is the whole city so
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
  // Each restaurant's title, cuisine, address, area and must-order dishes,
  // normalized once for matching (accents and apostrophes ignored). Built in
  // the browser.
  const searchable = useMemo(
    () =>
      blogs.map((blog) =>
        normalizeSearchText(
          [
            blog.title,
            blog.cuisine,
            blog.address,
            blog.area,
            ...(blog.mustOrder || []),
          ].join('\n')
        )
      ),
    [blogs]
  )
  const normalizedQuery = normalizeSearchText(query.trim())
  const searching = normalizedQuery !== ''
  const textMatches = searching
    ? blogs.filter((_, i) => searchable[i].includes(normalizedQuery))
    : blogs

  // Price chips, only in cities with `filters: true` (utils/cities.js), and
  // only once every open restaurant there has a price, so choosing one never
  // quietly hides restaurants that just haven't been priced yet.
  const priceOptions = useMemo(() => {
    if (!city.filters) return []
    const open = blogs.filter((blog) => !blog.closed)
    if (!open.length || !open.every((blog) => blog.price)) return []
    return PRICES.filter((p) => open.some((blog) => blog.price === p.label))
  }, [blogs, city.filters])
  // The selection lives in the address (?price=…), read once the router is
  // ready, like ?q=, so going back from a post keeps it.
  const selectedPrices = router.isReady
    ? readList(router.query.price)
        .map((key) => priceOptions.find((p) => p.key === key))
        .filter(Boolean)
        .map((p) => p.label)
    : []
  const filtering = selectedPrices.length > 0
  // Prices combine with OR, on top of the text search. Closed restaurants
  // are left out of filtered results and counts (they still show unfiltered
  // and in search).
  const openMatches = textMatches.filter((blog) => !blog.closed)

  const setPrices = (prices) => {
    const next = { ...router.query }
    const keys = prices.map((label) => PRICES.find((p) => p.label === label).key)
    if (keys.length) next.price = keys.join(',')
    else delete next.price
    router.replace({ pathname: router.pathname, query: next }, undefined, {
      shallow: true,
      scroll: false,
    })
  }

  const groups = priceOptions.length
    ? [
        {
          id: 'price',
          label: 'Price',
          onToggle: (value) =>
            setPrices(
              selectedPrices.includes(value)
                ? selectedPrices.filter((v) => v !== value)
                : [...selectedPrices, value]
            ),
          options: priceOptions.map((p) => ({
            value: p.label,
            label: p.label,
            selected: selectedPrices.includes(p.label),
            count: openMatches.filter((blog) => blog.price === p.label).length,
          })),
        },
      ]
    : []

  const restaurants = filtering
    ? openMatches.filter((blog) => selectedPrices.includes(blog.price))
    : searching
    ? // Closed restaurants still show in search, after the open ones, each
      // group in its usual order (newest first).
      [
        ...textMatches.filter((blog) => !blog.closed),
        ...textMatches.filter((blog) => blog.closed),
      ]
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
            activeCount={selectedPrices.length}
            onClear={() => setPrices([])}
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
