const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token de acceso requerido' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { empresa: true }
    });

    if (!user) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Token inválido' });
  }
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'No tienes permisos para realizar esta acción' });
    }

    next();
  };
};

const checkEmpresaAccess = async (req, res, next) => {
  const { empresaId } = req.params;
  const user = req.user;

  // Admin puede acceder a todo
  if (user.role === 'ADMIN') {
    return next();
  }

  // Lector solo puede acceder a su empresa
  if (user.role === 'LECTOR') {
    if (!user.empresaId || user.empresaId !== empresaId) {
      return res.status(403).json({ error: 'No tienes acceso a esta empresa' });
    }
  }

  next();
};

module.exports = {
  authenticateToken,
  authorizeRoles,
  checkEmpresaAccess
};