import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import '../DashboardLayout.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function UsuariosAdmin() {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        password: '',
        rol: 'cajero'
    });

    const cargarUsuarios = async () => {
        try {
            setLoading(true);
            const token = sessionStorage.getItem('token');
            const res = await fetch(`${API_URL}/admin/usuarios`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setUsuarios(data.usuarios);
            } else {
                toast.error('Error al cargar usuarios');
            }
        } catch (error) {
            console.error(error);
            toast.error('Error de conexión');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarUsuarios();
    }, []);

    const handleActualizarRol = async (id, nuevoRol) => {
        try {
            const token = sessionStorage.getItem('token');
            const res = await fetch(`${API_URL}/admin/usuarios/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ rol: nuevoRol })
            });

            const data = await res.json();

            if (data.success) {
                toast.success('Rol actualizado correctamente');
                setUsuarios(usuarios.map(u =>
                    u.id === id ? { ...u, rol: nuevoRol } : u
                ));
            } else {
                toast.error(data.message || 'Error al actualizar');
            }
        } catch (error) {
            console.error(error);
            toast.error('Error de conexión');
        }
    };

    const handleCrearUsuario = async (e) => {
        e.preventDefault();
        try {
            const token = sessionStorage.getItem('token');
            const res = await fetch(`${API_URL}/admin/usuarios`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (data.success) {
                toast.success('Usuario creado correctamente');
                setShowModal(false);
                setFormData({ nombre: '', email: '', password: '', rol: 'cajero' });
                cargarUsuarios();
            } else {
                toast.error(data.message || 'Error al crear usuario');
            }
        } catch (error) {
            console.error(error);
            toast.error('Error de conexión');
        }
    };

    if (loading) return <div className="loading-screen"><div className="spinner"></div></div>;

    return (
        <div className="admin-module">
            <header className="module-header">
                <h2>👥 Gestión de Usuarios</h2>
                <div className="actions">
                    <button onClick={() => setShowModal(true)} className="btn-primary">
                        + Nuevo Usuario
                    </button>
                    <button onClick={cargarUsuarios} className="refresh-btn">
                        🔄 Recargar
                    </button>
                </div>
            </header>

            <div className="table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID Global</th>
                            <th>Nombre</th>
                            <th>Email</th>
                            <th>Rol (Permisos)</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios.map(usuario => (
                            <tr key={usuario.id}>
                                <td style={{ fontFamily: 'monospace', color: '#3b82f6' }}>
                                    USR-{usuario.id.toString().padStart(4, '0')}
                                </td>
                                <td>
                                    <strong>{usuario.nombre}</strong>
                                </td>
                                <td>{usuario.email}</td>
                                <td>
                                    <select
                                        className="status-select"
                                        style={{
                                            backgroundColor: usuario.rol === 'admin' ? '#e0e7ff' : '#f1f5f9',
                                            color: usuario.rol === 'admin' ? '#3730a3' : '#475569',
                                            minWidth: '120px'
                                        }}
                                        value={usuario.rol}
                                        onChange={(e) => handleActualizarRol(usuario.id, e.target.value)}
                                        disabled={usuario.email === 'admin@sakura.com'} // Evitar bloquear al superadmin
                                    >
                                        <option value="admin">Administrador</option>
                                        <option value="cajero">Cajero</option>
                                        <option value="cocina">Cocina</option>
                                    </select>
                                </td>
                                <td>
                                    <span className="badge badge-success">ACTIVO</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal de Creación */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Nuevo Usuario del Sistema</h3>
                        <form onSubmit={handleCrearUsuario}>
                            <div className="form-group">
                                <label>Nombre Completo</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.nombre}
                                    onChange={e => setFormData({ ...formData, nombre: e.target.value })}
                                    placeholder="Ej. Juan Pérez"
                                />
                            </div>
                            <div className="form-group">
                                <label>Correo Electrónico</label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="juan@sakura.com"
                                />
                            </div>
                            <div className="form-group">
                                <label>Contraseña Temporal</label>
                                <input
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="******"
                                />
                            </div>
                            <div className="form-group">
                                <label>Rol Asignado</label>
                                <select
                                    value={formData.rol}
                                    onChange={e => setFormData({ ...formData, rol: e.target.value })}
                                >
                                    <option value="cajero">Cajero (Ventas)</option>
                                    <option value="cocina">Cocina (Pedidos)</option>
                                    <option value="admin">Administrador (Total)</option>
                                </select>
                            </div>
                            <div className="modal-actions">
                                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">
                                    Cancelar
                                </button>
                                <button type="submit" className="btn-primary">
                                    Crear Usuario
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UsuariosAdmin;
