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

            <meta property="og:title" content="Eat the Strip" />
            <meta property="og:type" content="website" />
            <meta property="og:url" content="https://www.eatthestrip.com" />
            <meta
              property="og:image"
              content="https://eatthestrip.com/_ipx/w_1920,q_75/%2F_next%2Fstatic%2Fmedia%2Fpexels-makafood-8984408.a837cd84.jpg?url=%2F_next%2Fstatic%2Fmedia%2Fpexels-makafood-8984408.a837cd84.jpg&w=1920&q=75"
            />
          </Head>

          <Layout>{page}</Layout>
        </>
      )
    }

  return renderWithLayout(<Component {...pageProps} />)
}
