import Head from 'next/head'
import styles from './Newsletter.module.css'
import Subscribe from '../../components/Subscribe'

const Newsletter = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Newsletter | Eat the Strip</title>
        <meta
          name="description"
          content="Get the weekly Eat the Strip newsletter: new strip mall gems from Ottawa-Gatineau and Fredericton, straight to your inbox."
        />
      </Head>
      <div className={styles.pitch}>
        <h1>The Eat the Strip newsletter</h1>
        <p>
          Once a week, we send you the latest mom-and-pop spots we’ve found
          tucked into strip malls and industrial parks across Ottawa-Gatineau
          and Fredericton. Expect new reviews, the dishes worth driving across
          town for, and the people behind them. 🧡
        </p>
        <p>No spam. Unsubscribe anytime.</p>
      </div>
      <div className={styles.formContainer}>
        <Subscribe
          label="Your email"
          successMessage="Almost there! Check your inbox to confirm your subscription."
          large
        />
      </div>
    </div>
  )
}

export default Newsletter
