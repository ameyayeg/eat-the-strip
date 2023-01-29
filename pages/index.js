import Link from 'next/link'
import styles from '../styles/Home.module.css'
import fs from 'fs'
import matter from 'gray-matter'
import { BsSearch } from 'react-icons/bs'
import { Skeleton } from '@mui/material'
import Search from '../components/Search'
import { useState } from 'react'

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
  const [query, setQuery] = useState("")
  const filteredItems = getFilteredItems(query, blogs)

  function getFilteredItems(query, blogs) {
    if(!query) {
      return blogs
    }
    return blogs.filter(blog => blog.title.toLowerCase().includes(query)) 
  }

  return ( 
    <>
      <Search 
        query={query}
        setQuery={setQuery}
      />
      <section className={styles.container}>
        {
          filteredItems ?         
            filteredItems.map(blog => (
              <div className={styles.thumbnail} key={blog.slug}>
                <Link href={`/blog/${blog.slug}`}>
                  <a>
                    <div style={{backgroundImage: `url(${blog.thumbnail})`, backgroundSize: `cover`, backgroundRepeat: 'no-repeat', backgroundPosition: 'center center', height: '200px', width: '300px', position: 'relative'}}>
                      <span style={{position: 'absolute', backgroundColor: 'yellow', color: 'black', top: '0', left: '0', textTransform: 'uppercase', padding: '0.25rem 0.5rem', fontWeight: 'bold'}}>{blog.cuisine}</span>
                      <span style={{position: 'absolute', backgroundColor: 'black', color: 'white', bottom: '0', left: '0', right: '0', padding: '0.5rem 0.75rem'}}>{blog.title}</span>
                    </div>
                  </a>
                </Link>
              </div>
            )) : (
              <Skeleton variant="rectangular" width={300} height={300} />
            )
          }
      </section>
    </>
   );
}
 
export default Home;
