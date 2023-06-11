import styles from './About.module.css'
import Contact from '../../components/Contact/Contact'

const About = () => {
  return (
    <div className={styles.container}>
      <div className={styles.about}>
        <h2>
          Eat the Strip is our tribute to the mom-and-pop food joints peppered
          across the Ottawa-Gatineau suburbs. We feel the folks who run these
          restaurants, diners and bars don't get the credit they deserve for
          contributing to our city's food culture. So, we created a review blog
          that only caters to strip mall gems. 🧡
        </h2>
        <p>
          For too long social media foodies and bloggers have overlooked these
          establishments, which tend to be tucked away in the periphery of the
          city. No, here you won't find any reviews or features of chain
          restaurants downtown. Here, it's 100 per cent strip malls.
        </p>
        <blockquote className={styles.blockquote}>
          Strip mall: A retail complex consisting of stores or restaurants in
          adjacent spaces in one long building, typically having a narrow
          parking area directly in front of the stores.
          <span>Dictionary.com</span>
        </blockquote>
        <p>
          Eat the Strip is designed, developed and run by Ameya Charnalia, an
          Ottawa-based Javascript developer, former parliamentary staffer and
          recovering journalist. All reviews are written by him, with
          contributions from his friends and family. This site would not have
          been possible without the technical mentorship of Ottawa-area
          developers Mat Dupont and Daniel Corner. Developers can see the source
          code, built in React and Next JS,{' '}
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
