const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // Si no hay DATABASE_URL, usa los individuales
    ...(!process.env.DATABASE_URL && {
        user: process.env.PG_USER,
        host: process.env.PG_HOST,
        database: process.env.PG_DATABASE,
        password: process.env.PG_PASSWORD,
        port: process.env.PG_PORT || 5432,
    }),
    // SSL requerido para producción (Railway lo necesita)
    ...(process.env.NODE_ENV === 'production' && {
        ssl: {
            rejectUnauthorized: false
        }
    })
});

pool.on('connect', () => {
    console.log('✅ Conectado a PostgreSQL');
});

pool.on('error', (err) => {
    console.error('❌ Error en PostgreSQL:', err);
});

// Función para probar la conexión
const testConnection = async () => {
    try {
        const result = await pool.query('SELECT NOW()');
        console.log('✅ PostgreSQL conectado:', result.rows[0].now);
        return true;
    } catch (error) {
        console.error('❌ Error conectando a PostgreSQL:', error.message);
        return false;
    }
};

// Exportar como objeto
module.exports = {
    query: (text, params) => pool.query(text, params),
    pool,  // ← Exportar pool como propiedad
    testConnection
};