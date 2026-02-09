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

async function fixPasswords() {
    try {
        console.log('Connecting to database...');

        // Passwords to fix
        const usersToFix = [
            'admin@cafeteria.com',
            'cajero@cafeteria.com',
            'cocina@cafeteria.com'
        ];

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('123456', salt);

        console.log(`Generated hash for '123456': ${hashedPassword}`);

        for (const email of usersToFix) {
            console.log(`Updating password for ${email}...`);
            const result = await pool.query(
                'UPDATE usuarios SET password = $1 WHERE email = $2 RETURNING id, email',
                [hashedPassword, email]
            );

            if (result.rows.length > 0) {
                console.log(`✅ Updated ${email} (ID: ${result.rows[0].id})`);
            } else {
                console.log(`⚠️ User ${email} not found.`);
            }
        }

        console.log('\nAll specified users updated.');

    } catch (err) {
        console.error('Database Error:', err);
    } finally {
        pool.end();
    }
}

fixPasswords();
