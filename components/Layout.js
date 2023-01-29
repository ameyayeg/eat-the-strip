import Header from "../components/Header"
import Footer from "../components/Footer"
import styles from "../styles/Layout.module.css"

const Layout = ({ children }) => {
    
    return ( 
        <div className={styles.container}>
            <Header/>
            <main className={styles.main}>{children}</main>
            <Footer/>
        </div>
     )
}
 
export default Layout;