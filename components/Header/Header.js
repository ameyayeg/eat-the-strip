import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { slide as Menu } from 'react-burger-menu'
import { FaInstagram, FaYoutube } from 'react-icons/fa'
import { AiOutlineMenu, AiOutlineSearch, AiOutlineClose } from 'react-icons/ai'
import styles from './Header.module.css'
import Subscribe from '../Subscribe'
import navLinks from '../../utils/navLinks'

// Listing pages: they get the big logo banner, and the header search filters
// them as you type. Everywhere else, Enter takes you to a listing.
const LISTING_ROUTES = [
  '/home',
  '/home/page/[page]',
  '/home/[city]',
  '/home/[city]/page/[page]',
]

// Where a search from this page goes: the current city's listing when the
// page belongs to a city, otherwise the default listing.
function searchTarget(router) {
  if (router.pathname.startsWith('/home/[city]') && router.query.city) {
    return `/home/${router.query.city}`
  }
  return '/home'
}

const HeaderSearch = ({ isListing }) => {
  const router = useRouter()
  const [value, setValue] = useState('')
  const [expanded, setExpanded] = useState(false) // phones only
  const inputRef = useRef(null)
  const toggleRef = useRef(null)

  // Show the search from the address (?q=) once the router has it.
  useEffect(() => {
    if (!router.isReady) return
    const q = typeof router.query.q === 'string' ? router.query.q : ''
    setValue(q)
    if (q) setExpanded(true)
    // Only when the page changes, not on every keystroke.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, router.pathname])

  // On listing pages, keep ?q= in the address so the listing can filter.
  const updateListing = (q) => {
    const query = { ...router.query }
    if (q.trim()) query.q = q
    else delete query.q
    router.replace({ pathname: router.pathname, query }, undefined, {
      shallow: true,
      scroll: false,
    })
  }

  const onChange = (event) => {
    setValue(event.target.value)
    if (isListing) updateListing(event.target.value)
  }

  const onSubmit = (event) => {
    event.preventDefault()
    if (isListing) return // already filtering as you type
    const q = value.trim()
    router.push({ pathname: searchTarget(router), query: q ? { q } : {} })
  }

  const open = () => {
    setExpanded(true)
    setTimeout(() => inputRef.current && inputRef.current.focus(), 0)
  }

  const close = () => {
    setExpanded(false)
    if (value) {
      setValue('')
      if (isListing) updateListing('')
    }
    setTimeout(() => toggleRef.current && toggleRef.current.focus(), 0)
  }

  return (
    <div className={`${styles.search} ${expanded ? styles.searchOpen : ''}`}>
      <button
        ref={toggleRef}
        type="button"
        className={`${styles.iconButton} ${styles.searchToggle}`}
        aria-label="Open search"
        aria-expanded={expanded}
        aria-controls="site-search"
        onClick={open}
      >
        <AiOutlineSearch aria-hidden="true" />
      </button>
      <form
        id="site-search"
        role="search"
        className={styles.searchForm}
        onSubmit={onSubmit}
      >
        <label htmlFor="site-search-input" className={styles.srOnly}>
          Search restaurants
        </label>
        <input
          ref={inputRef}
          id="site-search-input"
          className={styles.searchInput}
          type="search"
          placeholder="Search food, cuisine or address"
          autoComplete="off"
          value={value}
          onChange={onChange}
          onKeyDown={(event) => {
            if (event.key === 'Escape' && expanded) close()
          }}
        />
        <button
          type="button"
          className={`${styles.iconButton} ${styles.searchClose}`}
          aria-label="Close search"
          onClick={close}
        >
          <AiOutlineClose aria-hidden="true" />
        </button>
      </form>
    </div>
  )
}

// The same header on every page: menu, logo and search in a slim bar, plus
// the big logo banner on listing pages.
const Header = () => {
  const router = useRouter()
  const isListing = LISTING_ROUTES.includes(router.pathname)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButton = useRef(null)

  const wasOpen = useRef(false)

  const onMenuChange = ({ isOpen }) => {
    setMenuOpen(isOpen)
    // Closing (Escape, the close button or a click outside) returns focus to
    // the menu button. react-burger-menu blurs the focused element right
    // after this runs, so wait a tick. It also reports "closed" on page load,
    // which must not move focus.
    if (!isOpen && wasOpen.current) {
      setTimeout(() => menuButton.current && menuButton.current.focus(), 0)
    }
    wasOpen.current = isOpen
  }

  // Menu links navigate in the app and close the menu.
  const go = (href) => (event) => {
    event.preventDefault()
    setMenuOpen(false)
    router.push(href)
  }

  return (
    <>
      <header className={styles.bar}>
        <button
          ref={menuButton}
          type="button"
          className={`${styles.iconButton} ${styles.menuButton}`}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="site-menu"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <AiOutlineMenu aria-hidden="true" />
        </button>

        <Link href="/home">
          <a className={styles.logo} aria-label="Eat the Strip home">
            <span className={styles.logoImage} aria-hidden="true" />
          </a>
        </Link>

        <HeaderSearch isListing={isListing} />
      </header>

      <Menu
        id="site-menu"
        isOpen={menuOpen}
        onStateChange={onMenuChange}
        customBurgerIcon={false}
      >
        {navLinks.map(({ id, label, href, divider }) => (
          <a
            key={id}
            id={id}
            className={divider ? `menu-item ${styles.divider}` : 'menu-item'}
            href={href}
            onClick={go(href)}
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

      {isListing && (
        <div className={styles.hero}>
          <Link href="/home">
            <a className={styles.heroLink} aria-label="Eat the Strip home" />
          </Link>
        </div>
      )}
    </>
  )
}

export default Header
