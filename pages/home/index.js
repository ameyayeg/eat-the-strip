import Link from 'next/link'
import styles from './Home.module.css'
import Search from '../../components/Search/Search'
import { useState } from 'react'
import { ImLocation } from 'react-icons/im'
import { useEffect } from 'react'
import haversineDistance from '../../utils/haversine'
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
  const [isLocationsActivated, setIsLocationActivated] = useState(false)

  useEffect(() => {
    if (!query) {
      setAllRestaurants(blogs)
      setStatus('loaded')
      setIsLocationActivated(false)
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

  function handleLocation() {
    if (userCoordinates) {
      const filteredByDistance = allRestaurants.filter((restaurant) => {
        const distance = haversineDistance(userCoordinates, [
          restaurant.positives,
          restaurant.negatives,
        ])
        if (distance < 5) {
          return true
        } else return false
      })
      if (filteredByDistance.length < 1) {
        setStatus('none')
      } else {
        setAllRestaurants(filteredByDistance)
        if (!isLocationsActivated) {
          setIsLocationActivated(true)
        } else {
          setAllRestaurants(blogs)

          setIsLocationActivated(false)
        }
      }
    }
  }

  useEffect(() => {
    if (navigator?.geolocation) {
      navigator.geolocation.getCurrentPosition((location) => {
        if (location)
          setUserCoordinates([
            location.coords.latitude,
            location.coords.longitude,
          ])
      })
    }
  }, [status])

  function resetRestaurants() {
    setAllRestaurants(blogs)
    setStatus('loaded')
    setQuery('')
  }

  function distanceCalculator(restaurantCoordinates) {
    const decimalNumber = haversineDistance(
      userCoordinates,
      restaurantCoordinates
    )
    return `${Math.ceil(decimalNumber)} km`
  }

  return (
    <>
      <Search query={query} setQuery={setQuery} />
      {userCoordinates && (
        <ImLocation
          style={{
            fontSize: '2rem',
            position: 'absolute',
            top: '36px',
            right: '36px',
            cursor: 'pointer',
          }}
          onClick={handleLocation}
        />
      )}
      <section className={styles.container}>
        {status === 'loading' && <p>Loading...</p>}
        {status === 'loaded' &&
          allRestaurants.map((blog) => (
            <div className={styles.thumbnail} key={blog.slug}>
              <Link href={`/blog/${blog.slug}`}>
                <div style={{ position: 'relative' }}>
                  <Image
                    src={blog.thumbnail}
                    alt={blog.title}
                    width={320}
                    height={290}
                    style={{
                      position: 'fixed',
                      zIndex: -1,
                    }}
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
                  {isLocationsActivated && (
                    <span
                      style={{
                        position: 'absolute',
                        backgroundColor: 'yellow',
                        color: 'black',
                        top: '0',
                        right: '0',
                        textTransform: 'uppercase',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '16px',
                      }}
                    >
                      {distanceCalculator([blog.positives, blog.negatives])}
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
