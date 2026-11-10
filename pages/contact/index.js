import Head from 'next/head'
import styles from './ContactPage.module.css'
import Contact from '../../components/Contact/Contact'

const ContactPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Contact | Eat the Strip</title>
      </Head>
      <h1>Suggest a spot or say hello</h1>
      <Contact />
    </div>
  )
}

export default ContactPage
