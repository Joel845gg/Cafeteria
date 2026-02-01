const express = require('express');
const router = express.Router();
const cocinaController = require('../controllers/cocinaController');
const { auth, isCocina } = require('../middleware/auth');

// Todas las rutas requieren autenticación y rol cocina
router.use(auth);
router.use(isCocina);

// ===== RUTAS PRINCIPALES =====

// Obtener pedidos para cocina
router.get('/pedidos', cocinaController.getPedidosCocina);

// Obtener estadísticas
router.get('/estadisticas', cocinaController.getEstadisticasCocina);

// Obtener tiempo promedio de preparación
router.get('/tiempo-preparacion', cocinaController.getTiempoPreparacion);

// Cambiar estado de pedido
router.put('/pedidos/:id/estado', cocinaController.cambiarEstadoPedido);

// Ruta rápida para marcar como preparando
router.put('/pedidos/:id/preparando', async (req, res) => {
    req.body = { estado: 'preparando' };
    return cocinaController.cambiarEstadoPedido(req, res);
});

// Ruta rápida para marcar como listo
router.put('/pedidos/:id/listo', async (req, res) => {
    req.body = { estado: 'listo' };
    return cocinaController.cambiarEstadoPedido(req, res);
});

module.exports = router;