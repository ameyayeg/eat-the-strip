
import Image from "next/image"
import Link from 'next/link'
import Nav from "../components/Nav"
import styles from '../styles/Home.module.css'
import fs from 'fs'
import matter from 'gray-matter'

export async function getStaticProps() {
  const blogFiles= fs.readdirSync('./content/blogs')

  const blogs = blogFiles.map(filename => {
    const file = fs.readFileSync(`./content/blogs/${filename}`, 'utf8')
    const matterData = matter(file)

    return {
      ...matterData.data,
      slug: filename.slice(0, filename.indexOf('.'))
    }
  })
  return {
    props: {
      blogs
    }
  }
}


const Home = ( {blogs} ) => {
  return ( 
    <>
      <Nav/>
      <section className={styles.container}>
      {blogs.map(blog => (
        <div key={blog.slug}>
          <Link href={`/blog/${blog.slug}`}>
            <a>{blog.date}:{blog.title}</a>
          </Link>
        </div>
      ))}
      </section>
    </>
   );
}
 
export default Home;
