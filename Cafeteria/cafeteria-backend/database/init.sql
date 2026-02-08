-- ================================================
-- SCRIPT DE INICIALIZACIÓN DE BASE DE DATOS
-- Sakura Coffee - PostgreSQL
-- ================================================

-- Crear extensión para UUID si no existe
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ================================================
-- TABLA: categorias
-- ================================================
CREATE TABLE IF NOT EXISTS categorias (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================================================
-- TABLA: productos
-- ================================================
CREATE TABLE IF NOT EXISTS productos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10, 2) NOT NULL,
    categoria_id INTEGER REFERENCES categorias(id) ON DELETE CASCADE,
    imagen_url VARCHAR(500),
    stock INTEGER DEFAULT 0,
    destacado BOOLEAN DEFAULT false,
    tipo VARCHAR(50),
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================================================
-- TABLA: usuarios
-- ================================================
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol VARCHAR(50) DEFAULT 'cliente' CHECK (rol IN ('cliente', 'cajero', 'cocina', 'admin')),
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================================================
-- TABLA: pedidos
-- ================================================
CREATE TABLE IF NOT EXISTS pedidos (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id),
    nombre_cliente VARCHAR(100) NOT NULL,
    apellido_cliente VARCHAR(100) NOT NULL,
    codigo_usuario VARCHAR(20),
    items JSONB NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    estado VARCHAR(50) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'en_preparacion', 'listo', 'entregado', 'cancelado')),
    notas TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================================================
-- ÍNDICES PARA MEJORAR RENDIMIENTO
-- ================================================
CREATE INDEX IF NOT EXISTS idx_productos_categoria ON productos(categoria_id);
CREATE INDEX IF NOT EXISTS idx_productos_destacado ON productos(destacado) WHERE destacado = true;
CREATE INDEX IF NOT EXISTS idx_pedidos_usuario ON pedidos(usuario_id);
CREATE INDEX IF NOT EXISTS idx_pedidos_estado ON pedidos(estado);
CREATE INDEX IF NOT EXISTS idx_pedidos_created ON pedidos(created_at DESC);

-- ================================================
-- INSERTAR DATOS INICIALES: Categorías
-- ================================================
INSERT INTO categorias (nombre) VALUES
    ('Bebidas Calientes'),
    ('Bebidas Frías'),
    ('Postres'),
    ('Snacks')
ON CONFLICT (nombre) DO NOTHING;

-- ================================================
-- INSERTAR DATOS INICIALES: Productos
-- ================================================
-- Bebidas Calientes (categoria_id = 1)
INSERT INTO productos (nombre, descripcion, precio, categoria_id, imagen_url, stock, destacado, tipo) VALUES
    ('Café Americano', 'Café negro clásico', 3.50, 1, '/images/cafe-americano.jpg', 100, true, 'caliente'),
    ('Café Latte', 'Espresso con leche vaporizada', 4.50, 1, '/images/cafe-latte.jpg', 100, true, 'caliente'),
    ('Cappuccino', 'Espresso con espuma de leche', 4.50, 1, '/images/cappuccino.jpg', 100, false, 'caliente'),
    ('Mocha', 'Café con chocolate y crema', 5.00, 1, '/images/mocha.jpg', 100, true, 'caliente'),
    ('Té Verde', 'Té verde japonés', 3.00, 1, '/images/te-verde.jpg', 100, false, 'caliente'),
    ('Chocolate Caliente', 'Chocolate cremoso', 4.00, 1, '/images/chocolate-caliente.jpg', 100, false, 'caliente')
ON CONFLICT DO NOTHING;

-- Bebidas Frías (categoria_id = 2)
INSERT INTO productos (nombre, descripcion, precio, categoria_id, imagen_url, stock, destacado, tipo) VALUES
    ('Café Helado', 'Café frío con hielo', 4.00, 2, '/images/cafe-helado.jpg', 100, true, 'frio'),
    ('Frappuccino', 'Café batido con hielo', 5.50, 2, '/images/frappuccino.jpg', 100, true, 'frio'),
    ('Smoothie de Fresa', 'Batido de fresa natural', 5.00, 2, '/images/smoothie-fresa.jpg', 100, false, 'frio'),
    ('Limonada', 'Limonada natural', 3.50, 2, '/images/limonada.jpg', 100, false, 'frio'),
    ('Té Helado', 'Té frío con limón', 3.50, 2, '/images/te-helado.jpg', 100, false, 'frio')
ON CONFLICT DO NOTHING;

-- Postres (categoria_id = 3)
INSERT INTO productos (nombre, descripcion, precio, categoria_id, imagen_url, stock, destacado) VALUES
    ('Cheesecake', 'Pastel de queso clásico', 6.00, 3, '/images/cheesecake.jpg', 50, true),
    ('Brownie', 'Brownie de chocolate', 4.50, 3, '/images/brownie.jpg', 50, false),
    ('Tiramisu', 'Postre italiano con café', 6.50, 3, '/images/tiramisu.jpg', 50, false),
    ('Muffin', 'Muffin de arándanos', 3.50, 3, '/images/muffin.jpg', 50, false),
    ('Croissant', 'Croissant de mantequilla', 3.00, 3, '/images/croissant.jpg', 50, false)
ON CONFLICT DO NOTHING;

-- Snacks (categoria_id = 4)
INSERT INTO productos (nombre, descripcion, precio, categoria_id, imagen_url, stock, destacado) VALUES
    ('Sandwich', 'Sandwich de jamón y queso', 5.50, 4, '/images/sandwich.jpg', 30, false),
    ('Ensalada', 'Ensalada fresca', 6.00, 4, '/images/ensalada.jpg', 30, false),
    ('Bagel', 'Bagel con queso crema', 4.00, 4, '/images/bagel.jpg', 30, false),
    ('Galletas', 'Galletas de chocolate', 2.50, 4, '/images/galletas.jpg', 100, false)
ON CONFLICT DO NOTHING;

-- ================================================
-- INSERTAR DATOS INICIALES: Usuarios de prueba
-- ================================================
-- Nota: Las contraseñas están hasheadas con bcrypt
-- Contraseña para todos: "password123"
-- Hash bcrypt de "password123": $2a$10$YourHashHere

INSERT INTO usuarios (nombre, email, password, rol) VALUES
    ('Admin', 'admin@sakuracoffee.com', '$2a$10$8K1p/a0dL3.I1/YFrZ4POe.PMCRnPcPVsJPdKPBNKJQvJ8/Qvz8Zy', 'admin'),
    ('Cajero 1', 'cajero@sakuracoffee.com', '$2a$10$8K1p/a0dL3.I1/YFrZ4POe.PMCRnPcPVsJPdKPBNKJQvJ8/Qvz8Zy', 'cajero'),
    ('Cocina 1', 'cocina@sakuracoffee.com', '$2a$10$8K1p/a0dL3.I1/YFrZ4POe.PMCRnPcPVsJPdKPBNKJQvJ8/Qvz8Zy', 'cocina')
ON CONFLICT (email) DO NOTHING;

-- ================================================
-- FUNCIÓN: Actualizar timestamp updated_at
-- ================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ================================================
-- TRIGGERS: Actualizar updated_at automáticamente
-- ================================================
DROP TRIGGER IF EXISTS update_productos_updated_at ON productos;
CREATE TRIGGER update_productos_updated_at
    BEFORE UPDATE ON productos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_pedidos_updated_at ON pedidos;
CREATE TRIGGER update_pedidos_updated_at
    BEFORE UPDATE ON pedidos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ================================================
-- VERIFICACIÓN
-- ================================================
-- Mostrar resumen de datos insertados
SELECT 'Categorías creadas:' as info, COUNT(*) as total FROM categorias;
SELECT 'Productos creados:' as info, COUNT(*) as total FROM productos;
SELECT 'Usuarios creados:' as info, COUNT(*) as total FROM usuarios;

-- ================================================
-- FIN DEL SCRIPT
-- ================================================
