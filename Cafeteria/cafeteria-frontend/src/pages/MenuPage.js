import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MenuPage.css';
import MenuItem from '../components/MenuItem';
import CartModal from '../components/CartModal';
import { useCart } from '../context/CartContext';
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
    { id: 12, nombre: 'Adicionales', icon: '➕' }
];

// Datos completos del menú con separadores implementados
const menuItems = [
    // Bebidas Calientes (id: 1)
    {
        id: 101,
        nombre: 'Chocolate Caliente',
        descripcion: 'Delicioso chocolate derretido con leche espumosa',
        precio: 2.99,
        categoria_id: 1
    },
    {
        id: 102,
        nombre: 'Chai Latte',
        descripcion: 'Mezcla perfecta de té y especias con leche cremosa',
        precio: 2.50,
        categoria_id: 1
    },
    {
        id: 103,
        nombre: 'Matcha Latte',
        descripcion: 'Matcha vibrante con leche suave, energizante',
        precio: 2.50,
        categoria_id: 1
    },
    {
        id: 104,
        nombre: 'Té de Hierbas Relajante',
        descripcion: 'Relajante infusión de hierbas naturales',
        precio: 2.00,
        categoria_id: 1
    },
    {
        id: 105,
        nombre: 'Espresso Sakura',
        descripcion: 'Café concentrado con esencia de cerezo y notas florales',
        precio: 3.50,
        categoria_id: 1
    },
    {
        id: 106,
        nombre: 'Matcha Latte Tradicional',
        descripcion: 'Matcha ceremonial batido con leche vaporizada y miel',
        precio: 3.75,
        categoria_id: 1
    },
    {
        id: 107,
        nombre: 'Hojicha Latte',
        descripcion: 'Té verde tostado con leche cremosa y notas caramelizadas',
        precio: 3.75,
        categoria_id: 1
    },
    {
        id: 108,
        nombre: 'Genmaicha',
        descripcion: 'Té verde con arroz tostado, estilo tradicional japonés',
        precio: 3.50,
        categoria_id: 1
    },

    // Bebidas Frías (id: 2) - CON SEPARADORES
    // Bebidas frías SIN café
    {
        id: 201,
        nombre: 'Té Frío',
        descripcion: 'Refrescante y ligero, ideal para cualquier momento',
        precio: 2.50,
        categoria_id: 2,
        tipo: 'sin-cafe'
    },
    {
        id: 202,
        nombre: 'Sakura Té Frío',
        descripcion: 'Té helado con un toque floral, perfecto para una pausa',
        precio: 2.99,
        categoria_id: 2,
        tipo: 'sin-cafe'
    },
    {
        id: 203,
        nombre: 'Chai Latte Frío',
        descripcion: 'Especias y té negro en versión fría, cremosa',
        precio: 2.75,
        categoria_id: 2,
        tipo: 'sin-cafe'
    },
    {
        id: 204,
        nombre: 'Matcha Latte Frío',
        descripcion: 'Matcha vibrante batido con leche fría, refrescante',
        precio: 2.75,
        categoria_id: 2,
        tipo: 'sin-cafe'
    },
    
    // Bebidas frías CON café
    {
        id: 205,
        nombre: 'Café Helado',
        descripcion: 'Café frío servido sobre hielo, simple y refrescante',
        precio: 1.99,
        categoria_id: 2,
        tipo: 'con-cafe'
    },
    {
        id: 206,
        nombre: 'Ice Caramel Latte',
        descripcion: 'Espresso con leche fría, jarabe de caramelo y crema',
        precio: 2.99,
        categoria_id: 2,
        tipo: 'con-cafe'
    },
    {
        id: 207,
        nombre: 'Mocaccino Frío',
        descripcion: 'Café, chocolate y leche fría servido con hielo',
        precio: 2.75,
        categoria_id: 2,
        tipo: 'con-cafe'
    },
    {
        id: 208,
        nombre: 'Frozen de Caramelo',
        descripcion: 'Bebida helada con café, leche, caramelo y crema',
        precio: 2.99,
        categoria_id: 2,
        tipo: 'con-cafe'
    },
    {
        id: 209,
        nombre: 'Latte Frío',
        descripcion: 'Latte suave y cremoso con espresso y leche fría',
        precio: 2.50,
        categoria_id: 2,
        tipo: 'con-cafe'
    },
    {
        id: 210,
        nombre: 'Latte Frío de Sabores',
        descripcion: 'Café con leche fría con sabores de caramelo, vainilla, menta o avellana',
        precio: 2.99,
        categoria_id: 2,
        tipo: 'con-cafe'
    },

    // Desayunos (id: 3)
    {
        id: 301,
        nombre: 'Omelette',
        descripcion: 'Omelette esponjoso con ingredientes frescos, pan tostado y tomate confitado',
        precio: 4.50,
        categoria_id: 3
    },
    {
        id: 302,
        nombre: 'Avocado Toast',
        descripcion: 'Tostada con aguacate, queso feta, remolacha y semillas de chía',
        precio: 3.99,
        categoria_id: 3
    },
    {
        id: 303,
        nombre: 'Vegan Nut & Banana Toast',
        descripcion: 'Pan tostado con crema de maní, banano y miel de chía',
        precio: 3.99,
        categoria_id: 3
    },
    {
        id: 304,
        nombre: 'American Breakfast',
        descripcion: 'Waffles con maple, tocino y huevos revueltos',
        precio: 5.99,
        categoria_id: 3
    },
    {
        id: 305,
        nombre: 'Classic Breakfast',
        descripcion: 'Tostadas con huevos revueltos, fruta y mermelada',
        precio: 4.75,
        categoria_id: 3
    },
    {
        id: 306,
        nombre: 'Morning Boost',
        descripcion: 'Elige entre bowl de avena, smoothie o açaí con pan tostado',
        precio: 4.99,
        categoria_id: 3
    },
    {
        id: 307,
        nombre: 'Sweet Morning Stacks',
        descripcion: 'Pancakes con fruta fresca, mermelada y miel de maple',
        precio: 5.99,
        categoria_id: 3
    },
    {
        id: 308,
        nombre: 'Sweet Morning Stacks (Vegan)',
        descripcion: 'Pancakes veganos con fruta fresca y mermelada',
        precio: 6.99,
        categoria_id: 3
    },
    {
        id: 309,
        nombre: 'Sweet Breakfast',
        descripcion: 'Tostadas francesas con frutas y frutos secos',
        precio: 6.50,
        categoria_id: 3
    },

    // Postres (id: 4)
    {
        id: 401,
        nombre: 'Brownie con Helado y Crema',
        descripcion: 'Brownie caliente con helado y crema batida',
        precio: 3.99,
        categoria_id: 4
    },
    {
        id: 402,
        nombre: 'Pan de Banano',
        descripcion: 'Esponjoso pan de banano con toque de vainilla',
        precio: 1.99,
        categoria_id: 4
    },
    {
        id: 403,
        nombre: 'Blondie de Café',
        descripcion: 'Blondie con toque de café y chocolate blanco',
        precio: 1.99,
        categoria_id: 4
    },
    {
        id: 404,
        nombre: 'Cheesecake de la Casa',
        descripcion: 'Cheesecake cremoso con base crujiente',
        precio: 3.75,
        categoria_id: 4
    },
    {
        id: 405,
        nombre: 'Pie de Manzana',
        descripcion: 'Manzanas con canela en masa dorada y crujiente',
        precio: 2.99,
        categoria_id: 4
    },
    {
        id: 406,
        nombre: 'Tiramisú',
        descripcion: 'Capas de bizcocho con café, mascarpone y cacao',
        precio: 3.00,
        categoria_id: 4
    },

    // Sandwiches (id: 5)
    {
        id: 501,
        nombre: 'Sándwich de Pollo',
        descripcion: 'Pollo con salsa de champiñones y queso fundido',
        precio: 3.50,
        categoria_id: 5
    },
    {
        id: 502,
        nombre: 'Sándwich de Queso',
        descripcion: 'Tres tipos de quesos fundidos en pan tostado',
        precio: 2.99,
        categoria_id: 5
    },
    {
        id: 503,
        nombre: 'Sándwich de la Casa',
        descripcion: 'Huevo, tocino y queso derretido',
        precio: 3.50,
        categoria_id: 5
    },
    {
        id: 504,
        nombre: 'Sándwich Pesto',
        descripcion: 'Pesto, aguacate, tomate y queso derretido',
        precio: 3.00,
        categoria_id: 5
    },
    {
        id: 505,
        nombre: 'Katsu Sando',
        descripcion: 'Filete de cerdo empanizado con salsa tonkatsu',
        precio: 3.50,
        categoria_id: 5
    },
    {
        id: 506,
        nombre: 'Tamago Sando',
        descripcion: 'Ensalada de huevo con mayonesa japonesa',
        precio: 3.00,
        categoria_id: 5
    },
    {
        id: 507,
        nombre: 'Teriyaki Chicken Sando',
        descripcion: 'Pollo glaseado en salsa teriyaki',
        precio: 3.50,
        categoria_id: 5
    },

    // Picaditas (id: 6)
    {
        id: 601,
        nombre: 'Nachos con Queso',
        descripcion: 'Crujientes nachos con queso cheddar derretido',
        precio: 2.50,
        categoria_id: 6
    },
    {
        id: 602,
        nombre: 'Nachos Mixtos',
        descripcion: 'Nachos con queso cheddar y toppings especiales',
        precio: 3.00,
        categoria_id: 6
    },
    {
        id: 603,
        nombre: 'Papas Fritas',
        descripcion: 'Papas fritas con queso cheddar y tocino',
        precio: 2.50,
        categoria_id: 6
    },
    {
        id: 604,
        nombre: 'Extra Papas Fritas',
        descripcion: 'Porción adicional de papas fritas',
        precio: 1.25,
        categoria_id: 6
    },

    // Bowls (id: 7)
    {
        id: 701,
        nombre: 'Açaí Bowl',
        descripcion: 'Pulpa de açaí con frutas frescas y toppings',
        precio: 4.50,
        categoria_id: 7
    },
    {
        id: 702,
        nombre: 'Bowl de Avena',
        descripcion: 'Avena cremosa con fruta, almendras y miel',
        precio: 3.50,
        categoria_id: 7
    },
    {
        id: 703,
        nombre: 'Smoothie Bowl',
        descripcion: 'Mezcla de frutos rojos con toppings saludables',
        precio: 3.75,
        categoria_id: 7
    },

    // Café (id: 8)
    {
        id: 801,
        nombre: 'Espresso',
        descripcion: 'Café puro, intenso y robusto',
        precio: 1.25,
        categoria_id: 8
    },
    {
        id: 802,
        nombre: 'Doppio',
        descripcion: 'Doble shot de espresso para café fuerte',
        precio: 1.50,
        categoria_id: 8
    },
    {
        id: 803,
        nombre: 'Americano',
        descripcion: 'Café suave y ligero, perfecto para disfrutar',
        precio: 1.75,
        categoria_id: 8
    },
    {
        id: 804,
        nombre: 'Macchiato',
        descripcion: 'Espresso con toque de espuma de leche',
        precio: 1.99,
        categoria_id: 8
    },
    {
        id: 805,
        nombre: 'Flat White',
        descripcion: 'Doble espresso con leche al vapor, suave',
        precio: 2.75,
        categoria_id: 8
    },
    {
        id: 806,
        nombre: 'Cappuccino',
        descripcion: 'Espresso, leche y espuma espesa clásica',
        precio: 2.35,
        categoria_id: 8
    },
    {
        id: 807,
        nombre: 'Mocaccino',
        descripcion: 'Mezcla de café y chocolate con leche',
        precio: 2.50,
        categoria_id: 8
    },
    {
        id: 808,
        nombre: 'Signature Cappuccino',
        descripcion: 'Cappuccino especial con sabor a elegir',
        precio: 2.50,
        categoria_id: 8
    },

    // Aguas & Gaseosas (id: 9)
    {
        id: 901,
        nombre: 'Agua con gas',
        descripcion: 'Agua mineral con gas',
        precio: 1.25,
        categoria_id: 9
    },
    {
        id: 902,
        nombre: 'Agua sin gas',
        descripcion: 'Agua mineral sin gas',
        precio: 1.00,
        categoria_id: 9
    },
    {
        id: 903,
        nombre: 'Coca-Cola',
        descripcion: 'Refresco de cola',
        precio: 0.90,
        categoria_id: 9
    },
    {
        id: 904,
        nombre: 'Sprite',
        descripcion: 'Refresco de lima-limón',
        precio: 0.90,
        categoria_id: 9
    },
    {
        id: 905,
        nombre: 'Fanta',
        descripcion: 'Refresco de naranja',
        precio: 0.90,
        categoria_id: 9
    },
    {
        id: 906,
        nombre: 'Fioravanti',
        descripcion: 'Refresco de frutas',
        precio: 0.90,
        categoria_id: 9
    },

    // Jugos & Limonadas (id: 10)
    {
        id: 1001,
        nombre: 'Jugo de Naranja',
        descripcion: 'Jugo natural de naranja',
        precio: 1.99,
        categoria_id: 10
    },
    {
        id: 1002,
        nombre: 'Jugo de Frutilla',
        descripcion: 'Jugo natural de frutilla',
        precio: 1.99,
        categoria_id: 10
    },
    {
        id: 1003,
        nombre: 'Jugo de Mora',
        descripcion: 'Jugo natural de mora',
        precio: 1.99,
        categoria_id: 10
    },
    {
        id: 1004,
        nombre: 'Limonada Imperial',
        descripcion: 'Limonada refrescante tradicional',
        precio: 1.99,
        categoria_id: 10
    },
    {
        id: 1005,
        nombre: 'Limonada Rosada',
        descripcion: 'Limonada con toque especial rosado',
        precio: 2.50,
        categoria_id: 10
    },

    // Crepes & Waffles (id: 11)
    {
        id: 1101,
        nombre: 'Crepé Arequipe y Queso',
        descripcion: 'Arequipe cremoso y queso suave en crepé',
        precio: 3.99,
        categoria_id: 11
    },
    {
        id: 1102,
        nombre: 'Crispy Kiss Crepe',
        descripcion: 'Crepé con dulce de leche y frutas frescas',
        precio: 4.50,
        categoria_id: 11
    },
    {
        id: 1103,
        nombre: 'Waffle de Mantequilla y Miel',
        descripcion: 'Waffle dorado con mantequilla y miel',
        precio: 3.99,
        categoria_id: 11
    },
    {
        id: 1104,
        nombre: 'Waffle de Frutos del Bosque',
        descripcion: 'Waffle con mezcla de frutos del bosque',
        precio: 3.99,
        categoria_id: 11
    },
    {
        id: 1105,
        nombre: 'Waffle de Nutella y Banano',
        descripcion: 'Waffle con Nutella, banano y helado',
        precio: 5.99,
        categoria_id: 11
    },
    {
        id: 1106,
        nombre: 'Waffle de Arequipe con Helado',
        descripcion: 'Waffle con arequipe cremoso y helado',
        precio: 5.99,
        categoria_id: 11
    },
    {
        id: 1107,
        nombre: 'Crepé Veggie',
        descripcion: 'Crepé con frutas frescas y mermelada',
        precio: 4.50,
        categoria_id: 11
    },
    {
        id: 1108,
        nombre: 'Veggie Waffle',
        descripcion: 'Waffle con frutas frescas y mermelada',
        precio: 4.50,
        categoria_id: 11
    },

    // Adicionales (id: 12)
    {
        id: 1201,
        nombre: 'Crema',
        descripcion: 'Porción adicional de crema',
        precio: 0.50,
        categoria_id: 12
    },
    {
        id: 1202,
        nombre: 'Leche de Almendras',
        descripcion: 'Leche vegetal de almendras',
        precio: 0.85,
        categoria_id: 12
    },
    {
        id: 1203,
        nombre: 'Caramelo',
        descripcion: 'Jarabe o topping de caramelo',
        precio: 0.50,
        categoria_id: 12
    },
    {
        id: 1204,
        nombre: 'Queso',
        descripcion: 'Porción adicional de queso',
        precio: 0.75,
        categoria_id: 12
    },
    {
        id: 1205,
        nombre: 'Huevo',
        descripcion: 'Huevo adicional',
        precio: 0.75,
        categoria_id: 12
    },
    {
        id: 1206,
        nombre: 'Chocolate',
        descripcion: 'Topping o jarabe de chocolate',
        precio: 0.50,
        categoria_id: 12
    },
    {
        id: 1207,
        nombre: 'Helado',
        descripcion: 'Bola de helado adicional',
        precio: 1.00,
        categoria_id: 12
    },
    {
        id: 1208,
        nombre: 'Jarabe',
        descripcion: 'Jarabe de sabor a elección',
        precio: 0.50,
        categoria_id: 12
    },
    {
        id: 1209,
        nombre: 'Tocino',
        descripcion: 'Porción adicional de tocino',
        precio: 1.60,
        categoria_id: 12
    },
    {
        id: 1210,
        nombre: 'Fruta Picada',
        descripcion: 'Porción de fruta fresca picada',
        precio: 1.45,
        categoria_id: 12
    }
];

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
    
    // Agrupar por tipo si es la categoría de Bebidas Frías (id: 2)
    const itemsPorTipo = activeCategory === 2 
        ? {
            'sin-cafe': filteredItems.filter(item => item.tipo === 'sin-cafe'),
            'con-cafe': filteredItems.filter(item => item.tipo === 'con-cafe')
        }
        : null;

    // Obtener nombre de categoría activa
    const activeCategoryName = categories.find(c => c.id === activeCategory)?.nombre || 'Menú';
    const activeCategoryIcon = categories.find(c => c.id === activeCategory)?.icon || '📋';

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
                            className={`category-tab ${activeCategory === category.id ? 'active' : ''} ${
                                category.subcategorias ? 'has-subcategories' : ''
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

                {/* Grid de productos - Mostrar agrupado si es bebidas frías */}
                {activeCategory === 2 && itemsPorTipo ? (
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
                )}

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

export default MenuPage;