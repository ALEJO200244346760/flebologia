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
    <header className="fixed top-0 left-0 w-full z-10 bg-gradient-to-r from-blue-400 to-blue-600 p-4 shadow-lg">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        {/* Título */}
        <div className="text-white font-extrabold text-3xl flex items-center cursor-pointer" onClick={handleHomeClick}>
          <span>FLEBOLOGÍA</span>
          <span className="text-sm text-white ml-2">online</span>
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
            <div className="flex items-center space-x-3 text-white text-right">
              {/* Avatar */}
              <div className="w-10 h-10 bg-white text-blue-600 font-bold rounded-full flex items-center justify-center shadow-lg">
                {getInitials(user.nombre, user.apellido)}
              </div>

              {/* Logout + Email */}
              <div className="flex flex-col items-end">
                <button
                  onClick={handleLogoutClick}
                  className="px-4 py-1 text-sm font-semibold text-red-500 bg-white rounded-md shadow hover:bg-red-100 transition-all duration-200"
                >
                  Cerrar sesión
                </button>
                <span className="text-xs text-white mt-1">
                  {user?.email || 'Email no disponible'}
                </span>
              </div>
            </div>
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
