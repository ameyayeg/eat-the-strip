
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
            <div style={{backgroundImage: `url(${blog.thumbnail})`, backgroundSize: `cover`, backgroundRepeat: 'no-repeat', backgroundPosition: 'center center', height: '250', width: '250px'}}>
              {/* <img src={blog.thumbnail} className={styles.image}/> */}
              {/* <Image src={blog.thumbnail} width="200px" height="200px" className={styles.image}/> */}
            </div>
          </Link>
        </div>
      ))}
      </section>
    </>
   );
}
 
export default Home;
