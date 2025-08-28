import { useState } from 'react'
import dynamic from 'next/dynamic'
import styles from './All.module.css'
import { getSortedPosts } from '../../utils/mdx'

export async function getStaticProps() {
  const blogs = await getSortedPosts()
  return {
    props: {
      blogs,
    },
  }
}

const MapWithNoSSR = dynamic(() => import('../../components/Map'), {
  ssr: false,
})

const cityCenters = {
  'Ottawa-Gatineau': [45.4215, -75.6972],
  Fredericton: [45.9636, -66.6431],
}

const AllRestaurants = ({ blogs }) => {
  const [city, setCity] = useState('Ottawa-Gatineau')

  // Filter blogs by city (default to Ottawa if city not set)
  const filteredBlogs = blogs.filter(
    (blog) => (blog.city || 'Ottawa-Gatineau') === city
  )

  // Make sure your blog data has latitude/longitude fields!
  const coordinatesArray = filteredBlogs
    .filter((blog) => blog.positives && blog.positives)
    .map((blog) => ({
      name: blog.title,
      coordinates: [blog.positives, blog.negatives],
      slug: blog.slug,
    }))

  return (
    <>
      <div className={styles.container}>
        <h1>Map of all restaurants</h1>
        <div style={{ marginBottom: '1rem' }}>
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
            className={`cityToggleLink${
              city === 'Fredericton' ? ' active' : ''
            }`}
            aria-pressed={city === 'Fredericton'}
          >
            Fredericton
          </button>
        </div>
        <MapWithNoSSR
          coordinates={coordinatesArray}
          defaultCenter={cityCenters[city]}
          defaultZoom={12}
        />
      </div>
    </>
  )
}

export default AllRestaurants
