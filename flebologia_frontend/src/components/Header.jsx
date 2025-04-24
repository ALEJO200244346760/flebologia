// src/components/Header.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const auth = useAuth() || {};
  const { user = {}, logout, token } = auth;

  console.log('Datos del usuario en Header:', user); // 👀 Verificá si `role` aparece

  const isAdmin = user?.role === 'ADMIN';

  const handleLoginClick = () => {
    navigate('/login');
    setMenuOpen(false);
  };

  const handleLogoutClick = () => {
    logout?.();
    navigate('/');
    setMenuOpen(false);
  };

  const handleHomeClick = () => {
    navigate('/');
    setMenuOpen(false);
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const getInitials = (name = '', last = '') => {
    return (
      (name?.charAt(0) || '').toUpperCase() +
      (last?.charAt(0) || '').toUpperCase()
    );
  };

  return (
    <header className="fixed top-0 left-0 w-full z-10 bg-gradient-to-r from-blue-400 to-blue-600 p-4 shadow-lg">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        {/* Logo / Título */}
        <div
          className="text-white font-extrabold text-3xl flex items-center cursor-pointer"
          onClick={handleHomeClick}
        >
          <span>FLEBOLOGÍA</span>
          <span className="text-sm text-white ml-2">online</span>
        </div>

        {/* Botón hamburguesa - solo en móviles */}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="text-white focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Menú - Desktop */}
        <div className="hidden md:flex space-x-4 items-center">
          {!isAdmin && (
            <button
              onClick={() => {
                navigate('/contact');
                setMenuOpen(false);
              }}
              className="px-6 py-2 text-xl font-bold text-cyan-500 bg-white rounded-lg shadow-lg hover:bg-cyan-50 transition-all duration-300"
            >
              Contacto
            </button>
          )}

          {isAdmin && (
            <button
              onClick={() => navigate('/admin/chat')}
              className="px-6 py-2 text-sm font-bold text-white bg-blue-700 rounded-lg shadow hover:bg-blue-800"
            >
              Panel Admin
            </button>
          )}

          {token ? (
            <div className="flex items-center space-x-3 text-white text-right">
              <div className="w-10 h-10 bg-white text-blue-600 font-bold rounded-full flex items-center justify-center shadow-lg">
                {getInitials(user.nombre, user.apellido)}
              </div>
              <div className="flex flex-col items-end">
                <button
                  onClick={handleLogoutClick}
                  className="px-4 py-1 text-sm font-semibold text-red-500 bg-white rounded-md shadow hover:bg-red-100"
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
              className="px-6 py-2 text-xl font-bold text-cyan-500 bg-white rounded-lg shadow-lg hover:bg-cyan-50 transition-all duration-300"
            >
              Iniciar sesión
            </button>
          )}
        </div>
      </div>

      {/* Menú desplegable - Móvil */}
      {menuOpen && (
        <div className="md:hidden mt-4 space-y-3 bg-white text-blue-600 rounded-md shadow-lg p-4 mx-2">
          {!isAdmin && (
            <button
              onClick={() => {
                navigate('/contact');
                setMenuOpen(false);
              }}
              className="w-full text-left font-semibold hover:underline"
            >
              Contacto
            </button>
          )}
          {isAdmin && (
            <button
              onClick={() => {
                navigate('/admin/chat');
                setMenuOpen(false);
              }}
              className="w-full text-left font-semibold hover:underline"
            >
              Panel Admin
            </button>
          )}
          {token ? (
            <>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 text-white font-bold rounded-full flex items-center justify-center">
                  {getInitials(user.nombre, user.apellido)}
                </div>
                <span className="text-sm">{user?.email}</span>
              </div>
              <button
                onClick={handleLogoutClick}
                className="w-full text-left text-red-500 font-semibold hover:underline"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <button
              onClick={handleLoginClick}
              className="w-full text-left font-semibold hover:underline"
            >
              Iniciar sesión
            </button>
          )}
        </div>
      )}
    </header>
  );
}

export default Header;
