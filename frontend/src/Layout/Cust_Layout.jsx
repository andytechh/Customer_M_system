import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import {
  Search, LayoutGrid, Users, ShoppingBag, Bot,
  CircleHelp, MessageCircleWarning, Settings, Menu, Bell, UserPen, ShoppingCart 
} from 'lucide-react';
import axios from 'axios';

const apiURL = "http://localhost/Customer_M_system/backend/api/indexLogin.php?action=";

const Cust_Layout = () => {
    const [user, setUser] = useState(false);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [overlay, setOverlay] = useState(false);
    const [user_Id, setUser_Id] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const searchQuery = searchParams.get('search') || '';

    const handleLogout = () => {
        localStorage.removeItem('user_id');
        navigate('/customer-access');
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
        setOverlay(!overlay);
    };

    const closeSidebar = () => {
        setSidebarOpen(false);
        setOverlay(false);
    };

    const handleSearchChange = (e) => {
        const query = e.target.value;
        const newParams = new URLSearchParams(searchParams);
        
        if (query) {
            newParams.set('search', query);
        } else {
            newParams.delete('search');
        }
        
        setSearchParams(newParams);
    };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userId = localStorage.getItem('userId');
                const response = await axios.get(`${apiURL}user`, {
                    params: { user_id: userId }
                });

                if (!response.data.error) {
                    setUser(response.data); 
                } else {
                    alert(response.data.message || "No user found");
                }
            } catch (error) {
                console.error("Error fetching user:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
        const userId = localStorage.getItem('userId');
        setUser_Id(userId);
    }, []);

return (
<div className="flex flex-col min-h-screen h-screen bg-gray-100 overflow-hidden">
  {/* Header */}
  <header className="bg-white shadow p-4 flex justify-between items-center h-16">
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
                  placeholder="Search on Techzio..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full pl-10 pr-4 py-2 border bg-gray-300 border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
          </div>
      </div>
      <div className="space-x-4 hidden md:flex">
          <button className="text-gray-600 hover:text-indigo-600 ml-4"><Bell /></button>
          <button className="text-gray-600 hover:text-indigo-600"><UserPen /></button>
      </div>
  </header>
{overlay && <div className="fixed inset-0 bg-black opacity-50 z-40" onClick={closeSidebar}></div>}

<div className="flex flex-1 h-[calc(100vh-4rem)] overflow-hidden">
  {/* Sidebar */}
  <aside className={`bg-[#0E1336] shadow-md fixed md:static z-50 top-0 left-0 h-full w-64 transform transition-transform duration-200 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
      <nav className="h-[93vh] p-6 space-y-4 flex flex-col justify-between">
          <ul className="space-y-2">
              <NavItem to="/c-dashboard" icon={<LayoutGrid />} label="Dashboard" path={location.pathname} />
              <NavItem to="/my-orders" icon={<ShoppingBag />} label="Orders" path={location.pathname} />
              <NavItem to="/cart" icon={<ShoppingCart />} label="Cart" path={location.pathname} />
              <NavItem to="/chat-support" icon={<CircleHelp />} label="Chat Support" path={location.pathname} />
              <NavItem to="/support-tickets" icon={<MessageCircleWarning />} label="Reports" path={location.pathname} />
              <NavItem to="/u-settings" icon={<Settings />} label="Settings" path={location.pathname} />
          </ul>
          <div className="mt-6 border-t pt-4">
              <p className="text-sm text-gray-400">Logged in as: </p>
              {loading ? (
                  <p>Loading...</p>
              ) : !user ? (
                  <p>User not found.</p>
              ) : (
                  <p className="text-2xl max-w-40 w-full text-white">
                      <strong className="text-white">{user.uname}</strong>
                  </p>
              )}
              <button className="mt-2 text-red-600 hover:text-red-800" onClick={handleLogout}>Logout</button>
          </div>
      </nav>
  </aside>

  {/* Main Content */}
  <div className="flex-1 flex flex-col overflow-y-auto">
      <main className="flex-1 p-6 w-full mx-auto">
          <Outlet />
      </main>
  </div>
</div>
</div>
);
};

const NavItem = ({ to, icon, label, path }) => {
    const isActive = path === to;
    return (
        <li className={`flex items-center rounded-md p-2 hover:bg-gray-700 ${isActive ? 'bg-gray-700' : ''}`}>
            {React.cloneElement(icon, { className: 'text-[#1CB5E0]', size: 20 })}
            <Link to={to} className="text-gray-300 hover:text-[#1CB5E0] ml-3 font-semibold">{label}</Link>
        </li>
    );
};

export default Cust_Layout;