import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig'; // Importa la instancia de Axios configurada

function Registro() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [users, setUsers] = useState([]); // Estado para almacenar los usuarios registrados
  const navigate = useNavigate();

  // Verificar si ya hay un token y redirigir si es el caso
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Si ya tienes un token, redirigir a la página principal
      navigate('/');
    }
  }, [navigate]);

  // Función para obtener los usuarios registrados
  const fetchUsers = async () => {
    try {
      const res = await axiosInstance.get('/api/users');
      setUsers(res.data);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
    }
  };

  // Manejar el registro de un nuevo usuario
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post('/api/users/register', 
        { name, email, password },
        { headers: { 'Content-Type': 'application/json' } }
      );
      // Almacena el token
      localStorage.setItem('token', res.data.token);
      // Obtener los usuarios registrados después de registrarse
      fetchUsers();
      navigate('/'); // Redirige al inicio después del registro exitoso
    } catch (error) {
      console.error('Error en registro:', error);
      alert('Error al registrarse');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-sm w-full">
        <h2 className="text-2xl font-bold mb-4 text-center">Registrarse</h2>
        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Nombre"
            className="w-full p-2 border rounded mb-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
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
          <button type="submit" className="w-full bg-green-500 text-white p-2 rounded">
            Registrarse
          </button>
        </form>
      </div>
    </div>
  );
}

export default Registro;
