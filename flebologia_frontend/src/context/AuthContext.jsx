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
  const [user, setUser] = useState({ id: '', nombre: '', apellido: '', email: '', role: '' });

  useEffect(() => {
    if (token) {
      const decodedToken = decodeToken(token);
      setUser({
        id: decodedToken?.id || '', // Se agrega el id al estado
        nombre: decodedToken?.nombre || '',
        apellido: decodedToken?.apellido || '',
        email: decodedToken?.email || '',
        role: decodedToken?.role || '', // Ahora el role se incluye también
      });
    } else {
      setUser({ id: '', nombre: '', apellido: '', email: '', role: '' });
    }
  }, [token]);
  
  const login = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    const decodedToken = decodeToken(newToken);
    setUser({
      id: decodedToken?.id || '', // Almacenamos el id al hacer login
      nombre: decodedToken?.nombre || '',
      apellido: decodedToken?.apellido || '',
      email: decodedToken?.email || '',
      role: decodedToken?.role || '', // Almacenamos el role también
    });
  };  

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser({ id: '', nombre: '', apellido: '', email: '', role: '' });
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
