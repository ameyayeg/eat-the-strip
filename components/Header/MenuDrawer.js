import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FaInstagram, FaYoutube } from 'react-icons/fa'
import { AiOutlineClose } from 'react-icons/ai'
import styles from './MenuDrawer.module.css'
import Subscribe from '../Subscribe'
import navLinks from '../../utils/navLinks'

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])'

// The site menu: a panel that slides in from the left over the page, pinned
// to the top of the screen at any scroll position. While it's open the page
// can't scroll, Tab stays inside it and Escape closes it; when it closes,
// focus goes back to the menu button. Closed, it's hidden from the keyboard
// and screen readers.
const MenuDrawer = ({ id, open, onClose, returnFocusTo }) => {
  const router = useRouter()
  const panel = useRef(null)
  const wasOpen = useRef(false)

  // Close after any page change.
  useEffect(() => {
    router.events.on('routeChangeStart', onClose)
    return () => router.events.off('routeChangeStart', onClose)
  }, [router.events, onClose])

  useEffect(() => {
    if (open) {
      wasOpen.current = true
      // Lock page scrolling (this also works for touch scrolling on iPhones):
      // pin the page where it is, keep the scrollbar's space so nothing
      // jumps, and put the scroll position back when the menu closes.
      const scrollY = window.scrollY
      const scrollbar = window.innerWidth - document.documentElement.clientWidth
      const body = document.body.style
      const saved = {
        position: body.position,
        top: body.top,
        width: body.width,
        paddingRight: body.paddingRight,
      }
      body.position = 'fixed'
      body.top = `-${scrollY}px`
      body.width = '100%'
      if (scrollbar > 0) body.paddingRight = `${scrollbar}px`
      const first = panel.current && panel.current.querySelector('nav a')
      if (first) first.focus()

      const onKeyDown = (event) => {
        if (event.key === 'Escape') {
          event.preventDefault()
          onClose()
        } else if (event.key === 'Tab' && panel.current) {
          const items = [...panel.current.querySelectorAll(FOCUSABLE)]
          if (!items.length) return
          const firstItem = items[0]
          const lastItem = items[items.length - 1]
          if (event.shiftKey && document.activeElement === firstItem) {
            event.preventDefault()
            lastItem.focus()
          } else if (!event.shiftKey && document.activeElement === lastItem) {
            event.preventDefault()
            firstItem.focus()
          } else if (!panel.current.contains(document.activeElement)) {
            event.preventDefault()
            firstItem.focus()
          }
        }
      }
      document.addEventListener('keydown', onKeyDown)
      return () => {
        document.removeEventListener('keydown', onKeyDown)
        Object.assign(body, saved)
        window.scrollTo(0, scrollY)
      }
    }
    if (wasOpen.current) {
      wasOpen.current = false
      // preventScroll: the button may be off-screen; keep the reader's place.
      if (returnFocusTo.current) {
        returnFocusTo.current.focus({ preventScroll: true })
      }
    }
  }, [open, onClose, returnFocusTo])

  return (
    <div className={`${styles.drawer} ${open ? styles.open : ''}`}>
      <div className={styles.overlay} onClick={onClose} aria-hidden="true" />
      <div
        ref={panel}
        id={id}
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        aria-hidden={!open}
      >
        <button
          type="button"
          className={styles.close}
          aria-label="Close menu"
          onClick={onClose}
        >
          <AiOutlineClose aria-hidden="true" />
        </button>

        <nav aria-label="Site" className={styles.links}>
          {navLinks.map(({ id: linkId, label, href, divider }) => (
            <Link href={href} key={linkId}>
              <a
                id={linkId}
                className={
                  divider ? `${styles.link} ${styles.divider}` : styles.link
                }
                onClick={onClose}
              >
                {label}
              </a>
            </Link>
          ))}
        </nav>

        <div className={styles.extras}>
          <a href="https://ko-fi.com/B0B31A86OB" target="_blank">
            <img
              height="36"
              style={{ border: '0px', height: '40px' }}
              src="https://storage.ko-fi.com/cdn/kofi2.png?v=6"
              border="0"
              alt="Buy Me a Coffee at ko-fi.com"
            />
          </a>
          <div className={styles.socials}>
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

        <div className={styles.subscribe}>
          <Subscribe />
        </div>
      </div>
    </div>
  )
}

export default MenuDrawer
