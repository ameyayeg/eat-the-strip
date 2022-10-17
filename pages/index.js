import Head from "next/head"
import Image from "next/image"
import { attributes, react as HomeContent } from '../content/home.md'
import Nav from "../components/Nav"
import styles from '../styles/Home.module.css'


const Home = () => {
  const { title, cats } = attributes;
  return ( 
    <div>
      <Head>
        <title>Eat the Strip</title>
        <script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>
      </Head>
      <Nav/>
      <section className={styles.container}>
      {cats.map((cat, k) => (
              <li key={k}>
                <h2>{cat.name}</h2>
                <p>{cat.description}</p>
              </li>
            ))}
      </section>
    </div>
   );
}
 
export default Home;
