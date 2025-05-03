import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const apiURL = 'http://localhost/Customer_M_system/backend/api/indexLogin.php?action=';
const apiURL2 = 'http://localhost/Customer_M_system/backend/api/products.php?action=';

const RecommendationModal = ({ products, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
        <h2 className="text-2xl font-bold mb-4">Recommended For You</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {products.map(product => (
            <div key={product.product_id} className="border rounded-lg p-4">
              <img 
                src={`http://localhost/Customer_M_system/backend/uploads/${product.p_image}`} 
                alt={product.pname}
                className="w-full h-32 object-cover mb-2"
              />
              <h3 className="font-semibold">{product.pname}</h3>
              <p className="text-gray-600">₱{product.price}</p>
              <button className="mt-2 btn-primary w-full">
                Add to Cart
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={onClose}
          className="mt-4 btn-secondary w-full"
        >
          Continue to Dashboard
        </button>
      </div>
    </div>
  );
};
const LoginReg = () => {
  const navigate = useNavigate();
  const [insertModal, setInsertModal] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({});
  const [users, setUsers] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);


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

  const fetchRecommendedProducts = async (userId) => {
    try {
      console.log('Fetching recommendations for user:', userId);
      const response = await axios.get(`${apiURL2}recommendations`, {
        params: { user_id: userId }
      });
      console.log('Recommendations response:', response.data);
      setRecommendedProducts(response.data);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
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
      form.append('email', formData.email.trim()); 
      form.append('password', formData.password);
  
      const response = await axios.post(apiURL + 'login', form);
      console.log(response.data);
  
      if (!response.data.error) {
        const { user_id, role } = response.data.user;
        localStorage.setItem('user_id', user_id);
  
        alert('Login successful!');
        setInsertModal(false);
  
        if (role === 'admin') {
          navigate('/admin-dashboard');
        } else if (role === 'customer') {
          navigate('/c-dashboard');
        } else {
          alert('Unknown role.');
        }
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
      
      if (response.data.type === 'success') {
        const userId = response.data.user_id; 
        localStorage.setItem('user_id', userId);
        
        // 1. Show recommendations before navigation
        await fetchRecommendedProducts(userId);
        setShowRecommendations(true);
        
        // 2. Remove the navigate('/recommendations') call
        alert(response.data.message); 
        setInsertModal(false);
        fetchUsers();
      } else {
        alert(response.data.message); 
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed');
    }
  };
  
  return (
   
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#000046] to-[#1CB5E0]  p-4">
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
              ? ' w-1/4 btn-primary text-white  shadow-md'
              : 'btn-secondary text-white-800'
          }`}
        >
          Login
        </button>
        <button
          onClick={() => openModal(true)}
          className={`px-4 py-2 rounded-full font-medium ${
            isRegister
              ? 'w-ful btn-primary text-white shadow-lg'
              : 'btn-secondary text-white-800'
          }`}
        >
          Register
        </button>
      </div>
      {showRecommendations && (
          <RecommendationModal 
            products={recommendedProducts}
            onClose={() => {
              setShowRecommendations(false);
              navigate('/c-dashboard');
            }}
          />
        )}

        {loadingRecommendations && (
          <div className="text-center p-4">
            <p className="text-gray-500">Loading recommendations...</p>
          </div>
        )}


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
                className
                ="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

            <input
            type="text"
            name="uaddress"
            placeholder="Enter your address"
            value={formData.uaddress || ''}
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
              className="w-full py-3 rounded-lg btn-secondary font-semibold"
            >
              {isRegister ? 'Register' : 'Login'}
            </button>
            <button
              type="button"
              onClick={() => setInsertModal(false)}
              className="w-full py-3 rounded-lg btn-secondary font-semibold"
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
