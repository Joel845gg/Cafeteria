import React, { useState } from 'react';
import './CheckoutModal.css';
import { useCart } from '../context/CartContext';
import { createOrder } from '../services/api';

function CheckoutModal({ onClose, onOrderSuccess }) {
    const { cart, getTotalPrice, formatPrice } = useCart();
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [orderData, setOrderData] = useState(null);

    // Estado del formulario
    const [formData, setFormData] = useState({
        nombre: '',
        telefono: '',
        metodoPago: 'efectivo'
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);
        setIsProcessing(true);

        // Validaciones
        if (!formData.nombre.trim()) {
            setError('Por favor ingresa tu nombre');
            setIsProcessing(false);
            return;
        }

        if (!formData.telefono.trim() || formData.telefono.length < 10) {
            setError('Por favor ingresa un teléfono válido (mínimo 10 dígitos)');
            setIsProcessing(false);
            return;
        }

        if (cart.length === 0) {
            setError('El carrito está vacío');
            setIsProcessing(false);
            return;
        }

        try {
            const orderDataToSend = {
                nombre: formData.nombre,
                telefono: formData.telefono,
                metodo_pago: formData.metodoPago,
                items: cart.map(item => ({
                    producto_id: item.id,
                    nombre: item.nombre,
                    cantidad: item.quantity,
                    precio_unitario: item.precio,
                    subtotal: item.precio * item.quantity
                })),
                total: getTotalPrice()
            };

            console.log('Enviando pedido...');

            const response = await createOrder(orderDataToSend);
            console.log('Respuesta del servidor:', response);

            if (response.success) {
                setOrderData(response.order);
                setSuccess(true);

                // Notificar éxito al padre (CartModal)
                if (onOrderSuccess) {
                    onOrderSuccess(response.order);
                }

                // Cerrar modal después de 5 segundos
                setTimeout(() => {
                    onClose();
                }, 5000);

            } else {
                setError(response.message || 'Error al procesar el pedido');
            }
        } catch (err) {
            console.error('Error en checkout:', err);
            setError('Error de conexión. Intenta nuevamente.');
        } finally {
            setIsProcessing(false);
        }
    };

    // Pantalla de confirmación
    if (success && orderData) {
        return (
            <div className="checkout-modal-overlay" onClick={onClose}>
                <div className="checkout-modal" onClick={(e) => e.stopPropagation()}>
                    <div className="checkout-header">
                        <h2>¡Pedido Confirmado!</h2>
                        <button className="close-btn" onClick={onClose}>✕</button>
                    </div>

                    <div className="order-confirmation">
                        <div className="confirmation-icon">✅</div>
                        <h3>¡Gracias por tu compra!</h3>

                        <div className="confirmation-details">
                            <div className="detail-item">
                                <span className="detail-label">N° de pedido:</span>
                                <span className="detail-value">{orderData.numero_pedido}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Cliente:</span>
                                <span className="detail-value">{formData.nombre}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Teléfono:</span>
                                <span className="detail-value">{formData.telefono}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Total:</span>
                                <span className="detail-value">${formatPrice(orderData.total)}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Estado:</span>
                                <span className="detail-value status-pendiente">Pendiente</span>
                            </div>
                        </div>

                        <div className="confirmation-message">
                            <p>✅ Tu pedido ha sido procesado exitosamente.</p>
                            <p>📞 Te contactaremos para coordinar la entrega.</p>
                        </div>

                        <button className="continue-shopping-btn" onClick={onClose}>
                            Continuar Comprando
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Pantalla de formulario
    return (
        <div className="checkout-modal-overlay" onClick={onClose}>
            <div className="checkout-modal" onClick={(e) => e.stopPropagation()}>
                <div className="checkout-header">
                    <h2>Finalizar Pedido</h2>
                    <button className="close-btn" onClick={onClose}>✕</button>
                </div>

                <div className="checkout-content">
                    <div className="order-summary">
                        <h3>Resumen de tu Pedido</h3>
                        <div className="summary-items">
                            {cart.map(item => (
                                <div key={item.id} className="summary-item">
                                    <span>{item.nombre} x {item.quantity}</span>
                                    <span>${formatPrice(item.precio * item.quantity)}</span>
                                </div>
                            ))}
                        </div>
                        <div className="summary-total">
                            <strong>Total a pagar:</strong>
                            <strong>${formatPrice(getTotalPrice())}</strong>
                        </div>
                    </div>

                    <form className="checkout-form" onSubmit={handleSubmit}>
                        <h3>Datos del Cliente</h3>

                        {error && <div className="error-message">{error}</div>}

                        <div className="form-group">
                            <label htmlFor="nombre">Nombre del Cliente *</label>
                            <input
                                type="text"
                                id="nombre"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleInputChange}
                                required
                                placeholder="Ingresa tu nombre"
                                disabled={isProcessing}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="telefono">Teléfono *</label>
                            <input
                                type="tel"
                                id="telefono"
                                name="telefono"
                                value={formData.telefono}
                                onChange={handleInputChange}
                                required
                                placeholder="Ej: 0958718430"
                                disabled={isProcessing}
                            />
                        </div>

                        <div className="form-group">
                            <label>Método de Pago</label>
                            <div className="payment-method-readonly">
                                💵 Efectivo / Contra Entrega
                            </div>
                            <input type="hidden" name="metodoPago" value="efectivo" />
                        </div>

                        <div className="checkout-actions">
                            <button
                                type="button"
                                className="back-btn"
                                onClick={onClose}
                                disabled={isProcessing}
                            >
                                ← Volver
                            </button>
                            <button
                                type="submit"
                                className="submit-order-btn"
                                disabled={isProcessing || cart.length === 0}
                            >
                                {isProcessing ? (
                                    <>
                                        <span className="spinner"></span> Procesando...
                                    </>
                                ) : (
                                    `Confirmar Pedido $${formatPrice(getTotalPrice())}`
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default CheckoutModal;