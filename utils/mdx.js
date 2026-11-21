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
      if (!cityForPost(matterData.data.city)) {
        const names = cities.map((city) => `"${city.name}"`).join(', ')
        throw new Error(
          `content/blogs/${filename}: City "${matterData.data.city}" isn't a city in utils/cities.js. Use one of ${names}, or leave it blank for "${cities.find((city) => city.isDefault).name}".`
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
  ])
  return posts.filter((post) => cityForPost(post.city) === city)
}
