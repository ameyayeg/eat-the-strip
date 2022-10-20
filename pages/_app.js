import '../styles/styles.css'
import Head from "next/head"

export default function MyApp({ Component, pageProps }) {
  return (
    <div>
      <Head>
        <title>Eat the Strip</title>
      </Head>
      <Component {...pageProps} />
    </div>
  )
}