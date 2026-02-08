
async function testLogin(role, email, password) {
    console.log(`\nIntento: Login ${role}`);
    try {
        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok && data.success) {
            console.log(`✅ ${role}: Login exitoso`);
        } else {
            console.log(`❌ ${role}: Falló`);
            console.log('Status:', response.status);
            console.log('Mensaje:', data.message);
        }
    } catch (error) {
        console.error(`❌ ${role}: Error de conexión`);
        console.error(error.cause || error.message);
    }
}

async function run() {
    await testLogin('Admin', 'admin@cafeteria.com', 'admin123');
    await testLogin('Cajero', 'cajero@cafeteria.com', 'cajero123');
    await testLogin('Cocina', 'cocina@cafeteria.com', 'cocina123');
    await testLogin('Cliente', 'anonimo@cafeteria.com', 'cliente123');
}

run();
