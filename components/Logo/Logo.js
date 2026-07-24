import React from 'react'
import styles from './Logo.module.css'

const Logo = ({ variant = 'wordmark-compact' }) => {
  if (variant === 'stacked') {
    return (
      <div className={styles.stacked}>
        <div className={styles.mark}>E</div>
        <div className={styles.text}>
          <div className={styles.title}>Eat the Strip</div>
          <div className={styles.tag}>Local food stories</div>
        </div>
      </div>
    )
  }

  if (variant === 'icon') {
    return (
      <div className={styles.iconWrap} aria-hidden="true">
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={styles.icon}
        >
          <path d="M3 12c0-3 4-5 9-5s9 2 9 5-4 5-9 5S3 15 3 12z" fill="#111" />
        </svg>
      </div>
    )
  }

  // default: compact wordmark
  return (
    <div className={styles.wordmark}>
      <span className={styles.title}>Eat the Strip</span>
    </div>
  )
}

export default Logo
