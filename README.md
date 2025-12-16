# ☕ Sistema de Cafetería (Proyecto V2)

Este proyecto es una aplicación web full-stack para la gestión de una cafetería. Consta de un **Backend** desarrollado en Node.js con Express y PostgreSQL, y un **Frontend** desarrollado en React.

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:
* **Node.js:** [Descargar aquí](https://nodejs.org/)
    * Verificar instalación: `node -v`
* **PostgreSQL:** Base de datos relacional.

---

## 🛠️ Parte 1: Configuración del Backend

### Inicialización
Navega al directorio donde desees el backend y crea la carpeta:

```
mkdir cafeteria-backend
cd cafeteria-backend
npm init -y
```

Esto generará un archivo package.json con la configuración básica.
## Instalar Dependencias del Backend
Instalaremos Express (framework de Node.js) y pg (cliente para PostgreSQL):
npm install express pg
Para manejar las variables de entorno (como la contraseña de la base de datos), también puedes instalar dotenv:
```
npm install dotenv
```
## Crear el archivo del servidor (backend)
En la raíz de tu proyecto, crea un archivo llamado server.js:
```
touch server.js
```
Abre el archivo server.js y agrega el siguiente código para configurar Express:
```
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
```

## Crear el archivo .env para las variables de entorno
Crea un archivo llamado .env en la raíz de tu proyecto:
```
touch .env
```

## Agrega la configuración de la base de datos en este archivo:
````
PG_USER=tu_usuario
PG_HOST=localhost
PG_DATABASE=nombre_de_tu_base_de_datos
PG_PASSWORD=tu_contraseña
PG_PORT=5432
````

## Ejecutar el servidor
Inicia el servidor con el siguiente comando:
````
node server.js
````

El servidor debería estar corriendo en http://localhost:5000.

# Instalación del Frontend (React)
## Crear el Proyecto Frontend
En otro directorio, crea el proyecto React utilizando Create React App:
Abre una nueva terminal y navega al directorio donde deseas crear el frontend.
Ejecuta el siguiente comando para crear el proyecto React:
````
npx create-react-app cafeteria-frontend
````
Esto creará una carpeta llamada cafeteria-frontend con toda la estructura de un proyecto React.
## Navegar al Proyecto y Ejecutarlo
Ve al directorio del proyecto React:
````
cd cafeteria-frontend
````
Inicia el servidor de desarrollo de React:
````
npm start
````
Esto abrirá el proyecto en http://localhost:3000.
## Instalar Axios para las peticiones HTTP
Necesitaremos Axios para hacer peticiones HTTP desde el frontend al backend:
````
npm install axios
````
## Crear una página para mostrar el menú
En el directorio src, crea un archivo llamado Menu.js:
````
touch src/Menu.js
````
Abre el archivo Menu.js y agrega el siguiente código para obtener y mostrar el menú desde el backend:
````
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Menu() {
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/menu')
      .then(response => {
        setMenu(response.data);
      })
      .catch(error => {
        console.error('Error al obtener el menú:', error);
      });
  }, []);

  return (
    <div>
      <h1>Menú de la Cafetería</h1>
      <ul>
        {menu.map(item => (
          <li key={item.id}>{item.nombre} - ${item.precio}</li>
        ))}
      </ul>
    </div>
  );
}
export default Menu;
````
## Agregar el componente Menu al archivo App.js
Abre el archivo src/App.js y reemplázalo por el siguiente código:
````
import React from 'react';
import './App.css';
import Menu from './Menu';

function App() {
  return (
    <div className="App">
      <h1>Bienvenido a la Cafetería</h1>
      <Menu />
    </div>
  );
}

export default App;
````
## Ejecutar el Frontend
````
npm start
````





Si el frontend no se está ejecutando, usa el siguiente comando:

npm start


Tu aplicación React debería estar funcionando en http://localhost:3000, mostrando el menú desde el backend.
