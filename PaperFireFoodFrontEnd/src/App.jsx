import './App.css'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import Header from './Components/Header';
import Home from './Components/Home';
import About from './Components/About';
import Product from './Components/Product';
import Galary from './Components/Galary';
import Testimonials from './Components/Testimonials';
import Contact from './Components/Contact';
import Footer from './Components/Footer';
import Service from './Components/Service';

function App() {

  return (
    <>
      <Header />
      <Home />
      <About />
      <Service />
      <Product />
      <Galary />
      <Testimonials />
      <Contact />
      <Footer />
    </>
  )
}

export default App
