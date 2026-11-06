import styles from './SupportBox.module.css'

// Ko-fi support card shown at the end of every blog post.
const SupportBox = () => (
  <aside className={styles.box} aria-label="Support Eat the Strip">
    <p className={styles.text}>
      If this guide helped you find a great meal, you can back Eat the Strip
      every month on Ko-fi. It pays for the gas and the lunches.
    </p>
    <a
      className={styles.button}
      href="https://ko-fi.com/eatthestrip"
      target="_blank"
      rel="noopener noreferrer"
    >
      Support us on Ko-fi
      <span className={styles.srOnly}> (opens in a new tab)</span>
    </a>
  </aside>
)

export default SupportBox
