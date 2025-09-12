# 🚀 Deployment en Coolify - Sistema CRT

## Guía Completa para Desplegar en Coolify

### Prerrequisitos
- ✅ Código subido a GitHub
- ✅ Acceso a panel de Coolify
- ✅ VPS configurado con Coolify

---

## 📋 Paso a Paso

### 1. Crear Proyecto en Coolify

1. **Acceder a Coolify**
   - Ve a tu panel de Coolify
   - Haz clic en "New Project"

2. **Configurar Proyecto**
   - **Name**: `sistema-crt`
   - **Description**: `Sistema CRT - Consultora de Riesgos del Trabajo`

### 2. Configurar Base de Datos PostgreSQL

1. **Crear Servicio de Base de Datos**
   - En tu proyecto, clic en "Add Service"
   - Selecciona "PostgreSQL"
   - **Name**: `sistema-crt-db`
   - **Version**: `15` (recomendado)

2. **Configurar Variables de DB**
   ```env
   POSTGRES_DB=sistema_crt
   POSTGRES_USER=crt_user
   POSTGRES_PASSWORD=TU_PASSWORD_SEGURO_AQUI
   ```

3. **Configurar Volumen**
   - **Volume Path**: `/var/lib/postgresql/data`
   - **Host Path**: `/data/sistema-crt/postgres`

### 3. Configurar Backend (API)

1. **Crear Aplicación Backend**
   - "Add Application"
   - **Source**: GitHub Repository
   - **Repository**: `https://github.com/mausoftSistemas/sistema-crt`
   - **Branch**: `main`
   - **Build Pack**: Node.js
   - **Root Directory**: `backend`

2. **Variables de Entorno Backend**
   ```env
   DATABASE_URL=postgresql://crt_user:TU_PASSWORD_SEGURO_AQUI@sistema-crt-db:5432/sistema_crt
   JWT_SECRET=tu-clave-jwt-super-secreta-para-produccion-cambiar-esto
   NODE_ENV=production
   PORT=3001
   MAX_FILE_SIZE=10485760
   UPLOAD_PATH=./uploads
   ```

3. **Configurar Build Commands**
   ```bash
   # Build Command
   npm ci && npx prisma generate
   
   # Start Command
   npm start
   ```

4. **Configurar Volumen para Uploads**
   - **Container Path**: `/app/uploads`
   - **Host Path**: `/data/sistema-crt/uploads`

5. **Health Check**
   - **Path**: `/health`
   - **Port**: `3001`

### 4. Configurar Frontend

1. **Crear Aplicación Frontend**
   - "Add Application"
   - **Source**: GitHub Repository
   - **Repository**: `https://github.com/mausoftSistemas/sistema-crt`
   - **Branch**: `main`
   - **Build Pack**: Node.js
   - **Root Directory**: `frontend`

2. **Variables de Entorno Frontend**
   ```env
   VITE_API_URL=https://api-sistema-crt.tu-dominio.com/api
   ```

3. **Configurar Build Commands**
   ```bash
   # Build Command
   npm ci && npm run build
   
   # Start Command
   serve -s dist -l 3000
   ```

### 5. Configurar Dominios

1. **Backend API**
   - **Subdomain**: `api-sistema-crt`
   - **Domain**: `tu-dominio.com`
   - **Full URL**: `https://api-sistema-crt.tu-dominio.com`

2. **Frontend**
   - **Subdomain**: `sistema-crt` o usar dominio principal
   - **Domain**: `tu-dominio.com`
   - **Full URL**: `https://sistema-crt.tu-dominio.com`

### 6. Configurar SSL

- ✅ Coolify configura SSL automáticamente con Let's Encrypt
- ✅ Certificados se renuevan automáticamente

---

## 🔧 Post-Deployment

### 1. Ejecutar Migraciones de Base de Datos

Una vez desplegado el backend, ejecuta:

```bash
# Conectar al contenedor del backend
docker exec -it sistema-crt-backend bash

# Ejecutar migraciones
npx prisma migrate deploy

# Poblar datos iniciales
npm run seed
```

### 2. Verificar Funcionamiento

1. **Backend Health Check**
   - Ve a: `https://api-sistema-crt.tu-dominio.com/health`
   - Deberías ver: `{"status":"OK","timestamp":"..."}`

2. **Frontend**
   - Ve a: `https://sistema-crt.tu-dominio.com`
   - Deberías ver la página de login

3. **Login de Prueba**
   - **Email**: `admin@crt.com`
   - **Password**: `admin123`

### 3. Configurar Backups

1. **Base de Datos**
   ```bash
   # Backup automático diario
   0 2 * * * docker exec sistema-crt-db pg_dump -U crt_user sistema_crt > /backups/sistema-crt-$(date +%Y%m%d).sql
   ```

2. **Uploads**
   ```bash
   # Backup de archivos subidos
   0 3 * * * tar -czf /backups/uploads-$(date +%Y%m%d).tar.gz /data/sistema-crt/uploads/
   ```

---

## 🔍 Troubleshooting

### Problemas Comunes

1. **Error de Conexión a DB**
   - Verificar que PostgreSQL esté corriendo
   - Comprobar variables de entorno
   - Verificar conectividad entre contenedores

2. **Error de CORS**
   - Verificar VITE_API_URL en frontend
   - Comprobar configuración de CORS en backend

3. **Error de Permisos de Archivos**
   - Verificar permisos de carpeta uploads
   - Comprobar configuración de volúmenes

### Logs Útiles

```bash
# Ver logs del backend
docker logs sistema-crt-backend

# Ver logs del frontend
docker logs sistema-crt-frontend

# Ver logs de PostgreSQL
docker logs sistema-crt-db
```

---

## 📊 Monitoreo

### Métricas a Monitorear

- ✅ Uptime de servicios
- ✅ Uso de CPU y memoria
- ✅ Espacio en disco (especialmente uploads)
- ✅ Conexiones a base de datos
- ✅ Tiempo de respuesta de API

### Alertas Recomendadas

- 🚨 Servicio caído por más de 5 minutos
- 🚨 Uso de disco > 80%
- 🚨 Memoria > 90%
- 🚨 Error rate > 5%

---

## 🔐 Seguridad

### Checklist de Seguridad

- ✅ HTTPS habilitado
- ✅ JWT_SECRET seguro y único
- ✅ Passwords de DB seguros
- ✅ Firewall configurado
- ✅ Backups automáticos
- ✅ Logs de acceso habilitados

### Recomendaciones

1. **Cambiar credenciales por defecto**
2. **Configurar rate limiting**
3. **Monitorear logs de acceso**
4. **Actualizar dependencias regularmente**

---

## ✅ Checklist Final

- [ ] PostgreSQL desplegado y funcionando
- [ ] Backend desplegado con health check OK
- [ ] Frontend desplegado y accesible
- [ ] Dominios configurados con SSL
- [ ] Migraciones ejecutadas
- [ ] Datos iniciales cargados
- [ ] Login funcionando
- [ ] Subida de archivos funcionando
- [ ] Backups configurados
- [ ] Monitoreo configurado

¡Una vez completado este checklist, tu Sistema CRT estará completamente operativo en producción! 🚀