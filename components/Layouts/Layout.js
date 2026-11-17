import { useRouter } from 'next/router'
import Header, { isListingPage } from '../Header/Header'
import Footer from '../Footer/Footer'
import styles from './Layout.module.css'

const Layout = ({ children }) => {
  const router = useRouter()
  const sticky = !isListingPage(router.pathname)

  return (
    <div
      className={
        sticky ? `${styles.container} ${styles.underStickyBar}` : styles.container
      }
    >
      <Header />
      <main className={styles.main}>{children}</main>
      <Footer />
    </div>
  )
}

export default Layout
