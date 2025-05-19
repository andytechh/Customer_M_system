import React, { useState, useEffect } from 'react'
import {
  Search, LayoutGrid, Users, ShoppingBag, Bot,
  CircleHelp, MessageCircleWarning, Settings, Menu, Bell, UserPen, ShoppingCart 
} from 'lucide-react'
import { Outlet, Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom'

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [overlay, setOverlay] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchQuery, setSearchQuery] = useState('')

  // Handle search input changes
  const handleSearchChange = (e) => {
    const query = e.target.value
    setSearchQuery(query)
    const newParams = new URLSearchParams(searchParams)
    
    if (query) {
      newParams.set('search', query)
    } else {
      newParams.delete('search')
    }
    
    setSearchParams(newParams)
  }

  // Sync search query with URL parameter
  useEffect(() => {
    const query = searchParams.get('search') || ''
    setSearchQuery(query)
  }, [location.search])

  const handleLogout = () => {
    navigate('/customer-access')
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
    <div className="flex flex-col min-h-screen h-screen bg-gray-100 overflow-hidden">
      {/* Header */}
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <div className='flex items-center gap-4 w-full'>
          <button onClick={toggleSidebar} className="md:hidden">
            <Menu className="text-gray-700" />
          </button>
          <h1 className="text-2xl flex-1 font-bold text-gradient text-center md:text-left">
            Techzio Dashboard
          </h1>
          <div className='relative w-full max-w-sm hidden md:block'>
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black" size={15} />
            <input
              type="text"
              placeholder="Search customers..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 border bg-gray-300 border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
        <div className="space-x-4 hidden md:flex">
          <button className="text-gray-600 hover:text-indigo-600 ml-4"><Bell /></button>
          <button className="text-gray-600 hover:text-indigo-600"><UserPen /></button>
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
              <NavItem to="/customers" icon={<Users />} label="Customers" path={location.pathname} />
              <NavItem to="/manage-orders" icon={<ShoppingBag />} label="Orders" path={location.pathname} />
              <NavItem to="/products" icon={<ShoppingCart />} label="Products" path={location.pathname} />
              <NavItem to="/support" icon={<CircleHelp />} label="Chat Support" path={location.pathname} />
              <NavItem to="/reports" icon={<MessageCircleWarning />} label="Reports" path={location.pathname} />
              <NavItem to="/settings" icon={<Settings />} label="Settings" path={location.pathname} />
            </ul>
            <div className="mt-6 border-t pt-4">
              <p className="text-sm text-gray-400">Logged in as: <strong className='text-white'>Admin</strong></p>
              <button className="mt-2 text-red-600 hover:text-red-800" onClick={handleLogout}>Logout</button>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          <main className="flex-1 p-6 w-full mx-auto">
            <Outlet context={[searchQuery]} />
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
      {React.cloneElement(icon, { className: 'text-[#1CB5E0]', size: 20 })}
      <Link to={to} className="text-gray-300 hover:text-[#1CB5E0] ml-3 font-semibold">{label}</Link>
    </li>
  )
}

// Example Customers Component using the search
const Customers = () => {
  const [customers, setCustomers] = useState([])
  const [filteredCustomers, setFilteredCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const searchQuery = searchParams.get('search') || ''

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await fetch('/api/customers')
        if (!response.ok) throw new Error('Failed to fetch')
        const data = await response.json()
        setCustomers(data)
        setFilteredCustomers(filterCustomers(data, searchQuery))
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchCustomers()
  }, [])

  useEffect(() => {
    setFilteredCustomers(filterCustomers(customers, searchQuery))
  }, [searchQuery])

  const filterCustomers = (customers, query) => {
    return customers.filter(customer =>
      Object.values(customer).some(value =>
        value.toString().toLowerCase().includes(query.toLowerCase()))
      )
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Customer List</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.map(customer => (
          <div key={customer.id} className="border p-4 rounded-lg">
            <h3 className="font-bold text-lg">{customer.name}</h3>
            <p className="text-gray-600">{customer.email}</p>
            <p className="text-sm text-gray-500">{customer.phone}</p>
          </div>
        ))}
        {filteredCustomers.length === 0 && (
          <div className="col-span-full text-center py-8 text-gray-500">
            No customers found matching your search
          </div>
        )}
      </div>
    </div>
  )
}

export default DashboardLayout