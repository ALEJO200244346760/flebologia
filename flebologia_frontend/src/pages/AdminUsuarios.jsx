import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';

const AdminUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);

  const fetchUsuarios = async () => {
    try {
      const res = await axios.get('/api/users/all');
      setUsuarios(res.data);
    } catch (err) {
      console.error('Error al cargar usuarios:', err);
    }
  };

  const handleEliminar = async (id) => {
    if (window.confirm('¿Estás seguro de que querés eliminar este usuario?')) {
      try {
        await axios.delete(`/api/users/${id}`);
        fetchUsuarios();
      } catch (err) {
        console.error('Error al eliminar usuario:', err);
      }
    }
  };

  const handleRevocarPago = async (id) => {
    try {
      await axios.post(`/api/payment/revocar/${id}`);
      fetchUsuarios();
    } catch (err) {
      console.error('Error al revocar pago:', err);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Control de Usuarios</h2>
      <table className="w-full border shadow rounded overflow-hidden">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="p-2">ID</th>
            <th className="p-2">Email</th>
            <th className="p-2">Nombre</th>
            <th className="p-2">Pagó</th>
            <th className="p-2">Rol</th>
            <th className="p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((user) => (
            <tr key={user.id} className="text-center border-b">
              <td className="p-2">{user.id}</td>
              <td className="p-2">{user.email}</td>
              <td className="p-2">{user.name || '-'}</td>
              <td className="p-2">{user.hasPaid ? '✅' : '❌'}</td>
              <td className="p-2">{user.role}</td>
              <td className="p-2 space-x-2">
                <button
                  onClick={() => handleRevocarPago(user.id)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                >
                  Revocar Pago
                </button>
                <button
                  onClick={() => handleEliminar(user.id)}
                  className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUsuarios;
