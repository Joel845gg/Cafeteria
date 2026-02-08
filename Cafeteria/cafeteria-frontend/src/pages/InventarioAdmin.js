import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import '../DashboardLayout.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function InventarioAdmin() {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingProduct, setEditingProduct] = useState(null); // null = crear, obj = editar
    const [showModal, setShowModal] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        precio: '',
        categoria_id: 1, // Default a 'Cafés' o lo que sea ID 1
        stock: 0,
        activo: true
    });

    const cargarProductos = async () => {
        try {
            const res = await fetch(`${API_URL}/productos`);
            const data = await res.json();
            if (data.success) {
                setProductos(data.data);
            }
        } catch (error) {
            console.error(error);
            toast.error('Error cargando productos');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarProductos();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = sessionStorage.getItem('token');
        const url = editingProduct
            ? `${API_URL}/productos/${editingProduct.id}`
            : `${API_URL}/productos`;

        const method = editingProduct ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });
            const data = await res.json();

            if (data.success) {
                toast.success(editingProduct ? 'Producto actualizado' : 'Producto creado');
                cargarProductos();
                closeModal();
            } else {
                toast.error(data.message || 'Error al guardar');
            }
        } catch (error) {
            toast.error('Error de conexión');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Seguro que deseas eliminar este producto?')) return;

        try {
            const token = sessionStorage.getItem('token');
            const res = await fetch(`${API_URL}/productos/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();

            if (data.success) {
                toast.success('Producto eliminado');
                cargarProductos();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error('Error al eliminar');
        }
    };

    const openModal = (producto = null) => {
        if (producto) {
            setEditingProduct(producto);
            setFormData({
                nombre: producto.nombre,
                descripcion: producto.descripcion || '',
                precio: producto.precio,
                categoria_id: producto.categoria_id,
                stock: producto.stock || 0,
                activo: producto.activo
            });
        } else {
            setEditingProduct(null);
            setFormData({
                nombre: '',
                descripcion: '',
                precio: '',
                categoria_id: 1,
                stock: 0,
                activo: true
            });
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingProduct(null);
    };

    return (
        <div className="inventario-container">
            <div className="header-actions">
                <h2>📦 Inventario</h2>
                <button className="btn-primary" onClick={() => openModal()}>
                    ➕ Nuevo Producto
                </button>
            </div>

            {loading ? <div className="spinner"></div> : (
                <div className="table-responsive">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th>Precio</th>
                                <th>Stock</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productos.map(p => (
                                <tr key={p.id}>
                                    <td>
                                        <strong>{p.nombre}</strong><br />
                                        <small>{p.descripcion}</small>
                                    </td>
                                    <td>${parseFloat(p.precio).toFixed(2)}</td>
                                    <td>{p.stock}</td>
                                    <td>
                                        <span className={`badge ${p.activo ? 'badge-success' : 'badge-danger'}`}>
                                            {p.activo ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </td>
                                    <td>
                                        <button className="btn-icon" onClick={() => openModal(p)}>✏️</button>
                                        <button className="btn-icon" onClick={() => handleDelete(p.id)}>🗑️</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>{editingProduct ? 'Editar Producto' : 'Nuevo Producto'}</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Nombre</label>
                                <input
                                    type="text"
                                    value={formData.nombre}
                                    onChange={e => setFormData({ ...formData, nombre: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Descripción</label>
                                <textarea
                                    value={formData.descripcion}
                                    onChange={e => setFormData({ ...formData, descripcion: e.target.value })}
                                />
                            </div>
                            <div className="grid-2">
                                <div className="form-group">
                                    <label>Precio</label>
                                    <input
                                        type="number" step="0.50"
                                        value={formData.precio}
                                        onChange={e => setFormData({ ...formData, precio: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Stock</label>
                                    <input
                                        type="number"
                                        value={formData.stock}
                                        onChange={e => setFormData({ ...formData, stock: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="grid-2">
                                <div className="form-group">
                                    <label>Categoría ID</label>
                                    <input
                                        type="number"
                                        value={formData.categoria_id}
                                        onChange={e => setFormData({ ...formData, categoria_id: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Estado</label>
                                    <select
                                        value={formData.activo}
                                        onChange={e => setFormData({ ...formData, activo: e.target.value === 'true' })}
                                    >
                                        <option value="true">Activo</option>
                                        <option value="false">Inactivo</option>
                                    </select>
                                </div>
                            </div>
                            <div className="modal-actions">
                                <button type="button" onClick={closeModal} className="btn-secondary">Cancelar</button>
                                <button type="submit" className="btn-primary">Guardar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style>{`
                .header-actions { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
                .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
                .modal-content { background: white; padding: 2rem; border-radius: 12px; width: 500px; max-width: 90%; }
                .form-group { margin-bottom: 1rem; }
                .form-group label { display: block; margin-bottom: 0.5rem; font-weight: 500; }
                .form-group input, .form-group textarea, .form-group select { width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 6px; }
                .modal-actions { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1rem; }
                .btn-secondary { background: #eee; border: none; padding: 0.75rem 1.5rem; border-radius: 8px; cursor: pointer; }
                .btn-icon { background: transparent; border: none; cursor: pointer; font-size: 1.2rem; margin-right: 0.5rem; }
            `}</style>
        </div>
    );
}

export default InventarioAdmin;
