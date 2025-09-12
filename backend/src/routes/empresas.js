const express = require('express');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken, authorizeRoles, checkEmpresaAccess } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Obtener todas las empresas
router.get('/', authenticateToken, async (req, res) => {
  try {
    const user = req.user;
    let empresas;

    if (user.role === 'ADMIN' || user.role === 'TECNICO_ADMIN') {
      // Admin y Técnico-Admin pueden ver todas las empresas
      empresas = await prisma.empresa.findMany({
        include: {
          establecimientos: {
            select: { id: true, nombre: true }
          },
          _count: {
            select: {
              establecimientos: true,
              documentos: true
            }
          }
        },
        orderBy: { nombre: 'asc' }
      });
    } else if (user.role === 'LECTOR') {
      // Lector solo puede ver su empresa
      if (!user.empresaId) {
        return res.json([]);
      }
      empresas = await prisma.empresa.findMany({
        where: { id: user.empresaId },
        include: {
          establecimientos: {
            select: { id: true, nombre: true }
          },
          _count: {
            select: {
              establecimientos: true,
              documentos: true
            }
          }
        }
      });
    } else {
      // Técnico puede ver todas las empresas (para subir archivos)
      empresas = await prisma.empresa.findMany({
        select: {
          id: true,
          nombre: true,
          cuit: true,
          esRecurrente: true
        },
        orderBy: { nombre: 'asc' }
      });
    }

    res.json(empresas);
  } catch (error) {
    console.error('Error obteniendo empresas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Obtener empresa por ID
router.get('/:id', authenticateToken, checkEmpresaAccess, async (req, res) => {
  try {
    const { id } = req.params;

    const empresa = await prisma.empresa.findUnique({
      where: { id },
      include: {
        establecimientos: {
          include: {
            personas: {
              select: { id: true, nombre: true, apellido: true, cargo: true }
            },
            _count: {
              select: { personas: true, documentos: true }
            }
          }
        },
        documentos: {
          include: {
            categoria: true,
            tipoDocumento: true
          },
          orderBy: { createdAt: 'desc' }
        },
        _count: {
          select: {
            establecimientos: true,
            documentos: true
          }
        }
      }
    });

    if (!empresa) {
      return res.status(404).json({ error: 'Empresa no encontrada' });
    }

    res.json(empresa);
  } catch (error) {
    console.error('Error obteniendo empresa:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Crear nueva empresa
router.post('/', [
  authenticateToken,
  authorizeRoles('ADMIN', 'TECNICO_ADMIN'),
  body('nombre').notEmpty().withMessage('El nombre es requerido'),
  body('cuit').notEmpty().withMessage('El CUIT es requerido'),
  body('cuit').isLength({ min: 11, max: 11 }).withMessage('El CUIT debe tener 11 dígitos')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { nombre, cuit, direccion, telefono, email, esRecurrente } = req.body;

    // Verificar si ya existe una empresa con ese CUIT
    const existingEmpresa = await prisma.empresa.findUnique({
      where: { cuit }
    });

    if (existingEmpresa) {
      return res.status(400).json({ error: 'Ya existe una empresa con ese CUIT' });
    }

    const empresa = await prisma.empresa.create({
      data: {
        nombre,
        cuit,
        direccion,
        telefono,
        email,
        esRecurrente: esRecurrente || false
      }
    });

    res.status(201).json({
      message: 'Empresa creada exitosamente',
      empresa
    });
  } catch (error) {
    console.error('Error creando empresa:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Actualizar empresa
router.put('/:id', [
  authenticateToken,
  authorizeRoles('ADMIN', 'TECNICO_ADMIN'),
  body('nombre').optional().notEmpty().withMessage('El nombre no puede estar vacío'),
  body('cuit').optional().isLength({ min: 11, max: 11 }).withMessage('El CUIT debe tener 11 dígitos')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { nombre, cuit, direccion, telefono, email, esRecurrente } = req.body;

    // Verificar si la empresa existe
    const existingEmpresa = await prisma.empresa.findUnique({
      where: { id }
    });

    if (!existingEmpresa) {
      return res.status(404).json({ error: 'Empresa no encontrada' });
    }

    // Si se está actualizando el CUIT, verificar que no exista otro con el mismo
    if (cuit && cuit !== existingEmpresa.cuit) {
      const empresaWithSameCuit = await prisma.empresa.findUnique({
        where: { cuit }
      });

      if (empresaWithSameCuit) {
        return res.status(400).json({ error: 'Ya existe una empresa con ese CUIT' });
      }
    }

    const empresa = await prisma.empresa.update({
      where: { id },
      data: {
        ...(nombre && { nombre }),
        ...(cuit && { cuit }),
        ...(direccion !== undefined && { direccion }),
        ...(telefono !== undefined && { telefono }),
        ...(email !== undefined && { email }),
        ...(esRecurrente !== undefined && { esRecurrente })
      }
    });

    res.json({
      message: 'Empresa actualizada exitosamente',
      empresa
    });
  } catch (error) {
    console.error('Error actualizando empresa:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Eliminar empresa
router.delete('/:id', [
  authenticateToken,
  authorizeRoles('ADMIN', 'TECNICO_ADMIN')
], async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar si la empresa existe
    const empresa = await prisma.empresa.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            establecimientos: true,
            documentos: true,
            users: true
          }
        }
      }
    });

    if (!empresa) {
      return res.status(404).json({ error: 'Empresa no encontrada' });
    }

    // Verificar si tiene usuarios asignados
    if (empresa._count.users > 0) {
      return res.status(400).json({ 
        error: 'No se puede eliminar la empresa porque tiene usuarios asignados' 
      });
    }

    await prisma.empresa.delete({
      where: { id }
    });

    res.json({ message: 'Empresa eliminada exitosamente' });
  } catch (error) {
    console.error('Error eliminando empresa:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;