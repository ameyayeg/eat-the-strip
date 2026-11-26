import { useId, useState } from 'react'
import { FaStar, FaPlay } from 'react-icons/fa'
import { MdPlace } from 'react-icons/md'
import styles from './PostSummary.module.css'

// Optional post details from the CMS (all may be missing):
// favourite, dietary, price, area, mustOrder, youtube, cbc, cbcAudio.
// The map link comes from the existing title and address; the writer's-pick
// star sits beside the title (PostTitle), not in the card.

const text = (value) => String(value ?? '').trim()
// The first character in upper case and the rest exactly as written, so "pho"
// shows as "Pho" and "Roberto’s Italian Trio" stays as it is. Array.from keeps
// accented and other non-ASCII first letters whole ("éclair" -> "Éclair").
const capitalizeFirst = (value) => {
  const [first = '', ...rest] = Array.from(value)
  return first.toUpperCase() + rest.join('')
}
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

// The address line under the title. It links to Google Maps (searching the
// restaurant's name and address), with a map-pin icon, in a new tab. Closed
// posts, and posts without an address, keep the plain italic address.
export function PostAddress({ frontmatter }) {
  const fm = frontmatter || {}
  const address = text(fm.address)
  if (!address || fm.closed === true) {
    return (
      <p>
        <i>{fm.address}</i>
      </p>
    )
  }
  const query = encodeURIComponent(
    [text(fm.title), address].filter(Boolean).join(', ')
  )
  return (
    <p>
      <a
        className={styles.addressLink}
        href={`https://www.google.com/maps/search/?api=1&query=${query}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Open ${address} in Google Maps`}
      >
        <MdPlace className={styles.addressPin} aria-hidden="true" />
        <i>{fm.address}</i>
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

// The writer's-pick star on listing cards. The whole card is a link, so this
// is an icon rather than a button: named "Writer's pick" for screen readers,
// with the same star, colours and hover tooltip as the post page.
export function WritersPickIcon() {
  return (
    <span className={styles.pickIcon} role="img" aria-label="Writer's pick">
      <FaStar aria-hidden="true" />
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
  const headingId = useId()

  const hasTags = Boolean(dietary.length || price || area)
  if (!hasTags && !dishes.length) {
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
              <li key={dish}>{capitalizeFirst(dish)}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}

// Where the "Watch and listen" block goes in the article: after about half of
// the text paragraphs, never before the 3rd, or at the end when there are
// fewer than 3. Returns [before, after] (the Markdown cut at the blank line
// after that paragraph, so both halves keep their original text), or null when
// the post has no YouTube or CBC link.
export function splitForMedia(markdown, frontmatter) {
  const fm = frontmatter || {}
  if (!text(fm.youtube) && !text(fm.cbc) && !text(fm.cbcAudio)) return null
  const md = String(markdown || '')
  const separator = /\r?\n[ \t]*\r?\n/g
  const blocks = []
  let start = 0
  let match
  while ((match = separator.exec(md))) {
    blocks.push({ body: md.slice(start, match.index), end: match.index, next: separator.lastIndex })
    start = separator.lastIndex
  }
  blocks.push({ body: md.slice(start), end: md.length, next: md.length })
  const isText = (body) => {
    const t = body.trim()
    return t && !/^!\[[^\]]*\]\([^)]*\)$/.test(t) && !/^#/.test(t) && !/^[-*_ ]{3,}$/.test(t)
  }
  const paragraphs = blocks.filter((block) => isText(block.body))
  const after = Math.max(3, Math.ceil(paragraphs.length / 2))
  if (paragraphs.length < 3 || after >= paragraphs.length) return [md, '']
  const cut = paragraphs[after - 1]
  return [md.slice(0, cut.end), md.slice(cut.next)]
}

// "Watch and listen", inside the article: the Short or video, then the CBC
// clip. Nothing at all when the post has neither.
export function MediaBlock({ frontmatter }) {
  const fm = frontmatter || {}
  const youtube = text(fm.youtube)
  const cbc = text(fm.cbc)
  const cbcAudio = text(fm.cbcAudio)
  const headingId = useId()
  if (!youtube && !cbc && !cbcAudio) return null

  // A thin rule above and below, like the one under the byline; only when
  // the block itself renders.
  return (
    <>
      <hr className={styles.mediaRule} />
      <section className={styles.media} aria-labelledby={headingId}>
        <h2 id={headingId} className={styles.heading}>
          Watch and listen
        </h2>
        {youtube && (
          <YouTubeCard url={youtube} title={text(fm.title)} poster={fm.image} />
        )}
        {(cbc || cbcAudio) && <CbcClip page={cbc} audio={cbcAudio} />}
      </section>
      <hr className={`${styles.mediaRule} ${styles.mediaRuleAfter}`} />
    </>
  )
}
