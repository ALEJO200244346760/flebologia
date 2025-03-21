import React from 'react'
import { useNavigate } from 'react-router-dom'

function Header() {
  const navigate = useNavigate()

  // Función para navegar a la página de contacto
  const handleContactClick = () => {
    navigate('/contact')
  }

  // Función para navegar a la página de login
  const handleLoginClick = () => {
    navigate('/login')
  }

  return (
    <header className="fixed top-0 left-0 w-full z-10 bg-gradient-to-r from-blue-400 to-blue-600 p-4">
      <div className="flex justify-between items-center">
        {/* Lado izquierdo - Título */}
        <div className="text-white font-extrabold text-3xl flex items-center">
          <span>FLEBOLOGÍA</span>
          <span className="text-sm text-white ml-2">online</span>
        </div>

        {/* Lado derecho - Botones */}
        <div className="flex space-x-4">
          <button
            onClick={handleContactClick}
            className="px-6 py-2 text-xl font-bold text-cyan-500 bg-white rounded-lg shadow-lg hover:bg-cyan-50 transition-all duration-300 ease-in-out"
          >
            Contacto
          </button>
          <button
            onClick={handleLoginClick}
            className="px-6 py-2 text-xl font-bold text-cyan-500 bg-white rounded-lg shadow-lg hover:bg-cyan-50 transition-all duration-300 ease-in-out"
          >
            Iniciar sesión
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
