import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import '../DashboardLayout.css';

function HistorialPedidos() {
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtroEstado, setFiltroEstado] = useState('todos');

    const cargarPedidos = async () => {
        try {
            setLoading(true);
            const token = sessionStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/admin/pedidos', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setPedidos(data.pedidos);
            } else {
                toast.error('Error al cargar historial');
            }
        } catch (error) {
            console.error(error);
            toast.error('Error de conexión');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarPedidos();
    }, []);

    const handleStatusChange = async (pedidoId, nuevoEstado) => {
        try {
            const token = sessionStorage.getItem('token');
            const res = await fetch(`http://localhost:5000/api/admin/pedidos/${pedidoId}/estado`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ estado: nuevoEstado })
            });

            const data = await res.json();

            if (data.success) {
                toast.success(`Pedido #${data.pedido.numero_pedido} actualizado`);
                // Actualizar estado localmente
                setPedidos(pedidos.map(p =>
                    p.id === pedidoId ? { ...p, estado: nuevoEstado } : p
                ));
            } else {
                toast.error(data.message || 'Error al actualizar');
            }
        } catch (error) {
            console.error(error);
            toast.error('Error de conexión');
        }
    };

    const pedidosFiltrados = filtroEstado === 'todos'
        ? pedidos
        : pedidos.filter(p => p.estado === filtroEstado);

    // Formatear moneda
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN'
        }).format(amount || 0);
    };

    // Formatear fecha
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString();
    };

    if (loading) return <div className="loading-screen"><div className="spinner"></div></div>;

    return (
        <div className="admin-module">
            <header className="module-header">
                <h2>📜 Historial de Pedidos</h2>
                <div className="actions">
                    <select
                        value={filtroEstado}
                        onChange={(e) => setFiltroEstado(e.target.value)}
                        className="filter-select"
                    >
                        <option value="todos">Todos los estados</option>
                        <option value="pendiente_pago">Pendiente Pago</option>
                        <option value="pendiente_preparacion">En Cola</option>
                        <option value="preparando">Preparando</option>
                        <option value="listo">Listo</option>
                        <option value="entregado">Entregado</option>
                        <option value="cancelado">Cancelado</option>
                    </select>
                    <button onClick={cargarPedidos} className="btn-primary">
                        🔄 Actualizar
                    </button>
                </div>
            </header>

            <div className="table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Fecha</th>
                            <th>Cliente</th>
                            <th>Total</th>
                            <th>Estado</th>
                            <th>Detalles</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pedidosFiltrados.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="empty-row">No hay pedidos encontrados</td>
                            </tr>
                        ) : (
                            pedidosFiltrados.map(pedido => (
                                <tr key={pedido.id}>
                                    <td>#{pedido.numero_pedido}</td>
                                    <td>{formatDate(pedido.created_at)}</td>
                                    <td>{pedido.usuario_nombre || 'Cliente General'}</td>
                                    <td>{formatCurrency(pedido.total)}</td>
                                    <td>
                                        <select
                                            className={`status-select badge-${getEstadoBadge(pedido.estado)}`}
                                            value={pedido.estado}
                                            onChange={(e) => handleStatusChange(pedido.id, e.target.value)}
                                        >
                                            <option value="pendiente_pago">Pendiente Pago</option>
                                            <option value="pendiente_preparacion">En Cola</option>
                                            <option value="preparando">Preparando</option>
                                            <option value="listo">Listo</option>
                                            <option value="entregado">Entregado</option>
                                            <option value="cancelado">Cancelado</option>
                                        </select>
                                    </td>
                                    <td>
                                        <div className="items-summary">
                                            {pedido.items_count} items
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

const getEstadoBadge = (estado) => {
    switch (estado) {
        case 'entregado': return 'success';
        case 'pendiente_pago': return 'warning';
        case 'cancelado': return 'danger';
        default: return 'info';
    }
};

export default HistorialPedidos;
