import dynamic from 'next/dynamic'

// Dynamically import `DiscussionEmbed` on the client-side only
const DiscussionEmbed = dynamic(
  () => import('disqus-react').then((mod) => mod.DiscussionEmbed),
  { ssr: false }
)

const Comments = ({ slug, title }) => {
  return (
    <DiscussionEmbed
      shortname={process.env.NEXT_PUBLIC_API_KEY}
      config={{
        url: `http://www.eatthestrip.com/blog/${slug}`,
        identifier: slug,
        title: title,
      }}
    />
  )
}

export default Comments
