const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productoController');
const { auth, isAdmin } = require('../middleware/auth');
const { validateProducto } = require('../middleware/validation');

// Rutas públicas
router.get('/', productoController.getProductos);
router.get('/destacados', productoController.getDestacados);
router.get('/categoria/:categoriaId', productoController.getProductosByCategoria);
router.get('/buscar', productoController.searchProductos);
router.get('/:id', productoController.getProductoById);

// Rutas protegidas - solo admin
router.post('/', auth, isAdmin, validateProducto, productoController.createProducto);
router.put('/:id', auth, isAdmin, validateProducto, productoController.updateProducto);
router.delete('/:id', auth, isAdmin, productoController.deleteProducto);

module.exports = router;