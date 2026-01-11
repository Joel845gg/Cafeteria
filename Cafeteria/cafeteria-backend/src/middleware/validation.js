const validateProducto = (req, res, next) => {
    const { nombre, precio, categoria_id } = req.body;
    
    if (!nombre || nombre.trim() === '') {
        return res.status(400).json({ 
            success: false, 
            message: 'El nombre del producto es requerido' 
        });
    }
    
    if (!precio || isNaN(precio) || precio <= 0) {
        return res.status(400).json({ 
            success: false, 
            message: 'El precio debe ser un número mayor a 0' 
        });
    }
    
    if (!categoria_id || isNaN(categoria_id)) {
        return res.status(400).json({ 
            success: false, 
            message: 'La categoría es requerida' 
        });
    }
    
    next();
};

const validateCategoria = (req, res, next) => {
    const { nombre } = req.body;
    
    if (!nombre || nombre.trim() === '') {
        return res.status(400).json({ 
            success: false, 
            message: 'El nombre de la categoría es requerido' 
        });
    }
    
    next();
};

const validateUsuario = (req, res, next) => {
    const { nombre, email, password } = req.body;
    
    if (!nombre || nombre.trim() === '') {
        return res.status(400).json({ 
            success: false, 
            message: 'El nombre es requerido' 
        });
    }
    
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        return res.status(400).json({ 
            success: false, 
            message: 'Email inválido' 
        });
    }
    
    if (!password || password.length < 6) {
        return res.status(400).json({ 
            success: false, 
            message: 'La contraseña debe tener al menos 6 caracteres' 
        });
    }
    
    next();
};

module.exports = {
    validateProducto,
    validateCategoria,
    validateUsuario
};