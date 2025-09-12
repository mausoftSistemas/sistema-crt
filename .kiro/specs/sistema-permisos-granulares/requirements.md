# Requirements Document - Sistema de Permisos Granulares

## Introduction

El sistema actual de roles predefinidos (ADMIN, LECTOR, TECNICO, TECNICO_ADMIN) será extendido con un sistema de permisos granulares que permita al administrador crear roles personalizados para cada usuario. Cada usuario podrá tener permisos específicos sobre cada tabla/entidad del sistema (leer, crear, modificar, eliminar) configurables mediante checkboxes en la interfaz de administración.

## Requirements

### Requirement 1: Roles Predefinidos Base

**User Story:** Como administrador del sistema, quiero mantener los roles predefinidos existentes como plantillas base, para poder asignar rápidamente permisos comunes sin tener que configurar cada permiso individualmente.

#### Acceptance Criteria

1. WHEN el sistema se inicializa THEN SHALL mantener los 4 roles predefinidos existentes (ADMIN, LECTOR, TECNICO, TECNICO_ADMIN)
2. WHEN se selecciona un rol predefinido THEN SHALL aplicar automáticamente el conjunto de permisos correspondiente
3. WHEN se aplica un rol predefinido THEN SHALL permitir modificar los permisos individuales posteriormente
4. IF un usuario tiene rol ADMIN THEN SHALL tener todos los permisos habilitados por defecto
5. IF un usuario tiene rol LECTOR THEN SHALL tener solo permisos de lectura en su empresa asignada
6. IF un usuario tiene rol TECNICO THEN SHALL tener permisos de lectura y creación de documentos
7. IF un usuario tiene rol TECNICO_ADMIN THEN SHALL tener permisos de lectura, creación, modificación y eliminación excepto gestión de usuarios

### Requirement 2: Sistema de Permisos Granulares por Entidad

**User Story:** Como administrador del sistema, quiero poder configurar permisos específicos para cada tabla/entidad del sistema (empresas, establecimientos, personas, documentos, categorías, tipos de documento, usuarios), para tener control granular sobre qué puede hacer cada usuario.

#### Acceptance Criteria

1. WHEN accedo a la configuración de permisos de un usuario THEN SHALL mostrar una matriz de permisos con todas las entidades del sistema
2. WHEN configuro permisos THEN SHALL poder seleccionar para cada entidad: Leer, Crear, Modificar, Eliminar
3. WHEN guardo la configuración THEN SHALL validar que al menos tenga permiso de lectura en alguna entidad
4. IF un usuario no tiene permiso de lectura en una entidad THEN SHALL ocultar esa sección en la interfaz
5. IF un usuario no tiene permiso de creación THEN SHALL ocultar los botones de "Nuevo/Crear"
6. IF un usuario no tiene permiso de modificación THEN SHALL deshabilitar los botones de "Editar"
7. IF un usuario no tiene permiso de eliminación THEN SHALL ocultar los botones de "Eliminar"
8. WHEN se modifica un permiso THEN SHALL aplicar los cambios inmediatamente en la próxima sesión del usuario

### Requirement 3: Interfaz de Configuración de Permisos

**User Story:** Como administrador del sistema, quiero una interfaz visual intuitiva con checkboxes para configurar los permisos de cada usuario, para poder gestionar fácilmente qué puede hacer cada persona en el sistema.

#### Acceptance Criteria

1. WHEN accedo a la gestión de usuarios THEN SHALL mostrar una columna adicional "Configurar Permisos"
2. WHEN hago clic en "Configurar Permisos" THEN SHALL abrir un modal con la matriz de permisos
3. WHEN veo la matriz de permisos THEN SHALL mostrar las entidades en filas y los permisos (CRUD) en columnas
4. WHEN marco/desmarco un checkbox THEN SHALL actualizar visualmente el estado inmediatamente
5. WHEN marco "Leer" THEN SHALL habilitar automáticamente los checkboxes dependientes si están marcados
6. WHEN desmarco "Leer" THEN SHALL desmarcar automáticamente todos los otros permisos de esa entidad
7. WHEN guardo los cambios THEN SHALL mostrar un mensaje de confirmación
8. WHEN cancelo los cambios THEN SHALL restaurar el estado anterior

### Requirement 4: Validación y Lógica de Dependencias

**User Story:** Como administrador del sistema, quiero que el sistema valide automáticamente las dependencias entre permisos, para evitar configuraciones inválidas que puedan causar errores en el sistema.

#### Acceptance Criteria

1. WHEN intento habilitar "Crear" sin "Leer" THEN SHALL habilitar automáticamente "Leer"
2. WHEN intento habilitar "Modificar" sin "Leer" THEN SHALL habilitar automáticamente "Leer"
3. WHEN intento habilitar "Eliminar" sin "Leer" THEN SHALL habilitar automáticamente "Leer"
4. WHEN deshabilito "Leer" THEN SHALL deshabilitar automáticamente "Crear", "Modificar" y "Eliminar"
5. WHEN un usuario no tiene permisos de lectura en ninguna entidad THEN SHALL mostrar mensaje de error
6. WHEN guardo permisos inválidos THEN SHALL mostrar mensaje de error específico
7. IF un usuario pierde acceso a su empresa asignada THEN SHALL mantener acceso de solo lectura al dashboard
8. WHEN se elimina una entidad del sistema THEN SHALL limpiar automáticamente los permisos relacionados

### Requirement 5: Aplicación de Permisos en Backend

**User Story:** Como desarrollador del sistema, quiero que todos los endpoints de la API validen los permisos granulares del usuario, para garantizar que solo puedan realizar las acciones permitidas según su configuración.

#### Acceptance Criteria

1. WHEN un usuario hace una petición GET THEN SHALL verificar permiso de "Leer" en la entidad correspondiente
2. WHEN un usuario hace una petición POST THEN SHALL verificar permiso de "Crear" en la entidad correspondiente
3. WHEN un usuario hace una petición PUT/PATCH THEN SHALL verificar permiso de "Modificar" en la entidad correspondiente
4. WHEN un usuario hace una petición DELETE THEN SHALL verificar permiso de "Eliminar" en la entidad correspondiente
5. IF un usuario no tiene el permiso requerido THEN SHALL retornar error 403 Forbidden
6. WHEN se validan permisos THEN SHALL considerar también las restricciones por empresa (para lectores)
7. WHEN un usuario ADMIN hace cualquier petición THEN SHALL permitir todas las acciones sin validación adicional
8. WHEN se actualiza un permiso THEN SHALL invalidar la sesión actual para forzar recarga de permisos

### Requirement 6: Interfaz Adaptativa según Permisos

**User Story:** Como usuario del sistema, quiero que la interfaz se adapte automáticamente a mis permisos, mostrando solo las opciones y botones que puedo usar, para tener una experiencia clara y sin confusiones.

#### Acceptance Criteria

1. WHEN cargo una página THEN SHALL mostrar solo las secciones donde tengo permiso de lectura
2. WHEN veo una lista de registros THEN SHALL mostrar botones de acción solo si tengo los permisos correspondientes
3. WHEN no tengo permiso de creación THEN SHALL ocultar todos los botones "Nuevo", "Agregar", "Crear"
4. WHEN no tengo permiso de modificación THEN SHALL ocultar todos los botones "Editar", "Modificar"
5. WHEN no tengo permiso de eliminación THEN SHALL ocultar todos los botones "Eliminar", "Borrar"
6. WHEN accedo al menú lateral THEN SHALL mostrar solo las secciones donde tengo al menos permiso de lectura
7. IF no tengo acceso a ninguna sección THEN SHALL mostrar mensaje informativo y opción de contactar administrador
8. WHEN mis permisos cambian THEN SHALL actualizar la interfaz en la próxima carga de página

### Requirement 7: Auditoría y Logs de Permisos

**User Story:** Como administrador del sistema, quiero poder ver un historial de cambios de permisos y acciones realizadas por cada usuario, para mantener un control de auditoría y seguridad del sistema.

#### Acceptance Criteria

1. WHEN se modifican los permisos de un usuario THEN SHALL registrar en log: usuario modificado, admin que hizo el cambio, fecha/hora, permisos anteriores y nuevos
2. WHEN un usuario intenta una acción sin permisos THEN SHALL registrar en log: usuario, acción intentada, fecha/hora, IP
3. WHEN se accede a la auditoría THEN SHALL mostrar filtros por usuario, fecha, tipo de acción
4. WHEN se exporta el log de auditoría THEN SHALL generar archivo CSV con todos los registros filtrados
5. WHEN se consulta el historial de un usuario THEN SHALL mostrar cronología de cambios de permisos
6. WHEN se detecta actividad sospechosa THEN SHALL generar alerta para el administrador
7. IF el log supera cierto tamaño THEN SHALL archivar registros antiguos automáticamente
8. WHEN se elimina un usuario THEN SHALL mantener su historial de auditoría por tiempo definido

### Requirement 8: Migración de Roles Existentes

**User Story:** Como administrador del sistema, quiero que los usuarios existentes con roles predefinidos mantengan sus permisos actuales cuando se implemente el nuevo sistema, para no interrumpir el funcionamiento actual.

#### Acceptance Criteria

1. WHEN se ejecuta la migración THEN SHALL convertir automáticamente los roles existentes a permisos granulares
2. WHEN un usuario tiene rol ADMIN THEN SHALL asignar todos los permisos en todas las entidades
3. WHEN un usuario tiene rol LECTOR THEN SHALL asignar solo permisos de lectura en su empresa
4. WHEN un usuario tiene rol TECNICO THEN SHALL asignar permisos de lectura en todas las entidades y creación en documentos
5. WHEN un usuario tiene rol TECNICO_ADMIN THEN SHALL asignar permisos CRUD excepto gestión de usuarios
6. WHEN se completa la migración THEN SHALL mantener el campo 'role' como referencia pero usar el sistema de permisos
7. IF falla la migración THEN SHALL mantener el sistema de roles anterior como fallback
8. WHEN se verifica la migración THEN SHALL confirmar que todos los usuarios mantienen sus accesos actuales

## Entidades del Sistema

Las siguientes entidades tendrán permisos configurables:

1. **Empresas** - Gestión de empresas del sistema
2. **Establecimientos** - Gestión de establecimientos por empresa
3. **Personas** - Gestión de personal por establecimiento
4. **Documentos** - Gestión de archivos PDF y metadatos
5. **Categorías** - Gestión de categorías de documentos
6. **Tipos de Documento** - Gestión de tipos de documentos
7. **Usuarios** - Gestión de usuarios del sistema (solo ADMIN por defecto)
8. **Dashboard** - Acceso a estadísticas y reportes

## Permisos por Entidad

Para cada entidad, los permisos disponibles son:

- **Leer (R)** - Ver registros de la entidad
- **Crear (C)** - Agregar nuevos registros
- **Modificar (U)** - Editar registros existentes
- **Eliminar (D)** - Borrar registros

## Matriz de Permisos por Rol Predefinido

| Entidad | ADMIN | LECTOR | TECNICO | TECNICO_ADMIN |
|---------|-------|--------|---------|---------------|
| Empresas | CRUD | R (solo su empresa) | R | CRUD |
| Establecimientos | CRUD | R (solo su empresa) | R | CRUD |
| Personas | CRUD | R (solo su empresa) | R | CRUD |
| Documentos | CRUD | R (solo su empresa) | CR | CRUD |
| Categorías | CRUD | R | R | CRUD |
| Tipos Documento | CRUD | R | R | CRUD |
| Usuarios | CRUD | - | - | - |
| Dashboard | CRUD | R (solo su empresa) | R | CRUD |