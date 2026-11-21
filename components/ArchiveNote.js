import styles from './ArchiveNote.module.css'

// A short note on the listing and posts of a city that's no longer updated
// (a city with `archive` in utils/cities.js). Renders nothing otherwise.
const ArchiveNote = ({ city, className }) => {
  if (!city || !city.archive) return null
  const { from, to } = city.archive

  return (
    // A div, not a p, so page styles for paragraphs (such as the listing
    // heading's) don't restyle it.
    <div className={className ? `${styles.note} ${className}` : styles.note}>
      <strong>Archive:</strong> our {city.name} reviews were written between{' '}
      {from} and {to} and aren’t being updated. Restaurants change, so check
      that a place is still open before you go.
    </div>
  )
}

export default ArchiveNote
