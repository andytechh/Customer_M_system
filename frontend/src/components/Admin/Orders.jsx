import React from 'react'
import axios from 'axios'
import { useEffect, useState } from 'react'


const Orders = () => {
  const [cart, setCart] = useState([])


  
  return (
    <div className="overflow-x-auto bg-gray-300 rounded-lg shadow-md w-full max-h-[600px] mt-10">
      <table className="min-w-full text-sm border-collapse border border-gray-300">
        <caption className="text-lg font-bold text-center p-4">OrderList List</caption>
            <thead className="bg-[#0E1336] text-white sticky top-0 ">
              <tr className="">
                <th className="p-4  whitespace-nowrap">Order ID</th>
                <th className="p-4  whitespace-nowrap">Product ID</th>
                <th className="p-4  whitespace-nowrap">Product Name</th>
                <th className="p-4  whitespace-nowrap">Price</th>
                <th className="p-4  whitespace-nowrap">Image</th>
                <th className="p-4  whitespace-nowrap">Status</th>
                <th className="p-4  whitespace-nowrap">Ordered At</th>
                <th className="p-4  whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            
        </table>
    </div>
  )
}

export default Orders
