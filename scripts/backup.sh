#!/bin/bash

# Script de backup para Sistema CRT
# Uso: ./scripts/backup.sh

set -e

# Configuración
BACKUP_DIR="/backups/sistema-crt"
DATE=$(date +"%Y%m%d_%H%M%S")
CONTAINER_DB="sistema-crt-db"
CONTAINER_BACKEND="sistema-crt-backend"

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

# Crear directorio de backup
mkdir -p $BACKUP_DIR

log "🗄️ Iniciando backup del Sistema CRT"

# Backup de base de datos
log "📊 Creando backup de PostgreSQL..."
docker exec $CONTAINER_DB pg_dump -U crt_user sistema_crt > "$BACKUP_DIR/database_$DATE.sql"

if [ $? -eq 0 ]; then
    log "✅ Backup de base de datos completado: database_$DATE.sql"
else
    error "❌ Error en backup de base de datos"
fi

# Backup de archivos subidos
log "📁 Creando backup de archivos subidos..."
docker exec $CONTAINER_BACKEND tar -czf - uploads/ > "$BACKUP_DIR/uploads_$DATE.tar.gz"

if [ $? -eq 0 ]; then
    log "✅ Backup de uploads completado: uploads_$DATE.tar.gz"
else
    warn "⚠️ Error en backup de uploads (puede ser normal si no hay archivos)"
fi

# Información del backup
BACKUP_SIZE=$(du -sh $BACKUP_DIR | cut -f1)
log "📦 Backup completado. Tamaño total: $BACKUP_SIZE"

# Limpiar backups antiguos (mantener últimos 7 días)
log "🧹 Limpiando backups antiguos..."
find $BACKUP_DIR -name "database_*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "uploads_*.tar.gz" -mtime +7 -delete

log "✅ Backup del Sistema CRT completado exitosamente"
log "📍 Ubicación: $BACKUP_DIR"

# Listar backups disponibles
echo
log "📋 Backups disponibles:"
ls -lah $BACKUP_DIR/