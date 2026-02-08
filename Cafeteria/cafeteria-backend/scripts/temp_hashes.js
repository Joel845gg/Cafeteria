
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

async function generate() {
    const salt = await bcrypt.genSalt(10);
    const p1 = await bcrypt.hash('admin123', salt);
    const p2 = await bcrypt.hash('cajero123', salt);
    const p3 = await bcrypt.hash('cocina123', salt);
    const p4 = await bcrypt.hash('cliente123', salt);

    const data = JSON.stringify({
        admin: p1,
        cajero: p2,
        cocina: p3,
        cliente: p4
    }, null, 2);

    fs.writeFileSync(path.join(__dirname, 'hashes.json'), data);
    console.log('Hashes written to hashes.json');
}

generate();
