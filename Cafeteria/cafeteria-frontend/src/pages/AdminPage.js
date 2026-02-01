import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminPage.css';

function AdminPage() {
    const [estadisticas, setEstadisticas] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('dashboard');
    const navigate = useNavigate();

    // Función segura para formatear números
    const formatNumber = useCallback((num) => {
        if (num === null || num === undefined || isNaN(num)) {
            return '0.00';
        }
        return parseFloat(num).toFixed(2);
    }, []);

    // Función segura para parsear enteros
    const safeParseInt = useCallback((num) => {
        if (num === null || num === undefined) return 0;
        const parsed = parseInt(num);
        return isNaN(parsed) ? 0 : parsed;
    }, []);

    // Función para cargar estadísticas
    const cargarEstadisticas = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            setError('');
            const response = await fetch('http://localhost:5000/api/admin/estadisticas', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            const data = await response.json();
            
            if (!response.ok || !data.success) {
                throw new Error(data.message || 'Error al cargar estadísticas');
            }
            
            console.log('📊 Estadísticas recibidas:', data);
            setEstadisticas(data.estadisticas);
            
        } catch (error) {
            console.error('Error cargando estadísticas:', error);
            setError(error.message || 'No se pudieron cargar las estadísticas');
            
            // Si hay error de autenticación, redirigir al login
            if (error.message.includes('token') || error.message.includes('autenticación')) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        // Verificar que sea admin
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || user.rol !== 'admin') {
            navigate('/login');
            return;
        }

        cargarEstadisticas();
    }, [navigate, cargarEstadisticas]); // ✅ Ahora incluye todas las dependencias

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const handleRefresh = () => {
        setLoading(true);
        setError('');
        cargarEstadisticas();
    };

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="spinner"></div>
                <p>Cargando dashboard admin...</p>
            </div>
        );
    }

    return (
        <div className="admin-container">
            {/* Sidebar */}
            <div className="admin-sidebar">
                <div className="sidebar-header">
                    <h2>Panel Admin</h2>
                    <p>Sakura Coffee</p>
                </div>
                
                <nav className="sidebar-menu">
                    <button 
                        className={activeTab === 'dashboard' ? 'active' : ''}
                        onClick={() => setActiveTab('dashboard')}
                    >
                        📊 Dashboard
                    </button>
                    
                    <button 
                        className={activeTab === 'pedidos' ? 'active' : ''}
                        onClick={() => setActiveTab('pedidos')}
                    >
                        🛒 Pedidos
                    </button>
                    
                    <button 
                        className={activeTab === 'inventario' ? 'active' : ''}
                        onClick={() => setActiveTab('inventario')}
                    >
                        📦 Inventario
                    </button>
                    
                    <button 
                        className={activeTab === 'usuarios' ? 'active' : ''}
                        onClick={() => setActiveTab('usuarios')}
                    >
                        👥 Usuarios
                    </button>
                    
                    <button 
                        className={activeTab === 'reportes' ? 'active' : ''}
                        onClick={() => setActiveTab('reportes')}
                    >
                        📈 Reportes
                    </button>
                </nav>
                
                <div className="sidebar-footer">
                    <button onClick={handleRefresh} className="refresh-btn" title="Actualizar datos">
                        🔄 Actualizar
                    </button>
                    <button onClick={handleLogout} className="logout-btn">
                        👋 Cerrar Sesión
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="admin-main">
                <header className="admin-header">
                    <h1>Administración - Sakura Coffee</h1>
                    <div className="user-info">
                        <span>👑 Administrador</span>
                        <button onClick={handleRefresh} className="header-refresh">
                            🔄
                        </button>
                    </div>
                </header>

                <div className="admin-content">
                    {error && (
                        <div className="error-banner">
                            <span>⚠️ {error}</span>
                            <button onClick={handleRefresh}>Reintentar</button>
                        </div>
                    )}

                    {activeTab === 'dashboard' && (
                        <div className="dashboard-grid">
                            {/* Tarjetas de estadísticas */}
                            <div className="stat-card primary">
                                <h3>Pedidos Hoy</h3>
                                <p className="stat-number">
                                    {safeParseInt(estadisticas?.resumen?.pedidos_hoy)}
                                </p>
                                <div className="stat-change">
                                    {estadisticas?.resumen?.cambio_pedidos || '0'}% vs ayer
                                    {parseFloat(estadisticas?.resumen?.cambio_pedidos || 0) > 0 ? ' 📈' : ' 📉'}
                                </div>
                            </div>
                            
                            <div className="stat-card success">
                                <h3>Ventas Hoy</h3>
                                <p className="stat-number">
                                    ${formatNumber(estadisticas?.resumen?.ventas_hoy)}
                                </p>
                                <div className="stat-change">
                                    {estadisticas?.resumen?.cambio_ventas || '0'}% vs ayer
                                    {parseFloat(estadisticas?.resumen?.cambio_ventas || 0) > 0 ? ' 📈' : ' 📉'}
                                </div>
                            </div>
                            
                            <div className="stat-card warning">
                                <h3>Promedio Venta</h3>
                                <p className="stat-number">
                                    ${formatNumber(estadisticas?.resumen?.promedio_hoy)}
                                </p>
                                <p className="stat-label">por pedido</p>
                            </div>
                            
                            <div className="stat-card info">
                                <h3>Pedidos Activos</h3>
                                <p className="stat-number">
                                    {estadisticas?.por_estado?.filter(e => 
                                        e.estado !== 'entregado' && e.estado !== 'cancelado'
                                    ).reduce((sum, e) => sum + safeParseInt(e.cantidad), 0) || 0}
                                </p>
                                <p className="stat-label">en proceso</p>
                            </div>

                            {/* Distribución por estado */}
                            <div className="chart-container">
                                <div className="chart-header">
                                    <h3>Distribución por Estado</h3>
                                    <span className="chart-total">
                                        Total: {estadisticas?.por_estado?.reduce((sum, e) => sum + safeParseInt(e.cantidad), 0) || 0}
                                    </span>
                                </div>
                                <div className="estados-grid">
                                    {estadisticas?.por_estado?.map((estado, index) => (
                                        <div key={index} className="estado-item">
                                            <div className="estado-header">
                                                <span className="estado-badge">{estado.estado || 'Sin estado'}</span>
                                                <span className="estado-cantidad">
                                                    {safeParseInt(estado.cantidad)} pedidos
                                                </span>
                                            </div>
                                            <div className="estado-total">
                                                ${formatNumber(estado.total_estado)}
                                            </div>
                                        </div>
                                    ))}

                                    {(!estadisticas?.por_estado || estadisticas.por_estado.length === 0) && (
                                        <div className="empty-state">
                                            No hay pedidos hoy
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Top productos */}
                            <div className="chart-container">
                                <div className="chart-header">
                                    <h3>Top 10 Productos Hoy</h3>
                                    <span className="chart-total">
                                        {estadisticas?.top_productos?.length || 0} productos
                                    </span>
                                </div>
                                <div className="products-container">
                                    <table className="products-table">
                                        <thead>
                                            <tr>
                                                <th>Producto</th>
                                                <th>Cantidad Vendida</th>
                                                <th>Ingresos</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {estadisticas?.top_productos?.map((producto, index) => (
                                                <tr key={index}>
                                                    <td className="product-name">
                                                        <span className="product-rank">#{index + 1}</span>
                                                        {producto.nombre || 'Producto sin nombre'}
                                                    </td>
                                                    <td className="product-quantity">
                                                        {safeParseInt(producto.total_vendido)}
                                                        <span className="product-price">
                                                            (${formatNumber(producto.precio)} c/u)
                                                        </span>
                                                    </td>
                                                    <td className="product-income">
                                                        ${formatNumber(producto.ingresos)}
                                                    </td>
                                                </tr>
                                            ))}

                                            {(!estadisticas?.top_productos || estadisticas.top_productos.length === 0) && (
                                                <tr>
                                                    <td colSpan="3" className="empty-products">
                                                        <div className="empty-message">
                                                            🛒 No hay ventas de productos hoy
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'pedidos' && (
                        <div className="pedidos-container">
                            <div className="tab-header">
                                <h2>🛒 Gestión de Pedidos</h2>
                                <p>Administra y visualiza todos los pedidos del sistema</p>
                            </div>
                            <div className="coming-soon">
                                <div className="coming-soon-icon">⚡</div>
                                <h3>Próximamente</h3>
                                <p>Tabla completa de pedidos con filtros y acciones</p>
                            </div>
                        </div>
                    )}

                    {activeTab === 'inventario' && (
                        <div className="inventario-container">
                            <div className="tab-header">
                                <h2>📦 Gestión de Inventario</h2>
                                <p>Control de stock y productos</p>
                            </div>
                            <div className="coming-soon">
                                <div className="coming-soon-icon">📊</div>
                                <h3>Próximamente</h3>
                                <p>Reporte de inventario con alertas de stock bajo</p>
                            </div>
                        </div>
                    )}

                    {activeTab === 'usuarios' && (
                        <div className="usuarios-container">
                            <div className="tab-header">
                                <h2>👥 Gestión de Usuarios</h2>
                                <p>Administración de usuarios y roles</p>
                            </div>
                            <div className="coming-soon">
                                <div className="coming-soon-icon">👤</div>
                                <h3>Próximamente</h3>
                                <p>CRUD completo de usuarios</p>
                            </div>
                        </div>
                    )}

                    {activeTab === 'reportes' && (
                        <div className="reportes-container">
                            <div className="tab-header">
                                <h2>📈 Reportes Avanzados</h2>
                                <p>Genera reportes personalizados</p>
                            </div>
                            <div className="coming-soon">
                                <div className="coming-soon-icon">📋</div>
                                <h3>Próximamente</h3>
                                <p>Reportes detallados por período y exportación</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AdminPage;