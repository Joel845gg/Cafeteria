const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

async function testUpload() {
    try {
        // 1. Login as Admin
        console.log('Logging in as admin...');
        const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'admin@cafeteria.com',
            password: '123456'
        });

        const token = loginRes.data.token;
        console.log('Login successful. Token acquired.');

        // 2. Create Product with Multipart/Form-Data
        const form = new FormData();
        form.append('nombre', 'Producto Test Multer');
        form.append('descripcion', 'Descripcion de prueba');
        form.append('precio', 10);
        form.append('categoria_id', 1);
        form.append('stock', 100);
        form.append('activo', 'true');

        // Create a dummy file
        const dummyPath = path.join(__dirname, 'dummy.txt');
        fs.writeFileSync(dummyPath, 'contenido dummy');

        // Note: Multer filter expects image/, so this might fail the filter, 
        // but we want to see if BODY is parsed. 
        // Let's force a filename with .jpg to cheat the extension check if it's based on name,
        // but multer checks magic numbers usually? No, req.file.mimetype comes from headers in multipart.
        // axios form-data handles this.
        form.append('imagen', fs.createReadStream(dummyPath), {
            filename: 'test.jpg',
            contentType: 'image/jpeg'
        });

        console.log('Sending multipart request...');
        const headers = {
            ...form.getHeaders(),
            'Authorization': `Bearer ${token}`
        };

        const createRes = await axios.post('http://localhost:5000/api/productos', form, {
            headers: headers
        });

        console.log('Response:', createRes.data);

    } catch (error) {
        if (error.response) {
            console.error('Error Response:', error.response.status, error.response.data);
        } else {
            console.error('Error:', error.message);
        }
    }
}

testUpload();
