import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import Header from './Components/Header'
import SideNavbar from './Components/SideNavbar';
import Dashboard from './Components/Dashboard';
import Products from './Components/Products';
import Orders from './Components/Orders';
import axios from 'axios';
import Users from './Components/Users';

function App() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const [newPendingOrdersCnt, setNewPendingOrdersCnt] = useState(0)
  useEffect(() => {
    axios.get("http://localhost:7575/api/admin/getCounterOfPendingOrders")
    .then(response => setNewPendingOrdersCnt(response.data.count))
    .catch(error => console.error(`Error while fetching new pending orders count: ${error}`))
  })
  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle)
  }

  return (
    <div className='grid-container'>
      <SideNavbar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} newOrderCount={newPendingOrdersCnt} />
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
          <Route path='/Orders&Rents' element={
            <>
              <Header title={"ORDERS & RENTS"} OpenSidebar={OpenSidebar}/>
              <Orders />
            </>
          } />
          <Route path="/users" element={
            <>
              <Header title="System Users" OpenSidebar={OpenSidebar} />
              <Users />
            </>
          } />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
