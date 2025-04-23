import React, { useState, useEffect, useCallback } from 'react';
import axios from '../axiosConfig';
import ChatForm from './ChatForm';

const ChatMessages = () => {
  const [messages, setMessages] = useState([]);

  const fetchMessages = useCallback(async () => {
    try {
      const response = await axios.get('/api/chat/mensajes');
      setMessages(response.data);
    } catch (error) {
      console.error('Error al cargar mensajes:', error);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="space-y-4 mb-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start ${
              msg.sender.email === 'drjorja@flebologia.com' ? 'justify-start' : 'justify-end'
            }`}
          >
            <div
              className={`max-w-xs p-3 rounded-lg shadow-md ${
                msg.sender.email === 'drjorja@flebologia.com'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-green-100 text-green-800'
              }`}
            >
              {msg.content}
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
      </div>

      {/* ⬇️ Ahora ChatForm le pasa una función a llamar cuando se envía mensaje */}
      <ChatForm onMessageSent={fetchMessages} />
    </div>
  );
};

export default ChatMessages;
