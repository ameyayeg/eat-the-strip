import '../styles/styles.css'
import Head from "next/head"

export default function MyApp({ Component, pageProps }) {
  return (
    <div>
      <Head>
        <title>Eat the Strip</title>
        <script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>
      </Head>
      <Component {...pageProps} />
    </div>
  )
}