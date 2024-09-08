import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
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

      // Save token and user data to session storage
      sessionStorage.setItem('auth_token', access_token);
      sessionStorage.setItem('user', JSON.stringify(user));

      // Set the token and user in the App state using props
      setToken(access_token);
      setUser(user);

      // Navigate to a dashboard or homepage after successful login
      navigate('/dashboard');
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
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="cta-button">Login</button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
