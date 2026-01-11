import React from 'react';
import './CartModal.css';
import { useCart } from '../context/CartContext';

function CartModal({ onClose, onClearCart }) {
    const { 
        cart, 
        removeFromCart, 
        updateQuantity, 
        getTotalPrice,
        formatPrice  // ← Esta función ya viene del contexto
    } = useCart();

    // Función local para calcular total por item
    const calculateItemTotal = (price, quantity) => {
        const priceNumber = typeof price === 'number' ? price : parseFloat(price);
        return ((priceNumber || 0) * quantity).toFixed(2);
    };

    return (
        <div className="cart-modal-overlay" onClick={onClose}>
            <div className="cart-modal" onClick={(e) => e.stopPropagation()}>
                <div className="cart-modal-header">
                    <h2 className="cart-title">Tu Pedido</h2>
                    <button className="close-btn" onClick={onClose}>✕</button>
                </div>

                <div className="cart-content">
                    {cart.length === 0 ? (
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
                                            {/* Usa formatPrice del contexto */}
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
                                    {/* Usa formatPrice del contexto para el total */}
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
                                    <button className="checkout-btn">
                                        💳 Pagar ${formatPrice(getTotalPrice())}
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CartModal;