import styles from '../styles/Header.module.css'
import { GiFoodTruck } from 'react-icons/gi'
import Link from 'next/link'
import Image from 'next/image'
import heroImage from '../public/uploads/pexels-makafood-8984408.jpg'

const Header = () => {


    return ( 
        <header className={styles.container}>
            <div className={styles.imageWrapper}>
                <Image className={styles.hero}
                    src={heroImage}
                    alt="Fried egg"
                    layout="fill"
                    objectFit="cover"
                    objectPosition="center"
                /> 
            </div>

            <div className={styles.heroContent}>
                <h1>Eat the Strip</h1>
            </div>

        </header>
     );
}
 
export default Header;