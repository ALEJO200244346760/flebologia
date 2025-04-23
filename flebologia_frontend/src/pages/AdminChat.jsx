import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../axiosConfig';

const AdminChat = () => {
  const { userId } = useParams();
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');

  useEffect(() => {
    axios.get(`/api/chat/admin/mensajes/${userId}`)
      .then(res => setMessages(res.data))
      .catch(err => console.error('Error cargando mensajes:', err));
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      await axios.post('/api/chat/admin/enviar', {
        userId: parseInt(userId),
        content,
        type: 'TEXT',
      });
      setContent('');
      // Volver a cargar
      const res = await axios.get(`/api/chat/admin/mensajes/${userId}`);
      setMessages(res.data);
    } catch (err) {
      console.error('Error enviando mensaje:', err);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Chat con Usuario</h2>
      <div className="space-y-2 mb-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`p-3 rounded ${msg.sender.email === 'drjorja@flebologia.com' ? 'bg-blue-100' : 'bg-gray-100'}`}>
            <p><strong>{msg.sender.email}:</strong> {msg.content}</p>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Escribe tu respuesta..."
          className="flex-1 border p-2 rounded"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Enviar
        </button>
      </form>
    </div>
  );
};

export default AdminChat;
