import './App.css';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Preguntero from './components/Preguntero';
import Login from './pages/Login';
import Header from './components/Header';
import Registro from './pages/Registro';
import { AuthProvider } from './context/AuthContext'; // Proveedor global
import useAuth from './hooks/useAuth';

function AppRoutes() {
  const location = useLocation();
  const isAuthRoute = location.pathname === '/login' || location.pathname === '/registro';

  return (
    <>
      {/* Solo ocultar el Header en login y registro */}
      {!isAuthRoute && <Header />}

      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />

        {/* Página principal SIEMPRE accesible */}
        <Route path="/" element={<Preguntero />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
