import React from 'react'
import Head from 'next/head'
import styles from './Privacy.module.css'

const Privacy = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Privacy Policy | Eat the Strip</title>
      </Head>
      <h1>Privacy Policy</h1>
      <p>
        <em>Last updated: November 7, 2026</em>
      </p>
      <p>
        Eat the Strip collects very little about you: an email address if you
        join the newsletter, a message if you write to us, and ordinary visit
        statistics and ad cookies from Google. This page says what we collect,
        why, and who else handles it.
      </p>
      <p>
        <strong>Who we are.</strong> Eat the Strip is a food blog about
        family-run restaurants in strip malls across Ottawa-Gatineau and
        Fredericton, written and run by Ameya Charnalia in Ottawa, Ontario. You
        can reach us at contact@eatthestrip.com.
      </p>

      <h2>What we collect and why</h2>
      <p>
        <strong>Newsletter.</strong> If you subscribe, we collect your email
        address and the time you signed up. We email you a confirmation link
        first, and you are only added once you click it. Our newsletter service,
        MailerLite, also records whether you open our emails and click links, so
        we can see what readers enjoy. Every email has an unsubscribe link. We
        use your address only to send the newsletter.
      </p>
      <p>
        <strong>Messages to us.</strong> If you use the contact form on the
        About page, we collect the name, email address and message you type. If
        you email contact@eatthestrip.com or use the “Email us” link under a
        post, we receive your email and whatever you put in it. We use it to
        reply and to consider restaurant suggestions, which we may record in a
        private spreadsheet with your name or email so we can follow up. Contact
        form messages are stored by our web host and emailed to us. Email sent
        to contact@eatthestrip.com passes through an email forwarding service to
        our inbox.
      </p>
      <p>
        <strong>Visit statistics.</strong> We use Google Analytics to see which
        pages are read, roughly where readers are, what device and browser they
        use, and how they found us. It sets cookies that last up to 400 days.
        Google Analytics does not store your IP address. We keep this data for
        14 months.
      </p>
      <p>
        <strong>Ads.</strong> The site shows ads through Google AdSense. Google
        and its advertising partners may use cookies and similar technology to
        show ads, including personalized ads, and to measure and prevent fraud.
        We do not sell your personal information ourselves. Under some US state
        laws, ad personalization counts as “sharing”, which is why visitors in
        those states see a “Do Not Sell or Share My Personal Information” link.
      </p>
      <p>
        <strong>Fonts, maps and images from other servers.</strong> Our pages
        load fonts from Google Fonts, map tiles from OpenStreetMap, map icons
        from unpkg, and the Ko-fi button image from Ko-fi. Those services see
        your IP address and browser details when your browser asks them for
        these files.
      </p>

      <h2>Cookies and your choices</h2>
      <p>
        The site sets cookies to count visits (Google Analytics, up to 400
        days), to remember your consent choice (Google's consent tool, about a
        year), and to show and measure ads and check that your browser accepts
        cookies (Google AdSense). Google's advertising partners may set more
        cookies when ads are shown.
      </p>
      <ul>
        <li>
          <strong>Europe, the UK and Switzerland:</strong> a banner asks for
          your consent. You can choose Consent, Do not consent, or Manage
          options. Until a settings link is added to our footer, you can reset
          your choice by clearing this site's cookies in your browser.
        </li>
        <li>
          <strong>US states with privacy laws:</strong> a “Do Not Sell or Share
          My Personal Information” link lets you opt out of personalized ads.
        </li>
        <li>
          <strong>Everyone:</strong> you can block or delete cookies in your
          browser, turn off personalized ads in Google's Ads Settings
          (adssettings.google.com), and use Google's Analytics opt-out browser
          add-on (tools.google.com/dlpage/gaoptout).
        </li>
        <li>
          <strong>Canada, including Quebec:</strong> analytics and ads run
          without a banner. If you would rather they didn't, use the tools
          above, or email us and we will help.
        </li>
      </ul>

      <h2>Outside Canada</h2>
      <p>
        Some of the services described above are based in, or store data in, the
        United States or Europe, so your information may be processed outside
        Canada. Each has its own privacy policy.
      </p>

      <h2>How long we keep it</h2>
      <p>
        Newsletter addresses stay until you unsubscribe. MailerLite then keeps a
        record that you opted out, so we never email you again, and we can ask
        for it to be erased fully if you want that. We keep messages for as long
        as they are useful for replying or considering a suggestion, and delete
        them on request. Analytics data is kept for 14 months.
      </p>

      <h2>Your rights</h2>
      <p>
        You can ask us to show you, correct or delete the information we hold
        about you, or withdraw your consent, by emailing
        contact@eatthestrip.com. You can unsubscribe from the newsletter at any
        time with the link in any email. We send marketing email only with your
        consent, as Canada's anti-spam law requires. If you are unhappy with how
        we handle your information, you can contact the Office of the Privacy
        Commissioner of Canada (priv.gc.ca), or, if you live in Quebec, the
        Commission d'accès à l'information du Québec (cai.gouv.qc.ca).
      </p>

      <h2>Children</h2>
      <p>
        Eat the Strip is not aimed at children under 13, and we do not knowingly
        collect their information.
      </p>

      <h2>Security and other sites</h2>
      <p>
        We take reasonable steps to protect your information, but no website or
        email system is perfectly secure. Links to Instagram, YouTube, Ko-fi and
        other sites take you away from ours, and their privacy policies apply
        there.
      </p>

      <h2>Changes</h2>
      <p>
        If we change this policy, we will update the date at the top. Questions
        are welcome at contact@eatthestrip.com.
      </p>
    </div>
  )
}

export default Privacy
