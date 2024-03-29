import styles from './Footer.module.css'
import { FaSquareXTwitter } from 'react-icons/fa6'
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
        <p>
          Made by{' '}
          <a
            className="twitter"
            href="https://twitter.com/ameyayeg"
            target="_blank"
          >
            @ameyayeg
          </a>{' '}
          &copy; {date.getFullYear()}
        </p>
      </div>
      <div className={styles.socials}>
        <Link href="https://twitter.com/ameyayeg">
          <a target="_blank">
            <FaSquareXTwitter />
          </a>
        </Link>
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
