#!/bin/bash

# ===============================================
# Script de Configuración para EasyPanel
# Sistema CRT - Configuración Automática
# ===============================================

set -e  # Salir si hay algún error

echo "🚀 Configurando Sistema CRT para EasyPanel..."

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para imprimir mensajes
print_message() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# Verificar que estamos en el directorio correcto
if [ ! -f "docker-compose.easypanel.yml" ]; then
    print_error "No se encontró docker-compose.easypanel.yml"
    print_error "Asegúrate de estar en el directorio raíz del proyecto"
    exit 1
fi

print_step "1. Creando directorios para datos persistentes..."

# Crear directorios necesarios
mkdir -p ./data/postgres
mkdir -p ./data/uploads

# Dar permisos adecuados
chmod 755 ./data/postgres
chmod 755 ./data/uploads

print_message "Directorios creados: ./data/postgres y ./data/uploads"

print_step "2. Configurando variables de entorno..."

# Copiar archivo de configuración si no existe
if [ ! -f ".env" ]; then
    if [ -f ".env.easypanel" ]; then
        cp .env.easypanel .env
        print_message "Archivo .env creado desde .env.easypanel"
    else
        print_error "No se encontró .env.easypanel"
        exit 1
    fi
else
    print_warning "El archivo .env ya existe, no se sobrescribirá"
fi

print_step "3. Generando contraseñas seguras..."

# Generar contraseña segura para PostgreSQL si no está configurada
if grep -q "crt_secure_password_2024" .env; then
    NEW_POSTGRES_PASSWORD=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-25)
    sed -i "s/crt_secure_password_2024/${NEW_POSTGRES_PASSWORD}/g" .env
    sed -i "s/crt_secure_password_2024/${NEW_POSTGRES_PASSWORD}/g" docker-compose.easypanel.yml
    print_message "Nueva contraseña de PostgreSQL generada"
fi

# Generar JWT secret si no está configurado
if grep -q "jwt_super_secret_key_easypanel_2024_change_this_in_production" .env; then
    NEW_JWT_SECRET=$(openssl rand -base64 64 | tr -d "=+/" | cut -c1-50)
    sed -i "s/jwt_super_secret_key_easypanel_2024_change_this_in_production/${NEW_JWT_SECRET}/g" .env
    sed -i "s/jwt_super_secret_key_easypanel_2024_change_this_in_production/${NEW_JWT_SECRET}/g" docker-compose.easypanel.yml
    print_message "Nuevo JWT secret generado"
fi

print_step "4. Verificando configuración de Docker..."

# Verificar que Docker esté instalado
if ! command -v docker &> /dev/null; then
    print_error "Docker no está instalado"
    exit 1
fi

# Verificar que Docker Compose esté instalado
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose no está instalado"
    exit 1
fi

print_message "Docker y Docker Compose están disponibles"

print_step "5. Construyendo imágenes Docker..."

# Construir las imágenes
docker-compose -f docker-compose.easypanel.yml build

print_message "Imágenes construidas exitosamente"

print_step "6. Configuración completada!"

echo ""
echo "==============================================="
echo "🎉 CONFIGURACIÓN COMPLETADA"
echo "==============================================="
echo ""
print_message "Próximos pasos:"
echo ""
echo "1. Edita el archivo .env para configurar:"
echo "   - VITE_API_URL (URL de tu API)"
echo "   - CORS_ORIGIN (dominio de tu aplicación)"
echo ""
echo "2. Para iniciar los servicios:"
echo "   docker-compose -f docker-compose.easypanel.yml up -d"
echo ""
echo "3. Para verificar el estado:"
echo "   docker-compose -f docker-compose.easypanel.yml ps"
echo ""
echo "4. Para ver logs:"
echo "   docker-compose -f docker-compose.easypanel.yml logs -f"
echo ""
print_warning "IMPORTANTE: Revisa y ajusta las variables en .env antes de desplegar"
echo ""

# Mostrar información de configuración
echo "==============================================="
echo "📋 INFORMACIÓN DE CONFIGURACIÓN"
echo "==============================================="
echo ""
echo "Servicios configurados:"
echo "  - PostgreSQL: puerto 5432"
echo "  - Backend API: puerto 3001"
echo "  - Frontend: puerto 3000"
echo ""
echo "Directorios de datos:"
echo "  - Base de datos: ./data/postgres"
echo "  - Uploads: ./data/uploads"
echo ""
echo "Archivos importantes:"
echo "  - Configuración: .env"
echo "  - Docker Compose: docker-compose.easypanel.yml"
echo "  - Documentación: README_EASYPANEL.md"
echo ""

print_message "¡Configuración lista para EasyPanel! 🚀"