const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { auth, isAdmin } = require('../middleware/auth');

// Todas las rutas requieren autenticación y rol admin
router.use(auth);
router.use(isAdmin);

// ===== DASHBOARD Y ESTADÍSTICAS =====

// Estadísticas generales
router.get('/estadisticas', adminController.getEstadisticasGenerales);

// ===== GESTIÓN DE PEDIDOS =====

// Obtener todos los pedidos (con filtros)
router.get('/pedidos', adminController.getPedidosAdmin);

// Actualizar estado de cualquier pedido
router.put('/pedidos/:id/estado', adminController.actualizarEstadoPedido);

// ===== GESTIÓN DE INVENTARIO =====

// Obtener inventario
router.get('/inventario', adminController.getInventario);

// Actualizar stock
router.put('/inventario/:id/stock', adminController.actualizarStock);

// ===== GESTIÓN DE USUARIOS =====

// Obtener usuarios
router.get('/usuarios', adminController.getUsuarios);

// Crear usuario
router.post('/usuarios', adminController.crearUsuario);

// Actualizar usuario
router.put('/usuarios/:id', adminController.actualizarUsuario);

// ===== REPORTES =====

// Generar reporte de ventas
router.post('/reportes/ventas', adminController.generarReporteVentas);

module.exports = router;