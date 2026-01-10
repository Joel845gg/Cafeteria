import React from 'react';
import './CartModal.css';
import { useCart } from '../context/CartContext';

function CartModal({ onClose, onClearCart }) {
    const { cart, removeFromCart, updateQuantity, getTotalPrice } = useCart();

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
                                            <p className="item-price">${item.precio.toFixed(2)} c/u</p>
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
                                                ${(item.precio * item.quantity).toFixed(2)}
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
                                    <span className="total-price">${getTotalPrice().toFixed(2)}</span>
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
                                        💳 Pagar ${getTotalPrice().toFixed(2)}
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