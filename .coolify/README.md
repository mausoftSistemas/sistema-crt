# 🚀 Configuración Automática para Coolify

Este directorio contiene toda la configuración necesaria para que Coolify despliegue automáticamente el Sistema CRT con variables dinámicas y configuración preestablecida.

## 📁 Archivos de Configuración

### `config.json`
Configuración principal que Coolify lee automáticamente para:
- ✅ Crear servicios (PostgreSQL, Backend, Frontend)
- ✅ Configurar variables de entorno dinámicas
- ✅ Establecer dependencias entre servicios
- ✅ Configurar health checks
- ✅ Configurar dominios automáticamente

### `environment.template`
Plantilla de variables de entorno con:
- ✅ Variables generadas automáticamente por Coolify
- ✅ Referencias dinámicas entre servicios
- ✅ Configuración de seguridad preestablecida
- ✅ Documentación de cada variable

### `deploy.sh`
Script de post-deployment que:
- ✅ Ejecuta migraciones de base de datos
- ✅ Carga datos iniciales (seed)
- ✅ Verifica health de servicios
- ✅ Configura permisos de archivos
- ✅ Proporciona información de acceso

## 🔧 Variables Dinámicas

Coolify completará automáticamente estas variables:

```bash
# Dominio del proyecto
{{FQDN}} → tu-dominio.com

# Conexión entre servicios
{{SERVICE_postgres_POSTGRES_PASSWORD}} → password generado del postgres
{{SERVICE_postgres_INTERNAL_IP}} → IP interna del contenedor postgres

# Secrets generados
{{GENERATE_PASSWORD_32}} → password aleatorio de 32 caracteres
{{GENERATE_SECRET_64}} → secret aleatorio de 64 caracteres
```

## 🚀 Deployment Automático

1. **Coolify detecta automáticamente** la configuración
2. **Crea los servicios** en el orden correcto:
   - PostgreSQL Database
   - Backend API
   - Frontend React
3. **Configura variables** dinámicamente
4. **Ejecuta post-deployment** automáticamente
5. **Configura dominios** y SSL

## ✅ Lo que se Configura Automáticamente

### Base de Datos PostgreSQL
- ✅ Usuario y contraseña generados automáticamente
- ✅ Base de datos `sistema_crt` creada
- ✅ Health checks configurados
- ✅ Volumen persistente configurado

### Backend API
- ✅ Variables de entorno dinámicas
- ✅ Conexión automática a PostgreSQL
- ✅ JWT secret generado automáticamente
- ✅ Migraciones ejecutadas automáticamente
- ✅ Datos iniciales cargados
- ✅ Health checks en `/health`
- ✅ Volumen para uploads configurado

### Frontend React
- ✅ URL de API configurada dinámicamente
- ✅ Build optimizado para producción
- ✅ Nginx con configuración de seguridad
- ✅ Health checks configurados
- ✅ Routing SPA configurado

## 🌐 URLs Automáticas

Después del deployment tendrás:

- **Frontend**: `https://tu-dominio.com`
- **API**: `https://tu-dominio.com/api`
- **Health Check**: `https://tu-dominio.com/api/health`

## 👤 Credenciales por Defecto

Después del deployment automático:

- **Email**: `admin@crt.com`
- **Contraseña**: `admin123`
- **Rol**: Administrador

⚠️ **IMPORTANTE**: Cambiar estas credenciales después del primer login.

## 🔧 Personalización Manual

Si necesitas cambiar algo después del deployment automático:

1. **Variables de entorno**: Editar en panel de Coolify
2. **Dominios**: Configurar en settings del proyecto
3. **Recursos**: Ajustar CPU/memoria en configuración
4. **Backups**: Configurar en settings de volúmenes

## 📊 Monitoreo Automático

Coolify monitoreará automáticamente:
- ✅ Health checks de todos los servicios
- ✅ Uso de recursos (CPU, memoria, disco)
- ✅ Logs de aplicación
- ✅ Uptime de servicios

## 🆘 Troubleshooting

Si algo falla durante el deployment automático:

1. **Revisar logs** en panel de Coolify
2. **Verificar variables** de entorno
3. **Comprobar health checks**
4. **Revisar conectividad** entre servicios

Los logs del post-deployment están disponibles en Coolify para debugging.

## 🔄 Actualizaciones

Para actualizar el sistema:

1. **Push cambios** a GitHub
2. **Coolify detecta** automáticamente
3. **Redeploy automático** si está configurado
4. **Post-deployment** se ejecuta automáticamente

¡Con esta configuración, tu Sistema CRT se desplegará completamente automático en Coolify! 🎉