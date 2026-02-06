import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Configurar axios por defecto
    axios.defaults.baseURL = 'http://localhost:5000';

    useEffect(() => {
        const checkAuth = async () => {
            const token = sessionStorage.getItem('token');
            const storedUser = sessionStorage.getItem('user');

            if (token && storedUser) {
                // Configurar header
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                try {
                    // Opcional: Verificar token con backend
                    // const res = await axios.get('/api/auth/profile');
                    // setUser(res.data.user);

                    // Por ahora confiamos en sessionStorage + manejo de errores de axios
                    setUser(JSON.parse(storedUser));
                } catch (error) {
                    console.error('Error restaurando sesión:', error);
                    logout();
                }
            }
            setLoading(false);
        };

        checkAuth();
    }, []);

    const login = async (email, password) => {
        try {
            const res = await axios.post('/api/auth/login', { email, password });

            if (res.data.success) {
                const { token, user } = res.data;

                sessionStorage.setItem('token', token);
                sessionStorage.setItem('user', JSON.stringify(user));

                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                setUser(user);
                return { success: true, user };
            }
        } catch (error) {
            console.error('Login error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Error al iniciar sesión'
            };
        }
    };

    const logout = () => {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
    };

    const value = {
        user,
        login,
        logout,
        loading,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};
