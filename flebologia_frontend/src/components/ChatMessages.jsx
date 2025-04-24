import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from '../axiosConfig';
import ChatForm from './ChatForm';
import useAuth from '../hooks/useAuth';

const ChatMessages = () => {
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const { user } = useAuth();

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
  }, [fetchMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 🕒 Actualización automática cada 3 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      fetchMessages();
    }, 3000);
    return () => clearInterval(interval);
  }, [fetchMessages]);

  return (
    <div className="w-full max-w-screen-lg mx-auto p-6 flex flex-col h-[calc(100vh-130px)]">
      {/* 🔙 Botón para volver */}
      <button
        onClick={() => window.history.back()}
        className="text-blue-600 text-sm flex items-center mb-4"
      >
        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Volver
      </button>

      <div className="flex-1 overflow-y-auto space-y-4">
        {messages.map((msg) => {
          const isMine = msg.sender.id === user.id;

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
