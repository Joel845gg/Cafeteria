const Usuario = require('../models/Usuario');
const jwt = require('jsonwebtoken');

// Generar JWT Token
const generateToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            nombre: user.nombre,
            email: user.email,
            rol: user.rol
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );
};

// Login de usuario
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validar que vengan datos
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email y contraseña son requeridos'
            });
        }

        // Buscar usuario por email
        const user = await Usuario.findByEmail(email);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas'
            });
        }

        // Verificar contraseña
        const isPasswordValid = await Usuario.comparePassword(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas'
            });
        }

        // Generar token
        const token = generateToken(user);

        // Omitir password en la respuesta
        const { password: _, ...userWithoutPassword } = user;

        res.json({
            success: true,
            message: 'Login exitoso',
            token,
            user: userWithoutPassword
        });

    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({
            success: false,
            message: 'Error en el servidor'
        });
    }
};

// Registrar nuevo usuario
exports.register = async (req, res) => {
    try {
        const { nombre, email, password, rol } = req.body;

        // Verificar si el usuario ya existe
        const existingUser = await Usuario.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'El usuario ya existe'
            });
        }

        // Crear nuevo usuario
        const newUser = await Usuario.create({
            nombre,
            email,
            password,
            rol: rol || 'cliente'
        });

        // Generar token para el nuevo usuario
        const token = generateToken(newUser);

        res.status(201).json({
            success: true,
            message: 'Usuario registrado exitosamente',
            token,
            user: newUser
        });

    } catch (error) {
        console.error('Error en register:', error);
        res.status(500).json({
            success: false,
            message: 'Error en el servidor'
        });
    }
};

// Obtener perfil del usuario actual
exports.getProfile = async (req, res) => {
    try {
        const user = await Usuario.findById(req.user.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        res.json({
            success: true,
            data: user
        });

    } catch (error) {
        console.error('Error en getProfile:', error);
        res.status(500).json({
            success: false,
            message: 'Error en el servidor'
        });
    }
};

// Verificar token (para frontend)
exports.verifyToken = (req, res) => {
    res.json({
        success: true,
        user: req.user
    });
};