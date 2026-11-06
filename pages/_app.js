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
              content="Eat the Strip is our tribute to the mom-and-pop food joints peppered across the Ottawa-Gatineau and Fredericton suburbs."
            />
            <meta property="og:title" content="Eat the Strip" />
            <meta property="og:type" content="website" />
            <meta property="og:url" content="https://www.eatthestrip.com" />
            <meta
              property="og:image"
              content="https://eatthestrip.com/newlogo.png"
            />
          </Head>
          <Layout>{page}</Layout>
        </>
      )
    }

  // The favicon, AdSense and Google Analytics sit outside the layout so they
  // load on every page, including blog posts that use their own layout.
  return (
    <>
      <Head>
        <link rel="icon" href="/newlogo.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/newlogo.png" />
      </Head>
      {renderWithLayout(<Component {...pageProps} />)}
      <Script
        id="Adsense-id"
        data-ad-client="ca-pub-2447810247618678"
        async
        strategy="afterInteractive"
        onError={(e) => {
          console.error('Script failed to load', e)
        }}
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
      />
      <Script
        id="gtag-src"
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=G-S2M86NVLWK"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-S2M86NVLWK');
        `}
      </Script>
    </>
  )
}
