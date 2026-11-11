// Listing pages show this many restaurants per page. 24 divides evenly into
// the grid's one, two and three columns.
export const PAGE_SIZE = 24

export function pageCount(total) {
  return Math.max(1, Math.ceil(total / PAGE_SIZE))
}

export function pageItems(items, page) {
  const start = (page - 1) * PAGE_SIZE
  return items.slice(start, start + PAGE_SIZE)
}

// Page 1 is the listing itself (/home); later pages are /home/page/2 etc.
export function pagePath(basePath, page) {
  return page === 1 ? basePath : `${basePath}/page/${page}`
}

// Page numbers that need their own route (2 and up).
export function extraPages(total) {
  return Array.from({ length: pageCount(total) - 1 }, (_, i) => i + 2)
}
