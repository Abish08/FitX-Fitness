// src/hooks/useLogout.js
import { useNavigate } from 'react-router-dom';

export const useLogout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // ✅ Remove token
    localStorage.removeItem('token');

    // ✅ Redirect to login
    navigate('/admin-login'); // or '/login'
  };

  return handleLogout;
};