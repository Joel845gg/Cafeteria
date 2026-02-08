# Scripts de Base de Datos

Este directorio contiene los scripts SQL necesarios para inicializar y mantener la base de datos de Sakura Coffee.

## Archivos

### `init.sql`
Script principal de inicialización que crea:
- Todas las tablas necesarias (categorias, productos, usuarios, pedidos)
- Índices para mejorar el rendimiento
- Datos iniciales de ejemplo
- Triggers para actualizar timestamps automáticamente

## Cómo usar en Railway

### Opción 1: Railway CLI
```bash
# Conectarse a la base de datos
railway connect Postgres

# Ejecutar el script
\i database/init.sql
```

### Opción 2: Cliente PostgreSQL (pgAdmin, DBeaver, etc.)
1. Obtén las credenciales de PostgreSQL desde Railway
2. Conéctate usando tu cliente favorito
3. Ejecuta el contenido de `init.sql`

### Opción 3: Desde el código
Puedes crear un script Node.js para ejecutar el SQL automáticamente:

```javascript
const fs = require('fs');
const { pool } = require('./src/config/database');

async function initDatabase() {
    const sql = fs.readFileSync('./database/init.sql', 'utf8');
    await pool.query(sql);
    console.log('✅ Base de datos inicializada');
}

initDatabase();
```

## Datos de prueba

El script incluye:
- 4 categorías de productos
- ~24 productos de ejemplo
- 3 usuarios de prueba:
  - **Admin**: admin@sakuracoffee.com / password123
  - **Cajero**: cajero@sakuracoffee.com / password123
  - **Cocina**: cocina@sakuracoffee.com / password123

## Notas importantes

- El script usa `ON CONFLICT DO NOTHING` para evitar duplicados
- Las contraseñas están hasheadas con bcrypt
- Los triggers actualizan automáticamente `updated_at` en productos y pedidos
