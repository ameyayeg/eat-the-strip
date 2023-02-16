import Link from 'next/link'
import styles from '../styles/Home.module.css'
import fs from 'fs'
import matter from 'gray-matter'
import { BsSearch } from 'react-icons/bs'
import Search from '../components/Search'
import { useState, useEffect } from 'react'

export async function getStaticProps() {
  const blogFiles = fs.readdirSync('./content/blogs')

  const blogs = blogFiles
    .map((filename) => {
      const file = fs.readFileSync(`./content/blogs/${filename}`, 'utf8')
      const matterData = matter(file)

      return {
        ...matterData.data,
        slug: filename.slice(0, filename.indexOf('.')),
      }
    })
    .sort(function (a, b) {
      return new Date(b.date) - new Date(a.date)
    })
  return {
    props: {
      blogs,
    },
  }
}

const Home = ({ blogs }) => {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)

  const filteredItems = getFilteredItems(query, blogs)

  function getFilteredItems(query, blogs) {
    if (!query) {
      return blogs
    }
    return blogs.filter((blog) => blog.title.toLowerCase().includes(query))
  }

  function Box({ children }) {
    return (
      <div
        style={{
          display: 'flex',
          padding: '1rem',
          width: '290px',
          height: '290px',
        }}
      >
        {children}
      </div>
    )
  }

  return (
    <>
      <Search query={query} setQuery={setQuery} />
      <section className={styles.container}>
        {filteredItems.map((blog) => (
          <div className={styles.thumbnail} key={blog.slug}>
            <Link href={`/blog/${blog.slug}`}>
              <a>
                <div style={{ backgroundImage: `url(${blog.thumbnail})` }}>
                  <span
                    style={{
                      position: 'absolute',
                      backgroundColor: 'yellow',
                      color: 'black',
                      top: '0',
                      left: '0',
                      textTransform: 'uppercase',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '16px',
                    }}
                  >
                    {blog.cuisine}
                  </span>
                  <span
                    style={{
                      position: 'absolute',
                      backgroundColor: 'black',
                      color: 'white',
                      bottom: '0',
                      left: '0',
                      right: '0',
                      padding: '0.5rem 0.75rem',
                    }}
                  >
                    {blog.title}
                  </span>
                </div>
              </a>
            </Link>
          </div>
        ))}
      </section>
    </>
  )
}

export default Home
