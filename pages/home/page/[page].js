import CityListing from '../../../components/CityListing/CityListing'
import { defaultCity } from '../../../utils/cities'
import { getCityPosts } from '../../../utils/mdx'
import { extraPages } from '../../../utils/pagination'

// Later pages of the default city: /home/page/2 and up. Page 1 is /home.
export async function getStaticPaths() {
  const posts = await getCityPosts(defaultCity)
  return {
    paths: extraPages(posts.length).map((page) => ({
      params: { page: String(page) },
    })),
    fallback: false,
  }
}

export async function getStaticProps({ params }) {
  return {
    props: {
      cityId: defaultCity.id,
      blogs: await getCityPosts(defaultCity),
      page: Number(params.page),
    },
  }
}

const HomePage = (props) => <CityListing {...props} />

export default HomePage
