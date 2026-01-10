import React from 'react';
import './MenuItem.css';

function MenuItem({ item, onAddToCart }) {
    return (
        <div className="menu-item">
            {/* Imagen del producto */}
            <div className="item-image-container">
                <img 
                    src={item.imagen} 
                    alt={item.nombre}
                    className="item-image"
                    loading="lazy"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=400&h=250&q=80";
                    }}
                />
                <div className="item-image-overlay"></div>
            </div>
            
            {/* Contenido */}
            <div className="item-content">
                <div className="item-header">
                    <h3 className="item-name">{item.nombre}</h3>
                    <div className="item-price">
                        ${item.precio.toFixed(2)}
                    </div>
                </div>
                
                <p className="item-description">{item.descripcion}</p>
                
                <button 
                    className="add-to-cart-btn"
                    onClick={onAddToCart}
                >
                    <span className="cart-icon">🛒</span>
                    <span className="btn-text">Agregar al Carrito</span>
                </button>
            </div>
        </div>
    );
}

export default MenuItem;