import fs from 'fs'
import ReactMarkdown from 'react-markdown'
import matter from 'gray-matter'
import styles from './Blog.module.css'
import Layout from '../../components/Layouts/Layout'
import dynamic from 'next/dynamic'
import ContactLine from '../../components/ContactLine'
import SupportBox from '../../components/SupportBox'
import PostHead from '../../components/PostHead'
import ArchiveNote from '../../components/ArchiveNote'
import {
  PostAddress,
  PostSummaryCard,
  PostTitle,
  MediaBlock,
  splitForMedia,
} from '../../components/PostSummary/PostSummary'
import { getPostTitle, getPostDescription } from '../../utils/seo'
import { cityForPost, defaultCity } from '../../utils/cities'
import Image from 'next/image'

export async function getStaticPaths() {
  const filesInProjects = fs.readdirSync('./content/blogs')
  const paths = filesInProjects.map((file) => {
    const filename = file.slice(0, file.indexOf('.'))
    return { params: { slug: filename } }
  })

  return {
    paths,
    fallback: false,
  }
}

const MapWithNoSSR = dynamic(() => import('../../components/Map'), {
  ssr: false,
})

export async function getStaticProps({ params: { slug } }) {
  const fileContent = matter(
    fs.readFileSync(`./content/blogs/${slug}.md`, 'utf8')
  )
  let frontmatter = fileContent.data
  const markdown = fileContent.content
  const title = getPostTitle(frontmatter)
  const description = getPostDescription(frontmatter, markdown)

  return {
    props: { frontmatter, markdown, slug, title, description },
  }
}

export default function Blog({
  frontmatter,
  markdown,
  slug,
  title,
  description,
}) {
  function showSettings() {
    e.preventDefault()
  }
  // The article. On a post with a YouTube or CBC link it renders in two halves
  // with "Watch and listen" between them (components/PostSummary).
  const article = (text) => (
    <ReactMarkdown
      className={styles.markdown}
      components={{
        // A paragraph holding an image renders without its <p>: the image
        // becomes a <figure>, which HTML doesn't allow inside a <p>, and
        // the mismatch broke hydration. Text paragraphs keep their <p>.
        p: ({ node, children }) =>
          node.children.some(
            (child) => child.type === 'element' && child.tagName === 'img'
          ) ? (
            <>{children}</>
          ) : (
            <p>{children}</p>
          ),
        img: (props) => (
          <figure>
            <img
              src={props.src}
              alt={props.alt}
              style={{ maxWidth: '100%' }}
            />
            <figcaption
              style={{
                borderBottom: '1px solid #d8d8d8',
                color: '#545454',
                display: 'block',
                fontSize: '14px',
                lineHeight: '20px',
                marginBottom: '16px',
                paddingBottom: '16px',
              }}
            >
              {props.alt}
            </figcaption>
          </figure>
        ),
      }}
    >
      {text}
    </ReactMarkdown>
  )
  const parts = splitForMedia(markdown, frontmatter)

  return (
    <div>
      <PostHead
        frontmatter={frontmatter}
        title={title}
        description={description}
        slug={slug}
      />

      <div style={{ position: 'relative', width: '100%', height: '60vh' }}>
        <Image
          src={frontmatter.image}
          alt={frontmatter.title}
          layout="fill"
          objectFit="cover"
          objectPosition="center"
        />
      </div>
      <div className={styles.container}>
        <ArchiveNote
          city={cityForPost(frontmatter.city)}
          className={styles.archiveNote}
        />
        <div className={styles.frontmatterDiv}>
          <PostTitle frontmatter={frontmatter} />
          {frontmatter.closed && (
            <span
              style={{
                backgroundColor: 'red',
                color: 'black',
                top: '0',
                right: '0',
                textTransform: 'uppercase',
                padding: '0.25rem 0.5rem',
                borderRadius: '16px',
              }}
            >
              Closed
            </span>
          )}
          <PostAddress frontmatter={frontmatter} />
          <p>
            <strong>
              By: {frontmatter.author} | {frontmatter.date}
            </strong>
          </p>
          <hr />
        </div>
        <PostSummaryCard frontmatter={frontmatter} />
        {parts ? (
          <>
            {article(parts[0])}
            <MediaBlock frontmatter={frontmatter} />
            {parts[1] && article(parts[1])}
          </>
        ) : (
          article(markdown)
        )}
        <div className={styles.map}>
          <MapWithNoSSR
            coordinates={[
              {
                name: frontmatter.title,
                coordinates: [frontmatter.positives, frontmatter.negatives],
                slug: slug,
              },
            ]}
            defaultZoom={11}
            defaultCenter={(cityForPost(frontmatter.city) || defaultCity).mapCenter}
          />
        </div>
        <SupportBox />
        <ContactLine title={frontmatter.title} className={styles.contact} />
      </div>
    </div>
  )
}

// The shared layout, set here so the site-wide default tags in _app.js
// don't repeat the post's own title and social tags.
Blog.getLayout = function (page) {
  return <Layout>{page}</Layout>
}
