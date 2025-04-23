// src/components/ChatForm.js
import React, { useState } from 'react';
import axios from '../axiosConfig';

const ChatForm = () => {
  const [content, setContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      await axios.post('/api/chat/send', { content, type: 'TEXT' });
      setContent('');
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Escribe tu mensaje..."
        className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <button
        type="submit"
        className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:outline-none"
      >
        Enviar
      </button>
    </form>
  );
};

export default ChatForm;
