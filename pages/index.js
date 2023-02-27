import Link from 'next/link'
import styles from '../styles/Home.module.css'
import fs from 'fs'
import matter from 'gray-matter'
import { BsSearch } from 'react-icons/bs'
import Search from '../components/Search'
import { useState } from 'react'
import { BiCurrentLocation } from 'react-icons/bi'
import { useEffect } from 'react'
import haversineDistance from '../utils/haversine'

export async function getStaticProps() {
  const blogFiles = fs.readdirSync('./content/blogs')

  const blogs = blogFiles
    .map((filename) => {
      const file = fs.readFileSync(`./content/blogs/${filename}`, 'utf8')
      const matterData = matter(file)

      return {
        ...matterData.data,
        slug: filename.slice(0, filename.indexOf('.')),
      }
    })
    .sort(function (a, b) {
      return new Date(b.date) - new Date(a.date)
    })
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

  useEffect(() => {
    if (!query) {
      setAllRestaurants(blogs)
      setStatus('loaded')
    } else {
      const searchedRestaurants = allRestaurants.filter((restaurant) => {
        return restaurant.cuisine.toLowerCase().includes(query)
      })
      setAllRestaurants(searchedRestaurants)
      setStatus('loaded')
    }
  }, [query])

  function handleLocation() {
    console.log(userCoordinates)
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
        setStatus('loaded')
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
  }

  return (
    <>
      <div className={styles.searchContainer}>
        <Search query={query} setQuery={setQuery} />
        <BiCurrentLocation
          style={{
            fontSize: '2rem',
            position: 'absolute',
            top: '36px',
            right: '36px',
            cursor: 'pointer',
          }}
          onClick={handleLocation}
        />
      </div>
      <section className={styles.container}>
        {status === 'loading' && <p>Loading...</p>}
        {status === 'loaded' &&
          allRestaurants.map((blog) => (
            <div className={styles.thumbnail} key={blog.slug}>
              <Link href={`/blog/${blog.slug}`}>
                <a>
                  <div style={{ backgroundImage: `url(${blog.thumbnail})` }}>
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
                </a>
              </Link>
            </div>
          ))}
        {status === 'none' && (
          <p
            style={{
              position: 'absolute',
              top: '65%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            No restaurants nearby! Click{' '}
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
