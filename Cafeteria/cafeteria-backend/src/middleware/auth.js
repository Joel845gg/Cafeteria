const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Acceso denegado. Token no proporcionado.'
            });
        }

        const token = authHeader.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Acceso denegado. Token no válido.'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Error en autenticación:', error.message);

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Token inválido.'
            });
        }

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expirado.'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error en el servidor de autenticación.'
        });
    }
};

// Middleware genérico para autorización por roles
const authorize = (roles = []) => {
    // Si roles es string único, convertir a array
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'No autorizado'
            });
        }

        if (roles.length && !roles.includes(req.user.rol)) {
            return res.status(403).json({
                success: false,
                message: `Acceso denegado. Rol requerido: ${roles.join(' o ')}`
            });
        }

        next();
    };
};

// Mantener compatibilidad con exports antiguos si es necesario, 
// o exportar solo authorize y auth
module.exports = {
    auth,
    authorize,
    // Helpers para compatibilidad (deprecated)
    isAdmin: authorize(['admin']),
    isCajero: authorize(['cajero']),
    isCocina: authorize(['cocina']),
    isCajeroOrAdmin: authorize(['admin', 'cajero'])
};