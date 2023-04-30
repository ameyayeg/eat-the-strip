import fs from 'fs'
import RSS from 'rss'
import { getSortedPosts } from '../utils/mdx'

export default async function generateRssFeed() {
  const site_url = 'https://eatthestrip.com/'

  const allPosts = await getSortedPosts()

  const feedOptions = {
    title: 'Eat the Strip | RSS Feed',
    description: `Eat the Strip is our tribute to the mom-and-pop food joints peppered across the Ottawa-Gatineau suburbs. We feel the folks who run these restaurants, diners and bars don't get the credit they deserve for contributing to our city's food culture. So, we created a review blog that only caters to strip mall gems.`,
    site_url: site_url,
    feed_url: `${site_url}/rss.xml`,
    pubDate: new Date(),
    copyright: `All rights reserved ${new Date().getFullYear()}, Ameya Charnalia`,
  }

  const feed = new RSS(feedOptions)

  allPosts.map((post) => {
    feed.item({
      title: post.title,
      url: `${site_url}/blog/${post.slug}`,
      date: post.date,
      author: post.author,
      media: post.image,
    })
  })

  fs.writeFileSync('./public/rss.xml', feed.xml({ indent: true }))
}
