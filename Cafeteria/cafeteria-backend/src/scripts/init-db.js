const fs = require('fs');
const path = require('path');
const { pool } = require('../config/database');

async function initDB() {
    try {
        console.log('🔄 Conectando a la base de datos...');

        const sqlPath = path.join(__dirname, '../../database_setup.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log('📂 Leyendo archivo SQL...');

        await pool.query(sql);

        console.log('✅ Base de datos inicializada correctamente');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error inicializando base de datos:', error);
        process.exit(1);
    }
}

initDB();
