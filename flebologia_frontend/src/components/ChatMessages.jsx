import React, { useState, useEffect, useCallback } from 'react';
import axios from '../axiosConfig';
import useAuth from '../hooks/useAuth';
import ChatForm from './ChatForm';

const ChatMessages = () => {
  const [messages, setMessages] = useState([]);
  const { user } = useAuth(); // Accedemos al usuario logueado

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
        {messages.map((msg) => {
          const isFromCurrentUser = msg.sender.email === user.email;

          return (
            <div
              key={msg.id}
              className={`flex items-start ${isFromCurrentUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isFromCurrentUser && (
                <img
                  src="/doctor.jpg"
                  alt="Dr. Jorja"
                  className="w-10 h-10 rounded-full mr-2"
                />
              )}
              <div
                className={`max-w-xs p-3 rounded-lg shadow-md ${
                  isFromCurrentUser
                    ? 'bg-green-100 text-green-800'
                    : 'bg-blue-100 text-blue-800'
                }`}
              >
                {msg.content}
                {msg.type === 'IMAGE' && (
                  <img
                    src={msg.mediaUrl}
                    alt="Imagen"
                    className="mt-2 max-w-full rounded-lg"
                  />
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
          );
        })}
      </div>

      {/* ChatForm llama a fetchMessages después de enviar un mensaje */}
      <ChatForm onMessageSent={fetchMessages} />
    </div>
  );
};

export default ChatMessages;
