const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

// Importar configuración de base de datos
const db = require('./src/config/database');

const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        credentials: true
    }
});

// Guardar io en app para usarlo en controladores
app.set('io', io);

// Eventos de conexión
io.on('connection', (socket) => {
    console.log('Cliente conectado:', socket.id);

    socket.on('disconnect', () => {
        console.log('Cliente desconectado:', socket.id);
    });
});

const pedidoRoutes = require('./src/routes/pedidos.routes');

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos (imágenes)
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'src/uploads')));

// Test database connection on startup
db.testConnection().then(isConnected => {
    if (!isConnected) {
        console.error(' No se pudo conectar a la base de datos. Saliendo...');
        process.exit(1);
    }
});

// Importar rutas
const productoRoutes = require('./src/routes/productos.routes');
const categoriaRoutes = require('./src/routes/categorias.routes');
const authRoutes = require('./src/routes/auth.routes');
const cajeroRoutes = require('./src/routes/cajero.routes');
const cocinaRoutes = require('./src/routes/cocina.routes');
const adminRoutes = require('./src/routes/admin.routes');

// Usar rutas
app.use('/api/productos', productoRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/pedidos', pedidoRoutes);
app.use('/api/cajero', cajeroRoutes);
app.use('/api/cocina', cocinaRoutes);
app.use('/api/admin', adminRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: '🌸 API Sakura Coffee 🌸',
        version: '1.0.0',
        endpoints: {
            productos: '/api/productos',
            categorias: '/api/categorias',
            auth: '/api/auth',
            destacados: '/api/productos/destacados'
        },
        documentation: 'Visita /api para más información'
    });
});

// Ruta de información API
app.get('/api', (req, res) => {
    res.json({
        success: true,
        name: 'Sakura Coffee API',
        description: 'API para sistema de cafetería Sakura Coffee',
        version: '1.0.0',
        author: 'Sakura Coffee Team',
        endpoints: [
            { method: 'GET', path: '/api/productos', description: 'Obtener todos los productos' },
            { method: 'GET', path: '/api/productos/destacados', description: 'Obtener productos destacados' },
            { method: 'GET', path: '/api/productos/categoria/:id', description: 'Obtener productos por categoría' },
            { method: 'GET', path: '/api/productos/:id', description: 'Obtener producto por ID' },
            { method: 'GET', path: '/api/categorias', description: 'Obtener todas las categorías' },
            { method: 'POST', path: '/api/auth/login', description: 'Iniciar sesión' },
            { method: 'POST', path: '/api/auth/register', description: 'Registrar nuevo usuario' }
        ]
    });
});

// Manejo de errores 404
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Ruta no encontrada'
    });
});

// Manejo de errores generales
app.use((err, req, res, next) => {
    console.error(' Error del servidor:', err.stack);
    res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`
    🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸
      Servidor Sakura Coffee iniciado (con WebSockets)
      URL: http://localhost:${PORT}
      Base de datos: ${process.env.PG_DATABASE}
      Frontend: ${process.env.FRONTEND_URL}
    🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸
    `);
});