const Categoria = require('../models/Categoria');

exports.getCategorias = async (req, res) => {
    try {
        const categorias = await Categoria.getAll();
        res.json({
            success: true,
            count: categorias.length,
            data: categorias
        });
    } catch (error) {
        console.error('Error en getCategorias:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error al obtener categorías' 
        });
    }
};

exports.getCategoriaById = async (req, res) => {
    try {
        const categoria = await Categoria.getById(req.params.id);
        if (!categoria) {
            return res.status(404).json({ 
                success: false, 
                message: 'Categoría no encontrada' 
            });
        }
        res.json({
            success: true,
            data: categoria
        });
    } catch (error) {
        console.error('Error en getCategoriaById:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error al obtener categoría' 
        });
    }
};

exports.createCategoria = async (req, res) => {
    try {
        const nuevaCategoria = await Categoria.create(req.body);
        res.status(201).json({
            success: true,
            message: 'Categoría creada exitosamente',
            data: nuevaCategoria
        });
    } catch (error) {
        console.error('Error en createCategoria:', error);
        res.status(400).json({ 
            success: false, 
            message: error.message 
        });
    }
};

exports.updateCategoria = async (req, res) => {
    try {
        const categoriaActualizada = await Categoria.update(req.params.id, req.body);
        if (!categoriaActualizada) {
            return res.status(404).json({ 
                success: false, 
                message: 'Categoría no encontrada' 
            });
        }
        res.json({
            success: true,
            message: 'Categoría actualizada exitosamente',
            data: categoriaActualizada
        });
    } catch (error) {
        console.error('Error en updateCategoria:', error);
        res.status(400).json({ 
            success: false, 
            message: error.message 
        });
    }
};

exports.deleteCategoria = async (req, res) => {
    try {
        await Categoria.delete(req.params.id);
        res.json({
            success: true,
            message: 'Categoría eliminada exitosamente'
        });
    } catch (error) {
        console.error('Error en deleteCategoria:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error al eliminar categoría' 
        });
    }
};