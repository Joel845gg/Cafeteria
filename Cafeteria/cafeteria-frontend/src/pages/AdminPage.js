import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import '../DashboardLayout.css';
import './AdminPage.css';
import InventarioAdmin from './InventarioAdmin';
import HistorialPedidos from './HistorialPedidos';
import UsuariosAdmin from './UsuariosAdmin';

function AdminPage() {
    const { user, logout } = useAuth();
    const [estadisticas, setEstadisticas] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [refreshing, setRefreshing] = useState(false);

    // Formatear moneda
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN'
        }).format(amount || 0);
    };

    const cargarEstadisticas = useCallback(async () => {
        try {
            setRefreshing(true);
            const token = sessionStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/admin/estadisticas', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                setEstadisticas(data.estadisticas);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        cargarEstadisticas();
    }, [cargarEstadisticas]);

    if (loading) return <div className="loading-screen"><div className="spinner"></div></div>;

    return (
        <div className="dashboard-container">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-brand">
                    🌸 <span>Sakura Admin</span>
                </div>

                <div className="user-profile">
                    <div className="avatar">A</div>
                    <div className="info">
                        <h4>{user?.nombre || 'Admin'}</h4>
                        <span className="badge badge-info">Administrador</span>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    <button
                        className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
                        onClick={() => setActiveTab('dashboard')}
                    >
                        📊 Dashboard
                    </button>
                    <button
                        className={`nav-item ${activeTab === 'pedidos' ? 'active' : ''}`}
                        onClick={() => setActiveTab('pedidos')}
                    >
                        🛒 Pedidos
                    </button>
                    <button
                        className={`nav-item ${activeTab === 'inventario' ? 'active' : ''}`}
                        onClick={() => setActiveTab('inventario')}
                    >
                        📦 Inventario
                    </button>
                    <button
                        className={`nav-item ${activeTab === 'usuarios' ? 'active' : ''}`}
                        onClick={() => setActiveTab('usuarios')}
                    >
                        👥 Usuarios
                    </button>
                </nav>

                <div className="sidebar-footer">
                    <button onClick={logout} className="logout-btn">
                        🚪 Cerrar Sesión
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="dashboard-main">
                <header className="top-bar">
                    <div>
                        <h1>Hola, {user?.nombre?.split(' ')[0]} 👋</h1>
                        <p className="subtitle">Aquí tienes el resumen de hoy</p>
                    </div>
                    <button
                        onClick={cargarEstadisticas}
                        className={`refresh-btn ${refreshing ? 'spinning' : ''}`}
                    >
                        🔄 Actualizar
                    </button>
                </header>

                {activeTab === 'dashboard' && estadisticas && (
                    <div className="fade-in">
                        {/* KPI Cards */}
                        <div className="grid-4">
                            <div className="dashboard-card kpi-card primary">
                                <div className="icon">🛍️</div>
                                <div className="data">
                                    <h3>{estadisticas.resumen.pedidos_hoy}</h3>
                                    <p>Pedidos Hoy</p>
                                </div>
                                <span className="trend positive">
                                    {estadisticas.resumen.cambio_pedidos}% ↗
                                </span>
                            </div>

                            <div className="dashboard-card kpi-card success">
                                <div className="icon">💰</div>
                                <div className="data">
                                    <h3>{formatCurrency(estadisticas.resumen.ventas_hoy)}</h3>
                                    <p>Ventas Hoy</p>
                                </div>
                            </div>

                            <div className="dashboard-card kpi-card warning">
                                <div className="icon">⭐</div>
                                <div className="data">
                                    <h3>{formatCurrency(estadisticas.resumen.promedio_hoy)}</h3>
                                    <p>Ticket Promedio</p>
                                </div>
                            </div>
                        </div>

                        {/* Content Grid */}
                        <div className="content-grid">
                            <div className="dashboard-card">
                                <h3>🏆 Productos Más Vendidos</h3>
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>Producto</th>
                                            <th>Vendidos</th>
                                            <th>Ingresos</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {estadisticas.top_productos.map((prod, i) => (
                                            <tr key={i}>
                                                <td>
                                                    <span className="rank">#{i + 1}</span> {prod.nombre}
                                                </td>
                                                <td>{prod.total_vendido}</td>
                                                <td>{formatCurrency(prod.ingresos)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'pedidos' && (
                    <div className="fade-in">
                        <HistorialPedidos />
                    </div>
                )}

                {activeTab === 'inventario' && (
                    <div className="fade-in">
                        <InventarioAdmin />
                    </div>
                )}

                {activeTab === 'usuarios' && (
                    <div className="fade-in">
                        <UsuariosAdmin />
                    </div>
                )}

                {['dashboard', 'pedidos', 'inventario', 'usuarios'].indexOf(activeTab) === -1 && (
                    <div className="empty-state-container">
                        <div className="empty-icon">🚧</div>
                        <h2>En Construcción</h2>
                        <p>El módulo de <strong>{activeTab}</strong> estará disponible pronto.</p>
                    </div>
                )}
            </main>
        </div>
    );
}

export default AdminPage;