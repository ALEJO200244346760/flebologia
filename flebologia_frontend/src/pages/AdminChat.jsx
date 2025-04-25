import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../axiosConfig';
import useAuth from '../hooks/useAuth';
import { PaperClipIcon, MicrophoneIcon } from '@heroicons/react/24/outline';

const AdminChat = () => {
  const { userId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');
  const [mediaFile, setMediaFile] = useState(null);
  const [type, setType] = useState('TEXT');
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const [audioChunks, setAudioChunks] = useState([]);

  const fileInputRef = useRef(null);
  const audioInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const fetchMessages = useCallback(async () => {
    try {
      const res = await axios.get(`/api/chat/admin/mensajes/${userId}`);
      setMessages(res.data);
    } catch (err) {
      console.error('Error cargando mensajes:', err);
    }
  }, [userId]);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(() => {
      fetchMessages();
    }, 3000);
    return () => clearInterval(interval);
  }, [fetchMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() && !mediaFile) return;
  
    const formData = new FormData();
    formData.append('userId', userId); // 👈 ESTA LÍNEA ES CLAVE
    formData.append('content', content);
    formData.append('type', type);
    if (mediaFile) formData.append('media', mediaFile);
  
    try {
      await axios.post('/api/chat/admin/enviar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setContent('');
      setMediaFile(null);
      setType('TEXT');
      await fetchMessages();
    } catch (err) {
      console.error('Error enviando mensaje:', err);
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
    <div className="w-full max-w-screen-lg mx-auto pt-6 px-6 flex flex-col h-screen">
      {/* 🔙 Botón Volver */}
      <button
        onClick={() => navigate(user?.role === 'ADMIN' ? '/admin/chat' : '/preguntero')}
        className="text-blue-500 text-sm flex items-center mb-4"
      >
        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Volver
      </button>

      <h2 className="text-xl font-bold mb-4">Chat con Usuario</h2>

      {/* Mensajes */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {messages
          .filter(msg => msg.sender.id == userId || msg.recipient.id == userId)
          .map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender.id === user?.id ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-md md:max-w-lg lg:max-w-xl p-4 rounded-lg shadow ${
                  msg.sender.id === user?.id
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
          ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Formulario de mensaje */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center space-x-2 px-4 py-3 border-t border-gray-300 bg-white"
      >
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Escribe tu mensaje..."
          className="flex-1 resize-none p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

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

        <button
          type="button"
          onClick={recording ? stopRecording : startRecording}
          className={`p-2 rounded-full ${
            recording ? 'bg-red-500' : 'bg-gray-100 hover:bg-gray-200'
          }`}
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
    </div>
  );
};

export default AdminChat;
