import { DiscussionEmbed } from 'disqus-react'

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
