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
          Restaurants map
        </a>
        <a id="privacy" className="menu-item" href="/privacy">
          Privacy
        </a>
        <a id="terms" className="menu-item" href="/terms">
          Terms and conditions
        </a>
        <a href="https://ko-fi.com/B0B31A86OB" target="_blank">
          <img
            height="36"
            style={{ border: '0px', height: '36px' }}
            src="https://storage.ko-fi.com/cdn/kofi2.png?v=6"
            border="0"
            alt="Buy Me a Coffee at ko-fi.com"
          />
        </a>
      </Menu>
      <Header />
      <main className={styles.main}>{children}</main>
      <Footer />
    </div>
  )
}

export default Layout
