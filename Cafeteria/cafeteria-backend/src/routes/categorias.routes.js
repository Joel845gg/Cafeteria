const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriaController');
const { auth, isAdmin } = require('../middleware/auth');
const { validateCategoria } = require('../middleware/validation');

// Rutas públicas
router.get('/', categoriaController.getCategorias);
router.get('/:id', categoriaController.getCategoriaById);

// Rutas protegidas - solo admin
router.post('/', auth, isAdmin, validateCategoria, categoriaController.createCategoria);
router.put('/:id', auth, isAdmin, validateCategoria, categoriaController.updateCategoria);
router.delete('/:id', auth, isAdmin, categoriaController.deleteCategoria);

module.exports = router;