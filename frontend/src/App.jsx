import React from 'react'
import LoginReg from './Auth/LoginsReg'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Main_layout from './Layout/Main_layout'
import AdminLogin from './Auth/AdminLogin'
import Home from './components/landing/Home'
import Features from './components/landing/Features'
import Pricing from './components/landing/Pricing'
import Dashboard from './components/Dashboard'
import DashboardLayout from './Layout/Dashboard_Layout'
import Orders from './components/Admin/Orders'
import Customers from './components/Admin/Customers'
import Reports from './components/Admin/Reports'
import Settings from './components/Admin/Settings'
import Cust_Layout from './Layout/Cust_Layout'
import Profile from './components/Customer/Profile'
import Supports from './components/Admin/Supports'
import Users from './components/Admin/Users'
import Ai_recommendations from './components/Customer/Ai_recommendations'
import SupportTickets from './components/Customer/SupportTickets'
import ChatSupport from './components/Customer/ChatSupport'
import CTA from './components/landing/CTA'
import Products from './components/Admin/Products'
import Cart from './components/Customer/Cart'
import C_Home from './components/Customer/C_Home'
// import Login from './Auth/Login'
// import Register from './Auth/Register'

const App = () => {
  return (
    <div>
  <Router>
  <Routes>
  {/* Public Layout */}
  <Route path="/" element={<Main_layout />}>
    <Route index element={<Home />} />
    <Route path="/features" element={<Features />} />
    <Route path="/pricing" element={<Pricing />} />
    <Route path="/contact" element={<CTA/>} />
    <Route path="/admin-login" element={<AdminLogin />} />
    <Route path="/customer-access" element={<LoginReg />} />
  </Route>
  {/* Admin Dashboard Layout */}
  <Route path="/" element={<DashboardLayout />}>
  <Route path='/dashboard' element={<Dashboard/>}/>
  <Route path="/admin-dashboard" element={<Dashboard />} />
  <Route path="/users/:user_Id" element={<Users/>}/>
  <Route path="/customers" element={<Customers />} />
  <Route path="/products" element={<Products />} />
  <Route path="/reports" element={<Reports />} />
  <Route path="/Settings" element={<Settings />} />
  </Route>
  {/* Customer Layout */}
  <Route path="/" element={<Cust_Layout />}>
  <Route path="/c-dashboard" element={<C_Home />} />
  <Route path="/profile" element={<Profile />} />
  <Route path="/recommendations" element={<Ai_recommendations />} />
  <Route path="/chat-support" element={<ChatSupport />} />
  <Route path='/cart' element={<Cart />} />
  <Route path="/my-orders" element={<Orders />} />
  <Route path="/support-tickets" element={<SupportTickets />} />
  <Route path="/u-settings" element={<Settings />} />
  </Route>

  {/* 404 Not Found */}
  <Route path="*" element={<h1>404 Not Found</h1>} />
</Routes>
      </Router>
    </div>
  )
}

export default App
