import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [usuarios, setUsuarios] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/chat/admin/usuarios')
      .then(res => setUsuarios(res.data))
      .catch(err => console.error('Error cargando usuarios:', err));
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Chats de Pacientes</h2>
      <ul className="space-y-2">
        {usuarios.map((user) => (
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
