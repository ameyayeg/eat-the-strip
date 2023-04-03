import styles from '../styles/Footer.module.css'
import { AiFillTwitterCircle } from 'react-icons/ai'
import Link from 'next/link'

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
            <AiFillTwitterCircle />
          </a>
        </Link>
      </div>
    </footer>
  )
}

export default Footer
