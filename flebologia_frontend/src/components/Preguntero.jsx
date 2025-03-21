import React from 'react'
import { useNavigate } from 'react-router-dom'

function Preguntero() {
  const navigate = useNavigate()

  // Función para navegar a la página de login
  const handleConsultClick = () => {
    navigate('/login')
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-400 to-blue-600 p-0 m-0">
      {/* Contenedor principal con fondo blanco */}
      <div className="bg-white p-10 rounded-xl shadow-lg w-full max-w-full flex flex-col md:flex-row items-center space-y-8 md:space-y-0 md:space-x-8">

        {/* Lado izquierdo - Preguntas frecuentes */}
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-4xl font-extrabold text-gray-800 mb-4">Preguntas Frecuentes</h2>
          <ul className="text-lg text-gray-600 space-y-3 text-red">
            <li>¿Qué es la flebología?</li>
            <li>¿Cuáles son los síntomas más comunes?</li>
            <li>¿Qué tratamientos existen para la flebología?</li>
            <li>¿Es necesario operar siempre?</li>
            <li>¿Cómo prevenir problemas flebológicos?</li>
          </ul>
        </div>

        {/* Centro - Botón de consulta */}
        <div className="flex-shrink-0">
          <button
            onClick={handleConsultClick}
            className="px-8 py-4 text-xl font-bold text-white bg-gradient-to-r from-green-400 to-green-600 rounded-lg shadow-lg hover:bg-green-500 transition-all duration-300 ease-in-out"
          >
            Consultar
          </button>
        </div>

        {/* Lado derecho - Imagen del médico */}
        <div className="flex-1 text-center">
          <img
            src="ruta/a/tu/imagen-del-medico.jpg"
            alt=""
            className="w-48 h-48 object-cover rounded-full shadow-lg border-4 border-white"
          />
        </div>

      </div>
    </div>
  )
}

export default Preguntero
