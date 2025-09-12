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

## Instalación y Desarrollo

Ver documentación específica en cada carpeta (backend/frontend).

## Deployment

El proyecto está preparado para desplegarse en Coolify con Docker.