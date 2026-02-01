// Importar pool correctamente (desestructurando desde database.js)
const { pool } = require('../config/database');

// Obtener pedidos para cajero (solo del día actual)
exports.getPedidosCajero = async (req, res) => {
    try {
        const hoy = new Date().toISOString().split('T')[0];
        
        const result = await pool.query(`
            SELECT 
                p.id,
                p.numero_pedido,
                p.estado,
                p.total,
                p.notas,
                p.created_at,
                COALESCE(
                    json_agg(
                        json_build_object(
                            'producto_id', pi.producto_id,
                            'nombre', pr.nombre,
                            'cantidad', pi.cantidad,
                            'precio_unitario', pi.precio_unitario,
                            'subtotal', pi.subtotal
                        )
                    ) FILTER (WHERE pi.id IS NOT NULL),
                    '[]'::json
                ) as items
            FROM pedidos p
            LEFT JOIN pedido_items pi ON p.id = pi.pedido_id
            LEFT JOIN productos pr ON pi.producto_id = pr.id
            WHERE DATE(p.created_at) = $1
            AND p.estado IN ('pendiente_pago', 'preparando', 'listo', 'entregado')
            GROUP BY p.id
            ORDER BY 
                CASE p.estado
                    WHEN 'pendiente_pago' THEN 1
                    WHEN 'preparando' THEN 2
                    WHEN 'listo' THEN 3
                    WHEN 'entregado' THEN 4
                    ELSE 5
                END,
                p.created_at ASC
        `, [hoy]);

        res.json({
            success: true,
            pedidos: result.rows
        });

    } catch (error) {
        console.error('Error obteniendo pedidos para cajero:', error);
        res.status(500).json({
            success: false,
            message: 'Error del servidor'
        });
    }
};

// Marcar pedido como pagado
exports.marcarComoPagado = async (req, res) => {
    try {
        const { id } = req.params;

        // Verificar que el pedido existe y está en estado correcto
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

        if (pedido.estado !== 'pendiente_pago') {
            return res.status(400).json({
                success: false,
                message: `El pedido ya está en estado: ${pedido.estado}`
            });
        }

        // Actualizar estado del pedido
        await pool.query(
            'UPDATE pedidos SET estado = $1 WHERE id = $2',
            ['pendiente_preparacion', id]
        );

        res.json({
            success: true,
            message: 'Pedido marcado como pagado y enviado a cocina'
        });

    } catch (error) {
        console.error('Error marcando pedido como pagado:', error);
        res.status(500).json({
            success: false,
            message: 'Error del servidor'
        });
    }
};

// Marcar pedido como entregado
exports.marcarComoEntregado = async (req, res) => {
    try {
        const { id } = req.params;

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

        const pedido = pedidoCheck.rows[0];

        // Verificar que está en estado 'listo'
        if (pedido.estado !== 'listo') {
            return res.status(400).json({
                success: false,
                message: `El pedido debe estar "listo" para entregar. Estado actual: ${pedido.estado}`
            });
        }

        // Actualizar estado a 'entregado'
        await pool.query(
            'UPDATE pedidos SET estado = $1 WHERE id = $2',
            ['entregado', id]
        );

        res.json({
            success: true,
            message: 'Pedido marcado como entregado'
        });

    } catch (error) {
        console.error('Error marcando pedido como entregado:', error);
        res.status(500).json({
            success: false,
            message: 'Error del servidor'
        });
    }
};

// Obtener estadísticas para cajero
exports.getEstadisticasCajero = async (req, res) => {
    try {
        const hoy = new Date().toISOString().split('T')[0];
        
        // Ejecutar todas las consultas en paralelo
        const [totalResult, pendientesResult, listosResult] = await Promise.all([
            // Total pedidos y ventas del día (excluyendo pendientes_pago)
            pool.query(`
                SELECT 
                    COUNT(*) as total_pedidos,
                    COALESCE(SUM(total), 0) as total_ventas
                FROM pedidos 
                WHERE DATE(created_at) = $1 
                AND estado IN ('pendiente_preparacion', 'preparando', 'listo', 'entregado')
            `, [hoy]),
            
            // Pedidos pendientes de pago
            pool.query(`
                SELECT COUNT(*) as cantidad 
                FROM pedidos 
                WHERE DATE(created_at) = $1 
                AND estado = 'pendiente_pago'
            `, [hoy]),
            
            // Pedidos listos para entrega
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
                total_pedidos: parseInt(totalResult.rows[0].total_pedidos) || 0,
                total_ventas: parseFloat(totalResult.rows[0].total_ventas) || 0,
                pendientes_pago: parseInt(pendientesResult.rows[0].cantidad) || 0,
                listos_entrega: parseInt(listosResult.rows[0].cantidad) || 0
            }
        });

    } catch (error) {
        console.error('Error obteniendo estadísticas cajero:', error);
        res.status(500).json({
            success: false,
            message: 'Error del servidor'
        });
    }
};

// Obtener detalles de un pedido específico
exports.getPedidoDetalle = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(`
            SELECT 
                p.*,
                u.nombre as cliente_nombre,
                COALESCE(
                    json_agg(
                        json_build_object(
                            'id', pi.id,
                            'producto_id', pi.producto_id,
                            'nombre', pr.nombre,
                            'cantidad', pi.cantidad,
                            'precio_unitario', pi.precio_unitario,
                            'subtotal', pi.subtotal
                        )
                    ) FILTER (WHERE pi.id IS NOT NULL),
                    '[]'::json
                ) as items
            FROM pedidos p
            LEFT JOIN usuarios u ON p.usuario_id = u.id
            LEFT JOIN pedido_items pi ON p.id = pi.pedido_id
            LEFT JOIN productos pr ON pi.producto_id = pr.id
            WHERE p.id = $1
            GROUP BY p.id, u.nombre
        `, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Pedido no encontrado'
            });
        }

        res.json({
            success: true,
            pedido: result.rows[0]
        });

    } catch (error) {
        console.error('Error obteniendo detalle de pedido:', error);
        res.status(500).json({
            success: false,
            message: 'Error del servidor'
        });
    }
};

// Buscar pedido por número
exports.buscarPedido = async (req, res) => {
    try {
        const { numero } = req.query;

        if (!numero) {
            return res.status(400).json({
                success: false,
                message: 'Número de pedido requerido'
            });
        }

        const result = await pool.query(`
            SELECT 
                p.id,
                p.numero_pedido,
                p.estado,
                p.total,
                p.notas,
                p.created_at
            FROM pedidos p
            WHERE p.numero_pedido ILIKE $1
            AND DATE(p.created_at) = CURRENT_DATE
            ORDER BY p.created_at DESC
            LIMIT 10
        `, [`%${numero}%`]);

        res.json({
            success: true,
            pedidos: result.rows
        });

    } catch (error) {
        console.error('Error buscando pedido:', error);
        res.status(500).json({
            success: false,
            message: 'Error del servidor'
        });
    }
};