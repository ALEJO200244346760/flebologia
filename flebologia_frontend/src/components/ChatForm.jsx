import React, { useState } from 'react';
import axios from '../axiosConfig';
const ChatForm = () => {
  const [content, setContent] = useState('');
  const [type, setType] = useState('TEXT');
  const [mediaFile, setMediaFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMediaFile(file);
      if (file.type.startsWith('image/')) {
        setType('IMAGE');
      } else if (file.type.startsWith('audio/')) {
        setType('AUDIO');
      } else if (file.type.startsWith('video/')) {
        setType('VIDEO');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('content', content);
    formData.append('type', type);
    if (mediaFile) {
      formData.append('media', mediaFile);
    }

    try {
      const response = await axios.post(
        'https://flebologia-production.up.railway.app/api/chat/send',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      console.log('Mensaje enviado:', response.data);
      setContent('');
      setMediaFile(null);
      setType('TEXT');
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-3xl mx-auto p-4 bg-white rounded-lg shadow-lg space-y-4"
    >
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Escribe tu mensaje..."
        className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <input
        type="file"
        onChange={handleFileChange}
        className="w-full file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-500 file:text-white hover:file:bg-blue-600"
      />

      <button
        type="submit"
        className="w-full py-3 text-white bg-blue-600 rounded-lg font-semibold hover:bg-blue-700 transition-all"
      >
        Enviar
      </button>
    </form>
  );
};

export default ChatForm;
