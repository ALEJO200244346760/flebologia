import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../axiosConfig';

const AdminChat = () => {
  const { userId } = useParams();
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');
  const messagesEndRef = useRef(null);

  // Función para obtener los mensajes
  const fetchMessages = useCallback(async () => {
    try {
      const res = await axios.get(`/api/chat/admin/mensajes/${userId}`);
      setMessages(res.data);
    } catch (err) {
      console.error('Error cargando mensajes:', err);
    }
  }, [userId]);

  // Desplazamiento hacia abajo cuando se cargan los mensajes nuevos
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Efecto para cargar los mensajes cuando se monta el componente
  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Efecto para hacer scroll hacia abajo cada vez que los mensajes cambian
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Enviar un mensaje al servidor
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      await axios.post('/api/chat/admin/enviar', {
        userId: parseInt(userId),
        content,
        type: 'TEXT', // Esto puede ser 'TEXT', 'IMAGE', 'AUDIO', o 'VIDEO'
      });
      setContent('');
      await fetchMessages();
    } catch (err) {
      console.error('Error enviando mensaje:', err);
    }
  };

  return (
    <div className="w-full max-w-screen-lg mx-auto p-6 flex flex-col h-[calc(100vh-130px)]">
      <h2 className="text-xl font-bold mb-4">Chat con Usuario</h2>

      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {messages
          .filter(
            (msg) =>
              (msg.sender.email === 'admin@flebologia.com' && msg.recipient.id == userId) ||
              (msg.sender.id == userId && msg.recipient.email === 'admin@flebologia.com')
          )
          .map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.sender.email === 'admin@flebologia.com' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-md md:max-w-lg lg:max-w-xl p-4 rounded-lg shadow ${
                  msg.sender.email === 'admin@flebologia.com'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-blue-100 text-blue-800'
                }`}
              >
                <p className="text-sm font-semibold mb-1">{msg.sender.email}</p>
                <p>{msg.content}</p>
                {msg.type === 'IMAGE' && (
                  <img src={msg.mediaUrl} alt="Imagen" className="mt-2 max-w-full rounded-lg" />
                )}
                {msg.type === 'AUDIO' && (
                  <audio controls className="mt-2 w-full">
                    <source src={msg.mediaUrl} />
                  </audio>
                )}
                {msg.type === 'VIDEO' && (
                  <video controls className="mt-2 w-full rounded-lg">
                    <source src={msg.mediaUrl} />
                  </video>
                )}
              </div>
            </div>
          ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2 mt-4">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Escribe tu mensaje..."
          className="flex-1 border p-3 rounded-lg shadow"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition"
        >
          Enviar
        </button>
      </form>
    </div>
  );
};

export default AdminChat;
