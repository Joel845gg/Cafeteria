const db = require('../config/database');
const bcrypt = require('bcryptjs');

class Usuario {
    static async findByEmail(email) {
        try {
            const result = await db.query(
                'SELECT * FROM usuarios WHERE email = $1 AND activo = true',
                [email]
            );
            return result.rows[0];
        } catch (error) {
            console.error('Error en Usuario.findByEmail:', error);
            throw error;
        }
    }

    static async findById(id) {
        try {
            const result = await db.query(
                'SELECT id, nombre, email, rol, created_at FROM usuarios WHERE id = $1 AND activo = true',
                [id]
            );
            return result.rows[0];
        } catch (error) {
            console.error('Error en Usuario.findById:', error);
            throw error;
        }
    }

    static async create(usuario) {
        const { nombre, email, password, rol } = usuario;
        try {
            // Hashear la contraseña
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const result = await db.query(
                'INSERT INTO usuarios (nombre, email, password, rol) VALUES ($1, $2, $3, $4) RETURNING id, nombre, email, rol',
                [nombre, email, hashedPassword, rol || 'cliente']
            );
            return result.rows[0];
        } catch (error) {
            console.error('Error en Usuario.create:', error);
            throw error;
        }
    }

    static async comparePassword(password, hashedPassword) {
        try {
            return await bcrypt.compare(password, hashedPassword);
        } catch (error) {
            console.error('Error en Usuario.comparePassword:', error);
            throw error;
        }
    }

    static async getAll() {
        try {
            const result = await db.query(
                'SELECT id, nombre, email, rol, activo, created_at FROM usuarios ORDER BY id'
            );
            return result.rows;
        } catch (error) {
            console.error('Error en Usuario.getAll:', error);
            throw error;
        }
    }
}

module.exports = Usuario;