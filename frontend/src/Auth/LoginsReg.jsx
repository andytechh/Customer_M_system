import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const apiURL = 'http://localhost/Customer_M_system/backend/api/indexLogin.php?action=';

const LoginReg = () => {
  const [insertModal, setInsertModal] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({});
  const [users, setUsers] = useState([]);

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
    <div>
      <h1>Login & Register</h1>
      <button onClick={() => openModal(false)}>Login</button>
      <button onClick={() => openModal(true)}>Register</button>

      {insertModal && (
        <div className="modal">
          <h2>{isRegister ? 'Register' : 'Login'}</h2>
          <form onSubmit={isRegister ? handleRegisterSubmit : handleLoginSubmit}>
            {isRegister && (
              <>
                <input
                  type="text"
                  name="uname"
                  placeholder="Full Name"
                  value={formData.uname || ''}
                  onChange={handleInsertChange}
                  required
                />
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={formData.username || ''}
                  onChange={handleInsertChange}
                  required
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
            />
            <input
              type="password"
              name={isRegister ? 'upassword' : 'password'}
              placeholder="Password"
              value={isRegister ? formData.upassword || '' : formData.password || ''}
              onChange={handleInsertChange}
              required
            />
            <div className="modal-actions">
              <button type="submit">{isRegister ? 'Register' : 'Login'}</button>
              <button type="button" onClick={() => setInsertModal(false)}>Close</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default LoginReg;
