const fs = require('fs');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT || 5432,
});

async function initDatabase() {
    try {
        console.log('🔄 Iniciando base de datos...');
        
        // Leer el archivo SQL
        const sql = fs.readFileSync('./database/init.sql', 'utf8');
        
        // Ejecutar el SQL
        await pool.query(sql);
        
        console.log('✅ Base de datos inicializada correctamente');
        console.log('✅ Tablas creadas: categorias, productos, usuarios, pedidos');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error inicializando base de datos:', error.message);
        process.exit(1);
    }
}

initDatabase();
