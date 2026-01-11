const db = require('../config/database');

class Categoria {
    static async getAll() {
        try {
            const result = await db.query(
                'SELECT * FROM categorias WHERE activo = true ORDER BY id'
            );
            return result.rows;
        } catch (error) {
            console.error('Error en Categoria.getAll:', error);
            throw error;
        }
    }

    static async getById(id) {
        try {
            const result = await db.query(
                'SELECT * FROM categorias WHERE id = $1 AND activo = true',
                [id]
            );
            return result.rows[0];
        } catch (error) {
            console.error('Error en Categoria.getById:', error);
            throw error;
        }
    }

    static async create(categoria) {
        const { nombre } = categoria;
        try {
            const result = await db.query(
                'INSERT INTO categorias (nombre) VALUES ($1) RETURNING *',
                [nombre]
            );
            return result.rows[0];
        } catch (error) {
            console.error('Error en Categoria.create:', error);
            throw error;
        }
    }

    static async update(id, categoria) {
        const { nombre, activo } = categoria;
        try {
            const result = await db.query(
                'UPDATE categorias SET nombre = $1, activo = $2 WHERE id = $3 RETURNING *',
                [nombre, activo, id]
            );
            return result.rows[0];
        } catch (error) {
            console.error('Error en Categoria.update:', error);
            throw error;
        }
    }

    static async delete(id) {
        try {
            await db.query('UPDATE categorias SET activo = false WHERE id = $1', [id]);
            return true;
        } catch (error) {
            console.error('Error en Categoria.delete:', error);
            throw error;
        }
    }
}

module.exports = Categoria;