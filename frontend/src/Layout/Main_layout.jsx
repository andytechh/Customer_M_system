import React from 'react'
import { Link, Outlet } from 'react-router-dom'

const Main_layout = () => {
  return (
    <>
        <header className='flex justify-between items-center bg-blue-500 text-white p-5 sticky shadow-md'>
        <Link to="/" className="hover:text-gray-200 text font-bold text-2xl">Logo</Link>
        <nav className='bg-blue-500'>
          <ul className='flex-col md:flex-row flex gap-4 text-lg font-semibold pr-4 text-white' > 
          <li>
              <Link to="/" className="hover:text-gray-200 text-white">Home</Link>
              </li>
              <li><Link to="/features" className="hover:text-gray-200">Features</Link></li>
              <li><Link to="/reviews" className="hover:text-gray-200">Reviews</Link></li>
              <li><Link to="/pricing" className="hover:text-gray-200">Pricing</Link></li>
              <li><Link to="/admin-login" className="hover:text-gray-200">Admin Login</Link></li>
              <li><Link to="/customer-access" className="hover:text-gray-200">Customer Login / Sign Up</Link></li>
          </ul>
        </nav>
      </header>
      <main >
        <Outlet/>
      </main>

</>

  )
}

export default Main_layout
