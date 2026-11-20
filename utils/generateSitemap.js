import fs from 'fs'
import { getSortedPosts, getCityPosts } from './mdx'
import { defaultCity, otherCities, cityPath } from './cities'
import { extraPages, pagePath } from './pagination'
import { absoluteUrl } from './seo'

// Pages that aren't built from posts or cities. Left out on purpose: / (it
// redirects to /home), /404, /success (the form thank-you page),
// /home/<city>/<slug> (copies of /blog/<slug>), /admin and /api.
const STATIC_PAGES = [
  '/about',
  '/contact',
  '/newsletter',
  '/privacy',
  '/terms',
  '/all',
]

const escapeXml = (value) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')

// "January 4, 2024 2:16 PM" -> "2024-01-04". The date is read and written in
// the same local time, so the day never shifts with the time zone.
function lastmod(value) {
  const date = new Date(value)
  if (!value || Number.isNaN(date.getTime())) return null
  const pad = (n) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

// Writes public/sitemap.xml at build time, alongside public/rss.xml. Every URL
// goes through absoluteUrl(), the same function that writes each page's
// canonical tag, so the two always match (sa’hara -> sa%E2%80%99hara).
export default async function generateSitemap() {
  const entries = []

  // City listings and their later pages.
  for (const city of [defaultCity, ...otherCities]) {
    const basePath = cityPath(city)
    const posts = await getCityPosts(city)
    entries.push({ path: basePath })
    extraPages(posts.length).forEach((page) => {
      entries.push({ path: pagePath(basePath, page) })
    })
  }

  // Every post, at its canonical /blog/<slug> address.
  const posts = await getSortedPosts()
  posts.forEach((post) => {
    entries.push({ path: `/blog/${post.slug}`, lastmod: lastmod(post.date) })
  })

  STATIC_PAGES.forEach((path) => entries.push({ path }))

  const urls = entries
    .map(({ path, lastmod: date }) => {
      const loc = `    <loc>${escapeXml(absoluteUrl(path))}</loc>`
      const mod = date ? `\n    <lastmod>${date}</lastmod>` : ''
      return `  <url>\n${loc}${mod}\n  </url>`
    })
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`
  fs.writeFileSync('./public/sitemap.xml', xml)
}
