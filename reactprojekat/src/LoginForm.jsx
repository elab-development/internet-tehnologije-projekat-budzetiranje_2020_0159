 
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import FormInput from './FormInput';  
import './LoginForm.css';

const LoginForm = ({ setToken, setUser }) => {
  const [formData, setFormData] = useState({ email: 'user@example.com', password: 'password' });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/login', formData);
      const { access_token, user } = response.data;

      sessionStorage.setItem('auth_token', access_token);
      sessionStorage.setItem('user', JSON.stringify(user));

      setToken(access_token);
      setUser(user);  
      if(response.data.user.role=="admin"){
        navigate('/admindashboard');
      }else{
        navigate('/dashboard');
      } 


     
    } catch (err) {
      setError('Invalid login credentials');
    }
  };

  return (
    <div className="login-container">
      <div className="login-form-section">
        <h1>Login</h1>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <FormInput
            label="Email:"
            type="email"
            name="email"
            value={formData.email}
            handleChange={handleChange}
          />
          <FormInput
            label="Password:"
            type="password"
            name="password"
            value={formData.password}
            handleChange={handleChange}
          />
          <button type="submit" className="cta-button">Login</button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
