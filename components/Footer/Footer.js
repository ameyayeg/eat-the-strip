import styles from './Footer.module.css'
import Link from 'next/link'
import Subscribe from '../Subscribe'
import { MdRssFeed } from 'react-icons/md'
import { FaInstagram, FaYoutube } from 'react-icons/fa'
import navLinks from '../../utils/navLinks'

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
          {navLinks
            .filter(({ id }) => id !== 'home')
            .map(({ id, label, href, divider }) => (
              <li key={id} className={divider ? styles.divider : undefined}>
                <Link href={href}>
                  <a>{label}</a>
                </Link>
              </li>
            ))}
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
          <a rel="noreferrer" target="_blank" aria-label="Eat the Strip RSS feed">
            <MdRssFeed color="#ee802f" aria-hidden="true" />
          </a>
        </Link>
        <Link href="https://www.instagram.com/eatthestripyow/">
          <a
            rel="noreferrer"
            target="_blank"
            aria-label="Eat the Strip on Instagram"
          >
            <FaInstagram color="#ee802f" aria-hidden="true" />
          </a>
        </Link>
        <a
          href="https://www.youtube.com/@eatthestripyow"
          rel="noreferrer"
          target="_blank"
          aria-label="Eat the Strip on YouTube"
        >
          <FaYoutube color="#ee802f" aria-hidden="true" />
        </a>
        <div>
          <Subscribe />
        </div>
      </div>
    </footer>
  )
}

export default Footer
