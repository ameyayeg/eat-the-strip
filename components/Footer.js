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
          <li>About</li>
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
        <AiFillTwitterCircle />
      </div>
    </footer>
  )
}

export default Footer
