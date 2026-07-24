import Link from 'next/link'
import styles from '../Home.module.css'
import Search from '../../../components/Search/Search'
import { useState, useEffect } from 'react'
import { getSortedPosts } from '../../../utils/mdx'
import generateRssFeed from '../../../utils/generateRSSFeed'
import Image from 'next/image'

export async function getStaticProps() {
  await generateRssFeed()
  const blogs = await getSortedPosts()
  return {
    props: {
      blogs,
    },
  }
}

const Fredericton = ({ blogs }) => {
  const frederictonRestaurants = blogs.filter((blog) => blog.city === 'Fredericton')
  const [query, setQuery] = useState('')
  const [restaurants, setRestaurants] = useState(frederictonRestaurants)
  const [status, setStatus] = useState('loaded')

  useEffect(() => {
    const normalizedQuery = query.trim().toLowerCase()
    const cityRestaurants = blogs.filter((blog) => blog.city === 'Fredericton')

    if (!normalizedQuery) {
      setRestaurants(cityRestaurants)
      setStatus('loaded')
      return
    }

    const searchedRestaurants = cityRestaurants.filter((restaurant) => {
      return (
        restaurant.cuisine.toLowerCase().includes(normalizedQuery) ||
        restaurant.title.toLowerCase().includes(normalizedQuery) ||
        (restaurant.address || '').toLowerCase().includes(normalizedQuery)
      )
    })

    if (searchedRestaurants.length < 1) {
      setStatus('none')
      setRestaurants([])
    } else {
      setRestaurants(searchedRestaurants)
      setStatus('loaded')
    }
  }, [query, blogs])

  return (
    <>
      <section className={styles.pageHeading}>
        <div className={styles.headingInner}>
          <p className={styles.headingTag}>Fredericton</p>
          <h1>Fredericton’s best small spots</h1>
          <p>
            Search food, cuisine, or address to find Fredericton’s hidden gems.
          </p>
        </div>
      </section>

      <Search query={query} setQuery={setQuery} />

      <section className={styles.container}>
        {status === 'none' && (
          <p className={styles.noResults}>
            No Fredericton restaurants matched that search. Try something
            broader.
          </p>
        )}

        <div className={styles.restaurantGrid}>
          {status === 'loaded' &&
            restaurants.map((blog) => (
              <Link
                href={`/home/fredericton/${blog.slug}`}
                key={blog.slug}
              >
                <div className={styles.card}>
                  <div className={styles.cardImage}>
                    <Image
                      src={blog.thumbnail}
                      alt={blog.title}
                      layout="fill"
                      objectFit="cover"
                      objectPosition="center"
                    />
                    <span className={styles.cardBadge}>{blog.cuisine}</span>
                    {blog.closed && (
                      <span className={`${styles.cardBadge} ${styles.cardClosed}`}>
                        Closed
                      </span>
                    )}
                  </div>
                  <div className={styles.cardTitle}>{blog.title}</div>
                  <div className={styles.cardSubtitle}>{blog.address}</div>
                </div>
              </Link>
            ))}
        </div>
      </section>
    </>
  )
}

export default Fredericton
