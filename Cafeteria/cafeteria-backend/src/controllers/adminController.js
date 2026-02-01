const { pool } = require('../config/database');

// ===== ESTADÍSTICAS Y REPORTES =====

// Dashboard principal con estadísticas generales
exports.getEstadisticasGenerales = async (req, res) => {
    try {
        const hoy = new Date().toISOString().split('T')[0];
        const ayer = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        
        const [
            hoyResult,
            ayerResult,
            estadoResult,
            topProductosResult,
            ventasMensualesResult
        ] = await Promise.all([
            // Ventas de hoy
            pool.query(`
                SELECT 
                    COALESCE(COUNT(*), 0) as pedidos_hoy,
                    COALESCE(SUM(total), 0) as ventas_hoy,
                    COALESCE(AVG(total), 0) as promedio_hoy
                FROM pedidos 
                WHERE DATE(created_at) = $1 
                AND estado != 'cancelado'
            `, [hoy]),
            
            // Ventas de ayer (para comparación)
            pool.query(`
                SELECT 
                    COALESCE(COUNT(*), 0) as pedidos_ayer,
                    COALESCE(SUM(total), 0) as ventas_ayer
                FROM pedidos 
                WHERE DATE(created_at) = $1 
                AND estado != 'cancelado'
            `, [ayer]),
            
            // Distribución por estado
            pool.query(`
                SELECT 
                    estado,
                    COALESCE(COUNT(*), 0) as cantidad,
                    COALESCE(SUM(total), 0) as total_estado
                FROM pedidos 
                WHERE DATE(created_at) = $1
                GROUP BY estado
                ORDER BY cantidad DESC
            `, [hoy]),
            
            // Top 10 productos más vendidos (con COALESCE para evitar null)
            pool.query(`
                SELECT 
                    pr.nombre,
                    pr.precio,
                    COALESCE(SUM(pi.cantidad), 0) as total_vendido,
                    COALESCE(SUM(pi.subtotal), 0) as ingresos
                FROM productos pr
                LEFT JOIN pedido_items pi ON pr.id = pi.producto_id
                LEFT JOIN pedidos p ON pi.pedido_id = p.id AND DATE(p.created_at) = $1
                GROUP BY pr.id, pr.nombre, pr.precio
                HAVING COALESCE(SUM(pi.cantidad), 0) > 0
                ORDER BY total_vendido DESC
                LIMIT 10
            `, [hoy]),
            
            // Ventas últimos 30 días
            pool.query(`
                SELECT 
                    DATE(created_at) as fecha,
                    COALESCE(COUNT(*), 0) as pedidos,
                    COALESCE(SUM(total), 0) as ventas
                FROM pedidos 
                WHERE created_at >= NOW() - INTERVAL '30 days'
                AND estado != 'cancelado'
                GROUP BY DATE(created_at)
                ORDER BY fecha DESC
                LIMIT 30
            `)
        ]);

        // Parsear resultados de manera segura
        const pedidosHoy = parseInt(hoyResult.rows[0]?.pedidos_hoy) || 0;
        const ventasHoy = parseFloat(hoyResult.rows[0]?.ventas_hoy) || 0;
        const promedioHoy = parseFloat(hoyResult.rows[0]?.promedio_hoy) || 0;
        
        const pedidosAyer = parseInt(ayerResult.rows[0]?.pedidos_ayer) || 0;
        const ventasAyer = parseFloat(ayerResult.rows[0]?.ventas_ayer) || 0;
        
        // Calcular cambio porcentual (evitar división por cero)
        let cambioPedidos = '0.0';
        if (pedidosAyer > 0) {
            cambioPedidos = ((pedidosHoy - pedidosAyer) / pedidosAyer * 100).toFixed(1);
        } else if (pedidosHoy > 0) {
            cambioPedidos = '100.0';
        }
        
        let cambioVentas = '0.0';
        if (ventasAyer > 0) {
            cambioVentas = ((ventasHoy - ventasAyer) / ventasAyer * 100).toFixed(1);
        } else if (ventasHoy > 0) {
            cambioVentas = '100.0';
        }

        res.json({
            success: true,
            estadisticas: {
                // Resumen
                resumen: {
                    pedidos_hoy: pedidosHoy,
                    ventas_hoy: ventasHoy,
                    promedio_hoy: promedioHoy,
                    cambio_pedidos: cambioPedidos,
                    cambio_ventas: cambioVentas
                },
                
                // Distribución por estado (asegurar que sea array)
                por_estado: estadoResult.rows.map(row => ({
                    estado: row.estado || 'sin_estado',
                    cantidad: parseInt(row.cantidad) || 0,
                    total_estado: parseFloat(row.total_estado) || 0
                })),
                
                // Top productos (asegurar valores numéricos)
                top_productos: topProductosResult.rows.map(row => ({
                    nombre: row.nombre || 'Producto sin nombre',
                    precio: parseFloat(row.precio) || 0,
                    total_vendido: parseInt(row.total_vendido) || 0,
                    ingresos: parseFloat(row.ingresos) || 0
                })),
                
                // Ventas históricas
                ventas_mensuales: ventasMensualesResult.rows.map(row => ({
                    fecha: row.fecha,
                    pedidos: parseInt(row.pedidos) || 0,
                    ventas: parseFloat(row.ventas) || 0
                }))
            }
        });

    } catch (error) {
        console.error('Error obteniendo estadísticas generales:', error);
        res.status(500).json({
            success: false,
            message: 'Error del servidor'
        });
    }
};

// ===== GESTIÓN DE PEDIDOS =====

// Obtener todos los pedidos (con filtros)
exports.getPedidosAdmin = async (req, res) => {
    try {
        const { 
            estado, 
            fecha_desde, 
            fecha_hasta, 
            pagina = 1, 
            por_pagina = 20 
        } = req.query;
        
        let whereConditions = ['1=1'];
        let queryParams = [];
        let paramCount = 0;

        // Filtrar por estado
        if (estado && estado !== 'todos') {
            paramCount++;
            whereConditions.push(`p.estado = $${paramCount}`);
            queryParams.push(estado);
        }

        // Filtrar por fecha
        if (fecha_desde) {
            paramCount++;
            whereConditions.push(`DATE(p.created_at) >= $${paramCount}`);
            queryParams.push(fecha_desde);
        }

        if (fecha_hasta) {
            paramCount++;
            whereConditions.push(`DATE(p.created_at) <= $${paramCount}`);
            queryParams.push(fecha_hasta);
        }

        const whereClause = whereConditions.join(' AND ');
        const offset = (pagina - 1) * por_pagina;

        // Query principal con paginación
        const pedidosQuery = `
            SELECT 
                p.*,
                u.nombre as cliente_nombre,
                u.email as cliente_email,
                COALESCE(COUNT(*) OVER(), 0) as total_pedidos,
                COALESCE(
                    json_agg(
                        json_build_object(
                            'producto_id', pi.producto_id,
                            'nombre', pr.nombre,
                            'cantidad', COALESCE(pi.cantidad, 0),
                            'precio_unitario', COALESCE(pi.precio_unitario, 0),
                            'subtotal', COALESCE(pi.subtotal, 0)
                        )
                    ) FILTER (WHERE pi.id IS NOT NULL),
                    '[]'::json
                ) as items
            FROM pedidos p
            LEFT JOIN usuarios u ON p.usuario_id = u.id
            LEFT JOIN pedido_items pi ON p.id = pi.pedido_id
            LEFT JOIN productos pr ON pi.producto_id = pr.id
            WHERE ${whereClause}
            GROUP BY p.id, u.id
            ORDER BY p.created_at DESC
            LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}
        `;

        queryParams.push(parseInt(por_pagina), parseInt(offset));
        const result = await pool.query(pedidosQuery, queryParams);

        // Obtener total para paginación
        const totalPedidos = result.rows.length > 0 
            ? parseInt(result.rows[0].total_pedidos) 
            : 0;

        res.json({
            success: true,
            pedidos: result.rows.map(p => {
                const { total_pedidos, ...pedido } = p;
                return {
                    ...pedido,
                    total: parseFloat(pedido.total) || 0
                };
            }),
            paginacion: {
                pagina: parseInt(pagina) || 1,
                por_pagina: parseInt(por_pagina) || 20,
                total: totalPedidos,
                total_paginas: Math.ceil(totalPedidos / (parseInt(por_pagina) || 20))
            }
        });

    } catch (error) {
        console.error('Error obteniendo pedidos admin:', error);
        res.status(500).json({
            success: false,
            message: 'Error del servidor'
        });
    }
};

// Actualizar estado de pedido (admin puede cambiar cualquier estado)
exports.actualizarEstadoPedido = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;
        const adminId = req.user.id;

        // Validar estado
        const estadosValidos = ['pendiente_pago', 'preparando', 'listo', 'entregado', 'cancelado'];
        if (!estadosValidos.includes(estado)) {
            return res.status(400).json({
                success: false,
                message: `Estado inválido. Estados permitidos: ${estadosValidos.join(', ')}`
            });
        }

        // Verificar que el pedido existe
        const pedidoCheck = await pool.query(
            'SELECT id, estado FROM pedidos WHERE id = $1',
            [id]
        );

        if (pedidoCheck.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Pedido no encontrado'
            });
        }

        const estadoAnterior = pedidoCheck.rows[0].estado;

        // Actualizar estado
        await pool.query(
            'UPDATE pedidos SET estado = $1 WHERE id = $2',
            [estado, id]
        );

        // Registrar cambio en historial (si la tabla existe)
        try {
            await pool.query(
                `INSERT INTO pedido_tracking 
                 (pedido_id, estado_anterior, estado_nuevo, usuario_id, created_at) 
                 VALUES ($1, $2, $3, $4, NOW())`,
                [id, estadoAnterior, estado, adminId]
            );
        } catch (trackingError) {
            console.log('⚠️  Tabla pedido_tracking no existe, continuando...');
        }

        res.json({
            success: true,
            message: `Estado actualizado de "${estadoAnterior}" a "${estado}"`,
            estado_anterior: estadoAnterior,
            estado_nuevo: estado
        });

    } catch (error) {
        console.error('Error actualizando estado pedido:', error);
        res.status(500).json({
            success: false,
            message: 'Error del servidor'
        });
    }
};

// ===== GESTIÓN DE INVENTARIO =====

// Obtener reporte de inventario
exports.getInventario = async (req, res) => {
    try {
        const { categoria_id, bajo_stock = 'false' } = req.query;
        
        let whereConditions = ['p.activo = true'];
        let queryParams = [];
        let paramCount = 0;

        // Filtrar por categoría
        if (categoria_id) {
            paramCount++;
            whereConditions.push(`categoria_id = $${paramCount}`);
            queryParams.push(categoria_id);
        }

        // Filtrar por bajo stock
        if (bajo_stock === 'true') {
            whereConditions.push(`stock <= 10`);
        }

        const whereClause = whereConditions.join(' AND ');

        const result = await pool.query(`
            SELECT 
                p.*,
                c.nombre as categoria_nombre,
                CASE 
                    WHEN stock = 0 THEN 'agotado'
                    WHEN stock <= 10 THEN 'bajo'
                    ELSE 'normal'
                END as estado_stock
            FROM productos p
            LEFT JOIN categorias c ON p.categoria_id = c.id
            WHERE ${whereClause}
            ORDER BY 
                CASE 
                    WHEN stock = 0 THEN 1
                    WHEN stock <= 10 THEN 2
                    ELSE 3
                END,
                p.nombre ASC
        `, queryParams);

        // Calcular estadísticas de inventario
        const estadisticas = {
            total_productos: result.rows.length,
            agotados: result.rows.filter(p => p.stock === 0).length,
            bajo_stock: result.rows.filter(p => p.stock > 0 && p.stock <= 10).length,
            valor_total: result.rows.reduce((sum, p) => {
                const precio = parseFloat(p.precio) || 0;
                const stock = parseInt(p.stock) || 0;
                return sum + (precio * stock);
            }, 0)
        };

        res.json({
            success: true,
            productos: result.rows.map(p => ({
                ...p,
                precio: parseFloat(p.precio) || 0,
                stock: parseInt(p.stock) || 0
            })),
            estadisticas
        });

    } catch (error) {
        console.error('Error obteniendo inventario:', error);
        res.status(500).json({
            success: false,
            message: 'Error del servidor'
        });
    }
};

// Actualizar stock de producto
exports.actualizarStock = async (req, res) => {
    try {
        const { id } = req.params;
        const { stock, accion, cantidad } = req.body;

        // Validar datos
        if (!id || (stock === undefined && !accion)) {
            return res.status(400).json({
                success: false,
                message: 'Se requiere stock o acción (agregar/restar)'
            });
        }

        // Obtener producto actual
        const productoResult = await pool.query(
            'SELECT id, nombre, stock FROM productos WHERE id = $1',
            [id]
        );

        if (productoResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Producto no encontrado'
            });
        }

        const producto = productoResult.rows[0];
        const stockActual = parseInt(producto.stock) || 0;
        let nuevoStock = stockActual;

        // Calcular nuevo stock según acción
        if (accion === 'agregar') {
            if (!cantidad || cantidad <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Cantidad inválida para agregar'
                });
            }
            nuevoStock = stockActual + parseInt(cantidad);
        } else if (accion === 'restar') {
            if (!cantidad || cantidad <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Cantidad inválida para restar'
                });
            }
            nuevoStock = Math.max(0, stockActual - parseInt(cantidad));
        } else {
            // Stock directo
            nuevoStock = parseInt(stock);
            if (isNaN(nuevoStock) || nuevoStock < 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Stock inválido'
                });
            }
        }

        // Actualizar stock
        await pool.query(
            'UPDATE productos SET stock = $1 WHERE id = $2',
            [nuevoStock, id]
        );

        // Registrar movimiento en historial (si la tabla existe)
        try {
            await pool.query(
                `INSERT INTO inventario_movimientos 
                 (producto_id, tipo, cantidad, stock_anterior, stock_nuevo, usuario_id, created_at) 
                 VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
                [
                    id,
                    accion || 'ajuste',
                    Math.abs(nuevoStock - stockActual),
                    stockActual,
                    nuevoStock,
                    req.user.id
                ]
            );
        } catch (movimientoError) {
            console.log('⚠️  Tabla inventario_movimientos no existe, continuando...');
        }

        res.json({
            success: true,
            message: `Stock actualizado de ${stockActual} a ${nuevoStock}`,
            producto: {
                id: producto.id,
                nombre: producto.nombre,
                stock_anterior: stockActual,
                stock_nuevo: nuevoStock
            }
        });

    } catch (error) {
        console.error('Error actualizando stock:', error);
        res.status(500).json({
            success: false,
            message: 'Error del servidor'
        });
    }
};

// ===== GESTIÓN DE USUARIOS =====

// Obtener todos los usuarios
exports.getUsuarios = async (req, res) => {
    try {
        const { rol, activo } = req.query;
        
        let whereConditions = ['1=1'];
        let queryParams = [];
        let paramCount = 0;

        if (rol) {
            paramCount++;
            whereConditions.push(`rol = $${paramCount}`);
            queryParams.push(rol);
        }

        if (activo !== undefined) {
            paramCount++;
            whereConditions.push(`activo = $${paramCount}`);
            queryParams.push(activo === 'true');
        }

        const whereClause = whereConditions.join(' AND ');

        const result = await pool.query(`
            SELECT 
                id, nombre, email, rol, activo, created_at,
                COALESCE((SELECT COUNT(*) FROM pedidos WHERE usuario_id = usuarios.id), 0) as total_pedidos
            FROM usuarios 
            WHERE ${whereClause}
            ORDER BY created_at DESC
        `, queryParams);

        // Estadísticas de usuarios
        const estadisticas = {
            total: result.rows.length,
            activos: result.rows.filter(u => u.activo).length,
            por_rol: result.rows.reduce((acc, u) => {
                const rol = u.rol || 'sin_rol';
                acc[rol] = (acc[rol] || 0) + 1;
                return acc;
            }, {})
        };

        res.json({
            success: true,
            usuarios: result.rows.map(u => ({
                ...u,
                total_pedidos: parseInt(u.total_pedidos) || 0
            })),
            estadisticas
        });

    } catch (error) {
        console.error('Error obteniendo usuarios:', error);
        res.status(500).json({
            success: false,
            message: 'Error del servidor'
        });
    }
};

// Crear nuevo usuario
exports.crearUsuario = async (req, res) => {
    try {
        const { nombre, email, password, rol } = req.body;

        // Validaciones
        if (!nombre || !email || !password || !rol) {
            return res.status(400).json({
                success: false,
                message: 'Todos los campos son requeridos'
            });
        }

        const rolesValidos = ['admin', 'cajero', 'cocina'];
        if (!rolesValidos.includes(rol)) {
            return res.status(400).json({
                success: false,
                message: `Rol inválido. Roles permitidos: ${rolesValidos.join(', ')}`
            });
        }

        // Verificar si el email ya existe
        const usuarioExistente = await pool.query(
            'SELECT id FROM usuarios WHERE email = $1',
            [email]
        );

        if (usuarioExistente.rows.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'El email ya está registrado'
            });
        }

        // Crear usuario (password simple para desarrollo)
        const result = await pool.query(`
            INSERT INTO usuarios (nombre, email, password, rol, activo, created_at) 
            VALUES ($1, $2, $3, $4, true, NOW())
            RETURNING id, nombre, email, rol, activo, created_at
        `, [nombre, email, password, rol]);

        res.status(201).json({
            success: true,
            message: 'Usuario creado exitosamente',
            usuario: result.rows[0]
        });

    } catch (error) {
        console.error('Error creando usuario:', error);
        res.status(500).json({
            success: false,
            message: 'Error del servidor'
        });
    }
};

// Actualizar usuario
exports.actualizarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, email, rol, activo } = req.body;

        // Verificar que el usuario existe
        const usuarioResult = await pool.query(
            'SELECT id FROM usuarios WHERE id = $1',
            [id]
        );

        if (usuarioResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        // Construir query dinámica
        const updates = [];
        const values = [];
        let paramCount = 1;

        if (nombre !== undefined) {
            updates.push(`nombre = $${paramCount}`);
            values.push(nombre);
            paramCount++;
        }

        if (email !== undefined) {
            updates.push(`email = $${paramCount}`);
            values.push(email);
            paramCount++;
        }

        if (rol !== undefined) {
            const rolesValidos = ['admin', 'cajero', 'cocina'];
            if (!rolesValidos.includes(rol)) {
                return res.status(400).json({
                    success: false,
                    message: `Rol inválido. Roles permitidos: ${rolesValidos.join(', ')}`
                });
            }
            updates.push(`rol = $${paramCount}`);
            values.push(rol);
            paramCount++;
        }

        if (activo !== undefined) {
            updates.push(`activo = $${paramCount}`);
            values.push(activo === 'true');
            paramCount++;
        }

        if (updates.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No hay datos para actualizar'
            });
        }

        values.push(id);
        const updateQuery = `
            UPDATE usuarios 
            SET ${updates.join(', ')} 
            WHERE id = $${paramCount}
            RETURNING id, nombre, email, rol, activo, created_at
        `;

        const result = await pool.query(updateQuery, values);

        res.json({
            success: true,
            message: 'Usuario actualizado exitosamente',
            usuario: result.rows[0]
        });

    } catch (error) {
        console.error('Error actualizando usuario:', error);
        res.status(500).json({
            success: false,
            message: 'Error del servidor'
        });
    }
};

// ===== REPORTES AVANZADOS =====

// Generar reporte de ventas por período
exports.generarReporteVentas = async (req, res) => {
    try {
        const { fecha_inicio, fecha_fin, agrupar_por = 'dia' } = req.body;

        if (!fecha_inicio || !fecha_fin) {
            return res.status(400).json({
                success: false,
                message: 'Fecha inicio y fecha fin son requeridas'
            });
        }

        let groupByClause;
        let selectClause;

        switch (agrupar_por) {
            case 'hora':
                selectClause = `DATE_TRUNC('hour', p.created_at) as periodo`;
                groupByClause = `DATE_TRUNC('hour', p.created_at)`;
                break;
            case 'dia':
                selectClause = `DATE(p.created_at) as periodo`;
                groupByClause = `DATE(p.created_at)`;
                break;
            case 'semana':
                selectClause = `DATE_TRUNC('week', p.created_at) as periodo`;
                groupByClause = `DATE_TRUNC('week', p.created_at)`;
                break;
            case 'mes':
                selectClause = `DATE_TRUNC('month', p.created_at) as periodo`;
                groupByClause = `DATE_TRUNC('month', p.created_at)`;
                break;
            default:
                return res.status(400).json({
                    success: false,
                    message: 'Agrupación inválida. Use: hora, dia, semana, mes'
                });
        }

        const result = await pool.query(`
            SELECT 
                ${selectClause},
                COALESCE(COUNT(*), 0) as total_pedidos,
                COALESCE(SUM(total), 0) as total_ventas,
                COALESCE(AVG(total), 0) as promedio_venta,
                COALESCE(MIN(total), 0) as venta_minima,
                COALESCE(MAX(total), 0) as venta_maxima
            FROM pedidos p
            WHERE DATE(p.created_at) BETWEEN $1 AND $2
            AND p.estado != 'cancelado'
            GROUP BY ${groupByClause}
            ORDER BY periodo ASC
        `, [fecha_inicio, fecha_fin]);

        // Calcular totales
        const totales = {
            total_periodos: result.rows.length,
            total_pedidos: result.rows.reduce((sum, row) => sum + parseInt(row.total_pedidos), 0),
            total_ventas: result.rows.reduce((sum, row) => sum + parseFloat(row.total_ventas), 0),
            promedio_general: result.rows.length > 0 
                ? result.rows.reduce((sum, row) => sum + parseFloat(row.promedio_venta), 0) / result.rows.length
                : 0
        };

        res.json({
            success: true,
            reporte: {
                periodo: {
                    fecha_inicio,
                    fecha_fin,
                    agrupar_por
                },
                datos: result.rows.map(row => ({
                    periodo: row.periodo,
                    total_pedidos: parseInt(row.total_pedidos) || 0,
                    total_ventas: parseFloat(row.total_ventas) || 0,
                    promedio_venta: parseFloat(row.promedio_venta) || 0,
                    venta_minima: parseFloat(row.venta_minima) || 0,
                    venta_maxima: parseFloat(row.venta_maxima) || 0
                })),
                totales
            }
        });

    } catch (error) {
        console.error('Error generando reporte de ventas:', error);
        res.status(500).json({
            success: false,
            message: 'Error del servidor'
        });
    }
};