const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Configuración de multer para subida de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/documentos';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 // 10MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos PDF'), false);
    }
  }
});

// Obtener documentos con filtros
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { empresaId, establecimientoId, categoriaId, tipoDocumentoId, vencidos } = req.query;
    const user = req.user;

    let whereClause = {};

    // Filtros de acceso por rol
    if (user.role === 'LECTOR' && user.empresaId) {
      whereClause.empresaId = user.empresaId;
    } else if (empresaId) {
      whereClause.empresaId = empresaId;
    }

    // Filtros adicionales
    if (establecimientoId) whereClause.establecimientoId = establecimientoId;
    if (categoriaId) whereClause.categoriaId = categoriaId;
    if (tipoDocumentoId) whereClause.tipoDocumentoId = tipoDocumentoId;

    // Filtro de documentos vencidos
    if (vencidos === 'true') {
      whereClause.fechaVencimiento = {
        lt: new Date()
      };
    }

    const documentos = await prisma.documento.findMany({
      where: whereClause,
      include: {
        categoria: true,
        tipoDocumento: true,
        empresa: { select: { id: true, nombre: true } },
        establecimiento: { select: { id: true, nombre: true } },
        personas: {
          include: {
            persona: { select: { id: true, nombre: true, apellido: true } }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(documentos);
  } catch (error) {
    console.error('Error obteniendo documentos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Subir documento
router.post('/', [
  authenticateToken,
  authorizeRoles('ADMIN', 'TECNICO', 'TECNICO_ADMIN'),
  upload.single('archivo'),
  body('nombre').notEmpty().withMessage('El nombre es requerido'),
  body('categoriaId').notEmpty().withMessage('La categoría es requerida'),
  body('tipoDocumentoId').notEmpty().withMessage('El tipo de documento es requerido')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Eliminar archivo si hay errores de validación
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({ errors: errors.array() });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'El archivo PDF es requerido' });
    }

    const {
      nombre,
      descripcion,
      categoriaId,
      tipoDocumentoId,
      empresaId,
      establecimientoId,
      fechaVencimiento,
      personasIds
    } = req.body;

    // Crear documento
    const documento = await prisma.documento.create({
      data: {
        nombre,
        descripcion,
        nombreArchivo: req.file.originalname,
        rutaArchivo: req.file.path,
        fechaVencimiento: fechaVencimiento ? new Date(fechaVencimiento) : null,
        categoriaId,
        tipoDocumentoId,
        empresaId: empresaId || null,
        establecimientoId: establecimientoId || null
      }
    });

    // Asociar personas si se proporcionaron
    if (personasIds && personasIds.length > 0) {
      const personasArray = Array.isArray(personasIds) ? personasIds : JSON.parse(personasIds);
      await Promise.all(
        personasArray.map(personaId =>
          prisma.documentoPersona.create({
            data: {
              documentoId: documento.id,
              personaId
            }
          })
        )
      );
    }

    // Obtener documento completo
    const documentoCompleto = await prisma.documento.findUnique({
      where: { id: documento.id },
      include: {
        categoria: true,
        tipoDocumento: true,
        empresa: { select: { id: true, nombre: true } },
        establecimiento: { select: { id: true, nombre: true } },
        personas: {
          include: {
            persona: { select: { id: true, nombre: true, apellido: true } }
          }
        }
      }
    });

    res.status(201).json({
      message: 'Documento subido exitosamente',
      documento: documentoCompleto
    });
  } catch (error) {
    // Eliminar archivo si hay error
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    console.error('Error subiendo documento:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Descargar documento
router.get('/:id/download', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    const documento = await prisma.documento.findUnique({
      where: { id },
      include: { empresa: true }
    });

    if (!documento) {
      return res.status(404).json({ error: 'Documento no encontrado' });
    }

    // Verificar permisos de acceso
    if (user.role === 'LECTOR' && user.empresaId !== documento.empresaId) {
      return res.status(403).json({ error: 'No tienes acceso a este documento' });
    }

    if (!fs.existsSync(documento.rutaArchivo)) {
      return res.status(404).json({ error: 'Archivo no encontrado en el servidor' });
    }

    res.download(documento.rutaArchivo, documento.nombreArchivo);
  } catch (error) {
    console.error('Error descargando documento:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Eliminar documento
router.delete('/:id', [
  authenticateToken,
  authorizeRoles('ADMIN', 'TECNICO_ADMIN')
], async (req, res) => {
  try {
    const { id } = req.params;

    const documento = await prisma.documento.findUnique({
      where: { id }
    });

    if (!documento) {
      return res.status(404).json({ error: 'Documento no encontrado' });
    }

    // Eliminar archivo físico
    if (fs.existsSync(documento.rutaArchivo)) {
      fs.unlinkSync(documento.rutaArchivo);
    }

    // Eliminar documento de la base de datos
    await prisma.documento.delete({
      where: { id }
    });

    res.json({ message: 'Documento eliminado exitosamente' });
  } catch (error) {
    console.error('Error eliminando documento:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Obtener estadísticas de documentos
router.get('/stats/dashboard', authenticateToken, async (req, res) => {
  try {
    const user = req.user;
    let whereClause = {};

    if (user.role === 'LECTOR' && user.empresaId) {
      whereClause.empresaId = user.empresaId;
    }

    const [
      totalDocumentos,
      documentosVencidos,
      documentosPorCategoria,
      documentosPorTipo,
      documentosRecientes
    ] = await Promise.all([
      prisma.documento.count({ where: whereClause }),
      prisma.documento.count({
        where: {
          ...whereClause,
          fechaVencimiento: { lt: new Date() }
        }
      }),
      prisma.documento.groupBy({
        by: ['categoriaId'],
        where: whereClause,
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } }
      }),
      prisma.documento.groupBy({
        by: ['tipoDocumentoId'],
        where: whereClause,
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } }
      }),
      prisma.documento.findMany({
        where: whereClause,
        include: {
          categoria: true,
          tipoDocumento: true,
          empresa: { select: { nombre: true } }
        },
        orderBy: { createdAt: 'desc' },
        take: 5
      })
    ]);

    // Obtener nombres de categorías y tipos
    const categorias = await prisma.categoria.findMany();
    const tiposDocumento = await prisma.tipoDocumento.findMany();

    const categoriasMap = Object.fromEntries(categorias.map(c => [c.id, c.nombre]));
    const tiposMap = Object.fromEntries(tiposDocumento.map(t => [t.id, t.nombre]));

    res.json({
      totalDocumentos,
      documentosVencidos,
      documentosPorCategoria: documentosPorCategoria.map(item => ({
        categoria: categoriasMap[item.categoriaId],
        count: item._count.id
      })),
      documentosPorTipo: documentosPorTipo.map(item => ({
        tipo: tiposMap[item.tipoDocumentoId],
        count: item._count.id
      })),
      documentosRecientes
    });
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;