import React, { useState } from 'react';
import './CartModal.css';
import { useCart } from '../context/CartContext';
import CheckoutModal from './CheckoutModal';

function CartModal({ onClose, onClearCart }) {
    const { 
        cart, 
        removeFromCart, 
        updateQuantity, 
        getTotalPrice,
        formatPrice,
        clearCart  // ✅ Esta función SÍ existe en tu CartContext
    } = useCart();

    const [showCheckout, setShowCheckout] = useState(false);
    const [orderConfirmed, setOrderConfirmed] = useState(null);

    const handleCheckout = () => {
        setShowCheckout(true);
    };

    const handleOrderSuccess = (orderData) => {
        // Limpiar carrito cuando el pedido es exitoso
        clearCart(); // ✅ Usamos clearCart que SÍ existe
        
        // Mostrar confirmación en el carrito
        setOrderConfirmed(orderData);
        setShowCheckout(false);
        
        // Cerrar automáticamente después de 3 segundos
        setTimeout(() => {
            onClose();
            setOrderConfirmed(null);
        }, 3000);
    };

    const calculateItemTotal = (price, quantity) => {
        const priceNumber = typeof price === 'number' ? price : parseFloat(price);
        return ((priceNumber || 0) * quantity).toFixed(2);
    };

    return (
        <>
            <div className="cart-modal-overlay" onClick={onClose}>
                <div className="cart-modal" onClick={(e) => e.stopPropagation()}>
                    <div className="cart-modal-header">
                        <h2 className="cart-title">Tu Pedido</h2>
                        <button className="close-btn" onClick={onClose}>✕</button>
                    </div>

                    <div className="cart-content">
                        {orderConfirmed ? (
                            <div className="order-confirmation">
                                <div className="confirmation-icon">✅</div>
                                <h3>¡Pedido Confirmado!</h3>
                                <p>Tu pedido #{orderConfirmed.numero_pedido} ha sido procesado.</p>
                                <p>Total: ${formatPrice(orderConfirmed.total)}</p>
                                <p className="confirmation-note">
                                    Te contactaremos pronto para la entrega.
                                </p>
                            </div>
                        ) : cart.length === 0 ? (
                            <div className="empty-cart">
                                <div className="empty-icon">🛒</div>
                                <p>Tu carrito está vacío</p>
                                <button className="continue-shopping" onClick={onClose}>
                                    Continuar Comprando
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="cart-items">
                                    {cart.map(item => (
                                        <div key={item.id} className="cart-item">
                                            <div className="item-info">
                                                <h4 className="item-name">{item.nombre}</h4>
                                                <p className="item-price">${formatPrice(item.precio)} c/u</p>
                                            </div>
                                            
                                            <div className="item-controls">
                                                <div className="quantity-controls">
                                                    <button 
                                                        className="qty-btn"
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    >
                                                        −
                                                    </button>
                                                    <span className="quantity">{item.quantity}</span>
                                                    <button 
                                                        className="qty-btn"
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                                
                                                <div className="item-total">
                                                    ${calculateItemTotal(item.precio, item.quantity)}
                                                </div>
                                                
                                                <button 
                                                    className="remove-btn"
                                                    onClick={() => removeFromCart(item.id)}
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="cart-summary">
                                    <div className="summary-row total">
                                        <span>Total a pagar:</span>
                                        <span className="total-price">${formatPrice(getTotalPrice())}</span>
                                    </div>
                                </div>

                                <div className="cart-actions">
                                    <button 
                                        className="clear-cart-btn"
                                        onClick={onClearCart}
                                    >
                                        🗑️ Limpiar Carrito
                                    </button>
                                    
                                    <div className="checkout-buttons">
                                        <button className="continue-btn" onClick={onClose}>
                                            Seguir Comprando
                                        </button>
                                        <button 
                                            className="checkout-btn"
                                            onClick={handleCheckout}
                                        >
                                            💳 Proceder al Pago ${formatPrice(getTotalPrice())}
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {showCheckout && (
                <CheckoutModal
                    onClose={() => setShowCheckout(false)}
                    onOrderSuccess={handleOrderSuccess}
                />
            )}
        </>
    );
}

export default CartModal;