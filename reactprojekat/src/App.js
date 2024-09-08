import logo from './logo.svg';
import './App.css';
import HomePage from './HomePage';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { BrowserRouter, Routes, Route } from 'react-router-dom';  // Import Route

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
           
          <Route path="/" element={<HomePage />} />           {/* Početna stranica */}
          <Route path="/login" element={<LoginForm />} />     {/* Stranica za login */}
          <Route path="/register" element={<RegisterForm />} /> {/* Stranica za registraciju */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
