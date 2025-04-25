import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [usuariosConChat, setUsuariosConChat] = useState([]);
  const [todosLosUsuarios, setTodosLosUsuarios] = useState([]);
  const [tab, setTab] = useState('chats');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/chat/admin/usuarios')
      .then(res => setUsuariosConChat(res.data))
      .catch(err => console.error('Error cargando usuarios con chat:', err));

    axios.get('/api/admin/users')
      .then(res => setTodosLosUsuarios(res.data))
      .catch(err => console.error('Error cargando todos los usuarios:', err));
  }, []);

  const eliminarUsuario = async (id) => {
    if (!window.confirm('¿Eliminar este usuario?')) return;
    await axios.delete(`/api/admin/users/${id}`);
    setTodosLosUsuarios(prev => prev.filter(u => u.id !== id));
  };

  const revocarPago = async (id) => {
    await axios.post(`/api/admin/users/${id}/revocar-pago`);
    alert('Pago revocado');
  };

  return (
    <div className="p-6">
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setTab('chats')}
          className={`px-4 py-2 rounded ${tab === 'chats' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Mensajes
        </button>
        <button
          onClick={() => setTab('usuarios')}
          className={`px-4 py-2 rounded ${tab === 'usuarios' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Usuarios
        </button>
      </div>

      {tab === 'chats' && (
        <>
          <h2 className="text-xl font-bold mb-4">Chats de Pacientes</h2>
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
        </>
      )}

      {tab === 'usuarios' && (
        <>
          <h2 className="text-xl font-bold mb-4">Gestión de Usuarios</h2>
          <ul className="space-y-2">
            {todosLosUsuarios.map((user) => (
              <li key={user.id} className="p-4 bg-white shadow rounded flex justify-between items-center">
                <div>
                  <p className="font-bold">{user.name || 'Sin nombre'} ({user.email})</p>
                  <p className="text-sm text-gray-600">Rol: {user.role}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                    onClick={() => revocarPago(user.id)}
                  >
                    Revocar Pago
                  </button>
                  <button
                    className="bg-red-600 text-white px-3 py-1 rounded"
                    onClick={() => eliminarUsuario(user.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
