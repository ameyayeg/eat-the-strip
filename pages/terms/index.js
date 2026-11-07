import React from 'react'
import Head from 'next/head'
import styles from './Terms.module.css'

const Terms = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Terms of Use | Eat the Strip</title>
      </Head>
      <h1>Terms of Use</h1>
      <p>
        <em>Last updated: November 7, 2026</em>
      </p>
      <p>
        By using eatthestrip.com you agree to these terms. If you don't agree,
        please don't use the site.
      </p>
      <p>
        <strong>What the site is.</strong> Eat the Strip is a personal food
        blog. Our reviews are our own opinions and experiences, written as
        honestly as we can. We pay for our own meals and don't run sponsored
        posts. If that ever changes, we will label it clearly.
      </p>
      <p>
        <strong>Check before you go.</strong> Hours, prices, menus and locations
        change, and restaurants close or move. We do our best to keep posts
        accurate, but we can't promise they are current. Please check with the
        restaurant before you travel, and tell us about corrections at
        contact@eatthestrip.com. We aren't responsible for a wasted trip.
      </p>
      <p>
        <strong>Our content.</strong> The writing, photos, logo and design of
        this site belong to Eat the Strip, unless a post says otherwise. You may
        quote a short excerpt with credit and a link back to the post. Please
        don't copy whole posts or photos, or use them commercially, without
        asking first.
      </p>
      <p>
        <strong>Linking to us.</strong> You are welcome to link to any page of
        the site. Please don't suggest that we endorse you or your product.
      </p>
      <p>
        <strong>Ads and other sites.</strong> The site shows ads and links to
        other sites, including Ko-fi, Instagram and YouTube. Ads and links are
        not endorsements, and we don't control other sites or what they say.
      </p>
      <p>
        <strong>Supporting us on Ko-fi.</strong> Support is voluntary and
        handled by Ko-fi under its own terms. It does not buy coverage or
        influence what we write.
      </p>
      <p>
        <strong>Messages you send us.</strong> If you send us a restaurant
        suggestion or a message, we may use it to decide what to visit. We won't
        publish your message or your name without asking you first.
      </p>
      <p>
        <strong>Using the site properly.</strong> Please don't try to break,
        overload or scrape the site, and don't send spam through the sign-up or
        contact forms. We may block access if you do.
      </p>
      <p>
        <strong>No guarantees.</strong> The site is provided as it is, with no
        promise that it will always be available or free of errors. To the
        extent the law allows, we aren't liable for losses that come from using
        the site or relying on a post. Nothing here limits any right you have
        that the law doesn't allow us to limit.
      </p>
      <p>
        <strong>Governing law.</strong> These terms are governed by the laws of
        Ontario and the federal laws of Canada that apply there.
      </p>
      <p>
        <strong>Changes.</strong> We may update these terms from time to time
        and will change the date above when we do. If you keep using the site
        after that, you accept the new version.
      </p>
      <p>
        <strong>Contact.</strong> Questions about these terms are welcome at
        contact@eatthestrip.com.
      </p>
    </div>
  )
}

export default Terms
