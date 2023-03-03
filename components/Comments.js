import { DiscussionEmbed } from 'disqus-react'

const Comments = ({ slug, title }) => {
  return (
    <DiscussionEmbed
      shortname={process.env.customKey}
      config={{
        url: `http://localhost:3000/blog/${slug}`,
        identifier: slug,
        title: title,
      }}
    />
  )
}

export default Comments
