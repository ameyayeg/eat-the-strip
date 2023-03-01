import '../styles/styles.css'
import Head from 'next/head'
import Layout from '../components/Layout'

export default function MyApp({ Component, pageProps }) {
  const renderWithLayout =
    Component.getLayout ||
    function (page) {
      return (
        <>
          <Head>
            <title>Eat the Strip</title>
            <link rel="shortcut icon" href="/favicon.ico" />
          </Head>

          <Layout>{page}</Layout>
        </>
      )
    }

  return renderWithLayout(<Component {...pageProps} />)
}
