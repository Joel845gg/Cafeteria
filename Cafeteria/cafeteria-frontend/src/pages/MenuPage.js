import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MenuPage.css';
import { categories, menuItems } from '../data/menuData';
import MenuItem from '../components/MenuItem';
import CartModal from '../components/CartModal';
import { useCart } from '../context/CartContext';
import logo from '../images/sakuracoffee.jpg'; // Importar el logo

function MenuPage() {
    const navigate = useNavigate();
    const [activeCategory, setActiveCategory] = useState(1);
    const {
        addToCart,
        clearCart,
        getTotalItems,
        getTotalPrice,
        isCartOpen,
        setIsCartOpen
    } = useCart();

    // Filtrar items por categoría
    const filteredItems = menuItems.filter(item => item.categoria_id === activeCategory);

    // Obtener nombre de categoría activa
    const activeCategoryName = categories.find(c => c.id === activeCategory)?.nombre || 'Menú';

    return (
        <div className="menu-page">
            {/* Header del menú con logo */}
            <header className="menu-header">
                <button className="back-btn" onClick={() => navigate('/')}>
                    ← Inicio
                </button>
                
                <div className="header-content">
                    <img 
                        src={logo} 
                        alt="Sakura Coffee" 
                        className="menu-logo"
                    />
                    <p className="menu-subtitle">Selecciona una categoría para explorar</p>
                </div>
                
                <div 
                    className="cart-indicator"
                    onClick={() => setIsCartOpen(true)}
                >
                    🛒 {getTotalItems()}
                </div>
            </header>

            {/* Navegación de categorías */}
            <nav className="category-nav">
                <div className="category-tabs">
                    {categories.map(category => (
                        <button
                            key={category.id}
                            className={`category-tab ${activeCategory === category.id ? 'active' : ''}`}
                            onClick={() => setActiveCategory(category.id)}
                        >
                            <span className="tab-icon">
                                {getCategoryIcon(category.id)}
                            </span>
                            {category.nombre}
                        </button>
                    ))}
                </div>
            </nav>

            {/* Contenido principal */}
            <main className="menu-content">
                <div className="category-header">
                    <h2 className="category-title">
                        <span className="category-icon">
                            {getCategoryIcon(activeCategory)}
                        </span>
                        {activeCategoryName}
                    </h2>
                    
                    <div className="category-count">
                        {filteredItems.length} {filteredItems.length === 1 ? 'producto' : 'productos'}
                    </div>
                </div>

                {/* Grid de productos */}
                <div className="menu-grid">
                    {filteredItems.map(item => (
                        <div key={item.id} className="menu-item-wrapper">
                            <MenuItem 
                                item={item}
                                onAddToCart={() => addToCart(item)}
                            />
                        </div>
                    ))}
                </div>

                {/* Si no hay productos */}
                {filteredItems.length === 0 && (
                    <div className="empty-state">
                        <div className="empty-icon">🍜</div>
                        <p>No hay productos en esta categoría</p>
                    </div>
                )}
            </main>

            {/* Modal del carrito */}
            {isCartOpen && (
                <CartModal 
                    onClose={() => setIsCartOpen(false)}
                    onClearCart={clearCart}
                />
            )}

            {/* Botón flotante del carrito */}
            {getTotalItems() > 0 && (
                <div 
                    className="floating-cart-btn"
                    onClick={() => setIsCartOpen(true)}
                >
                    <span className="cart-icon">🛒</span>
                    <span className="cart-count">{getTotalItems()}</span>
                    <span className="cart-total">${getTotalPrice().toFixed(2)}</span>
                </div>
            )}
        </div>
    );
}

// Función para obtener iconos según categoría
// Función para obtener iconos según categoría
function getCategoryIcon(categoryId) {
    switch(categoryId) {
        case 1: return '🔥'; // Bebidas Calientes
        case 2: return '🧊'; // Bebidas Frías
        case 3: return '🌸'; // Especiales Sakura
        case 4: return '🍳'; // Desayunos
        case 5: return '🍡'; // Postres
        default: return '☕';
    }
}

export default MenuPage;