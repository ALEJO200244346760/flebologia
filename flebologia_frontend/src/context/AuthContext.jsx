import { createContext, useContext, useState, useEffect } from 'react';

// Crear el contexto
const AuthContext = createContext();

// Decodificar el token JWT
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

// Componente proveedor del contexto
export const AuthProvider = ({ children }) => {
  // Estado para el token y el usuario
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [user, setUser] = useState({ nombre: '', apellido: '' });

  // Efecto para leer el token cuando se carga el componente
  useEffect(() => {
    if (token) {
      const decodedToken = decodeToken(token);
      setUser({
        nombre: decodedToken?.nombre || '',
        apellido: decodedToken?.apellido || '',
      });
    } else {
      setUser({ nombre: '', apellido: '' });
    }
  }, [token]);

  // Función de login
  const login = (newToken) => {
    localStorage.setItem('token', newToken);  // Guardamos el token en localStorage
    setToken(newToken);
    const decodedToken = decodeToken(newToken);
    setUser({
      nombre: decodedToken?.nombre || '',
      apellido: decodedToken?.apellido || '',
    });
  };

  // Función de logout
  const logout = () => {
    localStorage.removeItem('token');  // Eliminamos el token de localStorage
    setToken(null);
    setUser({ nombre: '', apellido: '' });
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Exportar el contexto y un hook personalizado para acceder a los valores
export { AuthContext };