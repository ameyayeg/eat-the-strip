import { otherCities, cityPath } from './cities'

// The site's main links, in order. The hamburger menu (Header.js) shows all
// of them; the footer (Footer.js) leaves out Home because its logo links home.
// Keep the legal links last. `divider: true` adds a little space above that
// link in both places to set the legal links apart. Each city other than the
// default gets a link after the map, from utils/cities.js.
const navLinks = [
  { id: 'home', label: 'Home', href: '/home' },
  { id: 'all', label: 'Restaurants map', href: '/all' },
  ...otherCities.map((city) => ({
    id: city.id,
    label: city.name,
    href: cityPath(city),
  })),
  { id: 'newsletter', label: 'Newsletter', href: '/newsletter' },
  { id: 'about', label: 'About', href: '/about' },
  { id: 'contact', label: 'Contact', href: '/contact' },
  { id: 'privacy', label: 'Privacy', href: '/privacy', divider: true },
  { id: 'terms', label: 'Terms and conditions', href: '/terms' },
]

export default navLinks
