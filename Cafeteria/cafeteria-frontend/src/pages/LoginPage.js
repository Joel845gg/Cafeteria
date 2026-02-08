import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './LoginPage.css';

function LoginPage() {
    const [email, setEmail] = useState('cajero@cafeteria.com');
    const [password, setPassword] = useState('cajero123');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const { login } = useAuth(); // Usar hook de auth

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await login(email, password);

            if (result.success) {
                // Redirección basada en rol
                switch (result.user.rol) {
                    case 'admin':
                        navigate('/admin');
                        break;
                    case 'cajero':
                        navigate('/cajero');
                        break;
                    case 'cocina':
                        navigate('/cocina');
                        break;
                    default:
                        navigate('/');
                }
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError('Error inesperado. Intente nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2>Iniciar Sesión - Sistema Cajero</h2>
                <p className="login-subtitle">Sakura Coffee Management</p>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="usuario@cafeteria.com"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label>Contraseña</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            disabled={loading}
                        />
                    </div>

                    <button type="submit" disabled={loading} className="login-btn">
                        {loading ? (
                            <>
                                <span className="spinner-small"></span> Iniciando...
                            </>
                        ) : (
                            'Acceder al Sistema'
                        )}
                    </button>
                </form>

                <div className="login-info">
                    <p><strong>Usuario de prueba (Cajero):</strong></p>
                    <p>Email: cajero@cafeteria.com</p>
                    <p>Contraseña: cajero123</p>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;