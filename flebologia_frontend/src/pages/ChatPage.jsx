import React from 'react';
import ChatMessages from '../components/ChatMessages';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const ChatPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="flex flex-col h-screen pt-16 bg-gray-100">
      

      <header className="bg-blue-600 text-white py-3 text-center">
        <h2 className="text-xl font-semibold">Chat con el Dr. Jorja</h2>
      </header>

      <ChatMessages />
    </div>
  );
};

export default ChatPage;
