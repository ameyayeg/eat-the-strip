import '../styles/globals.css'
import Head from 'next/head'
import Layout from '../components/Layouts/Layout'
import Script from 'next/script'

export default function MyApp({ Component, pageProps }) {
  const renderWithLayout =
    Component.getLayout ||
    function (page) {
      return (
        <>
          <Head>
            <title>Eat the Strip</title>
            <meta
              name="description"
              content="Eat the Strip is our tribute to the mom-and-pop food joints peppered across the Ottawa-Gatineau suburbs."
            />
            <meta property="og:title" content="Eat the Strip" />
            <meta property="og:type" content="website" />
            <meta property="og:url" content="https://www.eatthestrip.com" />
            <meta
              property="og:image"
              content="https://eatthestrip.com/_ipx/w_1920,q_75/%2F_next%2Fstatic%2Fmedia%2Fpexels-makafood-8984408.a837cd84.jpg?url=%2F_next%2Fstatic%2Fmedia%2Fpexels-makafood-8984408.a837cd84.jpg&w=1920&q=75"
            />
          </Head>
          <Script
            id="adsbygoogle-init"
            strategy="lazyOnload"
            crossOrigin="anonymous"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_GOOGLE_ADS_CLIENT_ID}`}
          />

          <Layout>{page}</Layout>
        </>
      )
    }

  return renderWithLayout(<Component {...pageProps} />)
}
