import { useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import Header from './Components/Header'

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
      <BrowserRouter>
        <Routes>
          <Route path='/' element={dashboard}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
