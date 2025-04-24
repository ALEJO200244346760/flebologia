import React from 'react';
import ChatMessages from '../components/ChatMessages';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ChatPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="flex flex-col h-screen pt-16 bg-gray-100">
      {/* 🔙 Botón Volver */}
      <button
        onClick={() => navigate(user?.role === 'ADMIN' ? '/admin/chat' : '/preguntero')}
        className="text-blue-500 text-sm flex items-center ml-6 mb-2"
      >
        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Volver
      </button>

      <header className="bg-blue-600 text-white py-3 text-center">
        <h2 className="text-xl font-semibold">Chat con el Dr. Jorja</h2>
      </header>

      {/* ✅ Este incluye ChatForm internamente */}
      <ChatMessages />
    </div>
  );
};

export default ChatPage;
