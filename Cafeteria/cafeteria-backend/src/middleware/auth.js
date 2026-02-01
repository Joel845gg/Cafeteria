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

const isAdmin = (req, res, next) => {
    if (req.user.rol !== 'admin') {
        return res.status(403).json({ 
            success: false, 
            message: 'Acceso denegado. Se requiere rol de administrador.' 
        });
    }
    next();
};

const isCajero = (req, res, next) => {
    if (req.user.rol !== 'cajero') {
        return res.status(403).json({ 
            success: false, 
            message: 'Acceso denegado. Se requiere rol de cajero.' 
        });
    }
    next();
};

const isCocina = (req, res, next) => {
    if (req.user.rol !== 'cocina') {
        return res.status(403).json({ 
            success: false, 
            message: 'Acceso denegado. Se requiere rol de cocina.' 
        });
    }
    next();
};

const isCajeroOrAdmin = (req, res, next) => {
    if (!['admin', 'cajero'].includes(req.user.rol)) {
        return res.status(403).json({ 
            success: false, 
            message: 'Acceso denegado. Se requiere rol de cajero o administrador.' 
        });
    }
    next();
};

module.exports = { 
    auth, 
    isAdmin, 
    isCajero, 
    isCocina, 
    isCajeroOrAdmin 
};