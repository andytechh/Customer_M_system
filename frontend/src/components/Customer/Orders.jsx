import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Orders = () => {
const [orders, setOrders] = useState([]);
const [loading, setLoading] = useState(true);
const apiURL = "http://localhost/Customer_M_system/backend/api/products.php?action=";


useEffect(() => {
  fetchOrders();
}, []);

const fetchOrders = async () => {
  try {
    const userId = localStorage.getItem('user_id');
    const isAdmin = localStorage.getItem('is_admin') === 'true'; 
    
    const res = await axios.get(`${apiURL}vieworders`, {
      params: {
        user_id: isAdmin ? null : userId,
        is_admin: isAdmin
      }
    });

    if (Array.isArray(res.data)) {
      setOrders(res.data);
    } else {
      console.error("Unexpected response format:", res.data);
      setOrders([]);
    }
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    setOrders([]);
  } finally {
    setLoading(false);
  }
};

const cancel = async (orderId, currentStatus) => {
  const nonCancellableStatuses = ['shipped', 'delivered'];
  if (nonCancellableStatuses.includes(currentStatus)) {
    alert(`Cannot cancel order - already ${currentStatus}`);
    return;
  }

  if (window.confirm("Are you sure you want to cancel this order?")) {
    try {
      const res = await axios.post(`${apiURL}cancel`, {
        order_id: orderId
      });
      
      if (!res.data.error) {
        alert(res.data.message || "Order cancelled successfully!");
        fetchOrders();
      } else {
        alert(res.data.message || "Failed to cancel order");
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      alert(error.response?.data?.message || "Failed to cancel order");
    }
  }
};
if (loading) {
  return <div className="text-center py-10">Loading orders...</div>;
}

  return (
<div className="overflow-x-auto bg-gray-300 rounded-lg shadow-md w-full max-h-[700px] mt-10">
  <table className="min-w-full text-sm border-collapse border border-gray-300">
    <caption className="text-lg font-bold text-center p-4">Order List</caption>
    <thead className="bg-[#0E1336] text-white sticky top-0">
      <tr>
        <th className="p-4 whitespace-nowrap">Product Name</th>
        <th className="p-4 whitespace-nowrap">Image</th>
        <th className="p-4 whitespace-nowrap">Quantity</th>
        <th className="p-4 whitespace-nowrap">Total Price</th>
        <th className="p-4 whitespace-nowrap">Status</th>
        <th className="p-4 whitespace-nowrap">Ordered At</th>
        <th className="p-4 whitespace-nowrap">Actions</th>
      </tr>
    </thead>
    <tbody>
    {Array.isArray(orders) && orders.length > 0 ?  (
        orders.map((order) => (
          <tr key={order.order_id} className="border-b bg-white even:bg-gray-100">
            <td className="p-4 border-b text-center">{order.product_name}</td> 
            <td className="p-4 border-b text-center">
              <img
                src={order.p_image}
                alt={order.product_name}
                className="w-16 h-16 object-cover mx-auto"
              />
            </td>
            <td className="p-4 border-b text-center">{(order.quantity)}</td>
            <td className="p-4 border-b text-center">{(order.total_price)}
            </td>
            <td className="p-4 border-b text-center">
              <span
                className={`px-3 py-1 rounded-full text-white text-center text-xs ${
                  order.order_status === 'delivered'
                    ? 'bg-green-500'
                    : order.order_status === 'shipped'
                    ? 'bg-blue-500'
                    : order.order_status === 'cancelled'
                    ? 'bg-red-500'
                    : 'bg-yellow-500'
                }`}
              >
                {order.order_status || 'Pending'}
              </span>
            </td>
            <td className="p-4 border-b text-center">
              {new Date(order.order_date).toLocaleDateString()}
            </td>
            <td className="p-4 border-b text-center">
              <button
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                onClick={() => cancel(order.order_id)}
              >
                Cancel
              </button>
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="8" className="text-center p-4 text-gray-600">
            No orders found.
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>
  );
};

export default Orders;