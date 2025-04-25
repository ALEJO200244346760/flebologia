import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [usuariosConChat, setUsuariosConChat] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/chat/admin/usuarios')
      .then(res => setUsuariosConChat(res.data))
      .catch(err => console.error('Error cargando usuarios con chat:', err));
  }, []);

  return (
    <div className="pt-28 px-6"> {/* Aumentamos el padding top */}
      {/* 👉 Botón "Usuarios" alineado a la derecha, pero dentro del flujo */}
      <div className="flex justify-end mb-6">
        <button
          onClick={() => navigate('/admin/usuarios')}
          className="bg-gray-800 text-white px-4 py-2 rounded shadow hover:bg-gray-700"
        >
          Usuarios
        </button>
      </div>

      <h2 className="text-xl font-bold mb-6">Chats de Pacientes</h2>
      <ul className="space-y-2">
        {usuariosConChat.map((user) => (
          <li key={user.id} className="p-4 bg-white shadow rounded flex justify-between items-center">
            <span>{user.name} ({user.email})</span>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded"
              onClick={() => navigate(`/admin/chat/${user.id}`)}
            >
              Ver Chat
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;
