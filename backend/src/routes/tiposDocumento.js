const express = require('express');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Obtener todos los tipos de documento
router.get('/', authenticateToken, async (req, res) => {
  try {
    const tiposDocumento = await prisma.tipoDocumento.findMany({
      include: {
        _count: {
          select: { documentos: true }
        }
      },
      orderBy: { nombre: 'asc' }
    });

    res.json(tiposDocumento);
  } catch (error) {
    console.error('Error obteniendo tipos de documento:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Crear tipo de documento
router.post('/', [
  authenticateToken,
  authorizeRoles('ADMIN', 'TECNICO_ADMIN'),
  body('nombre').notEmpty().withMessage('El nombre es requerido')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { nombre, descripcion } = req.body;

    const tipoDocumento = await prisma.tipoDocumento.create({
      data: { nombre, descripcion }
    });

    res.status(201).json({
      message: 'Tipo de documento creado exitosamente',
      tipoDocumento
    });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Ya existe un tipo de documento con ese nombre' });
    }
    console.error('Error creando tipo de documento:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Actualizar tipo de documento
router.put('/:id', [
  authenticateToken,
  authorizeRoles('ADMIN', 'TECNICO_ADMIN')
], async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion } = req.body;

    const tipoDocumento = await prisma.tipoDocumento.update({
      where: { id },
      data: { nombre, descripcion }
    });

    res.json({
      message: 'Tipo de documento actualizado exitosamente',
      tipoDocumento
    });
  } catch (error) {
    console.error('Error actualizando tipo de documento:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Eliminar tipo de documento
router.delete('/:id', [
  authenticateToken,
  authorizeRoles('ADMIN', 'TECNICO_ADMIN')
], async (req, res) => {
  try {
    const { id } = req.params;

    const tipoDocumento = await prisma.tipoDocumento.findUnique({
      where: { id },
      include: { _count: { select: { documentos: true } } }
    });

    if (tipoDocumento._count.documentos > 0) {
      return res.status(400).json({ 
        error: 'No se puede eliminar el tipo de documento porque tiene documentos asociados' 
      });
    }

    await prisma.tipoDocumento.delete({
      where: { id }
    });

    res.json({ message: 'Tipo de documento eliminado exitosamente' });
  } catch (error) {
    console.error('Error eliminando tipo de documento:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;