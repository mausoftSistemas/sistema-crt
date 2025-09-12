# Guía de Instalación - Sistema CRT

## Requisitos Previos

- Node.js 18+ 
- PostgreSQL 15+
- Docker y Docker Compose (opcional)

## Instalación Local

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/sistema-crt.git
cd sistema-crt
```

### 2. Configurar Backend

```bash
cd backend
npm install
cp .env.example .env
```

Editar `.env` con tus configuraciones:

```env
DATABASE_URL="postgresql://usuario:password@localhost:5432/sistema_crt"
JWT_SECRET="tu-clave-secreta-muy-segura"
PORT=3001
NODE_ENV=development
```

### 3. Configurar Base de Datos

```bash
# Generar cliente Prisma
npx prisma generate

# Ejecutar migraciones
npx prisma migrate dev

# Poblar datos iniciales
npm run seed
```

### 4. Configurar Frontend

```bash
cd ../frontend
npm install
```

Crear `.env.local`:

```env
VITE_API_URL=http://localhost:3001/api
```

### 5. Ejecutar en Desarrollo

Terminal 1 (Backend):
```bash
cd backend
npm run dev
```

Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```

## Instalación con Docker

```bash
# Clonar repositorio
git clone https://github.com/tu-usuario/sistema-crt.git
cd sistema-crt

# Ejecutar con Docker Compose
docker-compose up -d

# Ejecutar migraciones y seed
docker-compose exec backend npx prisma migrate dev
docker-compose exec backend npm run seed
```

## Deployment en Coolify

### 1. Preparar repositorio en GitHub

- Subir código a GitHub
- Asegurar que `.env` no esté incluido

### 2. Configurar en Coolify

1. **Crear nueva aplicación**
   - Conectar repositorio GitHub
   - Seleccionar rama `main`

2. **Configurar variables de entorno**
   ```
   DATABASE_URL=postgresql://usuario:password@postgres:5432/sistema_crt
   JWT_SECRET=clave-super-secreta-para-produccion
   NODE_ENV=production
   VITE_API_URL=https://tu-dominio.com/api
   ```

3. **Configurar servicios**
   - PostgreSQL como servicio de base de datos
   - Backend como servicio web (puerto 3001)
   - Frontend como servicio web (puerto 3000)

4. **Configurar dominio**
   - Asignar dominio personalizado
   - Configurar SSL automático

### 3. Post-deployment

```bash
# Ejecutar migraciones (una sola vez)
npx prisma migrate deploy

# Poblar datos iniciales (una sola vez)
npm run seed
```

## Credenciales por Defecto

Después del seed inicial:

- **Email:** admin@crt.com
- **Contraseña:** admin123
- **Rol:** Administrador

## Estructura de Archivos

```
sistema-crt/
├── backend/              # API REST con Node.js
│   ├── src/
│   │   ├── routes/       # Rutas de la API
│   │   ├── middleware/   # Middlewares
│   │   └── server.js     # Servidor principal
│   ├── prisma/           # Esquema de base de datos
│   └── uploads/          # Archivos subidos
├── frontend/             # Aplicación React
│   ├── src/
│   │   ├── components/   # Componentes React
│   │   ├── pages/        # Páginas
│   │   ├── contexts/     # Contextos React
│   │   └── services/     # Servicios API
└── docs/                 # Documentación
```

## Solución de Problemas

### Error de conexión a base de datos
- Verificar que PostgreSQL esté ejecutándose
- Comprobar credenciales en `DATABASE_URL`
- Asegurar que la base de datos existe

### Error de permisos de archivos
- Verificar permisos de carpeta `uploads/`
- En producción, configurar volumen persistente

### Error de CORS
- Verificar configuración de dominios en `backend/src/server.js`
- Actualizar `VITE_API_URL` en frontend

## Mantenimiento

### Backup de Base de Datos
```bash
pg_dump sistema_crt > backup.sql
```

### Actualización
```bash
git pull origin main
docker-compose down
docker-compose up -d --build
```