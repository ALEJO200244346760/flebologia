import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig';
const ChatMessages = () => {
  const [messages, setMessages] = useState([]);

  const fetchMessages = async () => {
    try {
      const response = await axios.get('https://flebologia-production.up.railway.app/api/chat/mensajes');
      setMessages(response.data);
    } catch (error) {
      console.error('Error al cargar mensajes:', error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-4">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className="bg-white rounded-lg shadow-md p-4 border border-gray-200"
        >
          <div className="text-sm text-gray-500 mb-2">{msg.sender.email}</div>
          <div className="text-gray-800 mb-2">{msg.content}</div>

          {msg.type === 'IMAGE' && (
            <img
              src={`https://flebologia-production.up.railway.app${msg.mediaUrl}`}
              alt="Imagen"
              className="max-w-full rounded-lg"
            />
          )}

          {msg.type === 'AUDIO' && (
            <audio controls className="w-full">
              <source src={`https://flebologia-production.up.railway.app${msg.mediaUrl}`} />
            </audio>
          )}

          {msg.type === 'VIDEO' && (
            <video controls className="w-full rounded-lg">
              <source src={`https://flebologia-production.up.railway.app${msg.mediaUrl}`} />
            </video>
          )}
        </div>
      ))}
    </div>
  );
};

export default ChatMessages;
