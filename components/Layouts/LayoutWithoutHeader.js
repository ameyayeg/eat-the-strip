import Footer from '../Footer/Footer'
import styles from './Layout.module.css'

const LayoutWithoutHeader = ({ children }) => {
  return (
    <div className={styles.container}>
      <main className={styles.main}>{children}</main>
      <Footer />
    </div>
  )
}

export default LayoutWithoutHeader
