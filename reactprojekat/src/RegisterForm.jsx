
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import FormInput from './FormInput'; 
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
   

      navigate('/login');
    } catch (err) {
      if (err.response && err.response.data) {
        setError(Object.values(err.response.data).flat().join(', '));
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
          <FormInput
            label="Name:"
            type="text"
            name="name"
            value={formData.name}
            handleChange={handleChange}
          />
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
          <FormInput
            label="Confirm Password:"
            type="password"
            name="password_confirmation"
            value={formData.password_confirmation}
            handleChange={handleChange}
          />
          <button type="submit" className="cta-button">Register</button>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
