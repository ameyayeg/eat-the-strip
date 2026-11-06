import fs from 'fs'
import ReactMarkdown from 'react-markdown'
import matter from 'gray-matter'
import styles from '../../blog/Blog.module.css'
import LayoutWithoutHeader from '../../../components/Layouts/LayoutWithoutHeader'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import ContactLine from '../../../components/ContactLine'
import SupportBox from '../../../components/SupportBox'
import PostHead from '../../../components/PostHead'
import { getPostTitle, getPostDescription } from '../../../utils/seo'
import { AiOutlineHome } from 'react-icons/ai'
import Image from 'next/image'
import { getSortedPosts } from '../../../utils/mdx'

const MapWithNoSSR = dynamic(() => import('../../../components/Map'), {
  ssr: false,
})

export async function getStaticPaths() {
  const allBlogs = await getSortedPosts()
  const frederictonBlogs = allBlogs.filter((blog) => blog.city === 'Fredericton')

  return {
    paths: frederictonBlogs.map((blog) => ({ params: { slug: blog.slug } })),
    fallback: false,
  }
}

export async function getStaticProps({ params: { slug } }) {
  const fileContent = matter(
    fs.readFileSync(`./content/blogs/${slug}.md`, 'utf8')
  )
  const frontmatter = fileContent.data
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
  return (
    <div>
      <PostHead
        frontmatter={frontmatter}
        title={title}
        description={description}
        slug={slug}
      />

      <header className={styles.header}>
        <Link href="/home/fredericton">
          <a aria-label="Eat the Strip Fredericton home">
            <AiOutlineHome
              style={{ fontSize: 'var(--font-size-xxl)' }}
              aria-hidden="true"
            />
          </a>
        </Link>
        <h1>Eat the Strip</h1>
      </header>
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
        <div className={styles.frontmatterDiv}>
          <h1>{frontmatter.title}</h1>
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
          <p>
            <i>{frontmatter.address}</i>
          </p>
          <p>
            <strong>
              By: {frontmatter.author} | {frontmatter.date}
            </strong>
          </p>
          <hr />
        </div>
        <ReactMarkdown
          className={styles.markdown}
          components={{
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
          {markdown}
        </ReactMarkdown>
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
            defaultCenter={[45.4215, -75.6972]}
          />
        </div>
        <SupportBox />
        <ContactLine title={frontmatter.title} className={styles.contact} />
      </div>
    </div>
  )
}

Blog.getLayout = function (page) {
  return <LayoutWithoutHeader>{page}</LayoutWithoutHeader>
}
