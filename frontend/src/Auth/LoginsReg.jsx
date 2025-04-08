import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const apiURL = 'http://localhost/Customer_M_system/backend/api/indexLogin.php?action=';

const LoginReg = () => {
  const [insertModal, setInsertModal] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({});
  const [users, setUsers] = useState([]);
  const [showPassword, setShowPassword] = useState(false);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(apiURL + 'fetch');
      setUsers(res.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openModal = (register = false) => {
    setIsRegister(register);
    setInsertModal(true);
    setFormData({});
  };

  const handleInsertChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const form = new FormData();
      form.append('email', formData.email);
      form.append('password', formData.password);

      const response = await axios.post(apiURL + 'login', form);
      console.log(response.data);

      if (!response.data.error) {
        alert('Login successful!');
        setInsertModal(false);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      const newForm = {
        ...formData,
        ucreated: new Date().toISOString(),
      };

      const response = await axios.post(apiURL + 'register', newForm);
      console.log(response.data);

      if (response.data.type === 'success') {
        alert(response.data.message);
        setInsertModal(false);
        fetchUsers();
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  return (
   
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-600 to-purple-600 p-4">
    <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-2">
          {isRegister ? 'Create Account' : 'Welcome Back'}
        </h1>
        <p className="text-sm text-gray-500">
          {isRegister ? 'Register to get started' : 'Login to your account'}
        </p>
      </div>

      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => openModal(false)}
          className={`px-4 py-2 rounded-full font-medium ${
            !isRegister
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          Login
        </button>
        <button
          onClick={() => openModal(true)}
          className={`px-4 py-2 rounded-full font-medium ${
            isRegister
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          Register
        </button>
      </div>

      {insertModal && (
        <form
          onSubmit={isRegister ? handleRegisterSubmit : handleLoginSubmit}
          className="space-y-5"
        >
          {isRegister && (
            <>
              <input
                type="text"
                name="uname"
                placeholder="Full Name"
                value={formData.uname || ''}
                onChange={handleInsertChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username || ''}
                onChange={handleInsertChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </>
          )}

          <input
            type="email"
            name={isRegister ? 'uemail' : 'email'}
            placeholder="Email"
            value={isRegister ? formData.uemail || '' : formData.email || ''}
            onChange={handleInsertChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name={isRegister ? 'upassword' : 'password'}
              placeholder="Password"
              value={
                isRegister
                  ? formData.upassword || ''
                  : formData.password || ''
              }
              onChange={handleInsertChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-sm text-gray-500 hover:text-indigo-600"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold"
            >
              {isRegister ? 'Register' : 'Login'}
            </button>
            <button
              type="button"
              onClick={() => setInsertModal(false)}
              className="w-full py-3 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition font-semibold"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  </div>

  );
};

export default LoginReg;
