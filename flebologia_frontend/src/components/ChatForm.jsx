import React, { useState, useRef, useEffect } from 'react';
import axios from '../axiosConfig';
import { PaperClipIcon, MicrophoneIcon } from '@heroicons/react/24/outline';

const ChatForm = ({ onMessageSent }) => {
  const [content, setContent] = useState('');
  const [mediaFile, setMediaFile] = useState(null);
  const [type, setType] = useState('TEXT');
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const [audioChunks, setAudioChunks] = useState([]);

  const fileInputRef = useRef(null);
  const audioInputRef = useRef(null);

  // 🎙️ INICIAR GRABACIÓN
  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    mediaRecorderRef.current = recorder;
    setRecording(true);
    setAudioChunks([]);

    recorder.ondataavailable = (e) => {
      setAudioChunks(prev => [...prev, e.data]);
    };

    recorder.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
      const audioFile = new File([audioBlob], 'grabacion.webm', { type: 'audio/webm' });
      setMediaFile(audioFile);
      setType('AUDIO');
      setRecording(false);
    };

    recorder.start();
  };

  // 🛑 DETENER GRABACIÓN
  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

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

      onMessageSent?.(); // 🔄 llamar para recargar mensajes
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
    }
  };

  const handleFileChange = (e, mediaType) => {
    const file = e.target.files[0];
    if (file) {
      setMediaFile(file);
      setType(mediaType);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-2 px-4 py-3 border-t border-gray-300">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Escribe tu mensaje..."
        className="flex-1 resize-none p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Imagen/video */}
      <button
        type="button"
        onClick={() => fileInputRef.current.click()}
        className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
        title="Adjuntar archivo"
      >
        <PaperClipIcon className="h-6 w-6 text-gray-600" />
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        onChange={(e) =>
          handleFileChange(e, e.target.files[0].type.startsWith('image/') ? 'IMAGE' : 'VIDEO')
        }
        className="hidden"
      />

      {/* 🎙️ Micrófono */}
      <button
        type="button"
        onClick={recording ? stopRecording : startRecording}
        className={`p-2 rounded-full ${recording ? 'bg-red-500' : 'bg-gray-100 hover:bg-gray-200'}`}
        title="Grabar audio"
      >
        <MicrophoneIcon className="h-6 w-6 text-white" />
      </button>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
      >
        Enviar
      </button>
    </form>
  );
};

export default ChatForm;
