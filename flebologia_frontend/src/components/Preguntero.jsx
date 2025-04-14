import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig'; // Importa la instancia de Axios
import Cobrar from './Cobrar';

function Preguntero() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasPaid, setHasPaid] = useState(false);

  // Verificar usuario y si ha pagado
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axiosInstance.get('/api/users/me') // Usa la instancia de Axios configurada
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

  // Verificar si el usuario ya ha pagado
  const checkPaymentStatus = async () => {
    try {
      const res = await axiosInstance.get('/api/payment/status'); // Usa la instancia de Axios configurada
      setHasPaid(res.data.hasPaid);
      setLoading(false);
    } catch (error) {
      console.error('Error verificando pago:', error);
      setLoading(false);
    }
  };

  // Intentar entrar al chat
  const handleEnterChat = () => {
    if (hasPaid) {
      navigate('/chat');
    } else {
      alert('Debes pagar antes de acceder al chat.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-400 to-blue-600 p-0 m-0">
      <div className="bg-white p-10 rounded-xl shadow-lg w-full max-w-full flex flex-col md:flex-row items-center space-y-8 md:space-y-0 md:space-x-8">

        <div className="flex-1 text-center md:text-left">
          <h2 className="text-4xl font-extrabold text-gray-800 mb-4">Preguntas Frecuentes</h2>
          <ul className="text-lg text-gray-600 space-y-3">
            <li>¿Qué es la flebología?</li>
            <li>¿Cuáles son los síntomas más comunes?</li>
            <li>¿Qué tratamientos existen para la flebología?</li>
            <li>¿Es necesario operar siempre?</li>
            <li>¿Cómo prevenir problemas flebológicos?</li>
          </ul>
        </div>

        <div className="flex-shrink-0">
          {loading ? (
            <p>Cargando...</p>
          ) : user ? (
            hasPaid ? (
              <button
                onClick={handleEnterChat}
                className="px-8 py-4 text-xl font-bold text-white bg-green-500 rounded-lg shadow-lg hover:bg-green-600 transition-all duration-300 ease-in-out"
              >
                Ir al Chat
              </button>
            ) : (
              <Cobrar />
            )
          ) : (
            <div>
              <button
                onClick={() => navigate('/login')}
                className="px-8 py-4 text-xl font-bold text-white bg-blue-500 rounded-lg shadow-lg hover:bg-blue-600 transition-all duration-300 ease-in-out mr-2"
              >
                Iniciar Sesión
              </button>
              <button
                onClick={() => navigate('/registro')}
                className="px-8 py-4 text-xl font-bold text-white bg-gray-500 rounded-lg shadow-lg hover:bg-gray-600 transition-all duration-300 ease-in-out"
              >
                Registrarse
              </button>
            </div>
          )}
        </div>

        <div className="flex-1 text-center">
          <img
            src="public/doctor.jpg"
            alt="Doctor"
            className="w-48 h-48 object-cover rounded-full shadow-lg border-4 border-white"
          />
        </div>

      </div>
    </div>
  );
}

export default Preguntero;
