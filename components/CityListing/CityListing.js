import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { useMemo } from 'react'
import { useRouter } from 'next/router'
import styles from './CityListing.module.css'
import Pagination from '../Pagination/Pagination'
import ArchiveNote from '../ArchiveNote'
import { WritersPickIcon } from '../PostSummary/PostSummary'
import { getCityById, cityPath } from '../../utils/cities'
import { absoluteUrl, SITE_NAME } from '../../utils/seo'
import { pageCount, pageItems, pagePath } from '../../utils/pagination'
import { normalizeSearchText } from '../../utils/searchText'

// Cards in the first row (three columns on desktop) load right away;
// the rest load lazily as the reader scrolls.
const PRIORITY_CARDS = 3

// The listing page for one city: heading and restaurant cards. The search
// box lives in the header and puts the search in the address (?q=).
// `blogs` is the whole city so search covers every restaurant; without a
// search, only this page's cards show, with page numbers below.
const CityListing = ({ cityId, blogs, page = 1 }) => {
  const city = getCityById(cityId)
  const basePath = cityPath(city)
  const count = pageCount(blogs.length)
  const router = useRouter()
  // Read ?q= only once the router is ready, so the first render matches the
  // pre-built page (no flash, no hydration mismatch).
  const query =
    router.isReady && typeof router.query.q === 'string' ? router.query.q : ''
  // Each restaurant's title, cuisine and address, normalized once for
  // matching (accents and apostrophes ignored). Built in the browser, so the
  // page data stays the same size.
  const searchable = useMemo(
    () =>
      blogs.map((blog) =>
        normalizeSearchText([blog.title, blog.cuisine, blog.address].join('\n'))
      ),
    [blogs]
  )
  const normalizedQuery = normalizeSearchText(query.trim())
  const searching = normalizedQuery !== ''
  const restaurants = searching
    ? blogs.filter((_, i) => searchable[i].includes(normalizedQuery))
    : pageItems(blogs, page)
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
        </div>
      </section>

      <section className={styles.container}>
        {restaurants.length === 0 && (
          <p className={styles.noResults}>{city.noResults}</p>
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

        {!searching && (
          <Pagination page={page} count={count} basePath={basePath} />
        )}
      </section>
    </>
  )
}

export default CityListing
