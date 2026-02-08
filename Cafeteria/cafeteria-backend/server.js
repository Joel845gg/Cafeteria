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

// Test database connection and initialize database on startup
const fs = require('fs');
const path = require('path');

db.testConnection().then(async (isConnected) => {
    if (!isConnected) {
        console.error('❌ No se pudo conectar a la base de datos. Saliendo...');
        process.exit(1);
    }

    // Inicializar base de datos en producción
    if (process.env.NODE_ENV === 'production') {
        try {
            console.log('🔄 Verificando e inicializando base de datos...');

            // Verificar si ya existen las tablas
            const checkTables = await db.query(`
                SELECT EXISTS (
                    SELECT FROM information_schema.tables 
                    WHERE table_name = 'productos'
                );
            `);

            const tablesExist = checkTables.rows[0].exists;

            if (!tablesExist) {
                console.log('📝 Creando tablas...');
                const sqlPath = path.join(__dirname, 'database', 'init.sql');
                const sql = fs.readFileSync(sqlPath, 'utf8');
                await db.query(sql);
                console.log('✅ Base de datos inicializada correctamente');
            } else {
                console.log('✅ Las tablas ya existen');
            }

            // Verificar cantidad de productos y agregar faltantes si es necesario
            const countProducts = await db.query('SELECT COUNT(*) as total FROM productos');
            const totalProducts = parseInt(countProducts.rows[0].total);

            console.log(`📊 Productos actuales: ${totalProducts}`);

            if (totalProducts < 78) {
                console.log('🔄 Agregando productos faltantes...');
                const addProductsPath = path.join(__dirname, 'database', 'add_missing_products.sql');

                if (fs.existsSync(addProductsPath)) {
                    const addProductsSql = fs.readFileSync(addProductsPath, 'utf8');
                    await db.query(addProductsSql);

                    // Verificar nuevamente
                    const newCount = await db.query('SELECT COUNT(*) as total FROM productos');
                    const newTotal = parseInt(newCount.rows[0].total);
                    console.log(`✅ Productos actualizados: ${newTotal} productos`);
                } else {
                    console.log('⚠️ Archivo add_missing_products.sql no encontrado');
                }
            } else {
                console.log('✅ Todos los productos están presentes');
            }
        } catch (error) {
            console.error('⚠️ Error al inicializar base de datos:', error.message);
            console.log('⚠️ Continuando sin inicialización automática...');
        }
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