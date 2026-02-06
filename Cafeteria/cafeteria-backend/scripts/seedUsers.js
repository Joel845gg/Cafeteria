const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const pool = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT || 5432,
});

const seedUsers = async () => {
    try {
        console.log('🌱 Iniciando seed de usuarios...');

        // 1. Limpiar usuarios existentes (opcional, pero útil para resetear)
        // await pool.query('DELETE FROM usuarios'); 
        // console.log('🗑️  Usuarios anteriores eliminados.');

        const salt = await bcrypt.genSalt(10);

        const usuarios = [
            {
                nombre: 'Administrador',
                email: 'admin@cafeteria.com',
                password: 'admin123', // Contraseña a hashear
                rol: 'admin'
            },
            {
                nombre: 'Cajero Principal',
                email: 'cajero@cafeteria.com',
                password: 'cajero123',
                rol: 'cajero'
            },
            {
                nombre: 'Jefe de Cocina',
                email: 'cocina@cafeteria.com',
                password: 'cocina123',
                rol: 'cocina'
            }
        ];

        for (const user of usuarios) {
            // Verificar si existe
            const check = await pool.query('SELECT id FROM usuarios WHERE email = $1', [user.email]);

            const hashedPassword = await bcrypt.hash(user.password, salt);

            if (check.rows.length > 0) {
                // Actualizar
                await pool.query(
                    'UPDATE usuarios SET password = $1, nombre = $2, rol = $3, activo = true WHERE email = $4',
                    [hashedPassword, user.nombre, user.rol, user.email]
                );
                console.log(`🔄 Usuario actualizado: ${user.email}`);
            } else {
                // Crear
                await pool.query(
                    'INSERT INTO usuarios (nombre, email, password, rol, activo, created_at) VALUES ($1, $2, $3, $4, true, NOW())',
                    [user.nombre, user.email, hashedPassword, user.rol]
                );
                console.log(`✅ Usuario creado: ${user.email}`);
            }
        }

        console.log('✨ Seed completado correctamente.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error en seed:', error);
        process.exit(1);
    }
};

seedUsers();
