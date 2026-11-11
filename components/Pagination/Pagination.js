import Link from 'next/link'
import styles from './Pagination.module.css'
import { pagePath } from '../../utils/pagination'

// Page numbers to show: all of them when there are few, otherwise the first,
// the last and the two either side of the current page, with gaps between.
function pageList(page, count) {
  if (count <= 7) return Array.from({ length: count }, (_, i) => i + 1)
  const keep = new Set([1, count, page - 1, page, page + 1])
  const list = []
  for (let n = 1; n <= count; n++) {
    if (keep.has(n)) list.push(n)
    else if (list[list.length - 1] !== 'gap') list.push('gap')
  }
  return list
}

const Pagination = ({ page, count, basePath }) => {
  if (count <= 1) return null
  return (
    <nav className={styles.pagination} aria-label="Pages">
      {page > 1 && (
        <Link href={pagePath(basePath, page - 1)}>
          <a className={styles.step} rel="prev">
            ← Previous
          </a>
        </Link>
      )}
      <ol className={styles.numbers}>
        {pageList(page, count).map((n, i) =>
          n === 'gap' ? (
            <li key={`gap-${i}`} className={styles.gap} aria-hidden="true">
              …
            </li>
          ) : (
            <li key={n}>
              {n === page ? (
                <span className={styles.current} aria-current="page">
                  {n}
                </span>
              ) : (
                <Link href={pagePath(basePath, n)}>
                  <a className={styles.number} aria-label={`Page ${n}`}>
                    {n}
                  </a>
                </Link>
              )}
            </li>
          )
        )}
      </ol>
      {page < count && (
        <Link href={pagePath(basePath, page + 1)}>
          <a className={styles.step} rel="next">
            Next →
          </a>
        </Link>
      )}
    </nav>
  )
}

export default Pagination
