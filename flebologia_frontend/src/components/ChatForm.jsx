// src/components/ChatForm.js
import React, { useState } from 'react';
import axios from '../axiosConfig';

const ChatForm = () => {
  const [content, setContent] = useState('');
  const [mediaFile, setMediaFile] = useState(null);
  const [type, setType] = useState('TEXT');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() && !mediaFile) return;

    const formData = new FormData();
    formData.append('content', content);
    formData.append('type', type);
    if (mediaFile) formData.append('media', mediaFile);

    try {
      await axios.post('/api/chat/send', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setContent('');
      setMediaFile(null);
      setType('TEXT');
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setMediaFile(file);
    if (file.type.startsWith('image/')) {
      setType('IMAGE');
    } else if (file.type.startsWith('audio/')) {
      setType('AUDIO');
    } else if (file.type.startsWith('video/')) {
      setType('VIDEO');
    } else {
      setType('TEXT'); // fallback
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-2 mt-4 p-2 border-t">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Escribe tu mensaje..."
        className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none resize-none"
        rows={2}
      />

      {/* Botón de adjuntar archivo (➕) */}
      <label className="cursor-pointer p-2 text-blue-600 hover:text-blue-800">
        ➕
        <input
          type="file"
          accept="image/*,audio/*,video/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </label>

      {/* Botón de enviar */}
      <button
        type="submit"
        className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 w-10 h-10 flex items-center justify-center"
        title="Enviar"
      >
        {type === 'AUDIO' ? '🎤' : '📤'}
      </button>
    </form>
  );
};

export default ChatForm;
