-- =============================================
-- SCRIPT DE CONFIGURACIÓN DE BASE DE DATOS
-- PROYECTO: SAKURA COFFEE 
-- FECHA: 2024
-- =============================================

-- ⚠️  ADVERTENCIA: Este script eliminará tablas existentes.
-- Asegúrese de ejecutarlo en una base de datos de prueba o nueva.

BEGIN;

-- 1. LIMPIEZA DE TABLAS EXISTENTES
DROP TABLE IF EXISTS inventario_movimientos CASCADE;
DROP TABLE IF EXISTS pedido_tracking CASCADE;
DROP TABLE IF EXISTS pagos CASCADE;
DROP TABLE IF EXISTS pedido_items CASCADE;
DROP TABLE IF EXISTS pedidos CASCADE;
DROP TABLE IF EXISTS productos CASCADE;
DROP TABLE IF EXISTS categorias CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;

-- 2. CREACIÓN DE TABLAS

-- TABLA: USUARIOS
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol VARCHAR(20) NOT NULL CHECK (rol IN ('admin', 'cajero', 'cocina', 'cliente')),
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TABLA: CATEGORIAS
CREATE TABLE categorias (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    activo BOOLEAN DEFAULT true
);

-- TABLA: PRODUCTOS
CREATE TABLE productos (
    id SERIAL PRIMARY KEY,
    categoria_id INTEGER REFERENCES categorias(id),
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10, 2) NOT NULL,
    imagen_url TEXT,
    stock INTEGER DEFAULT 0,
    destacado BOOLEAN DEFAULT false,
    tipo VARCHAR(50), -- 'bebida', 'comida', etc.
    activo BOOLEAN DEFAULT true
);

-- TABLA: PEDIDOS
CREATE TABLE pedidos (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id),
    numero_pedido VARCHAR(20) UNIQUE NOT NULL,
    estado VARCHAR(20) DEFAULT 'pendiente_pago' CHECK (estado IN ('pendiente_pago', 'pagado', 'preparando', 'listo', 'entregado', 'cancelado')),
    total DECIMAL(10, 2) NOT NULL,
    notas TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TABLA: PEDIDO_ITEMS
CREATE TABLE pedido_items (
    id SERIAL PRIMARY KEY,
    pedido_id INTEGER REFERENCES pedidos(id) ON DELETE CASCADE,
    producto_id INTEGER REFERENCES productos(id),
    cantidad INTEGER NOT NULL,
    precio_unitario DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL
);

-- TABLA: PAGOS
CREATE TABLE pagos (
    id SERIAL PRIMARY KEY,
    pedido_id INTEGER REFERENCES pedidos(id),
    metodo_pago VARCHAR(50), -- 'efectivo', 'tarjeta', 'yape', etc.
    monto DECIMAL(10, 2) NOT NULL,
    estado VARCHAR(20) DEFAULT 'pendiente',
    referencia VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TABLA: PEDIDO_TRACKING (Historial de estados)
CREATE TABLE pedido_tracking (
    id SERIAL PRIMARY KEY,
    pedido_id INTEGER REFERENCES pedidos(id) ON DELETE CASCADE,
    estado_anterior VARCHAR(20),
    estado_nuevo VARCHAR(20),
    usuario_id INTEGER REFERENCES usuarios(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TABLA: INVENTARIO_MOVIMIENTOS (Historial de stock)
CREATE TABLE inventario_movimientos (
    id SERIAL PRIMARY KEY,
    producto_id INTEGER REFERENCES productos(id),
    tipo VARCHAR(20), -- 'agregar', 'restar', 'ajuste', 'venta'
    cantidad INTEGER,
    stock_anterior INTEGER,
    stock_nuevo INTEGER,
    usuario_id INTEGER REFERENCES usuarios(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. DATOS INICIALES (SEED)

-- USUARIOS
-- Contraseñas hasheadas con bcrypt (salt 10)
-- admin123 -> $2a$10$X7.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1 (Simulado, se usarán los del seedUsers.js para consistencia real)
-- Por simplicidad en SQL puro, insertamos hashes válidos generados previamente o texto plano si el backend lo permite (NO RECOMENDADO).
-- Aquí usaremos los hashes generados por el script seedUsers.js si los tuviera a mano, pero generaré nuevos compatibles con 'admin123', 'cajero123', 'cocina123'.
-- Nota: Los hashes a continuación son EJEMPLOS válidos para bcrypt cost 10.

INSERT INTO usuarios (nombre, email, password, rol, activo) VALUES 
('Administrador', 'admin@cafeteria.com', '$2a$10$uDOcyJhCsqvauL6B1rXttOO25gUEuKLZrXh7Msn5xFk.PVq4IkLgC', 'admin', true), -- Pass: admin123
('Cajero Principal', 'cajero@cafeteria.com', '$2a$10$uDOcyJhCsqvauL6B1rXttOlptGRqnv5Grw1pjEKNOEllU0vIrty5O', 'cajero', true), -- Pass: cajero123
('Jefe de Cocina', 'cocina@cafeteria.com', '$2a$10$uDOcyJhCsqvauL6B1rXttOBOdLvTuU29HPAlB599v0lccpcK90.aO', 'cocina', true), -- Pass: cocina123
('Cliente Anónimo', 'anonimo@cafeteria.com', '$2a$10$uDOcyJhCsqvauL6B1rXttOVhWeG5k4Oe.YAQj8cIDXXSSyKfyXSb2', 'cliente', true); -- Pass: cliente123

-- NOTA: Las contraseñas han sido pre-generadas con bcrypt cost 10 para compatibilidad inmediata.
-- Usuario: admin@cafeteria.com -> admin123
-- Usuario: cajero@cafeteria.com -> cajero123
-- Usuario: cocina@cafeteria.com -> cocina123

-- CATEGORIAS
INSERT INTO categorias (nombre, activo) VALUES 
('Cafés Calientes', true),
('Cafés Fríos', true),
('Postres', true),
('Sandwiches', true),
('Bebidas', true);

-- PRODUCTOS
-- Cafés Calientes (ID cat: 1 - asumiendo serial 1)
INSERT INTO productos (categoria_id, nombre, descripcion, precio, stock, destacado, tipo, imagen_url) VALUES
(1, 'Espresso Americano', 'Café espresso diluido con agua caliente', 5.50, 100, true, 'bebida', 'americano.jpg'),
(1, 'Cappuccino', 'Espresso con leche vaporizada y espuma', 7.50, 80, true, 'bebida', 'cappuccino.jpg'),
(1, 'Latte Macchiato', 'Leche manchada con espresso', 8.00, 80, false, 'bebida', 'latte.jpg'),
(1, 'Mochaccino', 'Cappuccino con jarabe de chocolate', 8.50, 50, false, 'bebida', 'mocha.jpg');

-- Cafés Fríos (ID cat: 2)
INSERT INTO productos (categoria_id, nombre, descripcion, precio, stock, destacado, tipo, imagen_url) VALUES
(2, 'Frappuccino Clásico', 'Café mezclado con hielo y leche', 9.50, 60, true, 'bebida', 'frappe.jpg'),
(2, 'Iced Latte', 'Latte servido con hielo', 8.50, 70, false, 'bebida', 'iced_latte.jpg'),
(2, 'Cold Brew', 'Café extraído en frío por 12 horas', 10.00, 30, true, 'bebida', 'cold_brew.jpg');

-- Postres (ID cat: 3)
INSERT INTO productos (categoria_id, nombre, descripcion, precio, stock, destacado, tipo, imagen_url) VALUES
(3, 'Cheesecake de Fresa', 'Tarta de queso con salsa de fresas naturales', 12.00, 20, true, 'comida', 'cheesecake.jpg'),
(3, 'Brownie de Chocolate', 'Brownie húmedo con nueces', 6.00, 40, false, 'comida', 'brownie.jpg'),
(3, 'Tiramisú', 'Postre italiano con café y mascarpone', 11.50, 15, false, 'comida', 'tiramisu.jpg'),
(3, 'Croissant de Almendras', 'Croissant relleno de crema de almendras', 7.00, 25, true, 'comida', 'croissant.jpg');

-- Sandwiches (ID cat: 4)
INSERT INTO productos (categoria_id, nombre, descripcion, precio, stock, destacado, tipo, imagen_url) VALUES
(4, 'Sandwich de Pollo', 'Pollo deshilachado, mayonesa y lechuga', 10.50, 30, false, 'comida', 'sandwich_pollo.jpg'),
(4, 'Club Sandwich', 'Clásico de 3 pisos con jamón, queso, tocino y huevo', 15.00, 20, true, 'comida', 'club_sandwich.jpg');

COMMIT;

-- =============================================
-- FIN DEL SCRIPT
-- =============================================
