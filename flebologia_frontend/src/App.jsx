// src/App.js
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Preguntero from './components/Preguntero';
import Login from './pages/Login';
import Header from './components/Header';
import Chat from './pages/ChatPage';
import Registro from './pages/Registro';
import Cobrar from './components/Cobrar';
import PagoExitoso from './components/PagoExitoso';
import { AuthProvider } from './context/AuthContext'; // 👈 importante

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />

        <Routes>
          <Route path="/" element={<Preguntero />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/pago" element={<Cobrar />} />
          <Route path="/pago-exitoso" element={<PagoExitoso />} />
          <Route path="/admin/chat" element={<AdminDashboard />} />
          <Route path="/admin/chat/:userId" element={<AdminChat />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
