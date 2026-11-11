import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import styles from './CityListing.module.css'
import Search from '../Search/Search'
import Pagination from '../Pagination/Pagination'
import { getCityById, cityPath } from '../../utils/cities'
import { absoluteUrl, SITE_NAME } from '../../utils/seo'
import { pageCount, pageItems, pagePath } from '../../utils/pagination'

// Cards in the first row (three columns on desktop) load right away;
// the rest load lazily as the reader scrolls.
const PRIORITY_CARDS = 3

const matches = (blog, query) =>
  (blog.cuisine || '').toLowerCase().includes(query) ||
  (blog.title || '').toLowerCase().includes(query) ||
  (blog.address || '').toLowerCase().includes(query)

// The listing page for one city: heading, search and restaurant cards.
// `blogs` is the whole city so search covers every restaurant; without a
// search, only this page's cards show, with page numbers below.
const CityListing = ({ cityId, blogs, page = 1 }) => {
  const city = getCityById(cityId)
  const basePath = cityPath(city)
  const count = pageCount(blogs.length)
  const [query, setQuery] = useState('')
  const normalizedQuery = query.trim().toLowerCase()
  const searching = normalizedQuery !== ''
  const restaurants = searching
    ? blogs.filter((blog) => matches(blog, normalizedQuery))
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
          <p className={styles.headingTag}>{city.name}</p>
          <h1>{city.heading}</h1>
          <p>{city.intro}</p>
        </div>
      </section>

      <Search query={query} setQuery={setQuery} />

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
                  <h2>{blog.title}</h2>
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
