import { Fragment, useState } from 'react'
import dynamic from 'next/dynamic'
import styles from './All.module.css'
import { getPostSummaries } from '../../utils/mdx'
import cities, { defaultCity, cityForPost } from '../../utils/cities'

export async function getStaticProps() {
  // Only the fields the map uses.
  const blogs = await getPostSummaries([
    'title',
    'city',
    'positives',
    'negatives',
  ])
  return {
    props: {
      blogs,
    },
  }
}

const MapWithNoSSR = dynamic(() => import('../../components/Map'), {
  ssr: false,
})

const AllRestaurants = ({ blogs }) => {
  const [cityId, setCityId] = useState(defaultCity.id)
  const city = cities.find((c) => c.id === cityId)

  // Posts in the selected city (posts without a city belong to the default)
  const filteredBlogs = blogs.filter((blog) => cityForPost(blog.city) === city)

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
          {cities.map((c, index) => (
            <Fragment key={c.id}>
              {index > 0 && <span>|</span>}
              <button
                onClick={() => setCityId(c.id)}
                className={`cityToggleLink${c.id === cityId ? ' active' : ''}`}
                aria-pressed={c.id === cityId}
              >
                {c.name}
              </button>
            </Fragment>
          ))}
        </div>
        <MapWithNoSSR
          coordinates={coordinatesArray}
          defaultCenter={city.mapCenter}
          defaultZoom={12}
        />
      </div>
    </>
  )
}

export default AllRestaurants
