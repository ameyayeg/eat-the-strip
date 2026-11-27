import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { AiOutlineMenu, AiOutlineSearch, AiOutlineClose } from 'react-icons/ai'
import styles from './Header.module.css'
import MenuDrawer from './MenuDrawer'

// Listing pages: they get the big logo banner, and the header search filters
// them as you type. Everywhere else, Enter takes you to a listing and the bar
// sticks to the top of the screen.
const LISTING_ROUTES = [
  '/home',
  '/home/page/[page]',
  '/home/[city]',
  '/home/[city]/page/[page]',
]

export const isListingPage = (pathname) => LISTING_ROUTES.includes(pathname)

// Where a search from this page goes: the current city's listing when the
// page belongs to a city, otherwise the default listing.
function searchTarget(router) {
  if (router.pathname.startsWith('/home/[city]') && router.query.city) {
    return `/home/${router.query.city}`
  }
  return '/home'
}

// Search in the bar. On listing pages it's a full box on wider screens and
// filters as you type. Everywhere else, and on phones, it's a magnifier icon
// that opens the search across the whole bar; Enter goes to the listing with
// ?q=. One x button clears the text, or closes the search when it's empty.
const HeaderSearch = ({ isListing }) => {
  const router = useRouter()
  const [value, setValue] = useState('')
  const [expanded, setExpanded] = useState(false)
  const inputRef = useRef(null)
  const toggleRef = useRef(null)

  // Show the search from the address (?q=) once the router has it.
  useEffect(() => {
    if (!router.isReady) return
    const q = typeof router.query.q === 'string' ? router.query.q : ''
    setValue(q)
    setExpanded(Boolean(q))
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

  // The x button: clear the text if there is any, otherwise close.
  const clearOrClose = () => {
    if (value) {
      setValue('')
      if (isListing) updateListing('')
      if (inputRef.current) inputRef.current.focus()
    } else {
      close()
    }
  }

  const classes = [
    styles.search,
    isListing ? '' : styles.compact,
    expanded ? styles.searchOpen : '',
    value ? styles.hasValue : '',
  ].join(' ')

  return (
    <div className={classes}>
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
          placeholder="Search by name, cuisine, dish or street"
          autoComplete="off"
          enterKeyHint="search"
          value={value}
          onChange={onChange}
          onKeyDown={(event) => {
            if (event.key === 'Escape' && (expanded || value)) close()
          }}
        />
        <button
          type="button"
          className={`${styles.iconButton} ${styles.searchClose}`}
          aria-label={value ? 'Clear search' : 'Close search'}
          onClick={clearOrClose}
        >
          <AiOutlineClose aria-hidden="true" />
        </button>
      </form>
    </div>
  )
}

// The same header on every page: menu, logo and search in a slim bar. On
// listing pages the bar and the big logo banner are one orange block, and the
// banner's logo is the only one (it links home). Source order is always menu
// button, home link, search, so the tab order is the same on every page.
const Header = () => {
  const router = useRouter()
  const isListing = isListingPage(router.pathname)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButton = useRef(null)

  const closeMenu = useCallback(() => setMenuOpen(false), [])

  return (
    <>
      <header
        className={`${styles.bar} ${isListing ? styles.listing : styles.sticky}`}
      >
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

        {isListing ? (
          <Link href="/home">
            <a className={styles.heroLink} aria-label="Eat the Strip home" />
          </Link>
        ) : (
          <Link href="/home">
            <a className={styles.logo} aria-label="Eat the Strip home">
              <span className={styles.logoImage} aria-hidden="true" />
            </a>
          </Link>
        )}

        <HeaderSearch isListing={isListing} />
      </header>

      <MenuDrawer
        id="site-menu"
        open={menuOpen}
        onClose={closeMenu}
        returnFocusTo={menuButton}
      />
    </>
  )
}

export default Header
