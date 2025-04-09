import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const apiURL = 'http://localhost/Customer_M_system/backend/api/indexLogin.php?action=';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingDuration] = useState(3000);

  const handleInsertChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); 

    setTimeout(() => { 
      setLoading(false); 
    }
    , loadingDuration);
    try {
        const form = new FormData();
        form.append('email', formData.email);
        form.append('password', formData.password);

        const response = await axios.post(apiURL + 'admin-login', form);

        console.log(response.data); 
       
        if (response.data.error === false) {
            alert('Login successful!');
            setLoading(false);
            navigate('/admin-dashboard'); 
        } else {
            alert(response.data.message); 
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('An error occurred while logging in.');
    }
};


  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-600 to-purple-600 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-extrabold text-gray-800 mb-2">
            Welcome Back
          </h1>
          <p className="text-sm text-gray-500">Login to your account</p>
        </div>

        <form onSubmit={handleLoginSubmit} className="space-y-5">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email || ''}
            onChange={handleInsertChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={formData.password || ''}
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

          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
