import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Preguntero from './components/Preguntero'
import Login from './components/Login'
import Header from './components/Header' // Importa el Header

function App() {
  return (
    <Router>
      {/* Renderizar el Header en todas las rutas */}
      <Header />
      <Routes>
        {/* Definir las rutas para cada componente */}
        <Route path="/" element={<Preguntero />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  )
}

export default App
