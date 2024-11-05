import './App.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';

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
import LoginModal from './Components/BootstrapModal/Login.Modal';
import RegistrationModal from './Components/BootstrapModal/Registration.Modal';
import ProfileModal from './Components/BootstrapModal/Profile.Modal';

function App() {
  const [scrollY, setScrollY] = useState(0);
  const [scrollHeight, setScrollHeight] = useState(0);

  const handleScroll = () => {
    setScrollY(window.scrollY);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    setScrollHeight(document.documentElement.scrollHeight - window.innerHeight);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollPercentage = (scrollY / scrollHeight) * 100;

  const homePage = <>
    <Home />
    <About />
    <Service />
    <Product title={"Our Equipment for Rent"} />
    <Galary />
    <Testimonials />
    <Contact />
  </>

  return (
    <>
      <Header />
      <BrowserRouter>
        <Routes>

          {/* LANDING PAGE */}
          <Route path="/" element={homePage} />
          <Route path="/:userId" element={<>
            {homePage} 
            <ProfileModal />
            </>} />

          {/* PRODUCT DETAILS PAGE WITHOUT USER */}
          <Route path="/productDetails/:P_ID" element={<ProductDetails />} />
          <Route path="/:userId/productDetails/:P_ID" element={<><ProductDetails /><ProfileModal /></>} />
        </Routes>
      </BrowserRouter>
      <Footer />

      <RegistrationModal />
      <LoginModal />
      {/* Scroll to Top Button */}
      <div className={`scroll-to-top ${scrollY > 200 ? 'visible' : ''}`} onClick={scrollToTop}>
        <div
          className="circle"
          style={{ borderColor: `rgba(255, 255, 255, ${scrollPercentage / 100})` }}
        >
          <div className="arrow">&#x25B2;</div>
        </div>
      </div>
    </>
  );
}

export default App;
