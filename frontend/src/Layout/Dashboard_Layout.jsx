import React from 'react'
import {
  Search, LayoutGrid, Users, ShoppingBag, Bot,
  CircleHelp, MessageCircleWarning, Settings, Menu
} from 'lucide-react'
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false)
  const [overlay, setOverlay] = React.useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    navigate('/admin-login')
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
    setOverlay(!overlay)
  }

  const closeSidebar = () => {
    setSidebarOpen(false)
    setOverlay(false)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <div className='flex items-center gap-4 w-full'>
          <button onClick={toggleSidebar} className="md:hidden">
            <Menu className="text-gray-700" />
          </button>
          <h1 className="text-1xl font-semibold text-gray-800 flex-1 text-center md:text-left">
            Customer Management
          </h1>
          <div className='relative w-full max-w-sm hidden md:block'>
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black" size={15} />
            <input
              type="text"
              placeholder="Search customers..."
              className="w-full pl-10 pr-4 py-2 border bg-gray-300 border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
        <div className="space-x-4 hidden md:flex">
          <button className="text-gray-600 hover:text-indigo-600">Notifications</button>
          <button className="text-gray-600 hover:text-indigo-600">Profile</button>
        </div>
      </header>

      {/* Sidebar Backdrop for Mobile */}
      {overlay && <div className="fixed inset-0 bg-black opacity-50 z-40" onClick={closeSidebar}></div>}

      {/* Layout */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className={`bg-[#0E1336] shadow-md fixed md:static z-50 top-0 left-0 h-full w-64 transform transition-transform duration-200 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
          <nav className="h-[93vh] p-6 space-y-4 flex flex-col justify-between">
            <ul className="space-y-2">
              <NavItem to="/dashboard" icon={<LayoutGrid />} label="Dashboard" path={location.pathname} />
              <NavItem to="/users" icon={<Users />} label="Customers" path={location.pathname} />
              <NavItem to="/customers" icon={<ShoppingBag />} label="Orders" path={location.pathname} />
              <NavItem to="/reports" icon={<Bot />} label="AI Recommendations" path={location.pathname} />
              <NavItem to="/support" icon={<CircleHelp />} label="Chat Support" path={location.pathname} />
              <NavItem to="/report-issues" icon={<MessageCircleWarning />} label="Reports" path={location.pathname} />
              <NavItem to="/settings" icon={<Settings />} label="Settings" path={location.pathname} />
            </ul>
            <div className="mt-6 border-t pt-4">
              <p className="text-sm text-gray-400">Logged in as: <strong className='text-white'>Admin</strong></p>
              <button className="mt-2 text-red-600 hover:text-red-800" onClick={handleLogout}>Logout</button>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col ml-0 md:ml-64 h-full">
          <main className="flex flex-col p-6 overflow-auto items-center justify-center w-full">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}

const NavItem = ({ to, icon, label, path }) => {
  const isActive = path === to
  return (
    <li className={`flex items-center rounded-md p-2 hover:bg-gray-700 ${isActive ? 'bg-gray-700' : ''}`}>
      {React.cloneElement(icon, { className: 'text-white', size: 20 })}
      <Link to={to} className="text-gray-300 hover:text-indigo-500 ml-3 font-semibold">{label}</Link>
    </li>
  )
}

export default DashboardLayout
