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
        <form
          action="https://www.paypal.com/donate"
          method="post"
          target="_top"
        >
          <input type="hidden" name="business" value="4K2E9APZQPMSN" />
          <input type="hidden" name="no_recurring" value="0" />
          <input type="hidden" name="currency_code" value="CAD" />
          <input
            type="image"
            src="https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif"
            border="0"
            name="submit"
            title="PayPal - The safer, easier way to pay online!"
            alt="Donate with PayPal button"
          />
          <img
            alt=""
            border="0"
            src="https://www.paypal.com/en_CA/i/scr/pixel.gif"
            width="1"
            height="1"
          />
        </form>

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
