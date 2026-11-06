import Head from 'next/head'
import { SITE_NAME, absoluteUrl, getPostImage } from '../utils/seo'

// Search and social tags for a blog post. The canonical URL is always
// /blog/<slug>, including Fredericton posts also served at
// /home/fredericton/<slug>.
const PostHead = ({ frontmatter, title, description, slug }) => {
  const canonical = absoluteUrl(`/blog/${slug}`)
  const image = getPostImage(frontmatter)

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content="article" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={image} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Head>
  )
}

export default PostHead
