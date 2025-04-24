import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from '../axiosConfig';
import ChatForm from './ChatForm';
import useAuth from '../hooks/useAuth';

const ChatMessages = () => {
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const { user } = useAuth(); // ← asegurate que este user tenga `id` y `email`

  const fetchMessages = useCallback(async () => {
    try {
      const response = await axios.get('/api/chat/mensajes');
      setMessages(response.data);
    } catch (error) {
      console.error('Error al cargar mensajes:', error);
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    fetchMessages();

    const interval = setInterval(() => {
      fetchMessages();
    }, 3000);

    return () => clearInterval(interval);
  }, [fetchMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="w-full max-w-screen-lg mx-auto p-6 flex flex-col h-[calc(100vh-130px)]">
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {messages.map((msg) => {
          const isMine =
            msg.sender.id === user?.id || msg.sender.email === user?.email;

          return (
            <div
              key={msg.id}
              className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-md md:max-w-lg lg:max-w-xl p-4 rounded-lg shadow ${
                  isMine
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
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <ChatForm onMessageSent={fetchMessages} />
    </div>
  );
};

export default ChatMessages;
