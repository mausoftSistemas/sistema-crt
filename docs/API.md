# Documentación API - Sistema CRT

## Autenticación

Todas las rutas (excepto login/register) requieren token JWT en el header:

```
Authorization: Bearer <token>
```

## Endpoints

### Autenticación

#### POST /api/auth/login
Iniciar sesión

**Body:**
```json
{
  "email": "admin@crt.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "message": "Login exitoso",
  "user": {
    "id": "user_id",
    "email": "admin@crt.com",
    "name": "Administrador",
    "role": "ADMIN"
  },
  "token": "jwt_token"
}
```

#### POST /api/auth/register
Registrar usuario

#### GET /api/auth/me
Obtener perfil del usuario actual

### Empresas

#### GET /api/empresas
Obtener todas las empresas

#### GET /api/empresas/:id
Obtener empresa por ID

#### POST /api/empresas
Crear nueva empresa (Admin/Técnico-Admin)

**Body:**
```json
{
  "nombre": "Empresa Ejemplo",
  "cuit": "20123456789",
  "direccion": "Av. Ejemplo 123",
  "telefono": "+54 11 1234-5678",
  "email": "contacto@ejemplo.com",
  "esRecurrente": true
}
```

#### PUT /api/empresas/:id
Actualizar empresa (Admin/Técnico-Admin)

#### DELETE /api/empresas/:id
Eliminar empresa (Admin/Técnico-Admin)

### Establecimientos

#### GET /api/establecimientos/empresa/:empresaId
Obtener establecimientos por empresa

#### POST /api/establecimientos
Crear establecimiento (Admin/Técnico-Admin)

#### PUT /api/establecimientos/:id
Actualizar establecimiento (Admin/Técnico-Admin)

#### DELETE /api/establecimientos/:id
Eliminar establecimiento (Admin/Técnico-Admin)

### Personas

#### GET /api/personas/establecimiento/:establecimientoId
Obtener personas por establecimiento

#### POST /api/personas
Crear persona (Admin/Técnico-Admin)

#### PUT /api/personas/:id
Actualizar persona (Admin/Técnico-Admin)

#### DELETE /api/personas/:id
Eliminar persona (Admin/Técnico-Admin)

### Documentos

#### GET /api/documentos
Obtener documentos con filtros

**Query Parameters:**
- `empresaId`: Filtrar por empresa
- `establecimientoId`: Filtrar por establecimiento
- `categoriaId`: Filtrar por categoría
- `tipoDocumentoId`: Filtrar por tipo
- `vencidos`: true/false para documentos vencidos

#### POST /api/documentos
Subir documento (Admin/Técnico/Técnico-Admin)

**Form Data:**
- `archivo`: Archivo PDF
- `nombre`: Nombre del documento
- `descripcion`: Descripción (opcional)
- `categoriaId`: ID de categoría
- `tipoDocumentoId`: ID de tipo de documento
- `empresaId`: ID de empresa (opcional)
- `establecimientoId`: ID de establecimiento (opcional)
- `fechaVencimiento`: Fecha de vencimiento (opcional)
- `personasIds`: Array de IDs de personas (opcional)

#### GET /api/documentos/:id/download
Descargar documento

#### DELETE /api/documentos/:id
Eliminar documento (Admin/Técnico-Admin)

#### GET /api/documentos/stats/dashboard
Obtener estadísticas para dashboard

### Categorías

#### GET /api/categorias
Obtener todas las categorías

#### POST /api/categorias
Crear categoría (Admin/Técnico-Admin)

#### PUT /api/categorias/:id
Actualizar categoría (Admin/Técnico-Admin)

#### DELETE /api/categorias/:id
Eliminar categoría (Admin/Técnico-Admin)

### Tipos de Documento

#### GET /api/tipos-documento
Obtener todos los tipos de documento

#### POST /api/tipos-documento
Crear tipo de documento (Admin/Técnico-Admin)

#### PUT /api/tipos-documento/:id
Actualizar tipo de documento (Admin/Técnico-Admin)

#### DELETE /api/tipos-documento/:id
Eliminar tipo de documento (Admin/Técnico-Admin)

### Usuarios

#### GET /api/users
Obtener todos los usuarios (Solo Admin)

#### PUT /api/users/:id/role
Actualizar rol de usuario (Solo Admin)

## Roles y Permisos

### ADMIN
- Acceso completo a todas las funcionalidades
- Puede gestionar usuarios
- Puede ver todas las empresas y documentos

### LECTOR
- Solo puede ver su empresa asignada
- No puede crear, editar o eliminar

### TECNICO
- Puede subir documentos a cualquier empresa
- Puede ver todas las empresas (para seleccionar al subir)
- No puede editar o eliminar

### TECNICO_ADMIN
- Puede crear, editar y eliminar empresas, establecimientos y personas
- Puede subir documentos
- Puede eliminar documentos
- No puede gestionar usuarios

## Códigos de Estado

- `200`: OK
- `201`: Creado
- `400`: Error de validación
- `401`: No autenticado
- `403`: Sin permisos
- `404`: No encontrado
- `500`: Error interno del servidor

## Ejemplos de Uso

### Subir un documento

```javascript
const formData = new FormData();
formData.append('archivo', pdfFile);
formData.append('nombre', 'Certificado de Capacitación');
formData.append('categoriaId', 'categoria_id');
formData.append('tipoDocumentoId', 'tipo_id');
formData.append('empresaId', 'empresa_id');

const response = await fetch('/api/documentos', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});
```

### Filtrar documentos vencidos

```javascript
const response = await fetch('/api/documentos?vencidos=true', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```