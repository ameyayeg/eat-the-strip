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
      </Menu>
      <Header />
      <main className={styles.main}>{children}</main>
      <Footer />
    </div>
  )
}

export default Layout
