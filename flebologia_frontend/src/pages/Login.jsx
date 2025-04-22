// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import useAuth from '../hooks/useAuth'; // ✅ Importar el hook del contexto

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth(); // ✅ Usar login del contexto

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log('Iniciando sesión con:', { email, password });

    try {
      const res = await axiosInstance.post('/api/users/login', { email, password });

      const { token } = res.data;

      console.log('Respuesta del servidor:', res);

      // ✅ Usar login del contexto para actualizar el estado global
      login(token); // 👈 Esto hace todo: setToken, setUser y re-render

      // ✅ Verificamos si ya pagó
      try {
        const checkPago = await axiosInstance.get('/api/chat', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (checkPago.status === 200) {
          navigate('/chat');
        }
      } catch (error) {
        if (error.response?.status === 403) {
          navigate('/pago');
        } else {
          console.error('Error verificando pago:', error);
          alert('Error inesperado al verificar el estado de pago');
        }
      }
    } catch (error) {
      if (error.response) {
        console.error('Respuesta del error:', error.response.data);
        alert('Error en login: ' + error.response.data);
      } else {
        console.error('Error en la solicitud:', error);
        alert('Error desconocido al intentar iniciar sesión');
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-sm w-full">
        <h2 className="text-2xl font-bold mb-4 text-center">Iniciar Sesión</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Correo electrónico"
            className="w-full p-2 border rounded mb-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Contraseña"
            className="w-full p-2 border rounded mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
            Iniciar Sesión
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          ¿No tienes cuenta?{' '}
          <Link to="/registro" className="text-blue-500 hover:underline">
            Registrarse
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
