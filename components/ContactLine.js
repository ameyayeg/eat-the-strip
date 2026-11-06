import { useEffect, useState } from 'react'

// The address is assembled in the browser after the page loads, so it never
// appears in the page HTML (or as one string in the code) for scrapers.
const USER = 'contact'
const DOMAIN = 'eatthestrip.com'

// "Closed, moved, or changed?" line under each post. The email subject is the
// restaurant's name, URL-encoded so apostrophes, accents and "&" survive.
const ContactLine = ({ title, className }) => {
  const [href, setHref] = useState()

  useEffect(() => {
    const subject = encodeURIComponent(title || '').replace(/'/g, '%27')
    setHref(`mailto:${USER}@${DOMAIN}?subject=${subject}`)
  }, [title])

  return (
    <p className={className}>
      Closed, moved, or changed? Know a spot we should try?{' '}
      <a href={href}>Email us</a>
    </p>
  )
}

export default ContactLine
