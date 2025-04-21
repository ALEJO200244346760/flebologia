import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';

const Cobrar = () => {
  const [preferenceId, setPreferenceId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const createPreference = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axiosInstance.post(
          '/api/payment/create_preference',
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
  
        // Verifica que la respuesta tenga el init_point
        console.log("init_point recibido:", response.data.init_point);
        
        if (response.data.init_point) {
          setPreferenceId(response.data.init_point);
        } else {
          console.error('Error: no se recibió el init_point');
        }
  
      } catch (error) {
        console.error('Error creando preferencia de pago:', error);
      }
    };
  
    createPreference();
  }, []);  

  // ✅ Nuevo useEffect para verificar si ya pagó y redirigir
  useEffect(() => {
    const checkPago = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axiosInstance.get('/api/chat', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 200) {
          navigate('/chat');
        }
      } catch (error) {
        // Si aún no pagó, no hacemos nada
      }
    };

    const interval = setInterval(checkPago, 3000); // Cada 3 segundos
    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {preferenceId ? (
        <>
          <h2 className="mb-4 text-xl font-semibold">Para acceder al chat con el doctor, realiza el pago:</h2>
          <a href={preferenceId} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Pagar con Mercado Pago
          </a>
          <p className="mt-4 text-sm text-gray-600">Una vez confirmado el pago, serás redirigido automáticamente al chat.</p>
        </>
      ) : (
        <p>Cargando pago...</p>
      )}
    </div>
  );
};

export default Cobrar;
