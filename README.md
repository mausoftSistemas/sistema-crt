# Sistema CRT - Consultora de Riesgos del Trabajo

Sistema web para gestión de documentación PDF y administración de empresas, establecimientos y personal.

## Características

- **Autenticación y Autorización**: Sistema de login con roles (lector, admin, técnico, técnico-admin)
- **Gestión de Empresas**: Administración de empresas y sus establecimientos
- **Gestión de Personal**: Control de personas por establecimiento
- **Documentación PDF**: Subida, categorización y gestión de archivos PDF
- **Dashboard**: Estadísticas y filtros avanzados
- **Descarga Masiva**: Exportación de archivos por empresa
- **URLs Compartibles**: Enlaces para descarga de archivos por empresa

## Roles y Permisos

- **Admin**: Acceso completo al sistema
- **Lector**: Solo visualización de su empresa asignada
- **Técnico**: Puede subir archivos a empresas
- **Técnico-Admin**: Puede modificar y eliminar registros

## Stack Tecnológico

- **Backend**: Node.js + Express + PostgreSQL + Prisma
- **Frontend**: React + Vite + Tailwind CSS
- **Autenticación**: JWT
- **Deployment**: Coolify compatible

## Estructura del Proyecto

```
sistema-crt/
├── backend/          # API REST
├── frontend/         # Aplicación React
├── docs/            # Documentación
└── docker-compose.yml
```

## 🚀 Inicio Rápido

### Opción 1: Configuración Automática
```bash
# Ejecutar script de inicialización
chmod +x scripts/init-project.sh
./scripts/init-project.sh
```

### Opción 2: Docker Compose (Desarrollo)
```bash
# Copiar variables de entorno
cp .env.example .env

# Iniciar servicios
docker-compose up -d

# Acceder a la aplicación
# Frontend: http://localhost:3000
# API: http://localhost:3001
```

### Opción 3: Desarrollo Local
```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (nueva terminal)
cd frontend  
npm install
npm run dev
```

## 🌐 Deployment en Coolify

### Deployment Completamente Automático

El proyecto incluye configuración automática para Coolify:

- ✅ **Variables dinámicas** generadas automáticamente
- ✅ **Servicios preconfigurados** (PostgreSQL, Backend, Frontend)
- ✅ **Dependencias automáticas** entre servicios
- ✅ **Post-deployment automático** (migraciones + seed)
- ✅ **Health checks** configurados
- ✅ **SSL automático** con Let's Encrypt

**Simplemente:**
1. Conecta tu repositorio GitHub a Coolify
2. Coolify detecta automáticamente la configuración
3. Todos los servicios se despliegan automáticamente
4. ¡Listo para usar!

Ver guía completa: [docs/DEPLOYMENT_COOLIFY.md](docs/DEPLOYMENT_COOLIFY.md)