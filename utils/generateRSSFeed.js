import fs from 'fs'
import { Feed } from 'feed'
import { getSortedPosts } from '../utils/mdx'

export default async function generateRssFeed() {
  const allPosts = await getSortedPosts()

  const site_url = 'https://eatthestrip.com/'

  const feedOptions = {
    title: 'Eat the Strip | RSS Feed',
    description: `Eat the Strip is our tribute to the mom-and-pop food joints peppered across the Ottawa-Gatineau suburbs. We feel the folks who run these restaurants, diners and bars don't get the credit they deserve for contributing to our city's food culture. So, we created a review blog that only caters to strip mall gems.`,
    id: site_url,
    link: site_url,
    copyright: `All rights reserved ${new Date().getFullYear()}, Ameya Charnalia`,
    generator: 'Feed for Eat the Strip',
    feedLinks: {
      rss2: `${site_url}/rss.xml`,
    },
  }

  const feed = new Feed(feedOptions)

  allPosts.forEach((post) => {
    feed.addItem({
      title: post.title,
      id: `${site_url}/blog/${post.slug}`,
      link: `${site_url}/blog/${post.slug}`,
      description: post.description.split('\n')[0] + '...',
      author: [
        {
          name: 'Ameya Charnalia',
        },
      ],
      date: new Date(post.date),
      image: post.image,
    })
  })

  fs.writeFileSync('./public/rss.xml', feed.rss2())
}
