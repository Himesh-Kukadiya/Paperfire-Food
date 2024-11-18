import { useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import Header from './Components/Header'
import SideNavbar from './Components/SideNavbar';
import Dashboard from './Components/Dashboard';

function App() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle)
  }
  const dashboard = 
  <>
    <Header title={"DASHBOARD"} OpenSidebar={OpenSidebar}/>
    <Dashboard />
  </>
  return (
    <div className='grid-container'>
      <SideNavbar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
      <BrowserRouter>
        <Routes>
          <Route path='/' element={dashboard}/>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
