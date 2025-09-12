#!/bin/sh

echo "🚀 Iniciando Sistema CRT Backend..."

# Esperar a que PostgreSQL esté listo
echo "⏳ Esperando PostgreSQL..."
until pg_isready -h postgres -p 5432 -U crt_user; do
  echo "PostgreSQL no está listo - esperando..."
  sleep 2
done

echo "✅ PostgreSQL está listo!"

# Ejecutar migraciones
echo "🔄 Ejecutando migraciones de Prisma..."
npx prisma migrate deploy

if [ $? -eq 0 ]; then
    echo "✅ Migraciones ejecutadas exitosamente"
else
    echo "⚠️ Error en migraciones, continuando..."
fi

# Ejecutar seed (solo si no hay datos)
echo "📊 Verificando datos iniciales..."
npm run seed

if [ $? -eq 0 ]; then
    echo "✅ Datos iniciales verificados"
else
    echo "⚠️ Error en seed, continuando..."
fi

# Iniciar aplicación
echo "🎉 Iniciando aplicación..."
npm start