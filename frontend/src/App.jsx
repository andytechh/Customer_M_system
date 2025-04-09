import React from 'react'
import LoginReg from './Auth/LoginsReg'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Main_layout from './Layout/Main_layout'
import AdminLogin from './Auth/AdminLogin'
import Home from './pages/Home'
import Features from './pages/Features'
import Reviews from './pages/Reviews'
import Pricing from './pages/Pricing'
import Dashboard from './components/Dashboard'
import DashboardLayout from './Layout/Dashboard_Layout'
import Users from './components/Admin/Users'
import Customers from './components/Admin/Customers'
import Reports from './components/Admin/Reports'
import Settings from './components/Admin/Settings'
import Cust_Layout from './Layout/Cust_Layout'
import Profile from './components/Customer/Profile'
import ChatSupport from './components/Customer/ChatSupport'
import Orders from './components/Customer/Orders'
import SupportTickets from './components/Customer/SupportTickets'
import Customer_Dashboard from './components/Customer/Customer_Dashboard'


// import Login from './Auth/Login'
// import Register from './Auth/Register'

const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path='/' element={<Main_layout />}>
          <Route index element={<Home/>}/>
          <Route path='/features' element={<Features/>}/>
          <Route path='/reviews' element={<Reviews/>}/>
          <Route path='/pricing' element={<Pricing/>}/>
          <Route path='/admin-login' element={<AdminLogin />}/>
          <Route path='/customer-access' element={<LoginReg/>}/>

          </Route>
          <Route path="/" element={<DashboardLayout />}>
          <Route path='/dashboard' element={<Dashboard/>}/>
          <Route path="/admin-dashboard" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/Settings" element={<Settings />} />
          </Route>
          <Route path="/" element={<Cust_Layout />}>
          <Route path="/cust-dashboard" element={<Customer_Dashboard />} />
          <Route path="/c-dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/chat-support" element={<ChatSupport />} />
          <Route path="/my-orders" element={<Orders />} />
          <Route path="/support-tickets" element={<SupportTickets />} />
          <Route path="/u-settings" element={<Settings />} />
          </Route>
          {/* 404 Not Found */}
          <Route>
            <Route path="*" element={<h1>404 Not Found</h1>} />
          </Route>
        </Routes>
      </Router>
    </div>
  )
}

export default App
