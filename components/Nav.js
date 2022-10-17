import styles from '../styles/Nav.module.css'
import { GiFoodTruck } from 'react-icons/gi'

const Nav = () => {
    return ( 
        <nav className={styles.nav}>
            <div>
                <h1>Eat the Strip</h1>
                <GiFoodTruck className={styles.logo}/>
                <hr/>
            </div>
        </nav>
     );
}
 
export default Nav;