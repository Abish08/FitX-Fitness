import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './Pages/Login';
import Register from './Pages/Register';
import Dashboard from './Pages/Dashboard';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}

export default App;
