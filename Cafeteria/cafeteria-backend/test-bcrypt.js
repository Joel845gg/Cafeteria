console.log('=== PRUEBA BCRYPT ===\n');

try {
    const bcrypt = require('bcryptjs');
    console.log('✅ bcryptjs cargado correctamente');
    console.log('Versión:', require('./package.json').dependencies.bcryptjs);
} catch (error) {
    console.error('❌ Error cargando bcryptjs:', error.message);
    
    // Prueba instalar
    console.log('\nIntentando instalar bcryptjs...');
    const { execSync } = require('child_process');
    try {
        execSync('npm install bcryptjs', { stdio: 'inherit' });
        console.log('✅ bcryptjs instalado. Ahora prueba npm start');
    } catch (installError) {
        console.error('❌ Error instalando:', installError.message);
    }
}