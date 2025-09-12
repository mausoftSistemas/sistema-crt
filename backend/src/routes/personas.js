const express = require('express');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Obtener personas por establecimiento
router.get('/establecimiento/:establecimientoId', authenticateToken, async (req, res) => {
  try {
    const { establecimientoId } = req.params;
    
    const personas = await prisma.persona.findMany({
      where: { establecimientoId },
      orderBy: [{ apellido: 'asc' }, { nombre: 'asc' }]
    });

    res.json(personas);
  } catch (error) {
    console.error('Error obteniendo personas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Crear persona
router.post('/', [
  authenticateToken,
  authorizeRoles('ADMIN', 'TECNICO_ADMIN'),
  body('nombre').notEmpty().withMessage('El nombre es requerido'),
  body('apellido').notEmpty().withMessage('El apellido es requerido'),
  body('dni').notEmpty().withMessage('El DNI es requerido'),
  body('establecimientoId').notEmpty().withMessage('El establecimiento es requerido')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { nombre, apellido, dni, email, telefono, cargo, establecimientoId } = req.body;

    const persona = await prisma.persona.create({
      data: {
        nombre,
        apellido,
        dni,
        email,
        telefono,
        cargo,
        establecimientoId
      }
    });

    res.status(201).json({
      message: 'Persona creada exitosamente',
      persona
    });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Ya existe una persona con ese DNI' });
    }
    console.error('Error creando persona:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Actualizar persona
router.put('/:id', [
  authenticateToken,
  authorizeRoles('ADMIN', 'TECNICO_ADMIN')
], async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, apellido, dni, email, telefono, cargo } = req.body;

    const persona = await prisma.persona.update({
      where: { id },
      data: { nombre, apellido, dni, email, telefono, cargo }
    });

    res.json({
      message: 'Persona actualizada exitosamente',
      persona
    });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Ya existe una persona con ese DNI' });
    }
    console.error('Error actualizando persona:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Eliminar persona
router.delete('/:id', [
  authenticateToken,
  authorizeRoles('ADMIN', 'TECNICO_ADMIN')
], async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.persona.delete({
      where: { id }
    });

    res.json({ message: 'Persona eliminada exitosamente' });
  } catch (error) {
    console.error('Error eliminando persona:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;