import '../styles/styles.css'
import Head from "next/head"
import Layout from '../components/Layout'

export default function MyApp({ Component, pageProps }) {
  return (
    <div>
      <Head>
        <title>Eat the Strip</title>
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </div>
  )
}