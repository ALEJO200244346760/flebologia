import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext' // Ajustá el path si es necesario

function Header() {
  const navigate = useNavigate()
  const { user, logout, token } = useAuth()

  const handleContactClick = () => {
    navigate('/contact')
  }

  const handleLoginClick = () => {
    navigate('/login')
  }

  const handleLogoutClick = () => {
    logout()
    navigate('/')
  }

  const handleHomeClick = () => {
    navigate('/')
  }

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
              <span className="text-white font-semibold text-lg">
                ¡Hola, {user.nombre}!
              </span>
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
  )
}

export default Header
