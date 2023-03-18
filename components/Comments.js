import dynamic from 'next/dynamic'
import { useState } from 'react'

// Dynamically import `DiscussionEmbed` on the client-side only
const DiscussionEmbed = dynamic(
  () => import('disqus-react').then((mod) => mod.DiscussionEmbed),
  { ssr: false }
)

const Comments = ({ slug, title }) => {
  const [showComments, setShowComments] = useState(false)

  return (
    <>
      <button onClick={() => setShowComments(true)}>Load Comments</button>
      {showComments && (
        <DiscussionEmbed
          shortname={process.env.NEXT_PUBLIC_API_KEY}
          config={{
            url: `http://www.eatthestrip.com/blog/${slug}`,
            identifier: slug,
            title: title,
          }}
        />
      )}
    </>
  )
}

export default Comments
