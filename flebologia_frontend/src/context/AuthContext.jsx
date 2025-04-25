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
      console.log('Token decodificado:', decodedToken); // Para verificar la información decodificada
      setUser({
        id: decodedToken?.id || '', // Se agrega el id al estado
        nombre: decodedToken?.nombre || '', // Asignamos el nombre del token
        apellido: decodedToken?.apellido || '', // Si no existe, dejamos vacío
        email: decodedToken?.sub || '', // Usamos `sub` para el email (común en JWT)
        role: decodedToken?.role || '', // Asignamos el rol
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
      id: decodedToken?.id || '',
      nombre: decodedToken?.nombre || '', // Usamos el nombre del token
      apellido: decodedToken?.apellido || '', // Usamos el apellido si existe
      email: decodedToken?.sub || '', // Usamos `sub` para el email (común en JWT)
      role: decodedToken?.role || '', // Asignamos el rol
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
