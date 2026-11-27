import fs from 'fs'
import matter from 'gray-matter'
import cities, { cityForPost } from './cities'

export async function getSortedPosts() {
  const blogFiles = fs.readdirSync('./content/blogs')

  const blogs = blogFiles
    .map((filename) => {
      const file = fs.readFileSync(`./content/blogs/${filename}`, 'utf8')
      const matterData = matter(file)

      // A City that matches no city would drop the post from every listing
      // and the map without warning, so stop the build instead.
      const postCity = cityForPost(matterData.data.city)
      if (!postCity) {
        const names = cities.map((city) => `"${city.name}"`).join(', ')
        throw new Error(
          `content/blogs/${filename}: City "${matterData.data.city}" isn't a city in utils/cities.js. Use one of ${names}, or leave it blank for "${cities.find((city) => city.isDefault).name}".`
        )
      }

      // Price chips only show when every open post in the city has a price,
      // so a missing one would hide them for the whole city. Stop the build
      // instead.
      if (
        postCity.filters &&
        matterData.data.closed !== true &&
        !matterData.data.price
      ) {
        throw new Error(
          `content/blogs/${filename}: open ${postCity.name} posts need a Price (Under $15, $15–$25 or Over $25). Set it in the CMS, or mark the post Closed.`
        )
      }

      return {
        ...matterData.data,
        slug: filename.slice(0, filename.indexOf('.')),
        description: matterData.content,
      }
    })
    .sort(function (a, b) {
      return new Date(b.date) - new Date(a.date)
    })
  return blogs
}

// Light post data for listing pages and the map: only the requested front
// matter fields (plus slug), newest first, without the article text.
// Missing fields become null so Next.js can serialize them.
export async function getPostSummaries(fields) {
  const posts = await getSortedPosts()
  return posts.map((post) => {
    const summary = { slug: post.slug }
    fields.forEach((field) => {
      summary[field] = post[field] === undefined ? null : post[field]
    })
    return summary
  })
}

// One city's posts for its listing page, with only the fields the cards and
// search use.
export async function getCityPosts(city) {
  const posts = await getPostSummaries([
    'title',
    'thumbnail',
    'cuisine',
    'address',
    'closed',
    'city',
    'favourite',
    'area',
    'price',
  ])
  // favourite is sent only for writer's picks (for the card star), and area
  // (for search) and price (for the price chips) only on posts that have
  // them, so other cards' data stays as small as before.
  return posts
    .filter((post) => cityForPost(post.city) === city)
    .map(({ favourite, area, price, ...post }) => ({
      ...post,
      ...(favourite === true && { favourite }),
      ...(area && { area }),
      ...(price && { price }),
    }))
}
