const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
});

async function auditUsers() {
    try {
        console.log('Connecting to database...');
        const result = await pool.query('SELECT id, email, password, rol FROM usuarios');

        console.log(`Found ${result.rows.length} users.`);

        const plainTextUsers = [];

        result.rows.forEach(user => {
            const isHash = user.password.startsWith('$2a$') || user.password.startsWith('$2b$');
            console.log(`User: ${user.email}, Role: ${user.rol}, Password looks hashed: ${isHash}`);
            if (!isHash) {
                plainTextUsers.push(user);
            }
        });

        if (plainTextUsers.length > 0) {
            console.log('\nWARNING: The following users have plain text passwords:');
            plainTextUsers.forEach(u => console.log(`- ${u.email} (ID: ${u.id})`));
        } else {
            console.log('\nAll users have hashed passwords.');
        }

    } catch (err) {
        console.error('Database Error:', err);
    } finally {
        pool.end();
    }
}

auditUsers();
