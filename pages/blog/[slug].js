import fs from 'fs'
import ReactMarkdown from 'react-markdown'
import matter from 'gray-matter'
import Head from 'next/head'
import Image from 'next/image'
import { AiFillStar, AiOutlineHome, AiOutlineStar } from 'react-icons/ai'
import styles from '../../styles/Blog.module.css'
import LayoutWithoutHeader from '../../components/LayoutWithoutHeader'
import Link from 'next/link'


export async function getStaticPaths() {
    const filesInProjects = fs.readdirSync('./content/blogs')
    const paths = filesInProjects.map(file => {
      const filename = file.slice(0, file.indexOf('.'))
      return { params: { slug: filename }}
    })
  
    return {
      paths,
      fallback: false // This shows a 404 page if the page is not found
    }
  }

export async function getStaticProps({ params: { slug } }) {
  const fileContent = matter(fs.readFileSync(`./content/blogs/${slug}.md`, 'utf8'))
  let frontmatter = fileContent.data
  const markdown = fileContent.content

  return {
    props: { frontmatter, markdown }
  }
}

export default function Blog({ frontmatter, markdown }) {

  const starsColorArray = new Array(frontmatter.rating).fill(<AiFillStar/>)


  const starColors = {
    color: 'orange',
    fontSize: '2rem',
  }

    return (
      <div className={styles.container}>
        <Head>
          <title>{`Eat the Strip | ${frontmatter.title}`}</title>
        </Head>
        <header className={styles.header}>
          <Link href="/"><a><AiOutlineHome style={{fontSize: '3rem'}}/></a></Link>
          <h1>Eat the Strip</h1>
        </header>
        <div>
          <div style={{backgroundImage: `url(${frontmatter.image})`, backgroundSize: `cover`, backgroundRepeat: 'no-repeat', backgroundPosition: 'center center', height: '50vh', width: '100%'}}></div>
          <h1>{frontmatter.title}</h1>
          {starsColorArray.map((star, idx) => <span key={idx} style={starColors}>{star}</span>)}
          {
            starsColorArray.length < 5 &&
            <span></span>
          }
          <p>{frontmatter.date}</p>
          <hr/>
        </div>
        <ReactMarkdown>
          {markdown}
        </ReactMarkdown>
      </div>

    )
    
  }

  Blog.getLayout = function(page) {
    return <LayoutWithoutHeader>{page}</LayoutWithoutHeader>;
  };
  
