 import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const apiURL = 'http://localhost/Customer_M_system/backend/api/indexLogin.php?action=';
const apiURL2 = 'http://localhost/Customer_M_system/backend/api/products.php?action=';

const RecommendationModal = ({ products, onClose }) => {
  const [activeTab, setActiveTab] = useState('personalized');
  
return (
<div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
<div className="bg-gradient-to-b from-[#121212] to-[#1a1a1a] rounded-xl w-full max-w-4xl h-[80vh] overflow-hidden flex flex-col">
{/* Header and tabs */}
<div className="p-6 flex justify-between items-center border-b border-gray-800">
  <h2 className="text-2xl font-bold text-white">Recommended For You</h2>
  <button onClick={onClose} className="text-gray-400 hover:text-white text-xl">✕</button>
</div>

<div className="flex border-b border-gray-800">
  {['personalized', 'trending', 'new'].map(tab => (
      <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`px-6 py-4 font-medium ${
              activeTab === tab
                  ? 'text-white border-b-2 border-indigo-500'
                  : 'text-gray-400 hover:text-white'
          }`}
      >
          {tab === 'personalized' && 'For You'}
          {tab === 'trending' && 'Trending'}
          {tab === 'new' && 'New Arrivals'}
      </button>
  ))}
</div>

{/* Content */}
<div className="p-6 overflow-y-auto flex-1">
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products[activeTab]?.map(product => (
          <div key={product.product_id} className="group">
              <div className="relative aspect-square mb-3 bg-gradient-to-br from-gray-800 to-gray-600 rounded-lg overflow-hidden shadow-lg transition-all group-hover:shadow-xl">
                  <img 
                      src={product.p_image} 
                      alt={product.pname}
                      className="absolute inset-0 w-full h-full object-cover"
                  />
                  <button className="absolute bottom-2 right-2 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:scale-105">
                      ➔
                  </button>
              </div>
              <h4 className="text-white font-medium truncate">{product.pname}</h4>
              <p className="text-gray-400 text-sm">₱{product.price}</p>
              {activeTab === 'personalized' && (
                  <p className="text-xs text-indigo-400">Based on your preferences</p>
              )}
          </div>
      ))}
  </div>
</div>

<div className="p-6 bg-gradient-to-t from-black to-transparent">
  <button 
      onClick={onClose}
      className="w-full py-3 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform"
  >
      Continue to Dashboard
  </button>
</div>
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
    setLoadingRecommendations(true);
    const response = await axios.get(`${apiURL2}recommendations`, {
      params: { user_id: userId }
    });
    if (response.data.error) {
      console.error('Recommendation Error:', response.data);
      return;
    }
    const formattedData = {
      personalized: response.data.personalized?.map(p => ({
        ...p,
        // Ensure correct image URL
        p_image: p.p_image?.startsWith('http') ? p.p_image : `${apiURL2}uploads/${p.p_image}`
      })) || [],
      
      trending: response.data.trending?.map(p => ({
        ...p,
        p_image: p.p_image?.startsWith('http') ? p.p_image : `${apiURL2}uploads/${p.p_image}`
      })) || [],
      
      new: response.data.new?.map(p => ({
        ...p,
        p_image: p.p_image?.startsWith('http') ? p.p_image : `${apiURL2}uploads/${p.p_image}`
      })) || []
    };

    setRecommendedProducts(formattedData);
    setShowRecommendations(true);

  } catch (error) {
    console.error('Fetch Error:', error);
    alert('Error loading recommendations. Please try again later.');
  } finally {
    setLoadingRecommendations(false);
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
        localStorage.setItem('is_admin', role === 'admin' ? 'true' : 'false');
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
         localStorage.setItem('is_admin', 'false'); 
        await fetchRecommendedProducts(userId);
        setShowRecommendations(true);
        
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