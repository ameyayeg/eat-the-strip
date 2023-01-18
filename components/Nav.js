import styles from '../styles/Nav.module.css'
import { GiFoodTruck } from 'react-icons/gi'
import Link from 'next/link'

const Nav = () => {
    return ( 
        <>
        <nav className={styles.container}>
            <Link href="/">
                <a style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25em', marginRight: 'auto'}}>
                    <h2>Eat the Strip</h2>
                    <GiFoodTruck className={styles.logo}/>
                </a>
            </Link>
        </nav>
        <hr/>
        </>
     );
}
 
export default Nav;