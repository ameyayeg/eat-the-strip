import Footer from "../components/Footer"
import styles from "../styles/Layout.module.css"

const LayoutWithoutHeader = ({ children }) => {
    
    return ( 
        <div className={styles.container}>
            <main className={styles.main}>{children}</main>
            <Footer/>
        </div>
     )
}
 
export default LayoutWithoutHeader;