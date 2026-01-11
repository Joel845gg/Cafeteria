const Producto = require('../models/Producto');

exports.getProductos = async (req, res) => {
    try {
        const productos = await Producto.getAll();
        res.json({
            success: true,
            count: productos.length,
            data: productos
        });
    } catch (error) {
        console.error('Error en getProductos:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error al obtener productos' 
        });
    }
};

exports.getProductoById = async (req, res) => {
    try {
        const producto = await Producto.getById(req.params.id);
        if (!producto) {
            return res.status(404).json({ 
                success: false, 
                message: 'Producto no encontrado' 
            });
        }
        res.json({
            success: true,
            data: producto
        });
    } catch (error) {
        console.error('Error en getProductoById:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error al obtener producto' 
        });
    }
};

exports.getProductosByCategoria = async (req, res) => {
    try {
        const productos = await Producto.getByCategoria(req.params.categoriaId);
        
        res.json({
            success: true,
            count: productos.length,
            data: productos
        });
    } catch (error) {
        console.error('Error en getProductosByCategoria:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error al obtener productos por categoría' 
        });
    }
};

exports.getDestacados = async (req, res) => {
    try {
        const productos = await Producto.getDestacados();
        res.json({
            success: true,
            count: productos.length,
            data: productos
        });
    } catch (error) {
        console.error('Error en getDestacados:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error al obtener productos destacados' 
        });
    }
};

exports.searchProductos = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.status(400).json({ 
                success: false, 
                message: 'Parámetro de búsqueda requerido' 
            });
        }
        const productos = await Producto.search(q);
        res.json({
            success: true,
            count: productos.length,
            data: productos
        });
    } catch (error) {
        console.error('Error en searchProductos:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error al buscar productos' 
        });
    }
};

exports.createProducto = async (req, res) => {
    try {
        const nuevoProducto = await Producto.create(req.body);
        res.status(201).json({
            success: true,
            message: 'Producto creado exitosamente',
            data: nuevoProducto
        });
    } catch (error) {
        console.error('Error en createProducto:', error);
        res.status(400).json({ 
            success: false, 
            message: error.message 
        });
    }
};

exports.updateProducto = async (req, res) => {
    try {
        const productoActualizado = await Producto.update(req.params.id, req.body);
        if (!productoActualizado) {
            return res.status(404).json({ 
                success: false, 
                message: 'Producto no encontrado' 
            });
        }
        res.json({
            success: true,
            message: 'Producto actualizado exitosamente',
            data: productoActualizado
        });
    } catch (error) {
        console.error('Error en updateProducto:', error);
        res.status(400).json({ 
            success: false, 
            message: error.message 
        });
    }
};

exports.deleteProducto = async (req, res) => {
    try {
        await Producto.delete(req.params.id);
        res.json({
            success: true,
            message: 'Producto eliminado exitosamente'
        });
    } catch (error) {
        console.error('Error en deleteProducto:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error al eliminar producto' 
        });
    }
};