import styles from "../styles/About.module.css";
import Contact from "../components/Contact";

const About = () => {
  return (
    <div className={styles.container}>
      <div className={styles.about}>
        <h2>
          Eat the Strip is our tribute to the mom-and-pop food joints peppered
          across Ottawa's suburbs. We feel the folks who run these restaurants,
          diners and bars don't get the credit they deserve for contributing to
          our city's food culture. So, we created a restaurant review blog that
          only caters to strip mall gems. 🧡
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
          All reviews have been written by Ameya Charnalia, Danielle Jeffery and
          their friends. Eat the Strip was designed and developed by Ameya, an
          Ottawa-based Javascript developer, former parliamentary staffer and
          recovering journalist. We would like also like to thank Mat Dupont and
          Daniel Corner for their help and mentorship in building the website.
          Developers can see the source code, built in React and Next JS,{" "}
          <a href="https://github.com/ameyayeg/eat-the-strip">
            <span style={{ borderBottom: "3px solid #78c0a8" }}>here.</span>
          </a>
        </p>
      </div>
      <div className={styles.formContainer}>
        <h2>Want to suggest a strip mall gem? Write to us!</h2>
        <Contact />
      </div>
    </div>
  );
};

export default About;
