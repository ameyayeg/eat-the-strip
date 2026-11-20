import fs from 'fs'
import { Feed } from 'feed'
import { getSortedPosts } from '../utils/mdx'
import { SITE_URL, absoluteUrl } from './seo'

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
      rss2: `${SITE_URL}/rss.xml`,
    },
  }

  const feed = new Feed(feedOptions)

  allPosts.forEach((post) => {
    feed.addItem({
      title: post.title,
      // The guid keeps its original value (double slash and all) so feed
      // readers and RSS-to-email tools don't treat every post as new. It's
      // marked isPermaLink="false" below; the link is the real address.
      id: `${site_url}/blog/${post.slug}`,
      link: absoluteUrl(`/blog/${post.slug}`),
      description: post.description.split('\n')[0],
      date: new Date(post.date),
      ...(post.city && { city: post.city }),
    })
  })

  // The feed package can't set isPermaLink, so it's added here.
  const xml = feed.rss2().replace(/<guid>/g, '<guid isPermaLink="false">')
  fs.writeFileSync('./public/rss.xml', xml)
}
