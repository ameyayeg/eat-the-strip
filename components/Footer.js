import styles from '../styles/Footer.module.css'
import { AiFillFacebook,  AiOutlineInstagram} from 'react-icons/ai'

const Footer = () => {

    const date = new Date()
    
    return ( 
        <footer className={styles.container}>
            <div className={styles.menu}>
                <ul>
                    <li>About</li>
                    <li>Categories</li>
                    <li>Search</li>
                </ul>
            </div>
            <div className={styles.copyright}>
                <p>Made by <a className="twitter" href="https://twitter.com/ameyayeg" target="_blank">@ameyayeg</a> &copy; {date.getFullYear()}</p>
            </div>
            <div className={styles.socials}>
                <AiFillFacebook/>
                <AiOutlineInstagram/>
            </div>
        </footer>
     );
}
 
export default Footer;