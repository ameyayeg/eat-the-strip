import { useId, useState } from 'react'
import { FaStar, FaPlay } from 'react-icons/fa'
import { MdPlace } from 'react-icons/md'
import styles from './PostSummary.module.css'

// Optional post details from the CMS (all may be missing):
// favourite, dietary, price, area, mustOrder, youtube, cbc, cbcAudio.
// The map link comes from the existing title and address; the writer's-pick
// star sits beside the title (PostTitle), not in the card.

const text = (value) => String(value ?? '').trim()
const list = (value) =>
  (Array.isArray(value) ? value : value ? [value] : []).map(text).filter(Boolean)

// The 11-character video id from a youtube.com or youtu.be link, or null.
function youtubeId(url) {
  let parsed
  try {
    parsed = new URL(url)
  } catch (e) {
    return null
  }
  const host = parsed.hostname.replace(/^(www|m)\./, '')
  let id = null
  if (host === 'youtu.be') id = parsed.pathname.split('/')[1]
  else if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
    id =
      parsed.searchParams.get('v') ||
      (parsed.pathname.match(/^\/(?:shorts|embed|live)\/([^/?#]+)/) || [])[1]
  }
  return /^[A-Za-z0-9_-]{11}$/.test(id || '') ? id : null
}

// A YouTube Shorts link (youtube.com/shorts/<id>), shown in a portrait box.
function isShort(url) {
  try {
    return /^\/shorts\//.test(new URL(url).pathname)
  } catch (e) {
    return false
  }
}

// "Open in Google Maps", searching the restaurant's name and address. Shown
// under the address on every post that isn't closed.
export function MapLinks({ frontmatter }) {
  const fm = frontmatter || {}
  const address = text(fm.address)
  if (!address || fm.closed === true) return null
  const query = encodeURIComponent(
    [text(fm.title), address].filter(Boolean).join(', ')
  )
  return (
    <p className={styles.mapLinks}>
      <a
        href={`https://www.google.com/maps/search/?api=1&query=${query}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        Open in Google Maps
      </a>
    </p>
  )
}

// The star with a "Writer's pick" tooltip: shown on hover, on keyboard focus
// and on tap; a second tap, Escape or moving focus away closes it. Screen
// readers hear the button's name once; the tooltip itself is visual only.
function WritersPick() {
  const [open, setOpen] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const classes = [
    styles.pick,
    open ? styles.open : '',
    dismissed ? styles.dismissed : '',
  ].join(' ')

  return (
    <span className={classes}>
      <button
        type="button"
        className={styles.star}
        aria-label="Writer's pick"
        onClick={() => {
          setOpen(!open)
          setDismissed(open)
        }}
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            setOpen(false)
            setDismissed(true)
          }
        }}
        onBlur={() => {
          setOpen(false)
          setDismissed(false)
        }}
      >
        <FaStar aria-hidden="true" />
      </button>
      <span className={styles.tooltip} aria-hidden="true">
        Writer’s pick
      </span>
    </span>
  )
}

// Click to play: nothing loads from YouTube until the reader asks for it.
// The preview uses the post's own photo, already loaded at the top of the post.
// Shorts get a portrait 9:16 box; other videos 16:9.
function YouTubeCard({ url, title, poster }) {
  const id = youtubeId(url)
  const [playing, setPlaying] = useState(false)

  if (!id) {
    return (
      <p className={styles.plain}>
        <a href={url} target="_blank" rel="noopener noreferrer">
          Watch on YouTube
        </a>
      </p>
    )
  }

  return (
    <div
      className={
        isShort(url) ? `${styles.video} ${styles.portrait}` : styles.video
      }
    >
      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1`}
          title={`${title} on YouTube`}
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          className={styles.videoButton}
          onClick={() => setPlaying(true)}
          aria-label={`Play the video about ${title}`}
        >
          {poster && <img src={poster} alt="" loading="lazy" />}
          <span className={styles.play} aria-hidden="true">
            <FaPlay />
          </span>
          <span className={styles.videoLabel} aria-hidden="true">
            Watch on YouTube
          </span>
        </button>
      )}
    </div>
  )
}

// The CBC clip: an audio player that loads nothing until played, credited to
// CBC. A link card replaces it when there's only the clip page, or when the
// audio can't be played.
function CbcClip({ page, audio }) {
  const [failed, setFailed] = useState(false)

  if (audio && !failed) {
    return (
      <div className={styles.audio}>
        <p className={styles.audioTitle}>Heard on CBC Ottawa Morning</p>
        <audio
          controls
          preload="none"
          src={audio}
          onError={() => setFailed(true)}
        >
          <a href={page || audio}>Listen on CBC</a>
        </audio>
        <p className={styles.credit}>
          {page ? (
            <a href={page} target="_blank" rel="noopener noreferrer">
              © CBC
            </a>
          ) : (
            '© CBC'
          )}
        </p>
      </div>
    )
  }

  return (
    <a
      className={styles.cbcLink}
      href={page || audio}
      target="_blank"
      rel="noopener noreferrer"
    >
      <span>Heard on CBC Ottawa Morning</span>
      <span aria-hidden="true"> · </span>
      <span className={styles.listen}>Listen</span>
    </a>
  )
}

// The restaurant's name. On a writer's pick, the star sits beside the <h1>,
// not inside it, so the heading and the page title don't change: the <h1>
// stays a normal block and the star sits to its right, level with its first
// line. Other posts get the plain <h1>.
export function PostTitle({ frontmatter }) {
  const fm = frontmatter || {}
  if (fm.favourite !== true) return <h1>{fm.title}</h1>
  return (
    <div className={styles.titleRow}>
      <h1>{fm.title}</h1>
      <WritersPick />
    </div>
  )
}

// The details card at the top of a post. Shows only the fields a post has,
// and nothing at all when it has none of them.
export function PostSummaryCard({ frontmatter }) {
  const fm = frontmatter || {}
  const dietary = list(fm.dietary)
  const dishes = list(fm.mustOrder)
  const price = text(fm.price)
  const area = text(fm.area)
  const youtube = text(fm.youtube)
  const cbc = text(fm.cbc)
  const cbcAudio = text(fm.cbcAudio)
  const headingId = useId()

  const hasTags = Boolean(dietary.length || price || area)
  if (!hasTags && !dishes.length && !youtube && !cbc && !cbcAudio) {
    return null
  }

  return (
    <section className={styles.card} aria-labelledby={headingId}>
      <h2 id={headingId} className={styles.srOnly}>
        At a glance
      </h2>
      {hasTags && (
        <div className={styles.tags}>
          {dietary.map((item) => (
            <span key={item} className={styles.badge}>
              {item}
            </span>
          ))}
          {price && (
            <span className={styles.label}>
              {price}
              <span className={styles.labelNote}> per person</span>
            </span>
          )}
          {area && (
            <span className={styles.label}>
              <MdPlace aria-hidden="true" />
              <span className={styles.srOnly}>Area: </span>
              {area}
            </span>
          )}
        </div>
      )}
      {dietary.length > 0 && (
        <p className={styles.note}>
          Based on what we saw or were told. Confirm with the restaurant.
        </p>
      )}
      {dishes.length > 0 && (
        <div>
          <h3 className={styles.heading}>Must order</h3>
          <ul className={styles.dishes}>
            {dishes.map((dish) => (
              <li key={dish}>{dish}</li>
            ))}
          </ul>
        </div>
      )}
      {youtube && (
        <YouTubeCard url={youtube} title={text(fm.title)} poster={fm.image} />
      )}
      {(cbc || cbcAudio) && <CbcClip page={cbc} audio={cbcAudio} />}
    </section>
  )
}
