import fs from 'fs'
import ReactMarkdown from 'react-markdown'
import matter from 'gray-matter'
import Image from 'next/image'
import { AiFillStar, AiOutlineHome, AiOutlineStar } from 'react-icons/ai'
import styles from '../../styles/Blog.module.css'
import LayoutWithoutHeader from '../../components/LayoutWithoutHeader'
import Link from 'next/link'
import range from '../../utils/utils'
import Head from 'next/head'
import dynamic from 'next/dynamic'

export async function getStaticPaths() {
  const filesInProjects = fs.readdirSync('./content/blogs')
  const paths = filesInProjects.map((file) => {
    const filename = file.slice(0, file.indexOf('.'))
    return { params: { slug: filename } }
  })

  return {
    paths,
    fallback: false, // This shows a 404 page if the page is not found
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

  return {
    props: { frontmatter, markdown },
  }
}

export default function Blog({ frontmatter, markdown }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>{`Eat the Strip | ${frontmatter.title}`}</title>
      </Head>
      {/* <header className={styles.header}>
        <Link href="/">
          <a>
            <AiOutlineHome style={{ fontSize: 'var(--font-size-xxl)' }} />
          </a>
        </Link>
        <h1>Eat the Strip</h1>
      </header> */}
      <div>
        <div
          style={{
            backgroundImage: `url(${frontmatter.image})`,
            backgroundSize: `cover`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center center',
            height: '50vh',
            width: '100%',
          }}
        ></div>
        <div className={styles.frontmatterDiv}>
          <h1>{frontmatter.title}</h1>
          {range(frontmatter.rating).map((num, idx) => (
            <AiFillStar
              key={idx}
              style={{ color: 'orange', fontSize: '1.5rem' }}
            />
          ))}
          {frontmatter.rating < 5 &&
            range(5 - frontmatter.rating).map((num, idx) => (
              <AiOutlineStar key={idx} style={{ fontSize: '1.5rem' }} />
            ))}
          <p>{frontmatter.date}</p>
          <hr />
        </div>
      </div>
      <ReactMarkdown
        className={styles.markdown}
        components={{
          img: (props) => (
            <Image src={props.src} alt={props.alt} width={1200} height={800} />
          ),
        }}
      >
        {markdown}
      </ReactMarkdown>
      <div className={styles.map}>
        <MapWithNoSSR
          positiveLat={frontmatter.positives}
          negativeLat={frontmatter.negatives}
        />
      </div>
    </div>
  )
}

Blog.getLayout = function (page) {
  return <LayoutWithoutHeader>{page}</LayoutWithoutHeader>
}
