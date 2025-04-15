import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Preguntero from './components/Preguntero';
import Login from './pages/Login';
import Header from './components/Header';
import Registro from './pages/Registro';
import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Verifica si el usuario está autenticado (puedes usar cookies o localStorage)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Verifica si el usuario tiene un token válido
        const response = await axios.get('https://flebologia-production.up.railway.app/api/users/me', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}` // Asegúrate de almacenar el token al hacer login
          }
        });
        if (response.status === 200) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <Router>
      {/* Solo muestra el Header si no estamos en las rutas de login o registro */}
      <Header />
      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        
        {/* Rutas privadas (solo accesibles si el usuario está autenticado) */}
        <Route
          path="/"
          element={isAuthenticated ? <Preguntero /> : <Login />} // Redirige a Login si no está autenticado
        />
      </Routes>
    </Router>
  );
}

export default App;
