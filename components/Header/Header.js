import styles from './Header.module.css'
import Link from 'next/link'
import Image from 'next/image'
import heroImage from '../../public/uploads/pexels-makafood-8984408.jpg'
import { slide as Menu } from 'react-burger-menu'
import { FaInstagram } from 'react-icons/fa'
import Subscribe from '../Subscribe'

const Header = () => {
  return (
    <header className={styles.container}>
      <Menu>
        <a id="home" className="menu-item" href="/">
          Home
        </a>
        <a id="about" className="menu-item" href="/about">
          About
        </a>
        <a id="all" className="menu-item" href="/all">
          Restaurants Map
        </a>
        <a id="privacy" className="menu-item" href="/privacy">
          Privacy
        </a>
        <a id="terms" className="menu-item" href="/terms">
          Terms and conditions
        </a>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <a href="https://ko-fi.com/B0B31A86OB" target="_blank">
            <img
              height="36"
              style={{ border: '0px', height: '40px' }}
              src="https://storage.ko-fi.com/cdn/kofi2.png?v=6"
              border="0"
              alt="Buy Me a Coffee at ko-fi.com"
            />
          </a>
          <a
            href="https://www.instagram.com/eatthestripyow/"
            rel="noreferrer"
            target="_blank"
          >
            <FaInstagram color="#ee802f" size="lg" />
          </a>
        </div>

        <div>
          <Subscribe />
        </div>
      </Menu>

      <Image
        className={styles.hero}
        src={heroImage}
        alt="Fried egg"
        layout="fill"
        objectFit="cover"
        objectPosition="center"
        priority
      />

      <div className={styles.heroContent}>
        <Link href="/">
          <a>
            <h1>Eat the Strip</h1>
          </a>
        </Link>
      </div>
    </header>
  )
}

export default Header
