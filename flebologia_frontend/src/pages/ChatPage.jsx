import React from 'react';
import ChatForm from '../components/ChatForms';
import ChatMessages from '../components/ChatMessages';

const ChatPage = () => {
  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Chat con el Dr. Jorja</h2>
      <div className="mb-4 max-h-[400px] overflow-y-auto border rounded-lg p-2 bg-white shadow">
        <ChatMessages />
      </div>
      <ChatForm />
    </div>
  );
};

export default ChatPage;
