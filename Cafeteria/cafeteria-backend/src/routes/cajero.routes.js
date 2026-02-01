const express = require('express');
const router = express.Router();
const cajeroController = require('../controllers/cajeroController');
const { auth, isCajero } = require('../middleware/auth');

// Todas las rutas requieren autenticación y rol cajero
router.use(auth);
router.use(isCajero);

// ===== RUTAS PRINCIPALES =====

// Obtener pedidos del día
router.get('/pedidos', cajeroController.getPedidosCajero);

// Obtener estadísticas del día
router.get('/estadisticas', cajeroController.getEstadisticasCajero);

// Marcar pedido como pagado
router.put('/pedidos/:id/pagar', cajeroController.marcarComoPagado);

// Marcar pedido como entregado
router.put('/pedidos/:id/entregar', cajeroController.marcarComoEntregado);

// ===== RUTAS ADICIONALES =====

// Obtener detalle de un pedido específico
router.get('/pedidos/:id', cajeroController.getPedidoDetalle);

// Buscar pedido por número
router.get('/buscar', cajeroController.buscarPedido);

module.exports = router;