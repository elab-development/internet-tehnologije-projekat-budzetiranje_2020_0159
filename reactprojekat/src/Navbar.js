import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Navbar.css';

const Navbar = ({ token, user, setToken, setUser }) => {
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

  // Assuming the role for admin is either stored in user.role or user.role_id
  const isAdmin = user && user.role === 'admin';  // Adjust this based on your user object structure

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <h1>MyApp</h1>
      </div>
      <div className="navbar-links">
        {token ? (
          <>
            {/* Show admin dashboard if user is admin */}
            {isAdmin ? (
              <Link to="/admindashboard">Admin Dashboard</Link>
            ) : (
              <>
                <Link to="/">Home</Link>
                <Link to="/dashboard">Dashboard</Link>
              </>
            )}
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
