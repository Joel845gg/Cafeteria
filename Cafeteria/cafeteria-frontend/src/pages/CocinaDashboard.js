import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CocinaDashboard.css';

function CocinaDashboard() {
    const [pedidos, setPedidos] = useState([]);
    const [estadisticas, setEstadisticas] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('pendientes');
    const navigate = useNavigate();

    // Verificar autenticación y rol
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || user.rol !== 'cocina') {
            navigate('/login');
        }
    }, [navigate]);

    // Cargar datos
    useEffect(() => {
        cargarDatos();
        const interval = setInterval(cargarDatos, 10000);
        return () => clearInterval(interval);
    }, []);

    const cargarDatos = async () => {
        try {
            const token = localStorage.getItem('token');
            
            // Cargar pedidos
            const pedidosRes = await fetch('http://localhost:5000/api/cocina/pedidos', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            const pedidosData = await pedidosRes.json();
            
            if (pedidosData.success) {
                setPedidos(pedidosData.pedidos);
            }

            // Cargar estadísticas
            const statsRes = await fetch('http://localhost:5000/api/cocina/estadisticas', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            const statsData = await statsRes.json();
            
            if (statsData.success) {
                setEstadisticas(statsData.estadisticas);
            }

        } catch (err) {
            console.error('Error cargando datos:', err);
            setError('Error de conexión');
        } finally {
            setLoading(false);
        }
    };

    const cambiarEstadoPedido = async (pedidoId, nuevoEstado) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/cocina/pedidos/${pedidoId}/${nuevoEstado}`, {
                method: 'PUT',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();
            
            if (data.success) {
                alert(`✅ Pedido marcado como ${nuevoEstado}`);
                cargarDatos();
            } else {
                alert(`❌ Error: ${data.message}`);
            }
        } catch (err) {
            console.error('Error cambiando estado:', err);
            alert('Error de conexión');
        }
    };

    const filtrarPedidos = () => {
        switch (activeTab) {
            case 'pendientes':
                return pedidos.filter(p => p.estado === 'pendiente_preparacion');
            case 'preparando':
                return pedidos.filter(p => p.estado === 'preparando');
            default:
                return pedidos;
        }
    };

    const formatHora = (fechaString) => {
        const fecha = new Date(fechaString);
        return fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const calcularTiempoEspera = (fechaCreacion) => {
        const creado = new Date(fechaCreacion);
        const ahora = new Date();
        const minutos = Math.floor((ahora - creado) / (1000 * 60));
        
        if (minutos < 1) return 'Recién llegado';
        if (minutos < 60) return `${minutos} min`;
        const horas = Math.floor(minutos / 60);
        const minsRestantes = minutos % 60;
        return `${horas}h ${minsRestantes}min`;
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Cargando dashboard cocina...</p>
            </div>
        );
    }

    return (
        <div className="cocina-dashboard">
            {/* Header */}
            <header className="cocina-header">
                <div className="header-left">
                    <h1>👨‍🍳 Dashboard Cocina</h1>
                    <p className="subtitle">Preparación de Pedidos - Sakura Coffee</p>
                </div>
                <div className="header-right">
                    <button 
                        className="logout-btn"
                        onClick={() => {
                            localStorage.clear();
                            navigate('/login');
                        }}
                    >
                        Cerrar Sesión
                    </button>
                </div>
            </header>

            {/* Estadísticas */}
            {estadisticas && (
                <div className="estadisticas-grid">
                    <div className="estadistica-card warning">
                        <div className="estadistica-icon">⏳</div>
                        <div className="estadistica-info">
                            <h3>{estadisticas.pendientes}</h3>
                            <p>Pendientes</p>
                        </div>
                    </div>
                    <div className="estadistica-card preparando">
                        <div className="estadistica-icon">👨‍🍳</div>
                        <div className="estadistica-info">
                            <h3>{estadisticas.en_preparacion}</h3>
                            <p>En Preparación</p>
                        </div>
                    </div>
                    <div className="estadistica-card success">
                        <div className="estadistica-icon">✅</div>
                        <div className="estadistica-info">
                            <h3>{estadisticas.completados_hoy}</h3>
                            <p>Completados Hoy</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Tabs */}
            <div className="tabs-container">
                <button 
                    className={`tab-btn ${activeTab === 'pendientes' ? 'active' : ''}`}
                    onClick={() => setActiveTab('pendientes')}
                >
                    ⏳ Pendientes
                    <span className="tab-badge">
                        {pedidos.filter(p => p.estado === 'pendiente_preparacion').length}
                    </span>
                </button>
                <button 
                    className={`tab-btn ${activeTab === 'preparando' ? 'active' : ''}`}
                    onClick={() => setActiveTab('preparando')}
                >
                    👨‍🍳 En Preparación
                    <span className="tab-badge">
                        {pedidos.filter(p => p.estado === 'preparando').length}
                    </span>
                </button>
            </div>

            {/* Lista de pedidos */}
            <div className="pedidos-container">
                {error && <div className="error-alert">{error}</div>}
                
                {filtrarPedidos().length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">✅</div>
                        <h3>¡Todo al día!</h3>
                        <p>No hay pedidos en esta sección</p>
                    </div>
                ) : (
                    <div className="pedidos-grid">
                        {filtrarPedidos().map(pedido => (
                            <div key={pedido.id} className={`pedido-card estado-${pedido.estado}`}>
                                <div className="pedido-header">
                                    <div className="pedido-info">
                                        <h3>#{pedido.numero_pedido}</h3>
                                        <div className="pedido-meta">
                                            <span className="pedido-hora">
                                                🕒 {formatHora(pedido.created_at)}
                                            </span>
                                            <span className="pedido-tiempo">
                                                ⏱️ {calcularTiempoEspera(pedido.created_at)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="pedido-total">
                                        ${parseFloat(pedido.total).toFixed(2)}
                                    </div>
                                </div>

                                {pedido.notas && (
                                    <div className="pedido-notas">
                                        <strong>📝 Notas:</strong> {pedido.notas}
                                    </div>
                                )}

                                <div className="pedido-items">
                                    <h4>🛒 Items:</h4>
                                    <div className="items-list">
                                        {pedido.items && pedido.items.map((item, index) => (
                                            <div key={index} className="pedido-item">
                                                <span className="item-cantidad">x{item.cantidad}</span>
                                                <span className="item-nombre">{item.nombre}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="pedido-actions">
                                    {pedido.estado === 'pendiente_preparacion' && (
                                        <button 
                                            className="btn-preparando"
                                            onClick={() => cambiarEstadoPedido(pedido.id, 'preparando')}
                                        >
                                            👨‍🍳 Comenzar Preparación
                                        </button>
                                    )}

                                    {pedido.estado === 'preparando' && (
                                        <button 
                                            className="btn-listo"
                                            onClick={() => cambiarEstadoPedido(pedido.id, 'listo')}
                                        >
                                            ✅ Marcar como Listo
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer */}
            <footer className="cocina-footer">
                <p>© {new Date().getFullYear()} Sakura Coffee - Sistema de Cocina</p>
                <p>Actualizado automáticamente cada 10 segundos</p>
            </footer>
        </div>
    );
}

export default CocinaDashboard;