import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig'; // Importa la instancia de Axios

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log('Iniciando sesión con:', { email, password }); // Agregado para depuración
    try {
      const res = await axiosInstance.post('/api/users/login', { email, password }); // Usar la instancia de Axios configurada
      console.log('Respuesta del servidor:', res); // Agregado para depuración
      localStorage.setItem('token', res.data.token); // Almacena el token en el almacenamiento local
      navigate('/'); // Redirige al inicio después del login exitoso
    } catch (error) {
      // Agregado para mejorar el manejo de errores
      if (error.response) {
        console.error('Respuesta del error:', error.response.data);
        alert('Error en login: ' + error.response.data); // Muestra el error del backend
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
      </div>
    </div>
  );
}

export default Login;
