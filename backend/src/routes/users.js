const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Obtener todos los usuarios (solo admin)
router.get('/', [
  authenticateToken,
  authorizeRoles('ADMIN')
], async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        empresaId: true,
        empresa: {
          select: { id: true, nombre: true }
        },
        createdAt: true
      },
      orderBy: { name: 'asc' }
    });

    res.json(users);
  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Actualizar rol de usuario
router.put('/:id/role', [
  authenticateToken,
  authorizeRoles('ADMIN')
], async (req, res) => {
  try {
    const { id } = req.params;
    const { role, empresaId } = req.body;

    const user = await prisma.user.update({
      where: { id },
      data: { 
        role,
        empresaId: role === 'LECTOR' ? empresaId : null
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        empresaId: true,
        empresa: {
          select: { id: true, nombre: true }
        }
      }
    });

    res.json({
      message: 'Usuario actualizado exitosamente',
      user
    });
  } catch (error) {
    console.error('Error actualizando usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;