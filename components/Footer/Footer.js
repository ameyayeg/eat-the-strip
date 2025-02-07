import styles from './Footer.module.css'
import Link from 'next/link'
import Subscribe from '../Subscribe'
import { MdRssFeed } from 'react-icons/md'

const Footer = () => {
  const date = new Date()

  return (
    <footer className={styles.container}>
      <div className={styles.menu}>
        <Link href="/">
          <a>
            <h1>Eat the Strip</h1>
          </a>
        </Link>
        <ul>
          <li>
            <Link href="/about">
              <a>About</a>
            </Link>
          </li>
          <li>
            <Link href="/all">
              <a>Map</a>
            </Link>
          </li>
          <li>
            <Link href="/privacy">
              <a>Privacy</a>
            </Link>
          </li>
          <li>
            <Link href="/terms">
              <a>Terms and conditions</a>
            </Link>
          </li>
        </ul>
      </div>
      <div className={styles.copyright}>
        <p>Made by Ameya Charnalia &copy; {date.getFullYear()}</p>
      </div>
      <div className={styles.socials}>
        <a href="https://ko-fi.com/B0B31A86OB" target="_blank">
          <img
            height="36"
            style={{
              height: '36px',
            }}
            src="https://storage.ko-fi.com/cdn/kofi2.png?v=6"
            border="0"
            alt="Buy Me a Coffee at ko-fi.com"
          />
        </a>
        <Link href="http://eatthestrip.com/rss.xml">
          <a rel="noreferrer" target="_blank">
            <MdRssFeed color="#ee802f" />
          </a>
        </Link>
        <div>
          <Subscribe />
        </div>
      </div>
    </footer>
  )
}

export default Footer
