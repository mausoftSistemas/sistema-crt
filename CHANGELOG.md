# Changelog - Sistema CRT

Todos los cambios importantes del proyecto serán documentados en este archivo.

## [1.0.0] - 2024-12-09

### Agregado
- ✨ Sistema de autenticación con JWT
- 👥 Gestión de usuarios con roles (Admin, Lector, Técnico, Técnico-Admin)
- 🏢 Gestión de empresas y establecimientos
- 👤 Gestión de personas por establecimiento
- 📄 Sistema de subida y gestión de documentos PDF
- 🏷️ Sistema de categorías y tipos de documento
- 📊 Dashboard con estadísticas y gráficos
- 🌙 Tema claro y oscuro
- 📱 Diseño responsive con Tailwind CSS
- 🔍 Filtros avanzados para documentos
- ⬇️ Descarga individual de documentos
- 📅 Control de vencimiento de documentos
- 🔒 Sistema de permisos por rol
- 🐳 Configuración Docker para deployment
- 📚 Documentación completa de API

### Características Técnicas
- **Backend**: Node.js + Express + PostgreSQL + Prisma ORM
- **Frontend**: React + Vite + Tailwind CSS
- **Autenticación**: JWT con roles y permisos
- **Base de datos**: PostgreSQL con Prisma
- **Subida de archivos**: Multer para PDFs
- **Deployment**: Docker ready

### Roles y Permisos
- **Admin**: Acceso completo al sistema
- **Lector**: Solo visualización de su empresa asignada
- **Técnico**: Puede subir archivos a empresas
- **Técnico-Admin**: Puede modificar y eliminar registros

### Estructura de Datos
- Empresas (recurrentes/temporales)
- Establecimientos (pertenecen a empresas)
- Personas (pertenecen a establecimientos)
- Documentos PDF con metadatos
- Categorías y tipos de documento
- Relaciones documento-persona

### Próximas Funcionalidades
- 📦 Descarga masiva de archivos
- 🔗 URLs compartibles por empresa
- 📈 Dashboard avanzado con más métricas
- 📧 Notificaciones de vencimiento
- 🔍 Búsqueda avanzada de documentos
- 📋 Reportes personalizados
- 🔄 Sincronización automática
- 📱 Aplicación móvil

## Instalación

Ver [docs/INSTALACION.md](docs/INSTALACION.md) para instrucciones detalladas.

## API

Ver [docs/API.md](docs/API.md) para documentación completa de la API.

## Contribuir

1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.