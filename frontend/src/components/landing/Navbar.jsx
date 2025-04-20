import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import LoginReg from '@/Auth/LoginsReg';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogin = (event) => {
    event.preventDefault(); 
    console.log('Navigating to /admin-login'); 
    navigate('/admin-login'); 
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <a href="/" className="flex items-center">
              <span className="text-2xl font-bold text-gradient">CatchCRM</span>
            </a>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <Link to="/" className="text-gray-700 hover:text-[#1CB5E0] px-3 py-2 rounded-md font-medium" >Home</Link>
              <Link to="/features" className="text-gray-700 hover:text-[#1CB5E0] px-3 py-2 rounded-md font-medium" >Features</Link>
              <Link to='/pricing' className="text-gray-700 hover:text-[#1CB5E0] px-3 py-2 rounded-md font-medium">
                Pricing
              </Link>
              <Link to="/contact" className="text-gray-700 hover:text-[#1CB5E0] px-3 py-2 rounded-md font-medium">
                Contact
              </Link>
              <Link  className="btn-secondary ml-4" to="/admin-login"  onClick={handleLogin}>
                Log in
              </Link>
            
              <Link to="/customer-access" className="btn-primary">
                Get Started
              </Link>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary hover:bg-gray-100 focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
            <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#1CB5E0] hover:bg-gray-100">
             Home
            </Link>
            <Link to="/features" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#1CB5E0] hover:bg-gray-100">
              Features
            </Link>
            <Link to="/pricing" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#1CB5E0] hover:bg-gray-100">
              Pricing
            </Link>
            <Link to="/contact" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#1CB5E0] hover:bg-gray-100">
              Contact
            </Link>
            <div className="flex space-x-2 mt-4 pt-2 border-t border-gray-200">
              <Link
                href="/admin-login" 
                onClick={handleLogin} 
                className="w-1/2 text-center btn-secondary text-sm"
              >
                Log in
              </Link>
              <a href="/signup" className="w-1/2 text-center btn-primary text-sm">
                Get Started
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;