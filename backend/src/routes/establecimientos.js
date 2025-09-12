const express = require('express');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Obtener establecimientos por empresa
router.get('/empresa/:empresaId', authenticateToken, async (req, res) => {
  try {
    const { empresaId } = req.params;
    
    const establecimientos = await prisma.establecimiento.findMany({
      where: { empresaId },
      include: {
        _count: {
          select: { personas: true, documentos: true }
        }
      },
      orderBy: { nombre: 'asc' }
    });

    res.json(establecimientos);
  } catch (error) {
    console.error('Error obteniendo establecimientos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Crear establecimiento
router.post('/', [
  authenticateToken,
  authorizeRoles('ADMIN', 'TECNICO_ADMIN'),
  body('nombre').notEmpty().withMessage('El nombre es requerido'),
  body('empresaId').notEmpty().withMessage('La empresa es requerida')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { nombre, direccion, telefono, empresaId } = req.body;

    const establecimiento = await prisma.establecimiento.create({
      data: { nombre, direccion, telefono, empresaId }
    });

    res.status(201).json({
      message: 'Establecimiento creado exitosamente',
      establecimiento
    });
  } catch (error) {
    console.error('Error creando establecimiento:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Actualizar establecimiento
router.put('/:id', [
  authenticateToken,
  authorizeRoles('ADMIN', 'TECNICO_ADMIN')
], async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, direccion, telefono } = req.body;

    const establecimiento = await prisma.establecimiento.update({
      where: { id },
      data: { nombre, direccion, telefono }
    });

    res.json({
      message: 'Establecimiento actualizado exitosamente',
      establecimiento
    });
  } catch (error) {
    console.error('Error actualizando establecimiento:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Eliminar establecimiento
router.delete('/:id', [
  authenticateToken,
  authorizeRoles('ADMIN', 'TECNICO_ADMIN')
], async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.establecimiento.delete({
      where: { id }
    });

    res.json({ message: 'Establecimiento eliminado exitosamente' });
  } catch (error) {
    console.error('Error eliminando establecimiento:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;