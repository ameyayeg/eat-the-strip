import Head from 'next/head'
import Link from 'next/link'
import styles from './Success.module.css'

// Netlify Forms shows this page after the contact form is sent.
const Success = () => {
  return (
    <div className={styles.card}>
      <Head>
        <title>Thanks | Eat the Strip</title>
        <meta name="robots" content="noindex" />
      </Head>
      <h1>Thanks for writing!</h1>
      <p className={styles.text}>
        Your message is in. We read every one and add the good suggestions to
        our list. We can't reply to everyone, but we'll be in touch if we have
        questions.
      </p>
      <div className={styles.actions}>
        <Link href="/home">
          <a className={styles.primary}>Back to Eat the Strip</a>
        </Link>
        <Link href="/contact">
          <a className={styles.secondary}>Send another message</a>
        </Link>
      </div>
    </div>
  )
}

export default Success
