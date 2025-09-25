# 🚀 Configuración GitHub - Sistema CRT

## Pasos para crear el repositorio en GitHub

### 1. Crear repositorio en GitHub
1. Ve a [GitHub.com](https://github.com)
2. Haz clic en el botón "+" en la esquina superior derecha
3. Selecciona "New repository"
4. Configura el repositorio:
   - **Repository name**: `sistema-crt`
   - **Description**: `Sistema web para gestión de documentación PDF - Consultora de Riesgos del Trabajo`
   - **Visibility**: Private (recomendado) o Public
   - **NO** marques "Add a README file" (ya tenemos uno)
   - **NO** marques "Add .gitignore" (ya tenemos uno)
   - **NO** marques "Choose a license" (ya tenemos uno)

### 2. Conectar repositorio local con GitHub

Una vez creado el repositorio, ejecuta estos comandos en tu terminal:

```bash
# Agregar el remote origin (reemplaza TU-USUARIO con tu usuario de GitHub)
git remote add origin https://github.com/TU-USUARIO/sistema-crt.git

# Subir el código
git push -u origin main
```

### 3. Verificar que se subió correctamente

Ve a tu repositorio en GitHub y deberías ver:
- ✅ 51 archivos subidos
- ✅ README.md con la documentación
- ✅ Estructura de carpetas backend/ y frontend/
- ✅ Documentación en docs/
- ✅ Configuración Docker

## 📋 Checklist Post-Upload

Después de subir a GitHub, verifica:

- [ ] README.md se muestra correctamente
- [ ] Estructura de carpetas está completa
- [ ] .gitignore está funcionando (no hay node_modules/ ni .env)
- [ ] Documentación en docs/ es accesible
- [ ] GitHub Actions workflow está configurado

## 🔧 Variables de Entorno para Producción

Para deployment en producción, configura estas variables:

### Backend
```env
DATABASE_URL=postgresql://usuario:password@postgres:5432/sistema_crt
JWT_SECRET=tu-clave-super-secreta-para-produccion
NODE_ENV=production
PORT=3001
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
```

### Frontend
```env
VITE_API_URL=https://tu-dominio.com/api
```

## 🚀 Próximos Pasos

1. **Crear repositorio en GitHub** ✅
2. **Subir código** ✅
3. **Configurar servidor de producción**
4. **Probar deployment**
5. **Configurar dominio personalizado**

## 📞 Soporte

Si tienes problemas:
1. Verifica que Git esté configurado correctamente
2. Asegúrate de tener permisos en el repositorio
3. Revisa que el remote origin esté configurado correctamente

```bash
# Verificar configuración
git remote -v
git status
```