import styles from '../styles/Nav.module.css'
import { GiFoodTruck } from 'react-icons/gi'
import Link from 'next/link'

const Nav = () => {
    return ( 
        <nav className={styles.container}>
            <div>
                <Link href={`/`}>
                    <a>
                        <h1>Eat the Strip</h1>
                        <GiFoodTruck className={styles.logo}/>
                    </a>
                </Link>
                <hr/>
            </div>
        </nav>
     );
}
 
export default Nav;