import styles from './About.module.css'
import Contact from '../../components/Contact/Contact'

const About = () => {
  return (
    <div className={styles.container}>
      <div className={styles.about}>
        <h2>
          Eat the Strip is our tribute to the mom-and-pop food joints tucked
          into the suburbs of Ottawa-Gatineau and Fredericton. We believe the
          people behind these restaurants, diners, and bars don’t get the
          recognition they deserve for shaping our local food culture. So we
          created a blog that shines a light exclusively on strip mall spots,
          industrial park eateries, and other hidden gems. 🧡
        </h2>
        <p>
          For too long, social media foodies and bloggers have overlooked these
          spots—often tucked away on the edges of the city. You won’t find
          reviews of downtown chain restaurants here. This blog is (almost)
          entirely dedicated to strip malls.
        </p>
        <blockquote className={styles.blockquote}>
          Strip mall: A retail complex consisting of stores or restaurants in
          adjacent spaces in one long building, typically having a narrow
          parking area directly in front of the stores.
          <span>Dictionary.com</span>
        </blockquote>
        <p>
          Eat the Strip is designed, developed, and maintained by Ameya
          Charnalia. The site wouldn’t have been possible without the technical
          mentorship of developers Brian Tavares, Mat Dupont, and Daniel Corner,
          as well as the support of Sergio Gonzalez—who also gave the site its
          name. Developers can check out the source code, built with Next.js and
          React,{' '}
          <a href="https://github.com/ameyayeg/eat-the-strip">
            <span style={{ borderBottom: '3px solid #78c0a8' }}>here.</span>
          </a>
        </p>
      </div>
      <div className={styles.formContainer}>
        <h2>Want to suggest a strip mall gem? Write to us!</h2>
        <Contact />
      </div>
    </div>
  )
}

export default About
