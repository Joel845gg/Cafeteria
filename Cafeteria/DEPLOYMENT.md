# 🚀 Resumen Rápido: Despliegue de Sakura Coffee

## 📦 Arquitectura
- **Railway**: Backend (Node.js) + PostgreSQL
- **Render**: Frontend (React)

## ✅ Pasos Rápidos

### 1️⃣ Railway (Backend + Base de Datos)
1. Crear cuenta en [railway.app](https://railway.app)
2. Crear proyecto → "Provision PostgreSQL"
3. Subir backend a GitHub
4. Conectar repositorio a Railway
5. Configurar variables de entorno (ver `.env.example`)
6. Generar dominio público
7. Ejecutar `database/init.sql` para crear tablas

### 2️⃣ Render (Frontend)
1. Crear cuenta en [render.com](https://render.com)
2. Subir frontend a GitHub
3. Crear "Web Service" → Conectar repositorio
4. Configurar:
   - Build: `npm install && npm run build`
   - Start: `npx serve -s build -l $PORT`
5. Agregar variable: `REACT_APP_API_URL=https://tu-backend.up.railway.app/api`
6. Agregar `serve` al package.json: `npm install --save serve`

### 3️⃣ Conectar Todo
1. Actualizar `FRONTEND_URL` en Railway con la URL de Render
2. Verificar que todo funcione

## 📄 Archivos Creados
- ✅ `.env.example` (backend y frontend)
- ✅ `.gitignore` (backend y frontend)
- ✅ `database/init.sql` (script de base de datos)
- ✅ `guia_despliegue.md` (guía completa paso a paso)

## 🔑 Credenciales de Prueba
- **Admin**: admin@sakuracoffee.com / password123
- **Cajero**: cajero@sakuracoffee.com / password123
- **Cocina**: cocina@sakuracoffee.com / password123

## 📚 Documentación Completa
Ver: `guia_despliegue.md` para instrucciones detalladas

## 💰 Costos
- **Railway**: $5 gratis/mes
- **Render**: 750 horas gratis/mes (con suspensión automática)

---

**¿Listo para empezar?** Sigue la guía completa en `guia_despliegue.md`
