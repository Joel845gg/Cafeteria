import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

function LoginPage() {
    const [email, setEmail] = useState('cajero@cafeteria.com');
    const [password, setPassword] = useState('123456');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (data.success) {
                // Guardar token y datos de usuario
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                
                // Redirigir según rol
                switch (data.user.rol) {
                    case 'admin':
                        navigate('/admin');
                        break;
                    case 'cajero':
                        navigate('/cajero'); // ← Cajero va a su dashboard
                        break;
                    case 'cocina':
                        navigate('/cocina');
                        break;
                    default:
                        navigate('/');
                }
            } else {
                setError(data.message || 'Credenciales incorrectas');
            }
        } catch (err) {
            setError('Error de conexión con el servidor');
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
                    <p>Contraseña: 123456</p>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;