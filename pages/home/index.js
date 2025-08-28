import Link from 'next/link'
import styles from './Home.module.css'
import Search from '../../components/Search/Search'
import { useState } from 'react'
import { useEffect } from 'react'
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
  const [query, setQuery] = useState('')
  const [userCoordinates, setUserCoordinates] = useState(null)
  const [allRestaurants, setAllRestaurants] = useState(blogs)
  const [status, setStatus] = useState('loading')
  const [city, setCity] = useState('Ottawa-Gatineau') // default

  useEffect(() => {
    if (!query) {
      setAllRestaurants(blogs)
      setStatus('loaded')
    } else {
      const searchedRestaurants = allRestaurants.filter((restaurant) => {
        return restaurant.cuisine.toLowerCase().includes(query)
      })
      if (searchedRestaurants.length < 1) {
        setStatus('none')
      } else {
        setAllRestaurants(searchedRestaurants)
        setStatus('loaded')
      }
    }
  }, [query])

  function resetRestaurants() {
    setAllRestaurants(blogs)
    setStatus('loaded')
    setQuery('')
  }

  function handleCityToggle() {
    setCity(city === 'Ottawa-Gatineau' ? 'Fredericton' : 'Ottawa-Gatineau')
  }

  // Filter restaurants by city (default Ottawa if city not set)
  const filteredRestaurants = allRestaurants.filter(
    (r) => (r.city || 'Ottawa-Gatineau') === city
  )

  return (
    <>
      <Search query={query} setQuery={setQuery} />

      <div
        style={{
          marginBottom: '1rem',
          position: 'absolute',
          top: '10px',
          right: '10px',
        }}
      >
        <button
          onClick={() => setCity('Ottawa-Gatineau')}
          className={`cityToggleLink${
            city === 'Ottawa-Gatineau' ? ' active' : ''
          }`}
          aria-pressed={city === 'Ottawa-Gatineau'}
        >
          Ottawa-Gatineau
        </button>
        <span>|</span>
        <button
          onClick={() => setCity('Fredericton')}
          className={`cityToggleLink${city === 'Fredericton' ? ' active' : ''}`}
          aria-pressed={city === 'Fredericton'}
        >
          Fredericton
        </button>
      </div>
      <section className={styles.container}>
        {status === 'loading' && <p>Loading...</p>}
        {status === 'loaded' &&
          filteredRestaurants.map((blog) => (
            <div className={styles.thumbnail} key={blog.slug}>
              <Link href={`/blog/${blog.slug}`}>
                <div style={{ position: 'relative' }}>
                  <Image
                    src={blog.thumbnail}
                    alt={blog.title}
                    width={320}
                    height={290}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      backgroundColor: 'yellow',
                      color: 'black',
                      top: '0',
                      left: '0',
                      textTransform: 'uppercase',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '16px',
                    }}
                  >
                    {blog.cuisine}
                  </span>
                  {blog.closed && (
                    <span
                      style={{
                        position: 'absolute',
                        backgroundColor: 'red',
                        color: 'black',
                        top: '0',
                        right: '0',
                        textTransform: 'uppercase',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '16px',
                      }}
                    >
                      Closed
                    </span>
                  )}

                  <span
                    style={{
                      position: 'absolute',
                      backgroundColor: 'black',
                      color: 'white',
                      bottom: '0',
                      left: '0',
                      right: '0',
                      padding: '0.5rem 0.75rem',
                    }}
                  >
                    {blog.title}
                  </span>
                </div>
              </Link>
            </div>
          ))}
        {status === 'none' && (
          <p
            style={{
              gridColumnStart: 2,
              gridColumnEnd: 4,
            }}
          >
            No restaurants found! Click{' '}
            <span
              style={{ textDecoration: 'underline', cursor: 'pointer' }}
              onClick={resetRestaurants}
            >
              here
            </span>{' '}
            to view all restaurants.
          </p>
        )}
      </section>
    </>
  )
}

export default Home
