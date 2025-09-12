#!/bin/bash

# Script de deploy para Coolify - Sistema CRT con Nginx Proxy
# Este script será ejecutado automáticamente por Coolify

set -e

echo "🚀 Iniciando deploy en Coolify..."

# Verificar que estamos en el directorio correcto
if [ ! -f "docker-compose.coolify.yml" ]; then
    echo "❌ Error: docker-compose.coolify.yml no encontrado"
    exit 1
fi

# Verificar variables de entorno requeridas
if [ -z "$POSTGRES_PASSWORD" ]; then
    echo "⚠️  Advertencia: POSTGRES_PASSWORD no definida, usando valor por defecto"
    export POSTGRES_PASSWORD="changeme"
fi

if [ -z "$JWT_SECRET" ]; then
    echo "⚠️  Advertencia: JWT_SECRET no definida, usando valor por defecto"
    export JWT_SECRET="default-jwt-secret-change-in-production"
fi

# Mostrar configuración
echo "📋 Configuración del deploy:"
echo "   - Postgres Password: [OCULTA]"
echo "   - JWT Secret: [OCULTO]"
echo "   - Domain: ${COOLIFY_FQDN:-localhost}"

# Detener servicios existentes si están corriendo
echo "🛑 Deteniendo servicios existentes..."
docker-compose -f docker-compose.coolify.yml down --remove-orphans || true

# Limpiar imágenes antiguas (opcional)
echo "🧹 Limpiando imágenes antiguas..."
docker system prune -f || true

# Construir y levantar servicios
echo "🔨 Construyendo y levantando servicios..."
docker-compose -f docker-compose.coolify.yml up -d --build

# Esperar a que los servicios estén listos
echo "⏳ Esperando a que los servicios estén listos..."
sleep 45

# Verificar estado de los servicios
echo "🔍 Verificando estado de los servicios..."
docker-compose -f docker-compose.coolify.yml ps

# Verificar logs de los servicios
echo "📋 Últimos logs del backend:"
docker-compose -f docker-compose.coolify.yml logs --tail=10 backend

echo "📋 Últimos logs del frontend:"
docker-compose -f docker-compose.coolify.yml logs --tail=10 frontend

echo "📋 Últimos logs del nginx:"
docker-compose -f docker-compose.coolify.yml logs --tail=10 nginx

echo "✅ Deploy completado exitosamente!"
echo "🌐 La aplicación debería estar disponible en: https://${COOLIFY_FQDN:-localhost}"
echo "📝 Nota: Ahora nginx actúa como proxy reverso unificando frontend y backend"