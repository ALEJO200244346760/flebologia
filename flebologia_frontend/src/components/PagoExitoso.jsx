import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';

const PagoExitoso = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const marcarComoPagadoYRedirigir = async () => {
      try {
        const token = localStorage.getItem('token');
        await axiosInstance.post('/api/payment/mark_as_paid', {}, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

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
