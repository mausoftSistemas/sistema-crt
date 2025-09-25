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
- **Deployment**: Docker compatible

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

## 🌐 Deployment

### Docker Compose para Producción

El proyecto incluye configuración para deployment con Docker:

- ✅ **Servicios containerizados** (PostgreSQL, Backend, Frontend)
- ✅ **Variables de entorno** configurables
- ✅ **Health checks** incluidos
- ✅ **Volúmenes persistentes** para datos y uploads

**Para deployment:**
1. Configura las variables de entorno en `.env.prod`
2. Ejecuta `docker-compose -f docker-compose.prod.yml up -d`
3. Configura tu proxy reverso (nginx, traefik, etc.)

Ver guía completa: [docs/INSTALACION.md](docs/INSTALACION.md)