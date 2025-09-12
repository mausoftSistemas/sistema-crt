const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...');

  // Crear categorías por defecto
  const categorias = [
    { nombre: 'Seguridad', descripcion: 'Documentos relacionados con seguridad laboral', color: '#EF4444' },
    { nombre: 'Higiene', descripcion: 'Documentos de higiene y salud ocupacional', color: '#10B981' },
    { nombre: 'Capacitación', descripcion: 'Certificados y documentos de capacitación', color: '#3B82F6' },
    { nombre: 'Legal', descripcion: 'Documentos legales y normativos', color: '#8B5CF6' },
    { nombre: 'Médico', descripcion: 'Exámenes médicos y certificados de salud', color: '#F59E0B' }
  ];

  for (const categoria of categorias) {
    await prisma.categoria.upsert({
      where: { nombre: categoria.nombre },
      update: {},
      create: categoria
    });
  }

  // Crear tipos de documento por defecto
  const tiposDocumento = [
    { nombre: 'Certificado de Capacitación', descripcion: 'Certificados de cursos y capacitaciones' },
    { nombre: 'Examen Médico', descripcion: 'Exámenes médicos ocupacionales' },
    { nombre: 'Informe de Riesgo', descripcion: 'Informes de evaluación de riesgos' },
    { nombre: 'Protocolo de Seguridad', descripcion: 'Protocolos y procedimientos de seguridad' },
    { nombre: 'Certificado de Aptitud', descripcion: 'Certificados de aptitud laboral' },
    { nombre: 'Plan de Emergencia', descripcion: 'Planes de evacuación y emergencia' }
  ];

  for (const tipo of tiposDocumento) {
    await prisma.tipoDocumento.upsert({
      where: { nombre: tipo.nombre },
      update: {},
      create: tipo
    });
  }

  // Crear usuario administrador por defecto
  const adminPassword = await bcrypt.hash('admin123', 12);
  
  await prisma.user.upsert({
    where: { email: 'admin@crt.com' },
    update: {},
    create: {
      email: 'admin@crt.com',
      password: adminPassword,
      name: 'Administrador CRT',
      role: 'ADMIN'
    }
  });

  // Crear empresa de ejemplo
  const empresaEjemplo = await prisma.empresa.upsert({
    where: { cuit: '20123456789' },
    update: {},
    create: {
      nombre: 'Empresa Ejemplo S.A.',
      cuit: '20123456789',
      direccion: 'Av. Ejemplo 123, Buenos Aires',
      telefono: '+54 11 1234-5678',
      email: 'contacto@ejemplo.com',
      esRecurrente: true
    }
  });

  // Crear establecimiento de ejemplo
  await prisma.establecimiento.upsert({
    where: { id: 'establecimiento-ejemplo' },
    update: {},
    create: {
      id: 'establecimiento-ejemplo',
      nombre: 'Planta Principal',
      direccion: 'Av. Ejemplo 123, Buenos Aires',
      telefono: '+54 11 1234-5678',
      empresaId: empresaEjemplo.id
    }
  });

  console.log('✅ Seed completado exitosamente');
  console.log('📧 Usuario admin creado: admin@crt.com / admin123');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });