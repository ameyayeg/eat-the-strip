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
            <meta
              name="description"
              content=" Eat the Strip is our tribute to the mom-and-pop food joints peppered
              across Ottawa's suburbs."
            />
          </Head>

          <Layout>{page}</Layout>
        </>
      )
    }

  return renderWithLayout(<Component {...pageProps} />)
}
