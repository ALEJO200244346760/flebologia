import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Preguntero from './components/Preguntero';
import Login from './pages/Login';
import Header from './components/Header';
import Chat from './pages/ChatPage'; // Asegúrate de tener esta página
import Registro from './pages/Registro';
import { AuthProvider } from './context/AuthContext'; // Proveedor de autenticación

function App() {
  return (
    <AuthProvider>
      <Router>
        {/* ✅ Header se muestra siempre */}
        <Header />

        <Routes>
          {/* ✅ Rutas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />

          {/* ✅ Página principal accesible para todos */}
          <Route path="/" element={<Preguntero />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
