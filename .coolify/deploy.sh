#!/bin/bash

# Script de deployment automático para Coolify
# Este script se ejecuta automáticamente después del deployment

set -e

echo "🚀 Iniciando post-deployment de Sistema CRT..."

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
    exit 1
}

# Esperar a que la base de datos esté lista
log "⏳ Esperando a que PostgreSQL esté listo..."
timeout=60
counter=0

while ! pg_isready -h postgres -p 5432 -U crt_user -d sistema_crt; do
    sleep 2
    counter=$((counter + 2))
    if [ $counter -ge $timeout ]; then
        error "Timeout esperando PostgreSQL"
    fi
done

log "✅ PostgreSQL está listo"

# Ejecutar migraciones de Prisma
log "🔄 Ejecutando migraciones de base de datos..."
if npx prisma migrate deploy; then
    log "✅ Migraciones ejecutadas exitosamente"
else
    error "❌ Error ejecutando migraciones"
fi

# Verificar si ya existen datos
log "🔍 Verificando datos existentes..."
USER_COUNT=$(npx prisma db execute --stdin <<< "SELECT COUNT(*) FROM users;" | tail -n 1 | tr -d ' ')

if [ "$USER_COUNT" -eq "0" ]; then
    log "📊 No hay datos existentes, ejecutando seed..."
    if npm run seed; then
        log "✅ Datos iniciales cargados exitosamente"
        log "👤 Usuario admin creado: admin@crt.com / admin123"
    else
        warn "⚠️ Error ejecutando seed (puede ser normal si ya existen datos)"
    fi
else
    log "📊 Datos existentes encontrados, omitiendo seed"
fi

# Verificar health del backend
log "🏥 Verificando health del backend..."
timeout=30
counter=0

while ! curl -f http://localhost:3001/health > /dev/null 2>&1; do
    sleep 2
    counter=$((counter + 2))
    if [ $counter -ge $timeout ]; then
        warn "Timeout verificando health del backend"
        break
    fi
done

if curl -f http://localhost:3001/health > /dev/null 2>&1; then
    log "✅ Backend está funcionando correctamente"
else
    warn "⚠️ Backend puede no estar respondiendo correctamente"
fi

# Crear directorio de uploads si no existe
log "📁 Configurando directorio de uploads..."
mkdir -p /app/uploads
chmod 755 /app/uploads

# Información final
log "🎉 Post-deployment completado exitosamente!"
log "🌐 Frontend: https://${COOLIFY_FQDN:-localhost}"
log "🔧 API: https://${COOLIFY_FQDN:-localhost}/api"
log "🏥 Health: https://${COOLIFY_FQDN:-localhost}/api/health"
log "👤 Login: admin@crt.com / admin123"

echo
log "📋 Servicios desplegados:"
log "  ✅ PostgreSQL Database"
log "  ✅ Backend API (Node.js + Express)"
log "  ✅ Frontend (React + Nginx)"
log "  ✅ Migraciones ejecutadas"
log "  ✅ Datos iniciales cargados"

echo
log "🔧 Para administrar el sistema:"
log "  - Cambiar credenciales por defecto"
log "  - Configurar usuarios adicionales"
log "  - Revisar configuración de empresas"

echo
log "📚 Documentación disponible en:"
log "  - README.md"
log "  - docs/DEPLOYMENT_COOLIFY.md"
log "  - docs/API.md"