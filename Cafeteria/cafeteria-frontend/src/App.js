import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import './App.css';



import CocinaDashboard from './pages/CocinaDashboard';
import CajeroDashboard from './pages/CajeroDashboard';
import LoginPage from './pages/LoginPage';



function App() {
  return (
    <Router>
      <CartProvider>
        <div className="App">
          <Routes>
            {/* Rutas públicas */}
            <Route path="/" element={<HomePage />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/login" element={<LoginPage />} />
            
            {/* Ruta protegida - Cajero */}
            <Route path="/cajero" element={<CajeroDashboard />} />

            
            <Route path="/cocina" element={<CocinaDashboard />} />


            {/* ... otras rutas ... */}
          </Routes>
        </div>
      </CartProvider>
    </Router>
  );
}

export default App;