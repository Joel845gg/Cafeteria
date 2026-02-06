const { pool } = require('../config/database');

// Obtener pedidos para cocina (pendientes y en preparación)
exports.getPedidosCocina = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                p.id,
                p.numero_pedido,
                p.estado,
                p.total,
                p.notas,
                p.created_at,
                json_agg(
                    json_build_object(
                        'producto_id', pi.producto_id,
                        'nombre', pr.nombre,
                        'cantidad', pi.cantidad,
                        'precio_unitario', pi.precio_unitario,
                        'subtotal', pi.subtotal
                    )
                ) as items
            FROM pedidos p
            LEFT JOIN pedido_items pi ON p.id = pi.pedido_id
            LEFT JOIN productos pr ON pi.producto_id = pr.id
            WHERE p.estado IN ('pendiente_preparacion', 'preparando')
            GROUP BY p.id
            ORDER BY 
                CASE p.estado
                    WHEN 'pendiente_preparacion' THEN 1
                    WHEN 'preparando' THEN 2
                    ELSE 3
                END,
                p.created_at ASC
        `);

        res.json({
            success: true,
            pedidos: result.rows
        });

    } catch (error) {
        console.error('Error obteniendo pedidos para cocina:', error);
        res.status(500).json({
            success: false,
            message: 'Error del servidor'
        });
    }
};

// Cambiar estado de pedido (cocina solo puede: pendiente_preparacion → preparando → listo)
exports.cambiarEstadoPedido = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;
        const cocinaId = req.user.id;

        // Validar estado permitido para cocina
        const estadosPermitidos = ['preparando', 'listo'];

        if (!estadosPermitidos.includes(estado)) {
            return res.status(400).json({
                success: false,
                message: `Estado no permitido para cocina. Estados permitidos: ${estadosPermitidos.join(', ')}`
            });
        }

        // Verificar pedido actual
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

        const pedido = pedidoCheck.rows[0];

        // Validar transición de estado
        const transicionesValidas = {
            'pendiente_preparacion': ['preparando'],
            'preparando': ['listo']
        };

        if (!transicionesValidas[pedido.estado] ||
            !transicionesValidas[pedido.estado].includes(estado)) {
            return res.status(400).json({
                success: false,
                message: `No se puede cambiar de "${pedido.estado}" a "${estado}"`
            });
        }

        // Actualizar estado
        await pool.query(
            'UPDATE pedidos SET estado = $1 WHERE id = $2',
            [estado, id]
        );

        const io = req.app.get('io');
        io.emit('pedido_actualizado', { id, estado });

        // Registrar cambio (opcional)
        await pool.query(
            'INSERT INTO pedido_tracking (pedido_id, estado_anterior, estado_nuevo, usuario_id) VALUES ($1, $2, $3, $4)',
            [id, pedido.estado, estado, cocinaId]
        );

        res.json({
            success: true,
            message: `Pedido cambiado a ${estado}`
        });

    } catch (error) {
        console.error('Error cambiando estado de pedido:', error);
        res.status(500).json({
            success: false,
            message: 'Error del servidor'
        });
    }
};

// Obtener estadísticas de cocina
exports.getEstadisticasCocina = async (req, res) => {
    try {
        const hoy = new Date().toISOString().split('T')[0];

        const [pendientesResult, preparandoResult, completadosResult] = await Promise.all([
            pool.query(`
                SELECT COUNT(*) as cantidad 
                FROM pedidos 
                WHERE DATE(created_at) = $1 
                AND estado = 'pendiente_preparacion'
            `, [hoy]),

            pool.query(`
                SELECT COUNT(*) as cantidad 
                FROM pedidos 
                WHERE DATE(created_at) = $1 
                AND estado = 'preparando'
            `, [hoy]),

            pool.query(`
                SELECT COUNT(*) as cantidad 
                FROM pedidos 
                WHERE DATE(created_at) = $1 
                AND estado = 'listo'
            `, [hoy])
        ]);

        res.json({
            success: true,
            estadisticas: {
                pendientes: parseInt(pendientesResult.rows[0].cantidad) || 0,
                en_preparacion: parseInt(preparandoResult.rows[0].cantidad) || 0,
                completados_hoy: parseInt(completadosResult.rows[0].cantidad) || 0
            }
        });

    } catch (error) {
        console.error('Error obteniendo estadísticas cocina:', error);
        res.status(500).json({
            success: false,
            message: 'Error del servidor'
        });
    }
};

// Obtener tiempo promedio de preparación
exports.getTiempoPreparacion = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                EXTRACT(EPOCH FROM (MAX(updated_at) - MIN(created_at))) / 60 as tiempo_promedio_minutos
            FROM (
                SELECT 
                    p.id,
                    p.created_at,
                    MAX(t.created_at) as updated_at
                FROM pedidos p
                LEFT JOIN pedido_tracking t ON p.id = t.pedido_id
                WHERE p.estado = 'listo'
                AND DATE(p.created_at) = CURRENT_DATE
                GROUP BY p.id
            ) as tiempos
        `);

        const tiempoPromedio = result.rows[0]?.tiempo_promedio_minutos || 0;

        res.json({
            success: true,
            tiempo_promedio_minutos: Math.round(tiempoPromedio * 10) / 10
        });

    } catch (error) {
        console.error('Error obteniendo tiempo de preparación:', error);
        res.status(500).json({
            success: false,
            message: 'Error del servidor'
        });
    }
};