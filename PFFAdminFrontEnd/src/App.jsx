import { useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import Header from './Components/Header'
import SideNavbar from './Components/SideNavbar';
import Dashboard from './Components/Dashboard';
import Products from './Components/Products';

function App() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle)
  }

  return (
    <div className='grid-container'>
      <SideNavbar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
      <BrowserRouter>
        <Routes>
          <Route path='/' element={
            <>
              <Header title={"DASHBOARD"} OpenSidebar={OpenSidebar}/>
              <Dashboard />
            </>
          }/>
          <Route path='/Products' element={
            <>
              <Header title={"PRODUCTS"} OpenSidebar={OpenSidebar}/>
              <Products />
            </>
          }/>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
