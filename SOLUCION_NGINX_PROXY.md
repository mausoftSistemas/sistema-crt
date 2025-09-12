# 🔧 Solución: Configuración Nginx Proxy Reverso

## 🎯 Problema Identificado

El sistema estaba funcionando correctamente (PostgreSQL, Backend, Frontend), pero había un **problema de routing/proxy** que causaba:
- ❌ 404 page not found en la URL principal
- ❌ "no available server" en logs de nginx

## 🔍 Causa Raíz

**Discrepancia en nombres de servicios** entre nginx.conf y docker-compose.coolify.yml:

### Antes (Incorrecto):
```nginx
# nginx.conf
upstream backend {
    server sistema-crt-backend:3001;  # ❌ Nombre incorrecto
}
upstream frontend {
    server sistema-crt-frontend:3000; # ❌ Nombre incorrecto
}
```

### Después (Correcto):
```nginx
# nginx.conf
upstream backend {
    server backend:3001;  # ✅ Nombre del servicio Docker
}
upstream frontend {
    server frontend:3000; # ✅ Nombre del servicio Docker
}
```

## 🛠️ Cambios Realizados

### 1. Corregir nginx.conf
- ✅ Cambiar nombres de upstream a nombres de servicios Docker
- ✅ Mantener configuración de proxy reverso

### 2. Actualizar docker-compose.coolify.yml
- ✅ Agregar servicio nginx como proxy reverso principal
- ✅ Configurar nginx para exponer puerto 80
- ✅ Cambiar VITE_API_URL a rutas relativas (/api)
- ✅ Configurar dependencias correctas

### 3. Nueva Arquitectura

```
Internet → Coolify → Nginx (puerto 80) → {
  /api/*     → Backend (puerto 3001)
  /health    → Nginx health check
  /*         → Frontend (puerto 3000)
}
```

## 📋 Configuración Final

### docker-compose.coolify.yml
```yaml
services:
  postgres: # Base de datos
  backend:  # API Node.js
  frontend: # React app
  nginx:    # ✅ NUEVO: Proxy reverso principal
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf:ro
    depends_on:
      - backend
      - frontend
```

### Variables de Entorno Actualizadas
```bash
# Frontend ahora usa rutas relativas
VITE_API_URL=/api  # ✅ En lugar de URL absoluta
```

## 🚀 Instrucciones de Deploy

### En Coolify:
1. **Configurar dominio principal** apuntando al servicio **nginx** (puerto 80)
2. **NO configurar** dominios separados para backend/frontend
3. **Usar las variables de entorno** existentes

### Resultado Esperado:
- ✅ `https://tu-dominio.com/` → Frontend React
- ✅ `https://tu-dominio.com/api/` → Backend API
- ✅ `https://tu-dominio.com/health` → Health check

## 🔍 Verificación

Después del deploy, verificar:

```bash
# Health checks
curl https://tu-dominio.com/health          # Nginx
curl https://tu-dominio.com/api/health      # Backend

# Frontend
curl https://tu-dominio.com/                # React app
```

## 📝 Notas Importantes

1. **Un solo dominio**: Ahora todo funciona bajo un dominio unificado
2. **Nginx como punto de entrada**: Maneja todo el tráfico y enruta correctamente
3. **Rutas relativas**: Frontend usa `/api` en lugar de URLs absolutas
4. **Simplificación**: Menos configuración de dominios en Coolify

## ✅ Beneficios

- 🎯 **Soluciona el 404**: Nginx enruta correctamente
- 🔒 **Mejor seguridad**: Un solo punto de entrada
- 🚀 **Más simple**: Un dominio, menos configuración
- 📱 **CORS resuelto**: Mismo origen para frontend y API
- 🔧 **Fácil mantenimiento**: Configuración centralizada

¡Con estos cambios, el sistema debería funcionar correctamente! 🎉