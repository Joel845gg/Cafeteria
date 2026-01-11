const db = require('../config/database');

class Producto {
    static async getAll() {
        try {
            const result = await db.query(`
                SELECT p.*, c.nombre as categoria_nombre
                FROM productos p
                JOIN categorias c ON p.categoria_id = c.id
                WHERE p.activo = true
                ORDER BY c.id, p.nombre
            `);
            return result.rows;
        } catch (error) {
            console.error('Error en Producto.getAll:', error);
            throw error;
        }
    }

    static async getById(id) {
        try {
            const result = await db.query(
                `SELECT p.*, c.nombre as categoria_nombre 
                 FROM productos p 
                 JOIN categorias c ON p.categoria_id = c.id 
                 WHERE p.id = $1 AND p.activo = true`,
                [id]
            );
            return result.rows[0];
        } catch (error) {
            console.error('Error en Producto.getById:', error);
            throw error;
        }
    }

    static async getByCategoria(categoriaId) {
        try {
            const result = await db.query(
                `SELECT p.*, c.nombre as categoria_nombre 
                 FROM productos p 
                 JOIN categorias c ON p.categoria_id = c.id 
                 WHERE p.categoria_id = $1 AND p.activo = true 
                 ORDER BY p.tipo NULLS FIRST, p.nombre`,
                [categoriaId]
            );
            return result.rows;
        } catch (error) {
            console.error('Error en Producto.getByCategoria:', error);
            throw error;
        }
    }

    static async getDestacados() {
        try {
            const result = await db.query(
                `SELECT p.*, c.nombre as categoria_nombre 
                 FROM productos p 
                 JOIN categorias c ON p.categoria_id = c.id 
                 WHERE p.destacado = true AND p.activo = true 
                 ORDER BY p.nombre LIMIT 6`
            );
            return result.rows;
        } catch (error) {
            console.error('Error en Producto.getDestacados:', error);
            throw error;
        }
    }

    static async create(producto) {
        const { nombre, descripcion, precio, categoria_id, imagen_url, stock, destacado, tipo } = producto;
        try {
            const result = await db.query(
                `INSERT INTO productos (nombre, descripcion, precio, categoria_id, imagen_url, stock, destacado, tipo) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
                [nombre, descripcion, precio, categoria_id, imagen_url || null, stock || 0, destacado || false, tipo || null]
            );
            return result.rows[0];
        } catch (error) {
            console.error('Error en Producto.create:', error);
            throw error;
        }
    }

    static async update(id, producto) {
        const { nombre, descripcion, precio, categoria_id, imagen_url, stock, destacado, activo, tipo } = producto;
        try {
            const result = await db.query(
                `UPDATE productos 
                 SET nombre = $1, descripcion = $2, precio = $3, categoria_id = $4, 
                     imagen_url = $5, stock = $6, destacado = $7, activo = $8, tipo = $9
                 WHERE id = $10 RETURNING *`,
                [nombre, descripcion, precio, categoria_id, imagen_url, stock, destacado, activo, tipo, id]
            );
            return result.rows[0];
        } catch (error) {
            console.error('Error en Producto.update:', error);
            throw error;
        }
    }

    static async delete(id) {
        try {
            await db.query('UPDATE productos SET activo = false WHERE id = $1', [id]);
            return true;
        } catch (error) {
            console.error('Error en Producto.delete:', error);
            throw error;
        }
    }

    static async search(query) {
        try {
            const result = await db.query(
                `SELECT p.*, c.nombre as categoria_nombre 
                 FROM productos p 
                 JOIN categorias c ON p.categoria_id = c.id 
                 WHERE p.activo = true AND 
                       (LOWER(p.nombre) LIKE LOWER($1) OR 
                        LOWER(p.descripcion) LIKE LOWER($1)) 
                 ORDER BY p.nombre`,
                [`%${query}%`]
            );
            return result.rows;
        } catch (error) {
            console.error('Error en Producto.search:', error);
            throw error;
        }
    }
}

module.exports = Producto;