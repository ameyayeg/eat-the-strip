// Titles, descriptions and share images for blog post pages.

export const SITE_URL = 'https://eatthestrip.com'
export const SITE_NAME = 'Eat the Strip'
export const DEFAULT_SHARE_IMAGE = '/newlogo.png'

const MAX_DESCRIPTION = 160
const MIN_DESCRIPTION = 70

// Words ending in a period that don't end a sentence.
const ABBREVIATION =
  /\b(St|Ave|Rd|Dr|Blvd|Hwy|Mr|Mrs|Ms|Dr|Mt|Jr|Sr|vs|No|approx|e\.g|i\.e|a\.m|p\.m)\.$/i

const clean = (value) =>
  String(value ?? '')
    .replace(/[​-‍﻿]/g, '')
    .replace(/\s+/g, ' ')
    .trim()

const sameText = (a, b) => {
  const norm = (s) => clean(s).toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '')
  return norm(a) !== '' && norm(a) === norm(b)
}

// Turns a site path like "/uploads/img 1.jpeg" into an absolute URL.
export function absoluteUrl(path = '/') {
  if (/^https?:\/\//i.test(path)) return path
  const withSlash = path.startsWith('/') ? path : `/${path}`
  let decoded = withSlash
  try {
    decoded = decodeURI(withSlash)
  } catch (e) {}
  return `${SITE_URL}${encodeURI(decoded)}`
}

const MAX_TITLE = 60

// Cuisines that read better without "food" ("Cafe in Fredericton").
const NO_FOOD_SUFFIX = ['cafe', 'bakery', 'pizza', 'dessert']

// "<name>: <cuisine> food in <city> | Eat the Strip". A blank City means
// Ottawa-Gatineau, as on the listing pages. Without a cuisine:
// "<name> | Eat the Strip". Titles over 60 characters drop "| Eat the Strip".
export function getPostTitle(frontmatter = {}) {
  const name = clean(frontmatter.title)
  const cuisine = clean(frontmatter.cuisine)
  const city = clean(frontmatter.city) || 'Ottawa-Gatineau'
  let base = name
  if (cuisine) {
    const food = NO_FOOD_SUFFIX.includes(cuisine.toLowerCase()) ? '' : ' food'
    base = `${name}: ${cuisine}${food} in ${city}`
  }
  const full = `${base} | ${SITE_NAME}`
  return full.length > MAX_TITLE ? base : full
}

// Removes Markdown formatting from one line, keeping the words.
function plainText(line) {
  return clean(
    line
      .replace(/!\[[^\]]*\]\([^)]*\)/g, '') // images
      .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // links -> link text
      .replace(/<[^>]+>/g, '') // HTML tags
      .replace(/^\s{0,3}(#{1,6}|>)\s*/, '') // heading / quote markers
      .replace(/^\s*([-*+]|\d+\.)\s+/, '') // list markers
      .replace(/(\*\*|__)(.*?)\1/g, '$2') // bold
      .replace(/(^|[^\w*])[*_]([^*_]+)[*_](?=[^\w*]|$)/g, '$1$2') // italics
      .replace(/\\([\\`*_{}\[\]()#+\-.!>~|])/g, '$1') // escapes
  )
}

// A line before the article starts that isn't article text.
function isLeadingHeader(raw, text, frontmatter) {
  if (/^\s{0,3}#/.test(raw)) return true // heading
  if (/^by\b[:\s]/i.test(text)) return true // byline
  if (/^(note|update)\s*:/i.test(text)) return true // editor's note
  if (sameText(text, frontmatter.title) || sameText(text, frontmatter.address))
    return true
  return false
}

// Paragraphs of the article, skipping leading title/address/byline lines,
// leading NOTE:/UPDATE: paragraphs, dividers like "* * *", images and headings.
function* articleParagraphs(markdown, frontmatter) {
  let started = false
  for (const raw of String(markdown || '').split(/\r?\n/)) {
    if (!raw.trim()) continue
    if (/^\s*!\[[^\]]*\]\([^)]*\)\s*$/.test(raw)) continue // image line
    const text = plainText(raw)
    if (!text || /^[\s*_\-–—•·.=~]*$/.test(text) || /^[\s*_\-–—•·.=~]*$/.test(raw))
      continue // divider
    if (/^\s{0,3}#/.test(raw)) continue // headings anywhere
    if (!started && isLeadingHeader(raw, text, frontmatter)) continue
    started = true
    yield text
  }
}

function sentences(paragraph) {
  const pieces = paragraph.split(/(?<=[.!?…]["”’)\]]*)\s+(?=["“‘(]?[\p{Lu}\p{N}])/u)
  const out = []
  for (const piece of pieces) {
    const last = out[out.length - 1]
    if (last && ABBREVIATION.test(last)) out[out.length - 1] = `${last} ${piece}`
    else out.push(piece)
  }
  return out
}

function shorten(text, max = MAX_DESCRIPTION) {
  if (text.length <= max) return text
  const cut = text.slice(0, max - 1)
  const space = cut.lastIndexOf(' ')
  const trimmed = (space > 0 ? cut.slice(0, space) : cut).replace(/[\s,;:–—-]+$/, '')
  return `${trimmed}…`
}

// The CMS summary when filled in; otherwise the first sentence of the article,
// with following sentences added while it's under ~70 characters.
export function getPostDescription(frontmatter = {}, markdown = '') {
  const summary = clean(frontmatter.description)
  if (summary) return shorten(summary)

  let text = ''
  for (const paragraph of articleParagraphs(markdown, frontmatter)) {
    for (const sentence of sentences(paragraph)) {
      text = text ? `${text} ${sentence}` : sentence
      if (text.length >= MIN_DESCRIPTION) return shorten(text)
    }
  }
  return shorten(text)
}

// Absolute share image: the post's thumbnail, or the site logo.
export function getPostImage(frontmatter = {}) {
  const thumbnail = clean(frontmatter.thumbnail)
  return absoluteUrl(thumbnail || DEFAULT_SHARE_IMAGE)
}
