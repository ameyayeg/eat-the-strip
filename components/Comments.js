import { DiscussionEmbed } from 'disqus-react'

const Comments = ({ slug, title }) => {
  return (
    <DiscussionEmbed
      shortname={process.env.customKey}
      config={{
        url: `http://www.eatthestrip.com/blog/${slug}`,
        identifier: slug,
        title: title,
      }}
    />
  )
}

export default Comments
