import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import '../DashboardLayout.css';
import './CajeroDashboard.css';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';

function CajeroDashboard() {
    const { logout } = useAuth();
    const [pedidos, setPedidos] = useState([]);
    const [activeTab, setActiveTab] = useState('porPagar'); // porPagar | listos | historico
    const [loading, setLoading] = useState(true);

    // Cargar datos
    const cargarDatos = async () => {
        try {
            const token = sessionStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/cajero/pedidos', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) setPedidos(data.pedidos);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarDatos();

        const socket = io('http://localhost:5000');

        socket.on('connect', () => console.log('🟢 Conectado a WebSocket'));

        socket.on('nuevo_pedido', () => {
            toast('🔔 Nuevo pedido recibido', { icon: '🍵' });
            cargarDatos();
        });

        socket.on('pedido_actualizado', () => {
            cargarDatos();
        });

        return () => socket.disconnect();
    }, []);

    // Acciones
    const procesarPedido = async (id, accion) => {
        try {
            const token = sessionStorage.getItem('token');
            const res = await fetch(`http://localhost:5000/api/cajero/pedidos/${id}/${accion}`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                toast.success(accion === 'pagar' ? '💰 Cobro registrado' : '📦 Pedido entregado');
                cargarDatos();
            } else {
                toast.error('No se pudo completar la acción');
            }
        } catch (error) {
            console.error('Error procesando:', error);
            toast.error('Error de conexión');
        }
    };

    const filtrarPedidos = () => {
        if (activeTab === 'porPagar') return pedidos.filter(p => p.estado === 'pendiente_pago');
        if (activeTab === 'listos') return pedidos.filter(p => p.estado === 'listo');
        if (activeTab === 'historico') return pedidos.filter(p => ['entregado', 'cancelado'].includes(p.estado));
        return [];
    };

    const pedidosFiltrados = filtrarPedidos();

    if (loading) return <div className="loading-screen"><div className="spinner"></div></div>;

    return (
        <div className="dashboard-container cajero-layout">
            <header className="cajero-header">
                <div className="brand">
                    🏪 <span>Terminal Cajero</span>
                </div>
                <div className="tabs">
                    <button
                        className={activeTab === 'porPagar' ? 'active' : ''}
                        onClick={() => setActiveTab('porPagar')}
                    >
                        ⏳ Por Pagar ({pedidos.filter(p => p.estado === 'pendiente_pago').length})
                    </button>
                    <button
                        className={activeTab === 'listos' ? 'active' : ''}
                        onClick={() => setActiveTab('listos')}
                    >
                        ✅ Para Entregar ({pedidos.filter(p => p.estado === 'listo').length})
                    </button>
                    <button
                        className={activeTab === 'historico' ? 'active' : ''}
                        onClick={() => setActiveTab('historico')}
                    >
                        📦 Historial
                    </button>
                </div>
                <button onClick={logout} className="logout-mini">Salir</button>
            </header>

            <main className="dashboard-main cajero-main">
                {pedidosFiltrados.length === 0 ? (
                    <div className="empty-state">
                        <div className="icon">🍵</div>
                        <h3>No hay pedidos pendientes aquí</h3>
                    </div>
                ) : (
                    <div className="orders-grid">
                        {pedidosFiltrados.map(pedido => (
                            <div key={pedido.id} className={`order-card status-${pedido.estado}`}>
                                <div className="order-header">
                                    <span className="order-id">#{pedido.numero_pedido}</span>
                                    <span className="order-time">
                                        {new Date(pedido.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>

                                <div className="order-items">
                                    {pedido.items.map((item, i) => (
                                        <div key={i} className="item-row">
                                            <span>{item.cantidad}x {item.nombre}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="order-footer">
                                    <div className="total">
                                        ${pedido.total}
                                    </div>

                                    {pedido.estado === 'pendiente_pago' && (
                                        <button
                                            className="action-btn pay-btn"
                                            onClick={() => procesarPedido(pedido.id, 'pagar')}
                                        >
                                            💰 Cobrar
                                        </button>
                                    )}

                                    {pedido.estado === 'listo' && (
                                        <button
                                            className="action-btn deliver-btn"
                                            onClick={() => procesarPedido(pedido.id, 'entregar')}
                                        >
                                            📦 Entregar
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

export default CajeroDashboard;