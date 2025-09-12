#!/bin/bash

# Script de inicialización del proyecto Sistema CRT
# Prepara todo para desarrollo local y deployment en Coolify

set -e

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

info() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
    exit 1
}

echo "🚀 Inicializando Sistema CRT..."
echo "=================================="

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ] && [ ! -f "docker-compose.yml" ]; then
    error "No estás en el directorio raíz del proyecto Sistema CRT"
fi

# Crear archivo .env si no existe
if [ ! -f ".env" ]; then
    log "📝 Creando archivo .env para desarrollo local..."
    cp .env.example .env
    log "✅ Archivo .env creado. Puedes editarlo si necesitas cambiar configuraciones."
else
    info "📝 Archivo .env ya existe"
fi

# Verificar Docker
if ! command -v docker &> /dev/null; then
    error "Docker no está instalado. Por favor instala Docker primero."
fi

if ! command -v docker-compose &> /dev/null; then
    error "Docker Compose no está instalado. Por favor instala Docker Compose primero."
fi

log "✅ Docker y Docker Compose están disponibles"

# Verificar Node.js (para desarrollo local opcional)
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    log "✅ Node.js detectado: $NODE_VERSION"
else
    warn "Node.js no detectado. Puedes usar Docker para desarrollo."
fi

# Crear directorios necesarios
log "📁 Creando directorios necesarios..."
mkdir -p backend/uploads
mkdir -p logs
mkdir -p backups

# Hacer scripts ejecutables
log "🔧 Configurando permisos de scripts..."
chmod +x scripts/*.sh
chmod +x .coolify/deploy.sh

log "✅ Permisos configurados"

# Información sobre deployment
echo
info "🎯 OPCIONES DE DEPLOYMENT:"
echo
echo "1. 🐳 DESARROLLO LOCAL CON DOCKER:"
echo "   docker-compose up -d"
echo "   Acceso: http://localhost:3000"
echo
echo "2. 🚀 DEPLOYMENT EN COOLIFY:"
echo "   - Coolify detectará automáticamente la configuración"
echo "   - Variables de entorno se generarán automáticamente"
echo "   - Servicios se desplegarán en orden correcto"
echo "   - Post-deployment se ejecutará automáticamente"
echo
echo "3. 💻 DESARROLLO LOCAL SIN DOCKER:"
echo "   cd backend && npm install && npm run dev"
echo "   cd frontend && npm install && npm run dev"
echo

info "📚 DOCUMENTACIÓN DISPONIBLE:"
echo "   - README.md - Información general"
echo "   - docs/DEPLOYMENT_COOLIFY.md - Guía de Coolify"
echo "   - docs/API.md - Documentación de API"
echo "   - .coolify/README.md - Configuración automática"
echo

info "🔑 CREDENCIALES POR DEFECTO:"
echo "   Email: admin@crt.com"
echo "   Contraseña: admin123"
echo "   ⚠️  Cambiar después del primer login"
echo

info "🌐 URLS DESPUÉS DEL DEPLOYMENT:"
echo "   Frontend: https://tu-dominio.com"
echo "   API: https://tu-dominio.com/api"
echo "   Health: https://tu-dominio.com/api/health"
echo

log "🎉 Inicialización completada!"
log "📋 El proyecto está listo para desarrollo y deployment"

echo
echo "¿Qué quieres hacer ahora?"
echo "1. Iniciar desarrollo local con Docker"
echo "2. Ver guía de deployment en Coolify"
echo "3. Continuar manualmente"
echo

read -p "Selecciona una opción (1-3): " choice

case $choice in
    1)
        log "🐳 Iniciando desarrollo local con Docker..."
        docker-compose up -d
        log "✅ Servicios iniciados!"
        log "🌐 Frontend: http://localhost:3000"
        log "🔧 API: http://localhost:3001"
        log "🏥 Health: http://localhost:3001/health"
        ;;
    2)
        log "📚 Abriendo guía de deployment..."
        if command -v code &> /dev/null; then
            code docs/DEPLOYMENT_COOLIFY.md
        else
            echo "Ver: docs/DEPLOYMENT_COOLIFY.md"
        fi
        ;;
    3)
        log "👍 Continuando manualmente"
        ;;
    *)
        log "👍 Opción no válida, continuando manualmente"
        ;;
esac

echo
log "🚀 ¡Sistema CRT listo para usar!"