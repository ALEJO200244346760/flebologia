import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';

const PagoExitoso = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const marcarComoPagadoYRedirigir = async () => {
      try {
        await axiosInstance.post('/api/payment/confirmar-pago');

        // Espera 1 segundo y redirige al chat
        setTimeout(() => {
          navigate('/chat');
        }, 1000);
      } catch (error) {
        console.error('Error al marcar como pagado:', error);
      }
    };

    marcarComoPagadoYRedirigir();
  }, [navigate]);

  return <p>Pago exitoso. Redirigiendo al chat...</p>;
};

export default PagoExitoso;
