
import Image from "next/image"
import Link from 'next/link'
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
      <section className={styles.container}>
        {blogs.map(blog => (
          <div className={styles.thumbnail} key={blog.slug}>
            <Link href={`/blog/${blog.slug}`}>
              <a>
                <div style={{backgroundImage: `url(${blog.thumbnail})`, backgroundSize: `cover`, backgroundRepeat: 'no-repeat', backgroundPosition: 'center center', height: '300px', width: '300px'}}></div>
              </a>
            </Link>
          </div>
        ))}
      </section>
    </>
   );
}
 
export default Home;
