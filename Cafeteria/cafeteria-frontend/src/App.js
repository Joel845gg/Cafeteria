import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import CocinaDashboard from './pages/CocinaDashboard';
import CajeroDashboard from './pages/CajeroDashboard';

import './App.css';

import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <Toaster position="top-right" reverseOrder={false} />
          <div className="App">
            <Routes>
              {/* Rutas públicas */}
              <Route path="/" element={<HomePage />} />
              <Route path="/menu" element={<MenuPage />} />
              <Route path="/login" element={<LoginPage />} />

              {/* Rutas Protegidas - Admin */}
              <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route path="/admin" element={<AdminPage />} />
              </Route>

              {/* Rutas Protegidas - Cajero */}
              <Route element={<ProtectedRoute allowedRoles={['cajero', 'admin']} />}>
                <Route path="/cajero" element={<CajeroDashboard />} />
              </Route>

              {/* Rutas Protegidas - Cocina */}
              <Route element={<ProtectedRoute allowedRoles={['cocina', 'admin']} />}>
                <Route path="/cocina" element={<CocinaDashboard />} />
              </Route>

              {/* Redirección por defecto */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;