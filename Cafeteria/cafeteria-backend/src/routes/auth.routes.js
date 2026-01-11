const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { auth } = require('../middleware/auth');
const { validateUsuario } = require('../middleware/validation');

// Rutas públicas
router.post('/login', authController.login);
router.post('/register', validateUsuario, authController.register);

// Rutas protegidas
router.get('/profile', auth, authController.getProfile);
router.get('/verify', auth, authController.verifyToken);

module.exports = router;