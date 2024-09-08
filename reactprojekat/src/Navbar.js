import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Navbar.css';

const Navbar = ({ token, setToken, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const token = sessionStorage.getItem('auth_token');
      await axios.post('http://127.0.0.1:8000/api/logout', {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      // Uklanjamo podatke iz session storage-a
      sessionStorage.removeItem('auth_token');
      sessionStorage.removeItem('user');
      setToken(null);
      setUser(null);

      // Preusmeravamo na početnu stranicu nakon logout-a
      navigate('/');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <h1>MyApp</h1>
      </div>
      <div className="navbar-links">
        <Link to="/">Home</Link>
        {token ? (
          <>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
