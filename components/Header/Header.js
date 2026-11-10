import styles from './Header.module.css'
import Link from 'next/link'
import { slide as Menu } from 'react-burger-menu'
import { FaInstagram, FaYoutube } from 'react-icons/fa'
import Subscribe from '../Subscribe'
import navLinks from '../../utils/navLinks'

const Header = () => {
  return (
    <header className={styles.container}>
      <Menu>
        {navLinks.map(({ id, label, href, divider }) => (
          <a
            key={id}
            id={id}
            className={divider ? `menu-item ${styles.divider}` : 'menu-item'}
            href={href}
          >
            {label}
          </a>
        ))}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '12px',
            marginTop: '16px',
          }}
        >
          <a href="https://ko-fi.com/B0B31A86OB" target="_blank">
            <img
              height="36"
              style={{ border: '0px', height: '40px' }}
              src="https://storage.ko-fi.com/cdn/kofi2.png?v=6"
              border="0"
              alt="Buy Me a Coffee at ko-fi.com"
            />
          </a>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <a
              href="https://www.instagram.com/eatthestripyow/"
              rel="noreferrer"
              target="_blank"
              aria-label="Eat the Strip on Instagram"
            >
              <FaInstagram color="#ee802f" size={36} aria-hidden="true" />
            </a>
            <a
              href="https://www.youtube.com/@eatthestripyow"
              rel="noreferrer"
              target="_blank"
              aria-label="Eat the Strip on YouTube"
            >
              <FaYoutube color="#ee802f" size={36} aria-hidden="true" />
            </a>
          </div>
        </div>

        <div>
          <Subscribe />
        </div>
      </Menu>

      <Link href="/">
        <a className={styles.hero} aria-label="Eat the Strip homepage" />
      </Link>
    </header>
  )
}

export default Header
