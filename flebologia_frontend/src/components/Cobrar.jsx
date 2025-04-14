import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosConfig'; // Importa la instancia de Axios configurada

const Cobrar = () => {
  const [preferenceId, setPreferenceId] = useState(null);

  useEffect(() => {
    const createPreference = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axiosInstance.post(
          '/api/payment/create_preference', // Usa la URL relativa ya configurada en axiosInstance
          {},
          { headers: { Authorization: `Bearer ${token}` } } // Autenticación con el token almacenado
        );

        setPreferenceId(response.data.init_point); // Guarda el punto de inicio de la preferencia de pago
      } catch (error) {
        console.error('Error creando preferencia de pago:', error);
      }
    };

    createPreference();
  }, []);

  return (
    <div>
      {preferenceId ? (
        <a href={preferenceId} className="btn-pago">
          Pagar con Mercado Pago
        </a>
      ) : (
        <p>Cargando pago...</p>
      )}
    </div>
  );
};

export default Cobrar;
