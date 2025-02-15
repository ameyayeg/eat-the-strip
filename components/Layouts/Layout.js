import Header from '../Header/Header'
import Footer from '../Footer/Footer'
import styles from './Layout.module.css'

const Layout = ({ children }) => {
  function showSettings() {
    e.preventDefault()
  }
  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>{children}</main>
      <Footer />
    </div>
  )
}

export default Layout
