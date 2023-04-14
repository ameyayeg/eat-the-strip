import dynamic from 'next/dynamic'

import styles from '../styles/All.module.css'
import { getSortedPosts } from '../utils/mdx'

export async function getStaticProps() {
  const blogs = await getSortedPosts()

  return {
    props: {
      blogs,
    },
  }
}

const MapWithNoSSR = dynamic(() => import('../components/Map'), {
  ssr: false,
})

const AllRestaurants = ({ blogs }) => {
  const coordinatesArray = blogs.map((blog) => ({
    name: blog.title,
    coordinates: [blog.positives, blog.negatives],
    slug: blog.slug,
  }))
  return (
    <>
      <div className={styles.container}>
        <h1>Map of all restaurants</h1>
        <MapWithNoSSR coordinates={coordinatesArray} />
      </div>
    </>
  )
}

export default AllRestaurants
