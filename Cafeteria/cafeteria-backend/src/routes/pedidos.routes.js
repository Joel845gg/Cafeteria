const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');

// Ruta única para crear pedidos
router.post('/', pedidoController.createOrder);

module.exports = router;