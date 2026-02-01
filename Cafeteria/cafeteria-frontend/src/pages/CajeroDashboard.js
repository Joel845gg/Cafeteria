import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CajeroDashboard.css';

function CajeroDashboard() {
    const [pedidos, setPedidos] = useState([]);
    const [estadisticas, setEstadisticas] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('porPagar');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Verificar autenticación y rol
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || user.rol !== 'cajero') {
            navigate('/login');
        }
    }, [navigate]);

    // Cargar pedidos y estadísticas
    useEffect(() => {
        cargarDatos();
        // Actualizar cada 10 segundos
        const interval = setInterval(cargarDatos, 10000);
        return () => clearInterval(interval);
    }, []);

    const cargarDatos = async () => {
        try {
            const token = localStorage.getItem('token');
            
            // Cargar pedidos
            const pedidosResponse = await fetch('http://localhost:5000/api/cajero/pedidos', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            const pedidosData = await pedidosResponse.json();
            
            if (pedidosData.success) {
                setPedidos(pedidosData.pedidos);
            }

            // Cargar estadísticas
            const statsResponse = await fetch('http://localhost:5000/api/cajero/estadisticas', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            const statsData = await statsResponse.json();
            
            if (statsData.success) {
                setEstadisticas(statsData.estadisticas);
            }

        } catch (err) {
            console.error('Error cargando datos:', err);
            setError('Error de conexión con el servidor');
        } finally {
            setLoading(false);
        }
    };

    const marcarComoPagado = async (pedidoId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/cajero/pedidos/${pedidoId}/pagar`, {
                method: 'PUT',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();
            
            if (data.success) {
                alert('✅ Pedido marcado como pagado y enviado a cocina');
                cargarDatos(); // Recargar datos
            } else {
                alert(`❌ Error: ${data.message}`);
            }
        } catch (err) {
            console.error('Error marcando como pagado:', err);
            alert('Error de conexión');
        }
    };

    const marcarComoEntregado = async (pedidoId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/cajero/pedidos/${pedidoId}/entregar`, {
                method: 'PUT',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();
            
            if (data.success) {
                alert('✅ Pedido marcado como entregado');
                cargarDatos(); // Recargar datos
            } else {
                alert(`❌ Error: ${data.message}`);
            }
        } catch (err) {
            console.error('Error marcando como entregado:', err);
            alert('Error de conexión');
        }
    };

    const filtrarPedidos = () => {
        switch (activeTab) {
            case 'porPagar':
                return pedidos.filter(p => p.estado === 'pendiente_pago');
            case 'preparando':
                return pedidos.filter(p => p.estado === 'preparando');
            case 'listos':
                return pedidos.filter(p => p.estado === 'listo');
            case 'entregados':
                return pedidos.filter(p => p.estado === 'entregado');
            default:
                return [];
        }
    };

    const formatFecha = (fechaString) => {
        const fecha = new Date(fechaString);
        return fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatMoneda = (monto) => {
        return `$${parseFloat(monto).toFixed(2)}`;
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Cargando dashboard cajero...</p>
            </div>
        );
    }

    return (
        <div className="cajero-dashboard">
            {/* Header */}
            <header className="cajero-header">
                <div className="header-left">
                    <h1>🏪 Dashboard Cajero</h1>
                    <p className="subtitle">Sistema de Gestión - Sakura Coffee</p>
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
                    <div className="estadistica-card">
                        <div className="estadistica-icon">📊</div>
                        <div className="estadistica-info">
                            <h3>{estadisticas.total_pedidos}</h3>
                            <p>Pedidos Hoy</p>
                        </div>
                    </div>
                    <div className="estadistica-card">
                        <div className="estadistica-icon">💰</div>
                        <div className="estadistica-info">
                            <h3>{formatMoneda(estadisticas.total_ventas)}</h3>
                            <p>Ventas Hoy</p>
                        </div>
                    </div>
                    <div className="estadistica-card warning">
                        <div className="estadistica-icon">⏳</div>
                        <div className="estadistica-info">
                            <h3>{estadisticas.pendientes_pago}</h3>
                            <p>Por Pagar</p>
                        </div>
                    </div>
                    <div className="estadistica-card success">
                        <div className="estadistica-icon">✅</div>
                        <div className="estadistica-info">
                            <h3>{estadisticas.listos_entrega}</h3>
                            <p>Listos para Entrega</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Tabs de navegación */}
            <div className="tabs-container">
                <button 
                    className={`tab-btn ${activeTab === 'porPagar' ? 'active' : ''}`}
                    onClick={() => setActiveTab('porPagar')}
                >
                    ⏳ Por Pagar
                    <span className="tab-badge">
                        {pedidos.filter(p => p.estado === 'pendiente_pago').length}
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
                <button 
                    className={`tab-btn ${activeTab === 'listos' ? 'active' : ''}`}
                    onClick={() => setActiveTab('listos')}
                >
                    ✅ Listos para Entrega
                    <span className="tab-badge">
                        {pedidos.filter(p => p.estado === 'listo').length}
                    </span>
                </button>
                <button 
                    className={`tab-btn ${activeTab === 'entregados' ? 'active' : ''}`}
                    onClick={() => setActiveTab('entregados')}
                >
                    📦 Entregados Hoy
                    <span className="tab-badge">
                        {pedidos.filter(p => p.estado === 'entregado').length}
                    </span>
                </button>
            </div>

            {/* Lista de pedidos */}
            <div className="pedidos-container">
                {error && <div className="error-alert">{error}</div>}
                
                {filtrarPedidos().length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">
                            {activeTab === 'porPagar' ? '⏳' : 
                             activeTab === 'preparando' ? '👨‍🍳' :
                             activeTab === 'listos' ? '✅' : '📦'}
                        </div>
                        <h3>No hay pedidos en esta sección</h3>
                        <p>Todos los pedidos están procesados</p>
                    </div>
                ) : (
                    <div className="pedidos-grid">
                        {filtrarPedidos().map(pedido => (
                            <div key={pedido.id} className="pedido-card">
                                <div className="pedido-header">
                                    <div className="pedido-info">
                                        <h3>Pedido #{pedido.numero_pedido}</h3>
                                        <span className="pedido-hora">
                                            {formatFecha(pedido.created_at)}
                                        </span>
                                    </div>
                                    <div className="pedido-total">
                                        {formatMoneda(pedido.total)}
                                    </div>
                                </div>

                                {pedido.notas && (
                                    <div className="pedido-notas">
                                        <strong>Notas:</strong> {pedido.notas}
                                    </div>
                                )}

                                <div className="pedido-items">
                                    <h4>Items:</h4>
                                    {pedido.items && pedido.items.map((item, index) => (
                                        <div key={index} className="pedido-item">
                                            <span>{item.nombre} x {item.cantidad}</span>
                                            <span>{formatMoneda(item.subtotal)}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="pedido-actions">
                                    {pedido.estado === 'pendiente_pago' && (
                                        <button 
                                            className="btn-pagar"
                                            onClick={() => marcarComoPagado(pedido.id)}
                                        >
                                            💰 Marcar como Pagado
                                        </button>
                                    )}

                                    {pedido.estado === 'listo' && (
                                        <button 
                                            className="btn-entregar"
                                            onClick={() => marcarComoEntregado(pedido.id)}
                                        >
                                            📦 Entregar al Cliente
                                        </button>
                                    )}

                                    {(pedido.estado === 'preparando' || pedido.estado === 'entregado') && (
                                        <div className="estado-indicador">
                                            Estado: <span className={`estado-${pedido.estado}`}>
                                                {pedido.estado === 'preparando' ? 'En Preparación' : 
                                                 pedido.estado === 'entregado' ? 'Entregado' : pedido.estado}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer */}
            <footer className="cajero-footer">
                <p>© {new Date().getFullYear()} Sakura Coffee - Sistema de Cajero</p>
                <p>Actualizado automáticamente cada 10 segundos</p>
            </footer>
        </div>
    );
}

export default CajeroDashboard;