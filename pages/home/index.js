import CityListing from '../../components/CityListing/CityListing'
import { defaultCity } from '../../utils/cities'
import { getCityPosts } from '../../utils/mdx'
import generateRssFeed from '../../utils/generateRSSFeed'

// The default city (Ottawa-Gatineau). This is the only page that writes
// public/rss.xml.
export async function getStaticProps() {
  await generateRssFeed()
  return {
    props: {
      cityId: defaultCity.id,
      blogs: await getCityPosts(defaultCity),
    },
  }
}

const Home = (props) => <CityListing {...props} />

export default Home
