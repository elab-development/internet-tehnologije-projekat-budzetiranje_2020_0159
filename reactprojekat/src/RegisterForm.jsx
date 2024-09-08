import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './RegisterForm.css';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  });
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
      const response = await axios.post('http://127.0.0.1:8000/api/register', formData);
      const { access_token, user } = response.data;

      // Save token and user data to session storage
      sessionStorage.setItem('auth_token', access_token);
      sessionStorage.setItem('user', JSON.stringify(user));

     
      navigate('/login');
    } catch (err) {
      if (err.response && err.response.data) {
        setError(Object.values(err.response.data).flat().join(', '));  // Prikazuje greške validacije
      } else {
        setError('Registration failed. Please check your input.');
      }
    }
  };

  return (
    <div className="register-container">
      <div className="register-form-section">
        <h1>Register</h1>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
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
          <div className="form-group">
            <label>Confirm Password:</label>
            <input
              type="password"
              name="password_confirmation"
              value={formData.password_confirmation}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="cta-button">Register</button>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
