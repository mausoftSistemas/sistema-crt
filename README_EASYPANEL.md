# 🚀 Despliegue en EasyPanel - Sistema CRT

Esta guía te ayudará a desplegar el Sistema CRT en EasyPanel usando Docker Compose con PostgreSQL preconfigurado.

## 📋 Requisitos Previos

- Servidor con EasyPanel instalado
- Docker y Docker Compose disponibles
- Acceso SSH al servidor

## 🛠️ Configuración Inicial

### 1. Preparar el Servidor

```bash
# Crear directorios para datos persistentes
mkdir -p ./data/postgres
mkdir -p ./data/uploads

# Dar permisos adecuados
chmod 755 ./data/postgres
chmod 755 ./data/uploads
```

### 2. Configurar Variables de Entorno

```bash
# Copiar el archivo de configuración
cp .env.easypanel .env

# Editar las variables importantes (OBLIGATORIO)
nano .env
```

**Variables que DEBES cambiar:**
- `POSTGRES_PASSWORD`: Contraseña segura para PostgreSQL
- `JWT_SECRET`: Clave secreta única para JWT
- `VITE_API_URL`: URL de tu API según tu dominio en EasyPanel
- `CORS_ORIGIN`: Dominio de tu aplicación

### 3. Desplegar con Docker Compose

```bash
# Usar el archivo específico para EasyPanel
docker-compose -f docker-compose.easypanel.yml up -d
```

## 🔧 Configuración en EasyPanel

### Opción 1: Usando la Interfaz Web

1. **Crear nuevo proyecto** en EasyPanel
2. **Seleccionar "Docker Compose"**
3. **Subir** el archivo `docker-compose.easypanel.yml`
4. **Configurar variables de entorno** desde el archivo `.env.easypanel`
5. **Desplegar**

### Opción 2: Usando CLI

```bash
# Clonar el repositorio en tu servidor
git clone [tu-repositorio]
cd sistema_crt

# Configurar variables de entorno
cp .env.easypanel .env
nano .env  # Editar según tus necesidades

# Desplegar
docker-compose -f docker-compose.easypanel.yml up -d
```

## 🌐 Configuración de Dominios

### En EasyPanel:

1. **Configurar dominio** para el frontend (puerto 3000)
2. **Configurar subdominio** para la API (puerto 3001)
   - Ejemplo: `api.tudominio.com` → puerto 3001
   - Ejemplo: `tudominio.com` → puerto 3000

### Actualizar Variables:

```bash
# En tu archivo .env
VITE_API_URL=https://api.tudominio.com/api
CORS_ORIGIN=https://tudominio.com
```

## 📊 Verificación del Despliegue

### Verificar que los servicios estén corriendo:

```bash
docker-compose -f docker-compose.easypanel.yml ps
```

### Verificar logs:

```bash
# Logs del backend
docker-compose -f docker-compose.easypanel.yml logs backend

# Logs del frontend
docker-compose -f docker-compose.easypanel.yml logs frontend

# Logs de PostgreSQL
docker-compose -f docker-compose.easypanel.yml logs postgres
```

### Verificar salud de los servicios:

```bash
# Health check del backend
curl http://localhost:3001/health

# Health check del frontend
curl http://localhost:3000/
```

## 🔒 Configuración de Seguridad

### 1. PostgreSQL

- ✅ Contraseña segura configurada
- ✅ Base de datos aislada en red interna
- ✅ Volumen persistente configurado

### 2. JWT

- ⚠️ **IMPORTANTE**: Cambia `JWT_SECRET` por una clave única
- ✅ Configurado para producción

### 3. CORS

- ⚠️ **IMPORTANTE**: Cambia `CORS_ORIGIN=*` por tu dominio específico
- Ejemplo: `CORS_ORIGIN=https://tudominio.com`

## 🔄 Comandos Útiles

### Reiniciar servicios:

```bash
docker-compose -f docker-compose.easypanel.yml restart
```

### Actualizar aplicación:

```bash
# Detener servicios
docker-compose -f docker-compose.easypanel.yml down

# Reconstruir imágenes
docker-compose -f docker-compose.easypanel.yml build --no-cache

# Iniciar servicios
docker-compose -f docker-compose.easypanel.yml up -d
```

### Backup de la base de datos:

```bash
docker exec sistema-crt-postgres pg_dump -U crt_user sistema_crt > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Restaurar base de datos:

```bash
docker exec -i sistema-crt-postgres psql -U crt_user sistema_crt < backup.sql
```

## 🐛 Solución de Problemas

### Problema: Base de datos no se conecta

```bash
# Verificar que PostgreSQL esté corriendo
docker-compose -f docker-compose.easypanel.yml logs postgres

# Verificar conectividad
docker exec sistema-crt-backend ping postgres
```

### Problema: Frontend no puede conectar con API

1. Verificar `VITE_API_URL` en `.env`
2. Verificar `CORS_ORIGIN` en `.env`
3. Verificar que ambos servicios estén corriendo

### Problema: Permisos de archivos

```bash
# Dar permisos a directorios de datos
sudo chown -R 999:999 ./data/postgres
sudo chown -R node:node ./data/uploads
```

## 📝 Notas Importantes

1. **Datos Persistentes**: Los datos se guardan en `./data/postgres` y `./data/uploads`
2. **Backups**: Configura backups automáticos de la base de datos
3. **SSL**: Configura SSL/TLS en EasyPanel para HTTPS
4. **Monitoreo**: Considera usar los health checks configurados
5. **Logs**: Los logs se pueden ver con `docker-compose logs`

## 🆘 Soporte

Si tienes problemas:

1. Revisa los logs de los servicios
2. Verifica la configuración de variables de entorno
3. Asegúrate de que los puertos no estén en uso
4. Verifica que los directorios de datos existan y tengan permisos

---

**¡Listo!** Tu Sistema CRT debería estar funcionando en EasyPanel con PostgreSQL preconfigurado. 🎉