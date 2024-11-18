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
import CartList from './Components/CartList';
import OrderHistory from './Components/OrderHistory';

function App() {
  const userData = JSON.parse(localStorage.getItem('userDataPFF'));
  const { pathname } = window.location;
  if (pathname === "/" && userData) {
    window.location = `/${userData._id}`;
  }
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

  const [cart, setCart] = useState([]);

  useEffect(() => {
    const cartItems = JSON.parse(localStorage.getItem('cartPFF'));
    setCart(cartItems || []);
  }, []);

  const addToCart = (product) => {
    const existingProduct = cart.find((p) => p._id === product._id);

    let updatedCart;
    if (existingProduct) {
      updatedCart = cart.map((p) =>
        p._id === product._id ? { ...p, quantity: product.quantity } : p
      );
    } else {
      updatedCart = [...cart, { ...product, }];
    }

    setCart(updatedCart);
    localStorage.setItem('cartPFF', JSON.stringify(updatedCart));
  };

  const updateQuantity = (product, quantityChange) => {
    const updatedCart = cart.map((p) => {
      if (p._id === product._id) {
        const newQuantity = p.quantity + quantityChange;
        return { ...p, quantity: Math.max(1, newQuantity) };
      }
      return p;
    });

    setCart(updatedCart);
    localStorage.setItem('cartPFF', JSON.stringify(updatedCart));
  };

  const removeFromCart = (product) => {
    const updatedCart = cart.filter((p) => p._id !== product._id);
    setCart(updatedCart);
    localStorage.setItem('cartPFF', JSON.stringify(updatedCart));
  };

  const carts = <>
  <ProfileModal />
  <CartList cartItems={cart} updateQuantity={updateQuantity} removeFromCart={removeFromCart} />
</>

  const homePage =
    <>
      <Home />
      <About />
      <Service />
      <Product title={"Our Equipment for Rent"} />
      <Galary />
      <Testimonials />
      <Contact />
      {carts}
    </>

  return (
    <>
      <Header addToCart={addToCart} removeFromCart={removeFromCart} updateQuantity={updateQuantity} />
      <BrowserRouter>
        <Routes>
          {/* LANDING PAGE */}
          <Route path="/" element={homePage} />
          <Route path="/:userId" element={
            <>
              {homePage}
              
            </>
          } />

          {/* PRODUCT DETAILS PAGE WITHOUT USER */}
          <Route path="/productDetails/:P_ID" element={<ProductDetails addToCart={addToCart} />} />
          <Route path="/:userId/productDetails/:P_ID" element={
            <>
              <ProductDetails addToCart={addToCart} />
              {carts}
            </>
          } />
          <Route path='/:userId/orderHistory/' element={
            <>
              <OrderHistory />
              {carts}
            </>
          } />
        </Routes>
      </BrowserRouter>
      <Footer />

      <RegistrationModal />
      <LoginModal />
      {/* Scroll to Top Button */}
      <div className={`scroll-to-top ${scrollY > 200 ? 'visible' : ''}`} onClick={scrollToTop}>
        <div className="circle" style={{ borderColor: `rgba(255, 255, 255, ${scrollPercentage / 100})` }}>
          <div className="arrow">&#x25B2;</div>
        </div>
      </div>
    </>
  );
}

export default App;
