import React, { useEffect, useState } from 'react';
import axios from 'axios';

const apiURL = "http://localhost/Customer_M_system/backend/api/products.php?action=";

const OrdersManagement = () => {
const [orders, setOrders] = useState([]);
const [loading, setLoading] = useState(true);
const [editingOrder, setEditingOrder] = useState(null);
const [editModal, setEditModal] = useState(false);

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

const handleEditSubmit = async (e) => {
e.preventDefault();
try {
    const res = await axios.post(`${apiURL}editorder`, {
        order_id: editingOrder.order_id,
        status: editingOrder.status
    });
    
    if (!res.data.error) {
        alert("Order updated successfully!");
        fetchOrders();
        setEditModal(false);
    } else {
        alert(res.data.message || "Failed to update order");
    }
} catch (error) {
    console.error("Error updating order:", error);
    alert(error.response?.data?.message || "Failed to update order");
}
};

const cancelOrder = async (orderId, currentStatus) => {
// Check status before showing confirmation
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
<div className="overflow-x-auto bg-gray-300 rounded-lg shadow-md w-full max-h-[650px] mt-10">
{editModal && editingOrder && (
<div className="fixed inset-0 bg-gray-400 bg-opacity-50 flex justify-center items-center z-50">
<div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg relative">
<button 
onClick={() => setEditModal(false)} 
className="absolute top-2 right-2 p-3 text-gray-500 hover:text-gray-700"
>
X
</button>
<h2 className="text-xl font-bold mb-3">Update Order Status</h2>
<form onSubmit={handleEditSubmit} className='space-y-4'>
<div className="flex flex-col">
    <label htmlFor="status" className="mb-1 text-sm font-medium text-gray-700">
        Order Status
    </label>
    <select
        id="status"
        value={editingOrder.status}
        onChange={(e) => setEditingOrder({...editingOrder, status: e.target.value})}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
    >  
        <option value="">Update Status</option>
        <option value="pending">Pending</option>
        <option value="processing">Processing</option>
        <option value="shipped">Shipped</option>
        <option value="delivered">Delivered</option>
        <option value="cancelled">Cancelled</option>
        <option value="returned">Returned</option>
        <option value="refunded">Refunded</option>
    </select>
</div>
<button 
    type="submit" 
    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
>
    Update Status
</button>
</form>
</div>
</div>
)}

<table className="min-w-full text-sm border-collapse border border-gray-300">
<caption className="text-lg font-bold text-center p-4">Order List</caption>
<thead className="bg-[#0E1336] text-white sticky top-0">
    <tr>
        <th className="p-4 whitespace-nowrap">Order ID</th>
        <th className="p-4 whitespace-nowrap">Customer ID</th>
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
{orders.length > 0 ? (
orders.map((order) => (
<tr key={order.order_id} className="border-b bg-white even:bg-gray-100">
<td className="p-4 border-b text-center">{order.order_id}</td>
<td className="p-4 border-b text-center">{order.user_id}</td>
<td className="p-4 border-b text-center">{order.product_name}</td>
<td className="p-4 border-b text-center">
    <img
        src={order.p_image}
        alt={order.product_name}
        className="w-16 h-16 object-cover mx-auto"
        onError={(e) => {
            e.target.src = 'https://via.placeholder.com/64?text=No+Image';
        }}
    />
</td>
<td className="p-4 border-b text-center">{order.quantity}</td>
<td className="p-4 border-b text-center">
    {typeof order.total_price === 'number' 
        ? `$${order.total_price.toFixed(2)}`
        : order.total_price}
</td>
<td className="p-4 border-b text-center">
    <span
    className={`px-3 py-1 rounded-full text-white text-center text-xs ${
        order.order_status === 'delivered'
            ? 'bg-green-500'
            : order.order_status === 'shipped'
            ? 'bg-blue-500'
            : order.order_status === 'cancelled' || order.order_status === 'returned' || order.order_status === 'refunded'
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
<td className="p-4 border-b text-center space-x-2">
    <button
        onClick={() => {
            setEditingOrder(order);
            setEditModal(true);
        }}
        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
    >
        Edit
    </button>
    <button
  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
  onClick={() => cancelOrder(order.order_id, order.order_status)}
  disabled={['shipped', 'delivered'].includes(order.order_status)}
>
  Cancel
</button>
</td>
</tr>
))
) : (
    <tr>
        <td colSpan="9" className="text-center p-4 text-gray-600">
            No orders found.
        </td>
    </tr>
    )}
</tbody>
</table>
</div>
    );
};

export default OrdersManagement;