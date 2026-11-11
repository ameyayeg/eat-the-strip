import CityListing from '../../../components/CityListing/CityListing'
import { otherCities, getCityBySlug } from '../../../utils/cities'
import { getCityPosts } from '../../../utils/mdx'

// Every city except the default one, e.g. /home/fredericton.
export async function getStaticPaths() {
  return {
    paths: otherCities.map((city) => ({ params: { city: city.slug } })),
    fallback: false,
  }
}

export async function getStaticProps({ params }) {
  const city = getCityBySlug(params.city)
  return {
    props: {
      cityId: city.id,
      blogs: await getCityPosts(city),
    },
  }
}

const CityPage = (props) => <CityListing {...props} />

export default CityPage
