import React from 'react';
import './MenuItem.css';

function MenuItem({ item, onAddToCart }) {
    // Obtener icono según el tipo de producto
    const getItemIcon = (nombre) => {
        if (nombre.includes('Espresso') || nombre.includes('Café')) return '☕';
        if (nombre.includes('Matcha') || nombre.includes('Té')) return '🍵';
        if (nombre.includes('Latte')) return '🥛';
        if (nombre.includes('Desayuno')) return '🍳';
        if (nombre.includes('Mochi') || nombre.includes('Dorayaki')) return '🍡';
        return '🍴';
    };

    return (
        <div className="menu-item-card">
            <div className="item-icon">{getItemIcon(item.nombre)}</div>
            
            <div className="item-content">
                <div className="item-header">
                    <h3 className="item-name">{item.nombre}</h3>
                    <div className="price-badge">${item.precio.toFixed(2)}</div>
                </div>
                
                <p className="item-description">{item.descripcion}</p>
                
                <button 
                    className="cart-add-btn"
                    onClick={onAddToCart}
                >
                    <span className="cart-icon">🛒</span>
                    Agregar al carrito
                </button>
            </div>
        </div>
    );
}

export default MenuItem;