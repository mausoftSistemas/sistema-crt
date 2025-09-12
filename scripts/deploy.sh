#!/bin/bash

# Script de deployment para Sistema CRT
# Uso: ./scripts/deploy.sh [environment]

set -e

ENVIRONMENT=${1:-production}
echo "🚀 Iniciando deployment para ambiente: $ENVIRONMENT"

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para logging
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

# Verificar que estamos en la rama correcta
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    warn "No estás en la rama main. Rama actual: $CURRENT_BRANCH"
    read -p "¿Continuar con el deployment? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        error "Deployment cancelado"
    fi
fi

# Verificar que no hay cambios sin commitear
if [ -n "$(git status --porcelain)" ]; then
    error "Hay cambios sin commitear. Por favor, commitea todos los cambios antes del deployment."
fi

# Verificar que estamos sincronizados con origin
git fetch origin
LOCAL=$(git rev-parse @)
REMOTE=$(git rev-parse @{u})

if [ $LOCAL != $REMOTE ]; then
    error "La rama local no está sincronizada con origin. Ejecuta 'git pull' primero."
fi

log "✅ Verificaciones de Git completadas"

# Verificar archivos de configuración
if [ ! -f "docker-compose.yml" ]; then
    error "docker-compose.yml no encontrado"
fi

if [ ! -f "backend/package.json" ]; then
    error "backend/package.json no encontrado"
fi

if [ ! -f "frontend/package.json" ]; then
    error "frontend/package.json no encontrado"
fi

log "✅ Archivos de configuración verificados"

# Crear tag de versión
VERSION=$(date +"%Y%m%d-%H%M%S")
TAG="v$VERSION"

log "📦 Creando tag de versión: $TAG"
git tag -a $TAG -m "Deployment $ENVIRONMENT - $VERSION"
git push origin $TAG

log "✅ Tag creado y subido a GitHub"

# Instrucciones para Coolify
log "🔧 Instrucciones para completar el deployment en Coolify:"
echo
echo "1. Ve a tu panel de Coolify"
echo "2. Selecciona el proyecto 'sistema-crt'"
echo "3. Haz clic en 'Deploy' en cada servicio:"
echo "   - PostgreSQL (si es la primera vez)"
echo "   - Backend API"
echo "   - Frontend"
echo
echo "4. Verifica que las variables de entorno estén configuradas:"
echo "   Backend:"
echo "   - DATABASE_URL"
echo "   - JWT_SECRET"
echo "   - NODE_ENV=production"
echo
echo "   Frontend:"
echo "   - VITE_API_URL"
echo
echo "5. Una vez desplegado, ejecuta las migraciones:"
echo "   docker exec -it sistema-crt-backend npx prisma migrate deploy"
echo "   docker exec -it sistema-crt-backend npm run seed"
echo
echo "6. Verifica el funcionamiento:"
echo "   - Health check: https://api-sistema-crt.tu-dominio.com/health"
echo "   - Frontend: https://sistema-crt.tu-dominio.com"
echo

log "🎉 Deployment preparado exitosamente!"
log "📋 Tag creado: $TAG"
log "🔗 Repositorio: https://github.com/mausoftSistemas/sistema-crt"

echo
echo "¿Necesitas ayuda con la configuración de Coolify?"
echo "Consulta: docs/DEPLOYMENT_COOLIFY.md"