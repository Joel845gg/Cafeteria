const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Conexión a la base de datos PostgreSQL
const pool = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT || 5432,
});

// Middleware para manejar JSON
app.use(express.json());

// Rutas de ejemplo
app.get('/', (req, res) => {
    res.send('Bienvenido a la cafetería');
});

// Ruta para obtener el menú desde la base de datos
app.get('/menu', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM menu');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error al obtener el menú');
    }
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});