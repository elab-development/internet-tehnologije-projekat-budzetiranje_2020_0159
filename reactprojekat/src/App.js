import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import Navbar from './Navbar';  // Importujemo Navbar

function App() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  // Kada se stranica učita, proveravamo da li postoji token u sessionStorage
  useEffect(() => {
    const savedToken = sessionStorage.getItem('auth_token');
    const savedUser = sessionStorage.getItem('user');
    if (savedToken) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar token={token} setToken={setToken} setUser={setUser} /> 
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginForm setToken={setToken} setUser={setUser} />} />
          <Route path="/register" element={<RegisterForm />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
