import Link from 'next/link'
import styles from './Home.module.css'
import Search from '../../components/Search/Search'
import { useState, useEffect } from 'react'
import { getSortedPosts } from '../../utils/mdx'
import generateRssFeed from '../../utils/generateRSSFeed'
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

const Home = ({ blogs }) => {
  const cityRestaurants = blogs.filter(
    (blog) => (blog.city || 'Ottawa-Gatineau') === 'Ottawa-Gatineau'
  )
  const [query, setQuery] = useState('')
  const [restaurants, setRestaurants] = useState(cityRestaurants)
  const [status, setStatus] = useState('loaded')

  useEffect(() => {
    const normalizedQuery = query.trim().toLowerCase()

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
      setRestaurants([])
      setStatus('none')
    } else {
      setRestaurants(searchedRestaurants)
      setStatus('loaded')
    }
  }, [query, blogs])

  return (
    <>
      <section className={styles.pageHeading}>
        <div className={styles.headingInner}>
          <p className={styles.headingTag}>Ottawa-Gatineau</p>
          <h1>Explore the best local food in the capital region</h1>
          <p>
            Search food, cuisine, or address to discover the latest
            Ottawa-Gatineau spots.
          </p>
        </div>
      </section>

      <Search query={query} setQuery={setQuery} />

      <section className={styles.container}>
        {status === 'none' && (
          <p className={styles.noResults}>
            No restaurants matched that search. Try another cuisine or reset
            the search.
          </p>
        )}

        <div className={styles.restaurantGrid}>
          {restaurants.map((blog) => (
            <Link href={`/blog/${blog.slug}`} key={blog.slug}>
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
                <div className={styles.cardCopy}>
                  <h2>{blog.title}</h2>
                  <p>{blog.address}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}

export default Home
