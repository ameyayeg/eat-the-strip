import Nav from "../components/Nav"
import Footer from "../components/Footer"


const Layout = ({ children }) => {
    return ( 
        <>
            <Nav/>
            <main>{children}</main>
            <Footer/>
        </>
     );
}
 
export default Layout;