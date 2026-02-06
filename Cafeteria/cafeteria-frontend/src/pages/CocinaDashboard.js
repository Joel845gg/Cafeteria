import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import '../DashboardLayout.css';
import './CocinaDashboard.css';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';

function CocinaDashboard() {
    const { logout } = useAuth();
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);

    const cargarDatos = async () => {
        try {
            const token = sessionStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/cocina/pedidos', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                // Ordenar: primero los más viejos
                const sorted = data.pedidos.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
                setPedidos(sorted);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarDatos();

        const socket = io('http://localhost:5000');

        socket.on('nuevo_pedido_cocina', () => {
            toast('🔥 Nuevo pedido para preparar', { icon: '👨‍🍳' });
            cargarDatos();
        });

        socket.on('pedido_actualizado', () => {
            cargarDatos();
        });

        return () => socket.disconnect();
    }, []);

    const avanzarEstado = async (id, estadoActual) => {
        const nuevoEstado = estadoActual === 'pendiente_preparacion' ? 'preparando' : 'listo';
        try {
            const token = sessionStorage.getItem('token');
            const res = await fetch(`http://localhost:5000/api/cocina/pedidos/${id}/${nuevoEstado}`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                toast.success(nuevoEstado === 'preparando' ? '🔥 Cocinando...' : '✅ ¡Pedido Listo!');
                cargarDatos();
            } else {
                toast.error('Error al actualizar');
            }
        } catch (error) {
            console.error(error);
            toast.error('Error de conexión');
        }
    };

    const pendientes = pedidos.filter(p => p.estado === 'pendiente_preparacion');
    const enProceso = pedidos.filter(p => p.estado === 'preparando');

    if (loading) return <div className="loading-screen"><div className="spinner"></div></div>;

    return (
        <div className="kds-container">
            <header className="kds-header">
                <h1>👨‍🍳 KDS - Cocina</h1>
                <div className="kds-stats">
                    <span className="stat warn">{pendientes.length} Pendientes</span>
                    <span className="stat info">{enProceso.length} En Proceso</span>
                </div>
                <button onClick={logout} className="kds-logout">Salir</button>
            </header>

            <main className="kds-grid">
                {/* Columna Pendientes */}
                <section className="kds-column">
                    <h2 className="col-title pendiente">⏳ Pendientes</h2>
                    <div className="tickets-stack">
                        {pendientes.map(p => (
                            <Ticket key={p.id} pedido={p} onAction={() => avanzarEstado(p.id, p.estado)} />
                        ))}
                    </div>
                </section>

                {/* Columna En Preparación */}
                <section className="kds-column">
                    <h2 className="col-title proceso">🔥 En Preparación</h2>
                    <div className="tickets-stack">
                        {enProceso.map(p => (
                            <Ticket key={p.id} pedido={p} onAction={() => avanzarEstado(p.id, p.estado)} />
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
}

// Componente Ticket interno
const Ticket = ({ pedido, onAction }) => {
    const [elapsed, setElapsed] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setElapsed(Math.floor((new Date() - new Date(pedido.created_at)) / 60000));
        }, 1000);
        return () => clearInterval(timer);
    }, [pedido.created_at]);

    return (
        <div className={`kds-ticket ${elapsed > 15 ? 'urgent' : ''}`}>
            <div className="ticket-header">
                <span className="ticket-id">#{pedido.numero_pedido}</span>
                <span className="ticket-timer">{elapsed} min</span>
            </div>
            <ul className="ticket-items">
                {pedido.items.map((item, i) => (
                    <li key={i}>
                        <span className="qty">{item.cantidad}</span> {item.nombre}
                    </li>
                ))}
            </ul>
            {pedido.notas && <div className="ticket-note">⚠️ {pedido.notas}</div>}
            <button className="ticket-btn" onClick={onAction}>
                {pedido.estado === 'pendiente_preparacion' ? '👨‍🍳 Empezar' : '✅ Terminar'}
            </button>
        </div>
    );
};

export default CocinaDashboard;