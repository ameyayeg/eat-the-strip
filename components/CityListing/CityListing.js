import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import styles from './CityListing.module.css'
import Search from '../Search/Search'
import { getCityById, cityPath } from '../../utils/cities'
import { absoluteUrl, SITE_NAME } from '../../utils/seo'

// Cards in the first row (three columns on desktop) load right away;
// the rest load lazily as the reader scrolls.
const PRIORITY_CARDS = 3

const matches = (blog, query) =>
  (blog.cuisine || '').toLowerCase().includes(query) ||
  (blog.title || '').toLowerCase().includes(query) ||
  (blog.address || '').toLowerCase().includes(query)

// The listing page for one city: heading, search and restaurant cards.
const CityListing = ({ cityId, blogs }) => {
  const city = getCityById(cityId)
  const [query, setQuery] = useState('')
  const normalizedQuery = query.trim().toLowerCase()
  const restaurants = normalizedQuery
    ? blogs.filter((blog) => matches(blog, normalizedQuery))
    : blogs

  return (
    <>
      <Head>
        <title>{`${city.name} restaurants | ${SITE_NAME}`}</title>
        <link rel="canonical" href={absoluteUrl(cityPath(city))} />
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
      </section>
    </>
  )
}

export default CityListing
