import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

function Header() {
  const navigate = useNavigate();
  const auth = useAuth() || {};
  const { user = {}, logout, token } = auth;

  const handleContactClick = () => {
    navigate('/contact');
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleLogoutClick = () => {
    logout?.();
    navigate('/');
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  // Obtener iniciales del usuario para el circulito
  const getInitials = (name = '', last = '') => {
    return (
      (name?.charAt(0) || '').toUpperCase() +
      (last?.charAt(0) || '').toUpperCase()
    );
  };

  return (
    <header className="fixed top-0 left-0 w-full z-10 bg-gradient-to-r from-blue-400 to-blue-600 p-4">
      <div className="flex justify-between items-center">
        {/* Título */}
        <div className="text-white font-extrabold text-3xl flex items-center">
          <button onClick={handleHomeClick}>
            <span>FLEBOLOGÍA</span>
            <span className="text-sm text-white ml-2">online</span>
          </button>
        </div>

        {/* Botones */}
        <div className="flex space-x-4 items-center">
          <button
            onClick={handleContactClick}
            className="px-6 py-2 text-xl font-bold text-cyan-500 bg-white rounded-lg shadow-lg hover:bg-cyan-50 transition-all duration-300 ease-in-out"
          >
            Contacto
          </button>

          {token ? (
            <>
              {/* Avatar del usuario */}
              <div className="w-10 h-10 bg-white text-blue-600 font-bold rounded-full flex items-center justify-center shadow-lg">
                {getInitials(user.nombre, user.apellido)}
              </div>
              <button
                onClick={handleLogoutClick}
                className="px-6 py-2 text-xl font-bold text-red-500 bg-white rounded-lg shadow-lg hover:bg-red-100 transition-all duration-300 ease-in-out"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <button
              onClick={handleLoginClick}
              className="px-6 py-2 text-xl font-bold text-cyan-500 bg-white rounded-lg shadow-lg hover:bg-cyan-50 transition-all duration-300 ease-in-out"
            >
              Iniciar sesión
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
