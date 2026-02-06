const { pool } = require('../config/database');

// Crear nuevo pedido - VERSIÓN CORREGIDA
exports.createOrder = async (req, res) => {
    const client = await pool.connect();

    try {
        console.log('Recibiendo pedido:', req.body);

        const { nombre, telefono, metodo_pago, items, total } = req.body;

        // Validaciones básicas
        if (!nombre || !telefono || !items || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Datos incompletos'
            });
        }

        await client.query('BEGIN');

        // 1. BUSCAR el usuario anónimo por email
        const usuarioResult = await client.query(
            'SELECT id FROM usuarios WHERE email = $1',
            ['anonimo@cafeteria.com']
        );

        let usuarioId;

        if (usuarioResult.rows.length === 0) {
            // Crear usuario anónimo si no existe
            const createAnonimo = await client.query(`
                INSERT INTO usuarios (nombre, email, password, rol, activo, created_at) 
                VALUES ('Cliente Anónimo', 'anonimo@cafeteria.com', 'cliente123', 'cliente', true, NOW())
                RETURNING id
            `);
            usuarioId = createAnonimo.rows[0].id;
            console.log('Usuario anónimo creado con ID:', usuarioId);
        } else {
            usuarioId = usuarioResult.rows[0].id;
            console.log('Usuario anónimo encontrado con ID:', usuarioId);
        }

        // 2. Generar número de pedido
        const timestamp = Date.now().toString().slice(-8);
        const random = Math.floor(Math.random() * 100).toString().padStart(2, '0');
        const numeroPedido = `P${timestamp}${random}`;

        console.log('Número de pedido:', numeroPedido);

        // 3. Insertar pedido
        const pedidoQuery = `
            INSERT INTO pedidos (usuario_id, numero_pedido, estado, total, notas, created_at)
            VALUES ($1, $2, $3, $4, $5, NOW())
            RETURNING id
        `;

        const notas = `Cliente: ${nombre}, Tel: ${telefono}`;

        const pedidoResult = await client.query(pedidoQuery, [
            usuarioId,
            numeroPedido,
            'pendiente_pago',
            total,
            notas
        ]);

        const pedidoId = pedidoResult.rows[0].id;
        console.log('Pedido ID:', pedidoId);

        // 4. Insertar items del pedido
        for (const item of items) {
            const itemQuery = `
                INSERT INTO pedido_items (pedido_id, producto_id, cantidad, precio_unitario, subtotal)
                VALUES ($1, $2, $3, $4, $5)
            `;

            await client.query(itemQuery, [
                pedidoId,
                item.producto_id,
                item.cantidad,
                item.precio_unitario,
                item.subtotal
            ]);
        }

        // 5. Insertar pago
        const pagoQuery = `
            INSERT INTO pagos (pedido_id, metodo_pago, monto, estado, referencia, created_at)
            VALUES ($1, $2, $3, $4, $5, NOW())
        `;

        const referencia = `REF${numeroPedido}`;

        await client.query(pagoQuery, [
            pedidoId,
            metodo_pago,
            total,
            'pendiente_pago',
            referencia
        ]);

        await client.query('COMMIT');

        console.log('✅ PEDIDO CREADO EXITOSAMENTE!');
        console.log('==============================');
        console.log('Número de pedido:', numeroPedido);
        console.log('Cliente:', nombre);
        console.log('Teléfono:', telefono);
        console.log('Total:', total);
        console.log('Usuario ID:', usuarioId);
        console.log('Pedido ID:', pedidoId);
        console.log('Items:', items.length);

        // Emitir evento WebSocket
        const io = req.app.get('io');
        io.emit('nuevo_pedido', {
            id: pedidoId,
            numero_pedido: numeroPedido,
            estado: 'pendiente_pago',
            total: total
        });

        res.status(201).json({
            success: true,
            message: '¡Pedido confirmado!',
            order: {
                id: pedidoId,
                numero_pedido: numeroPedido,
                total: total,
                estado: 'pendiente_pago',
                fecha: new Date().toISOString(),
                cliente: nombre,
                telefono: telefono
            }
        });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('❌ Error creating order:', error);

        // Error detallado para debugging
        console.error('Código de error:', error.code);
        console.error('Detalle:', error.detail);
        console.error('Tabla:', error.table);
        console.error('Constraint:', error.constraint);

        res.status(500).json({
            success: false,
            message: 'Error al procesar el pedido',
            error: error.message
        });
    } finally {
        client.release();
    }
};