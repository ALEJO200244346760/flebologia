// src/pages/ChatPage.js
import React from 'react';
import ChatMessages from '../components/ChatMessages';
import ChatForm from '../components/ChatForm';

const ChatPage = () => {
  return (
    <div className="flex flex-col h-screen pt-16 bg-gray-100">
      <header className="bg-blue-600 text-white py-3 text-center">
        <h2 className="text-xl font-semibold">Chat con el Dr. Jorja</h2>
      </header>
      <div className="flex-1 overflow-auto p-4">
        <ChatMessages />
      </div>
      <div className="p-4 bg-white shadow-md">
        <ChatForm />
      </div>
    </div>
  );
};

export default ChatPage;
