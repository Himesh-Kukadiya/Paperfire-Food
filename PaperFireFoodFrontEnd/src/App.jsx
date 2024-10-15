import './App.css'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Header from './Components/Header';
import Home from './Components/Home';
import About from './Components/About';
import Service from './Components/Service';
import Product from './Components/Product';
import Galary from './Components/Gallary';
import Testimonials from './Components/Testimonials';
import Contact from './Components/Contact';
import Footer from './Components/Footer';
import ProductDetails from './Components/ProductDetails';

function App() {

  return (
    <>
      <Header />
        <BrowserRouter>
          <Routes>
            {/* LANDING PAGE */}
            <Route path='/' element={
              <>
                <Home />
                <About />
                <Service />
                <Product title={"Our Equipment for Rent"} />
                <Galary />
                <Testimonials />
                <Contact />
              </>
            } />
            
            {/* PRODUCT DETAILS PAGE */}
            <Route path='/ProductDetails/:P_ID' element={
              <>
                <ProductDetails />
              </>
            } />
            
          </Routes>
        </BrowserRouter>
      <Footer />
    </>
  )
}

export default App
