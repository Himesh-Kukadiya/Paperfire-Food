import { useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import Header from './Components/Header'
import SideNavbar from './Components/SideNavbar';

function App() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle)
  }
  const dashboard = 
  <>
    <Header title={"DASHBOARD"} OpenSidebar={OpenSidebar}/>
  </>
  return (
    <>
      <SideNavbar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
      <BrowserRouter>
        <Routes>
          <Route path='/' element={dashboard}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
