import React from 'react';
import ChatMessages from '../components/ChatMessages';

const ChatPage = () => {
  return (
    <div className="flex flex-col h-screen pt-16 bg-gray-100">
      <header className="bg-blue-600 text-white py-3 text-center">
        <h2 className="text-xl font-semibold">Chat con el Dr. Jorja</h2>
      </header>

      {/* ✅ Este incluye ChatForm internamente */}
      <ChatMessages />
    </div>
  );
};

export default ChatPage;
