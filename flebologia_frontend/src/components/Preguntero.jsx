import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import Cobrar from './Cobrar';

function Preguntero() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasPaid, setHasPaid] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axiosInstance.get('/api/users/me')
        .then((res) => {
          setUser(res.data);
          checkPaymentStatus();
        })
        .catch(() => {
          localStorage.removeItem('token');
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const checkPaymentStatus = async () => {
    try {
      const res = await axiosInstance.get('/api/payment/status');
      setHasPaid(res.data.hasPaid);
      setLoading(false);
    } catch (error) {
      console.error('Error verificando pago:', error);
      setLoading(false);
    }
  };

  const handleEnterChat = () => {
    if (hasPaid) {
      navigate('/chat');
    } else {
      alert('Debes pagar antes de acceder al chat.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-400 to-blue-600 p-4">
      <div className="bg-white p-6 sm:p-8 md:p-10 rounded-xl shadow-lg w-full max-w-5xl flex flex-col md:flex-row items-center space-y-8 md:space-y-0 md:space-x-8">

        {/* Imagen del doctor - Mostrar primero en móvil */}
        <div className="flex md:hidden justify-center">
          <img
            src="/doctor.jpg"
            alt="Doctor"
            className="w-32 h-32 sm:w-40 sm:h-40 object-cover rounded-full shadow-lg border-4 border-white"
          />
        </div>

        {/* Sección Preguntas */}
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-800 mb-4">Preguntas Frecuentes</h2>
          <ul className="text-base sm:text-lg text-gray-600 space-y-3">
            <li>¿Qué son las varices?</li>
            <li>¿Cuáles son los síntomas más comunes?</li>
            <li>¿Qué tratamientos existen para las varices?</li>
            <li>¿Es necesario operar siempre?</li>
            <li>¿Cómo prevenir varices?</li>
          </ul>
        </div>

        {/* Botones / Cobro */}
        <div className="w-full md:w-auto flex flex-col items-center space-y-4">
          {loading ? (
            <p>Cargando...</p>
          ) : user ? (
            hasPaid ? (
              <button
                onClick={handleEnterChat}
                className="px-6 py-3 text-lg sm:text-xl font-bold text-white bg-green-500 rounded-lg shadow-lg hover:bg-green-600 transition-all duration-300"
              >
                Ir al Chat
              </button>
            ) : (
              <Cobrar />
            )
          ) : (
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate('/login')}
                className="px-6 py-3 text-lg font-bold text-white bg-blue-500 rounded-lg shadow-lg hover:bg-blue-600 transition-all duration-300"
              >
                Iniciar Sesión
              </button>
              <button
                onClick={() => navigate('/registro')}
                className="px-6 py-3 text-lg font-bold text-white bg-gray-500 rounded-lg shadow-lg hover:bg-gray-600 transition-all duration-300"
              >
                Registrarse
              </button>
            </div>
          )}
        </div>

        {/* Imagen Doctor - Oculta en móvil, visible en desktop */}
        <div className="hidden md:flex md:flex-1 justify-center">
          <img
            src="/doctor.jpg"
            alt="Doctor"
            className="w-48 h-48 object-cover rounded-full shadow-lg border-4 border-white"
          />
        </div>

      </div>
    </div>
  );
}

export default Preguntero;
