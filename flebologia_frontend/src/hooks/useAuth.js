// src/hooks/useAuth.js
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext'; // Usá el export correcto

const useAuth = () => {
  return useContext(AuthContext);
};

export default useAuth;
