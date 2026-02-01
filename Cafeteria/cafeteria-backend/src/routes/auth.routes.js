const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { auth } = require('../middleware/auth');

// Ruta pública - solo login
router.post('/login', authController.login);

// Rutas protegidas
router.get('/profile', auth, authController.getProfile);

module.exports = router;