import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import { SquarePen, Trash2 } from 'lucide-react';

const apiURL = 'http://localhost/Customer_M_system/backend/api/indexLogin.php?action=view';

const Customers = () => {
  const [users, setUsers] = useState([]);
  const [openModal, setOpenModal] = useState(false); 
  const [editModal, setEditModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({ uname: '', username: '', uemail: '', upassword: '', ucreated: '' });
  const [loading, setLoading] = useState(true);
  const [loadingDuration] = useState(2000);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(apiURL);
      if (!response.data.error && Array.isArray(response.data.users)) {
        setUsers(response.data.users);
      } else {
        alert(response.data.message || 'No users found');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setTimeout(() => setLoading(false), loadingDuration);
    }
  };

  const del = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
    if (!id) {
      alert('Invalid user ID.');
      return;
    }
    console.log('Deleting user with ID:', id); // Debugging
    try {
      const formData = new URLSearchParams();
      formData.append('userId', id);
      const res = await axios.post(
        'http://localhost/Customer_M_system/backend/api/indexLogin.php?action=deleteUser',
        formData
      );
      alert(res.data.message);
      if (!res.data.error) {
        fetchUsers(); 
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting user');
    }
  }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost/Customer_M_system/backend/api/indexLogin.php?action=register', formData);
      alert(res.data.message);
      setOpenModal(false);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredUsers = users.filter(user =>
    user.uname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleView = async (userId) => {
    try {
      const res = await axios.get(`http://localhost/Customer_M_system/backend/api/indexLogin.php?action=viewUser`, {
        params: { user_id: userId }
      });
      if (!res.data.error) {
        const user = res.data.user;
        navigate(`/users/${userId}`, { state: { user } });
      } else {
        alert(res.data.message);
      }
    } catch (error) {
      alert('Error viewing user');
      console.error(error);
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
      formData.append("password", editingCustomer.password || ''); 
      const res = await axios.post(
        "http://localhost/Customer_M_system/backend/api/indexLogin.php?action=updateUser",
        formData
      );
      alert(res.data.message);
      if (!res.data.error) {
        setEditingCustomer(null);
        setEditModal(false);
        fetchUsers();
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update customer.");
    }
  };

  if (loading) return <p className="text-center text-gray-600">Loading customers...</p>;

  return (
    <div className="flex flex-col w-7/9 h-90vh overflow-hidden relative">
      <div className="sm:hidden mb-4">
        <input
          type="text"
          placeholder="Search..."
          className="ml-10 px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Add Customer Modal
      {openModal && (
        <div className="fixed inset-0 bg-gray-400 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg relative">
            <button onClick={() => setOpenModal(false)} className="absolute top-2 right-2 text-gray-500 hover:text-[#1CB5E0] p-3 mr-2">
              X
            </button>
            <h3 className="text-lg font-semibold mb-4">New Customer</h3>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <input type="text" placeholder="Name" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" onChange={e => setFormData({ ...formData, uname: e.target.value })} />
              <input type="text" placeholder="Username" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" onChange={e => setFormData({ ...formData, username: e.target.value })} />
              <input type="text" placeholder="Email" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" onChange={e => setFormData({ ...formData, uemail: e.target.value })} />
              <input type="text" placeholder="Address" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" onChange={e => setFormData({ ...formData, uaddress: e.target.value })} />
              <input type="password" placeholder="Password" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" onChange={e => setFormData({ ...formData, upassword: e.target.value })} />
              <input type="datetime-local" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" onChange={e => setFormData({ ...formData, ucreated: e.target.value })} />
              <button type="submit" className="w-full px-6 py-3 btn-secondary">Submit</button>
            </form>
          </div>
        </div>
      )} */}

      {/* Edit Customer Modal */}
      {editModal && editingCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg relative">
            <button onClick={() => setEditModal(false)} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
              X
            </button>
            <h2 className="text-xl font-bold mb-3">Update Customer</h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label htmlFor="uname" className="mb-1 text-sm font-medium text-gray-700">Full Name</label>
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
                  <label htmlFor="username" className="mb-1 text-sm font-medium text-gray-700">Username</label>
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
                  <label htmlFor="email" className="mb-1 text-sm font-medium text-gray-700">Email</label>
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
                  <label htmlFor="contact" className="mb-1 text-sm font-medium text-gray-700">Contact</label>
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
                  <label htmlFor="password" className="mb-1 text-sm font-medium text-gray-700">Password</label>
                  <input
                    id="password"
                    type="password"
                    value={editingCustomer.password || '********'} 
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, password: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="New password (optional)"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="status" className="mb-1 text-sm font-medium text-gray-700">Status</label>
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
                <button type="submit" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200">Save</button>
                <button type="button" onClick={() => setEditModal(false)} className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition duration-200">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Customer Table */}
  <div className="overflow-x-auto bg-gray-300 rounded-lg shadow-md w-full max-h-[600px] mt-10">
      <table className="min-w-full text-sm border-collapse border border-gray-300">
      <caption className="text-lg font-bold text-center p-4">Customers List</caption>
        <thead className="bg-[#0E1336] text-white sticky top-0">
          <tr>
            <th className="p-2 whitespace-nowrap">ID</th>
            <th className="p-2 whitespace-nowrap">Name</th>
            <th className="p-2 whitespace-nowrap">Username</th>
            <th className="p-2 whitespace-nowrap">Email</th>
            <th className="p-2 whitespace-nowrap">Contact</th>
            <th className="p-2 whitespace-nowrap">Status</th>
            <th className="p-2 whitespace-nowrap">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user, index) => (
              <tr key={index} className="bg-white even:bg-gray-50 text-center">
                <td className="p-2 whitespace-nowrap">{user.user_id}</td>
                <td className="p-2 whitespace-nowrap">{user.uname}</td>
                <td className="p-2 whitespace-nowrap">{user.username}</td>
                <td className="p-2 whitespace-nowrap">{user.email}</td>
                <td className="p-2 whitespace-nowrap">{user.contacts}</td>
                <td className="p-2 whitespace-nowrap">{user.ustatus}</td>
                <td className="p-2 space-x-2">
                  <div className='flex justify-center items-center gap-2'>
                    <button
                      onClick={() => handleView(user.user_id)}
                      className="w-1/5 py-3 btn-secondary rounded-lg"
                    >
                      View
                    </button>
                    <button
                      onClick={() => {
                        setEditingCustomer(user);
                        setEditModal(true);
                      }}
                      className="text-center btn-alternative rounded-lg"
                    >
                      <SquarePen size={25} />
                    </button>
                    <button
                      onClick={() => del(user.user_id)}
                      className="text-center btn-alternative1 rounded-lg"
                    >
                      <Trash2 size={25} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center py-4">
                No users found!
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
      </div>
  );
};

export default Customers;