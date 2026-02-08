import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MenuPage.css';
import MenuItem from '../components/MenuItem';
import CartModal from '../components/CartModal';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import logo from '../images/sakuracoffee.jpg';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

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
    const { addToCart, isCartOpen, setIsCartOpen, clearCart } = useCart();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get(`${API_URL}/productos`);
                setProducts(res.data);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // Filtrar productos
    const filteredProducts = products.filter(product => {
        const matchesCategory = product.categoria_id === activeCategory;
        const matchesSearch = product.nombre.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const currentCategory = categories.find(c => c.id === activeCategory);

    return (
        <div className="menu-page">
            <header className="menu-header">
                <div className="header-content">
                    <img src={logo} alt="Sakura Coffee" className="header-logo" />
                    <div className="search-bar">
                        <input
                            type="text"
                            placeholder="Buscar en el menú..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </header>

            <div className="categories-scroll">
                {categories.map(category => (
                    <button
                        key={category.id}
                        className={`category-btn ${activeCategory === category.id ? 'active' : ''}`}
                        onClick={() => setActiveCategory(category.id)}
                    >
                        <span className="cat-icon">{category.icon}</span>
                        {category.nombre}
                    </button>
                ))}
            </div>

            <main className="menu-content">
                <h2 className="category-title">
                    {currentCategory?.nombre}
                </h2>

                {loading ? (
                    <p>Cargando menú...</p>
                ) : (
                    <div className="products-grid">
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map(product => (
                                <MenuItem
                                    key={product.id}
                                    item={product}
                                    onAddToCart={() => {
                                        addToCart(product);
                                        setIsCartOpen(true);
                                    }}
                                />
                            ))
                        ) : (
                            <p className="no-products">No hay productos en esta categoría.</p>
                        )}
                    </div>
                )}
            </main>

            {isCartOpen && (
                <CartModal
                    onClose={() => setIsCartOpen(false)}
                    onClearCart={clearCart}
                />
            )}
        </div>
    );
}

export default MenuPage;