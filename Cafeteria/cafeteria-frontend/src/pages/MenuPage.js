import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MenuPage.css';
import MenuItem from '../components/MenuItem';
import CartModal from '../components/CartModal';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import logo from '../images/sakuracoffee.jpg';

// Datos de categorías completos
const categories = [
    { id: 1, nombre: 'Bebidas Calientes', icon: '🔥' },
    {
        id: 2,
        nombre: 'Bebidas Frías',
        icon: '🧊',
        subcategorias: [
            { id: 'sin-cafe', nombre: 'Sin Café' },
            { id: 'con-cafe', nombre: 'Con Café' }
        ]
    },
    { id: 3, nombre: 'Desayunos', icon: '🍳' },
    { id: 4, nombre: 'Postres', icon: '🍰' },
    { id: 5, nombre: 'Sandwiches', icon: '🥪' },
    { id: 6, nombre: 'Picaditas', icon: '🍟' },
    { id: 7, nombre: 'Bowls', icon: '🥣' },
    { id: 8, nombre: 'Café', icon: '☕' },
    { id: 9, nombre: 'Aguas & Gaseosas', icon: '💧' },
    { id: 10, nombre: 'Jugos & Limonadas', icon: '🍹' },
    { id: 11, nombre: 'Crepes & Waffles', icon: '🧇' },
    { id: 12, nombre: 'Adicionales', icon: '' }
];

function MenuPage() {
    const navigate = useNavigate();
    const [activeCategory, setActiveCategory] = useState(1);
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(false);

    const {
        addToCart,
        clearCart,
        getTotalItems,
        getTotalPrice,
        isCartOpen,
        setIsCartOpen
    } = useCart();

    // Cargar productos desde la API
    useEffect(() => {
        const loadProducts = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:5000/api/productos/categoria/${activeCategory}`);
                // La API puede devolver {data: [...]} o directamente el array
                const data = response.data.data || response.data;
                setMenuItems(data || []);
            } catch (error) {
                console.error('Error al cargar productos:', error);
                // Datos de respaldo (puedes eliminarlos una vez que la API funcione)
                const fallbackData = getFallbackData(activeCategory);
                setMenuItems(fallbackData);
            } finally {
                setLoading(false);
            }
        };

        if (activeCategory) {
            loadProducts();
        }
    }, [activeCategory]);

    // Datos de respaldo por si la API falla
    const getFallbackData = (categoryId) => {
        // Datos mínimos de ejemplo
        const fallback = {
            1: [
                { id: 101, nombre: 'Chocolate Caliente', descripcion: 'Delicioso chocolate derretido', precio: 2.99, categoria_id: 1 }
            ],
            2: [
                { id: 201, nombre: 'Té Frío', descripcion: 'Refrescante y ligero', precio: 2.50, categoria_id: 2, tipo: 'sin-cafe' },
                { id: 205, nombre: 'Café Helado', descripcion: 'Café frío con hielo', precio: 1.99, categoria_id: 2, tipo: 'con-cafe' }
            ]
        };
        return fallback[categoryId] || [];
    };

    // Filtrar items por categoría
    const filteredItems = menuItems.filter(item => item.categoria_id === activeCategory);

    // Agrupar por tipo si es la categoría de Bebidas Frías (id: 2)
    const itemsPorTipo = activeCategory === 2
        ? {
            'sin-cafe': filteredItems.filter(item => item.tipo === 'sin-cafe'),
            'con-cafe': filteredItems.filter(item => item.tipo === 'con-cafe')
        }
        : null;

    // Obtener nombre de categoría activa
    const activeCategoryName = categories.find(c => c.id === activeCategory)?.nombre || 'Menú';
    const activeCategoryIcon = categories.find(c => c.id === activeCategory)?.icon || '';

    // Componente para el separador de subcategorías
    const SubcategorySeparator = ({ titulo, icono }) => (
        <div className="subcategory-separator">
            <div className="separator-line"></div>
            <div className="separator-content">
                <span className="separator-icon">{icono}</span>
                <h3 className="separator-title">{titulo}</h3>
            </div>
            <div className="separator-line"></div>
        </div>
    );

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
                            className={`category-tab ${activeCategory === category.id ? 'active' : ''} ${category.subcategorias ? 'has-subcategories' : ''
                                }`}
                            onClick={() => setActiveCategory(category.id)}
                        >
                            <span className="tab-icon">
                                {category.icon}
                            </span>
                            <span className="tab-name">{category.nombre}</span>
                        </button>
                    ))}
                </div>
            </nav>

            {/* Contenido principal */}
            <main className="menu-content">
                <div className="category-header">
                    <h2 className="category-title">
                        <span className="category-icon">
                            {activeCategoryIcon}
                        </span>
                        {activeCategoryName}
                    </h2>

                    <div className="category-count">
                        {filteredItems.length} {filteredItems.length === 1 ? 'producto' : 'productos'}
                    </div>
                </div>

                {loading ? (
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Cargando productos...</p>
                    </div>
                ) : (
                    /* Grid de productos - Mostrar agrupado si es bebidas frías */
                    activeCategory === 2 && itemsPorTipo ? (
                        <div className="menu-with-subcategories">
                            {/* Bebidas frías SIN café */}
                            {itemsPorTipo['sin-cafe'].length > 0 && (
                                <>
                                    <SubcategorySeparator
                                        titulo="Bebidas Frías Sin Café"
                                        icono="🧃"
                                    />
                                    <div className="menu-grid">
                                        {itemsPorTipo['sin-cafe'].map(item => (
                                            <div key={item.id} className="menu-item-wrapper">
                                                <MenuItem
                                                    item={item}
                                                    onAddToCart={() => addToCart(item)}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}

                            {/* Bebidas frías CON café */}
                            {itemsPorTipo['con-cafe'].length > 0 && (
                                <>
                                    <SubcategorySeparator
                                        titulo="Bebidas Frías Con Café"
                                        icono="☕"
                                    />
                                    <div className="menu-grid">
                                        {itemsPorTipo['con-cafe'].map(item => (
                                            <div key={item.id} className="menu-item-wrapper">
                                                <MenuItem
                                                    item={item}
                                                    onAddToCart={() => addToCart(item)}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    ) : (
                        /* Grid normal para otras categorías */
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
                    )
                )}

                {/* Si no hay productos */}
                {!loading && filteredItems.length === 0 && (
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

export default MenuPage;