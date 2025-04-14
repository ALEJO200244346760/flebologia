import axios from 'axios';

// Función para obtener el token del localStorage
const getToken = () => {
    const token = localStorage.getItem('token');
    console.log('Token en localStorage:', token);  // Elimina esto en producción
    return token;
};

// Crear instancia de axios con configuración base
const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080', // asegurate que no termine en /
    headers: {
      'Content-Type': 'application/json',
    },
  });

// Interceptor de solicitud para agregar el token de autorización
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            if (error.response.status === 401) {
                alert('Token no válido o ha expirado.');
            }
            return Promise.reject(error.response.data);
        } else {
            alert('Error al conectar con el servidor');
            return Promise.reject(error);
        }
    }
);

// Interceptor de respuesta para manejar errores globalmente
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Si obtenemos un error 401 (Unauthorized)
        if (error.response && error.response.status === 401) {
            console.error('Token no válido o ha expirado.');

            // Elimina el token inválido
            localStorage.removeItem('token');

            // Lanzar un error para manejarlo en el componente donde se hace la solicitud
            return Promise.reject(error);
        }
        return Promise.reject(error);
    }
);

// Exportar la instancia configurada de axios
export default axiosInstance;
