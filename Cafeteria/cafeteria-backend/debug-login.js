const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const pool = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
});

async function testLogin() {
    try {
        console.log('Connecting to database...');
        const email = 'cajero@cafeteria.com';
        const rawPassword = '123456';

        const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);

        if (result.rows.length === 0) {
            console.log('User NOT found!');
        } else {
            const user = result.rows[0];
            console.log('User found:');
            console.log(`- ID: ${user.id}`);
            console.log(`- Email: ${user.email}`);
            console.log(`- Password (DB): ${user.password}`);
            console.log(`- Rol: ${user.rol}`);
            console.log(`- Activo: ${user.activo}`);

            try {
                const isMatch = await bcrypt.compare(rawPassword, user.password);
                console.log(`\nbcrypt.compare('${rawPassword}', user.password) => ${isMatch}`);
            } catch (bcryptError) {
                console.log(`\nbcrypt error: ${bcryptError.message}`);
                console.log("Is the password in DB not a valid hash?");
            }

            // Allow manual check if needed
            if (rawPassword === user.password) {
                console.log('\nPLAIN TEXT MATCH! The password in DB is plain text, not hashed.');
            }
        }
    } catch (err) {
        console.error('Database Error:', err);
    } finally {
        pool.end();
    }
}

testLogin();
