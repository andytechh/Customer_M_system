import React from 'react'
import { Outlet, Link, useNavigate } from 'react-router-dom'

const Cust_Layout = () => {
    const [user, isUser] = React.useState(false)
    const [loading, setLoading] = React.useState(true)
    const navigate = useNavigate()
    const handleLogout = () => {
      navigate('/admin-login')
    }
    return (
      <div className="flex min-h-screen bg-gray-100">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-md">
          <nav className="h-full p-6 space-y-4">
            <img src="src/assets/solo.jpg" className='rounded-full w-30 h-30' alt="pfp" />
            <h2 className="text-xl font-bold text-indigo-600 mb-4">Customer Name</h2>
            <ul className="space-y-2">
              <li><Link  to="/c-dashboard" className="text-gray-700 hover:text-indigo-500">Dashboard</Link></li>
              <li><Link  to="/profile" className="text-gray-700 hover:text-indigo-500">Profile</Link></li>
              <li><Link  to="/chat-support" className="text-gray-700 hover:text-indigo-500">Chat Support</Link></li>
              <li><Link  to="/my-orders"  className="text-gray-700 hover:text-indigo-500">My Orders</Link></li>
              <li><Link  to="/support-tickets"  className="text-gray-700 hover:text-indigo-500">Support Tickets</Link></li>
              <li><Link  to="/u-settings"  className="text-gray-700 hover:text-indigo-500">Settings</Link></li>
            </ul>
            <div className="mt-6 border-t pt-4">
              <p className="text-sm text-gray-500">Logged in as: <strong>Customer</strong></p>
              <button className="mt-2 text-red-600 hover:text-red-800 " onClick={handleLogout}>Logout</button>
            </div>
          </nav>
        </aside>
  
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-white shadow p-4 flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-800">Customer Panel</h1>
            <div className="space-x-4">
              <button className="text-gray-600 hover:text-indigo-600">Notifications</button>
              <button className="text-gray-600 hover:text-indigo-600">Profile</button>
            </div>
          </header>
  
          {/* Main Content */}
          <main className="flex-1 p-6">
            <Outlet />
          </main>
  
          {/* Footer */}
          <footer className="bg-white p-4 text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Customer Management System. All rights reserved.
          </footer>
        </div>
      </div>
    )
}

export default Cust_Layout
