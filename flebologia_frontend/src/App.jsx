import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Preguntero from './components/Preguntero';
import Login from './pages/Login';
import Header from './components/Header';
import Registro from './pages/Registro';

function App() {
  return (
    <Router>
      {/* Solo muestra el Header si no estamos en las rutas de login o registro */}
      <Header />
      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        
        {/* Rutas privadas (solo accesibles si el usuario está autenticado) */}
        <Route path="/" element={<Preguntero />} />
      </Routes>
    </Router>
  );
}

export default App;
