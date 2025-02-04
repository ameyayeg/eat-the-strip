import Header from '../Header/Header'
import Footer from '../Footer/Footer'
import styles from './Layout.module.css'
import { slide as Menu } from 'react-burger-menu'

const Layout = ({ children }) => {
  function showSettings() {
    e.preventDefault()
  }
  return (
    <div className={styles.container}>
      <Menu>
        <a id="home" className="menu-item" href="/">
          Home
        </a>
        <a id="about" className="menu-item" href="/about">
          About
        </a>
        <a id="all" className="menu-item" href="/all">
          Map
        </a>
        <a id="privacy" className="menu-item" href="/privacy">
          Privacy
        </a>
        <a id="terms" className="menu-item" href="/terms">
          Terms and conditions
        </a>
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
      </Menu>
      <Header />
      <main className={styles.main}>{children}</main>
      <Footer />
    </div>
  )
}

export default Layout
