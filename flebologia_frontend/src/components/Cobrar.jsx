import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const Cobrar = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);

  useEffect(() => {
    const script = document.createElement("script");

    // Este es el script de Mercado Pago que recibiste
    script.src = "https://www.mercadopago.com.ar/integrations/v1/web-payment-checkout.js";
    script.setAttribute("data-preference-id", "29203240-0284652e-14ee-4441-86e3-2e285e8f8b9f"); // Usar el ID que te dieron
    script.setAttribute("data-source", "button");
    script.type = "text/javascript";

    // Lo agregamos al contenedor cuando esté montado
    if (containerRef.current) {
      containerRef.current.innerHTML = ""; // Limpiar por si acaso
      containerRef.current.appendChild(script);
    }
  }, []);

  // Redirección automática si el usuario ya pagó (opcional)
  useEffect(() => {
    const checkPago = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('https://flebologia-production.up.railway.app/api/chat', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 200) {
          navigate('/chat');
        }
      } catch (error) {
        // No ha pagado aún
      }
    };

    const interval = setInterval(checkPago, 3000); // Verificamos cada 3 segundos
    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <h2 className="mb-6 text-xl font-semibold text-center">Para acceder al chat con el doctor, realiza el pago:</h2>

      {/* Aquí se inserta dinámicamente el botón de Mercado Pago */}
      <div ref={containerRef} />

      <p className="mt-6 text-sm text-gray-600 text-center">
        Una vez confirmado el pago, serás redirigido automáticamente al chat.
      </p>
    </div>
  );
};

export default Cobrar;
