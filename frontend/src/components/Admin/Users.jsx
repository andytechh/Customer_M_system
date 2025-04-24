import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom'; 
import { SquarePen, Trash2, Send, ArrowLeftToLine } from 'lucide-react';

const Users = () => {
  const { user_Id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editModal, setEditModal] = useState(false); 
  const [editingCustomer, setEditingCustomer] = useState(null); 

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `http://localhost/Customer_M_system/backend/api/indexLogin.php?action=viewUser&user_id=${user_Id}`
        
        );
        console.log("user ID:" + user_Id);
        if (!res.data.error) {
          setUser(res.data.user);
          
        } else {
          console.error(res.data.message);
        }
      } catch (err) {
        console.error('Error fetching user:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [user_Id]);


  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
        try {
            const formData = new URLSearchParams();
            formData.append('userId', userId);

            const res = await axios.post(
                'http://localhost/Customer_M_system/backend/api/indexLogin.php?action=deleteUser',
                formData,
                { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } } 
            );

            if (!res.data.error) {
                alert('User deleted successfully!');
                window.location.href = '/customers'; 
            } else {
                alert(res.data.message || 'Failed to delete user');
            }
        } catch (err) {
            alert('Error deleting user: ' + err.message);
            console.error('Error deleting user:', err);
        }
    }
};
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("user_id", editingCustomer.user_id);
      formData.append("uname", editingCustomer.uname);
      formData.append("username", editingCustomer.username);
      formData.append("contacts", editingCustomer.contacts);
      formData.append("status", editingCustomer.status);
      formData.append("email", editingCustomer.email);

      if (editingCustomer.password && editingCustomer.password !== '********') {
        formData.append("password", editingCustomer.password);
      }

      const res = await axios.post(
        "http://localhost/Customer_M_system/backend/api/indexLogin.php?action=updateUser",
        formData
      );

      alert(res.data.message);
      if (!res.data.error) {
        setEditModal(false); 
        setEditingCustomer(null); 
        window.location.reload(); 
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update customer.");
    }
  };

  return (
    <div className="bg-gray-300 min-h-[90vh] flex-col justify-center overflow-hidden max-h-full w-full">
      {/* Header Section */}
      <div className="flex items-center justify-between bg-white p-4 shadow-md rounded-lg mb-4 gap-10 w-full">
        <div className="flex items-center gap-2">
          <button onClick={() => window.history.back()} className="btn-secondary w-15 py-1 ml-1 rounded-lg">
            <ArrowLeftToLine size={20} />
          </button>
          <img className="rounded-full w-20 h-20 ml-10 mr-3" src="/src/assets/solo.jpg" alt="Profile" />
          {loading ? (
            <p>Loading...</p>
          ) : !user ? (
            <p>User not found.</p>
          ) : (
            <p className="text-2xl max-w-40 w-full">
              <strong>{user.uname}</strong>
            </p>
          )}
        </div>
        <div className="flex gap-3 mr-10">
          {/* Edit Button */}
          <button
            onClick={() => {
              setEditingCustomer(user); 
              setEditModal(true);
            }}
            className="btn-secondary w-1/1 py-2 rounded-lg">
            <SquarePen size={20} />
          </button>
          <button onClick={() => handleDelete(user.user_id)} className="btn-alternative1 w-2/2 py-2 rounded-lg">
            <Trash2 size={20} />
          </button>
          <button className="btn-alternative w-2/2 py-2 rounded-lg">
            <Send size={20} />
          </button>
        </div>
      </div>
      {/* Edit Modal */}
      {editModal && editingCustomer && (
        <div className="fixed inset-0 bg-gray-300 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg relative">
            <button onClick={() => setEditModal(false)} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
              X
            </button>
            <h2 className="text-xl font-bold mb-3">Update Customer</h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
                <div className="flex flex-col">
                  <label htmlFor="uname" className="mb-1 text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    id="uname"
                    type="text"
                    value={editingCustomer.uname}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, uname: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter full name"
                    required
                  />
                </div>
              
                <div className="flex flex-col">
                  <label htmlFor="username" className="mb-1 text-sm font-medium text-gray-700">
                    Username
                  </label>
                  <input
                    id="username"
                    type="text"
                    value={editingCustomer.username}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, username: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter username"
                    required
                  />
                </div>
     
                <div className="flex flex-col">
                  <label htmlFor="email" className="mb-1 text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    id="email"
                    type="text"
                    value={editingCustomer.email}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter email"
                    required
                  />
                </div>
    
                <div className="flex flex-col">
                  <label htmlFor="contact" className="mb-1 text-sm font-medium text-gray-700">
                    Contact
                  </label>
                  <input
                    id="contact"
                    type="text"
                    value={editingCustomer.contacts}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, contacts: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter contact number"
                  />
                </div>
       
                <div className="flex flex-col">
                  <label htmlFor="password" className="mb-1 text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={editingCustomer.password || '********'}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, password: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="New password (optional)"
                  />
                </div>
                {/* Status */}
                <div className="flex flex-col">
                  <label htmlFor="status" className="mb-1 text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    id="status"
                    value={editingCustomer.status}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, status: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Active/Inactive</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button type="submit" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200">
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditModal(false)}
                  className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User Info Section */}
      <div className="flex flex-row justify-around gap-4 p-4">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">User Info</h2>
          {loading ? (
            <p>Loading...</p>
          ) : !user ? (
            <p>User not found.</p>
          ) : (
            <div className="flex flex-col gap-6 text-lg d p-5 rounded-lg card-hover h-full w-90">
              <p>
                <strong className="mr-2">User ID:</strong> {user.user_id}
              </p>
              <p>
                <strong className="mr-2">Username:</strong> {user.username}
              </p>
              <p>
                <strong className="mr-2">Email:</strong> {user.email}
              </p>
              <p>
                <strong className="mr-2">Contact:</strong> {user.contacts}
              </p>
              <p>
                <strong className="mr-2">Address:</strong> {user.uaddress}
              </p>
              <p>
                <strong className="mr-2">Status:</strong> {user.ustatus}
              </p>
              <p>
                <strong className="mr-2">Role:</strong> {user.roles}
              </p>
              <p>
                <strong className="mr-2">Created At:</strong> {user.created_at}
              </p>
            </div>
          )}
        </div>

        {/* Orders Section */}
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Orders</h2>
          {loading ? (
            <p>Loading...</p>
          ) : !user ? (
            <p>User not found.</p>
          ) : (
            <div className="flex gap-10 p-2 rounded-lg w-150 card-hover">
              <table className="min-w-full text-sm border-collapse border h-20 border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="p-3 whitespace-nowrap mr-10">Order Id</th>
                    <th className="p-2 whitespace-nowrap">Price</th>
                    <th className="p-2 whitespace-nowrap">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-2 text-center whitespace-nowrap">1</td>
                    <td className="p-2 text-center whitespace-nowrap">2</td>
                    <td className="p-2 text-center whitespace-nowrap">3</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Users;