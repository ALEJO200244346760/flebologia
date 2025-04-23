// src/context/AuthContext.js
import { createContext, useState, useEffect } from 'react';

// Crear el contexto
const AuthContext = createContext();

// Función para decodificar el token JWT
const decodeToken = (token) => {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch (e) {
    console.error('Error decodificando el token:', e);
    return null;
  }
};

// Proveedor del contexto de autenticación
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [user, setUser] = useState({ nombre: '', apellido: '', email: '' });

  useEffect(() => {
    if (token) {
      const decodedToken = decodeToken(token);
      setUser({
        nombre: decodedToken?.nombre || '',
        apellido: decodedToken?.apellido || '',
        email: decodedToken?.email || '',
        role: decodedToken?.role || '', // 👈 Agregado
      });
    } else {
      setUser({ nombre: '', apellido: '', email: '', role: '' });
    }
  }, [token]);
  
  const login = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    const decodedToken = decodeToken(newToken);
    setUser({
      nombre: decodedToken?.nombre || '',
      apellido: decodedToken?.apellido || '',
      email: decodedToken?.email || '',
      role: decodedToken?.role || '', // 👈 Agregado
    });
  };  

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser({ nombre: '', apellido: '', email: '' });
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
