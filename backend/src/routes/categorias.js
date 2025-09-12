const express = require('express');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Obtener todas las categorías
router.get('/', authenticateToken, async (req, res) => {
  try {
    const categorias = await prisma.categoria.findMany({
      include: {
        _count: {
          select: { documentos: true }
        }
      },
      orderBy: { nombre: 'asc' }
    });

    res.json(categorias);
  } catch (error) {
    console.error('Error obteniendo categorías:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Crear categoría
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

    const { nombre, descripcion, color } = req.body;

    const categoria = await prisma.categoria.create({
      data: { nombre, descripcion, color }
    });

    res.status(201).json({
      message: 'Categoría creada exitosamente',
      categoria
    });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Ya existe una categoría con ese nombre' });
    }
    console.error('Error creando categoría:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Actualizar categoría
router.put('/:id', [
  authenticateToken,
  authorizeRoles('ADMIN', 'TECNICO_ADMIN')
], async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, color } = req.body;

    const categoria = await prisma.categoria.update({
      where: { id },
      data: { nombre, descripcion, color }
    });

    res.json({
      message: 'Categoría actualizada exitosamente',
      categoria
    });
  } catch (error) {
    console.error('Error actualizando categoría:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Eliminar categoría
router.delete('/:id', [
  authenticateToken,
  authorizeRoles('ADMIN', 'TECNICO_ADMIN')
], async (req, res) => {
  try {
    const { id } = req.params;

    const categoria = await prisma.categoria.findUnique({
      where: { id },
      include: { _count: { select: { documentos: true } } }
    });

    if (categoria._count.documentos > 0) {
      return res.status(400).json({ 
        error: 'No se puede eliminar la categoría porque tiene documentos asociados' 
      });
    }

    await prisma.categoria.delete({
      where: { id }
    });

    res.json({ message: 'Categoría eliminada exitosamente' });
  } catch (error) {
    console.error('Error eliminando categoría:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;