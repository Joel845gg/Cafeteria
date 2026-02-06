import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
    const { user, isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.rol)) {
        return (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
                <h2>⛔ Acceso Denegado</h2>
                <p>No tienes permisos para ver esta página.</p>
                <p>Tu rol actual: <strong>{user.rol}</strong></p>
            </div>
        );
    }

    return <Outlet />;
};

export default ProtectedRoute;
