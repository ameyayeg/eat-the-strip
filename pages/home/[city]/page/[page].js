import CityListing from '../../../../components/CityListing/CityListing'
import { otherCities, getCityBySlug } from '../../../../utils/cities'
import { getCityPosts } from '../../../../utils/mdx'
import { extraPages } from '../../../../utils/pagination'

// Later pages of the other cities: /home/fredericton/page/2 and up.
// Page 1 is /home/<city>.
export async function getStaticPaths() {
  const paths = []
  for (const city of otherCities) {
    const posts = await getCityPosts(city)
    extraPages(posts.length).forEach((page) => {
      paths.push({ params: { city: city.slug, page: String(page) } })
    })
  }
  return { paths, fallback: false }
}

export async function getStaticProps({ params }) {
  const city = getCityBySlug(params.city)
  return {
    props: {
      cityId: city.id,
      blogs: await getCityPosts(city),
      page: Number(params.page),
    },
  }
}

const CityPage = (props) => <CityListing {...props} />

export default CityPage
