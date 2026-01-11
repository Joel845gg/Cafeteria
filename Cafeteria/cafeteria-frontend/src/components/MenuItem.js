// MenuItem.js - Versión mejorada con badges opcionales
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
        if (nombre.includes('Crepe') || nombre.includes('Waffle')) return '🧇';
        if (nombre.includes('Jugo') || nombre.includes('Limonada')) return '🍹';
        if (nombre.includes('Agua') || nombre.includes('Gaseosa')) return '💧';
        if (nombre.includes('Sandwich')) return '🥪';
        if (nombre.includes('Postre')) return '🍰';
        return '🍴';
    };

    // Función para formatear precio seguro
    const formatPrice = (price) => {
        const priceNumber = typeof price === 'number' ? price : parseFloat(price);
        return (priceNumber || 0).toFixed(2);
    };

    // Determinar si es nuevo (ejemplo: agregado en los últimos 7 días)
    const esNuevo = item.fecha_creacion ? 
        (new Date() - new Date(item.fecha_creacion)) < (7 * 24 * 60 * 60 * 1000) : 
        false;

    // Determinar si es popular (ejemplo: si tiene muchas ventas)
    const esPopular = item.ventas ? item.ventas > 50 : false;

    return (
        <div className="menu-item-card">
            {/* Badges opcionales */}
            {esNuevo && <div className="new-badge">NUEVO</div>}
            {esPopular && <div className="popular-badge">POPULAR</div>}
            
            <div className="item-icon">{getItemIcon(item.nombre)}</div>
            
            <div className="item-content">
                <div className="item-header">
                    <h3 className="item-name">{item.nombre}</h3>
                    <div className="price-badge">${formatPrice(item.precio)}</div>
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