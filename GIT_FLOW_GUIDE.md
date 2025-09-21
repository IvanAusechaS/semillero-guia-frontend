# 🌊 Git Flow Configuration - Semillero GUIA Frontend

Este proyecto utiliza **Git Flow** para la gestión de ramas y releases.

## 🏗️ Estructura de Ramas

### **main** (Producción)
- ✅ Código estable en producción
- ✅ Solo merges desde `develop` o `hotfix`
- ✅ Tagged releases (v1.0.0, v1.1.0, etc.)

### **develop** (Desarrollo)
- 🔄 Rama principal de desarrollo
- 🔄 Integra todas las features completadas
- 🔄 Base para nuevas feature branches

### **feature/** (Nuevas Funcionalidades)
- 🌟 Ramas para desarrollo de nuevas características
- 🌟 Se crean desde `develop`
- 🌟 Se mergen de vuelta a `develop`

**Formato:** `feature/nombre-descriptivo`

**Ejemplos:**
- `feature/user-authentication`
- `feature/project-management-ui`
- `feature/event-calendar`

### **release/** (Preparación de Releases)
- 🚀 Preparación para nueva versión
- 🚀 Bug fixes menores y ajustes de versión
- 🚀 Se crea desde `develop`, se merge a `main` y `develop`

**Formato:** `release/v1.0.0`

### **hotfix/** (Correcciones Urgentes)
- 🔥 Correcciones críticas en producción
- 🔥 Se crea desde `main`
- 🔥 Se merge a `main` y `develop`

**Formato:** `hotfix/critical-bug-fix`

## 📋 Workflow Típico

### **Desarrollo de Nueva Feature**

```bash
# 1. Actualizar develop
git checkout develop
git pull origin develop

# 2. Crear feature branch
git checkout -b feature/nueva-funcionalidad

# 3. Desarrollar y hacer commits
git add .
git commit -m "feat: implementar nueva funcionalidad"

# 4. Push de feature branch
git push -u origin feature/nueva-funcionalidad

# 5. Crear Pull Request en GitHub
# develop ← feature/nueva-funcionalidad

# 6. Después del review y merge, limpiar
git checkout develop
git pull origin develop
git branch -d feature/nueva-funcionalidad
```

### **Preparar Release**

```bash
# 1. Crear release branch desde develop
git checkout develop
git pull origin develop
git checkout -b release/v1.1.0

# 2. Actualizar versión en package.json
# 3. Hacer commits de preparación
git commit -m "chore: bump version to 1.1.0"

# 4. Push release branch
git push -u origin release/v1.1.0

# 5. Crear PR hacia main
# main ← release/v1.1.0

# 6. Después del merge, crear tag
git checkout main
git pull origin main
git tag -a v1.1.0 -m "Release version 1.1.0"
git push origin v1.1.0

# 7. Merge de vuelta a develop
git checkout develop
git merge main
git push origin develop
```

### **Hotfix Urgente**

```bash
# 1. Crear hotfix desde main
git checkout main
git pull origin main
git checkout -b hotfix/critical-fix

# 2. Hacer la corrección
git commit -m "fix: corregir bug crítico"

# 3. Push hotfix
git push -u origin hotfix/critical-fix

# 4. Crear PR hacia main
# main ← hotfix/critical-fix

# 5. Después del merge, hacer también merge a develop
```

## 🏷️ Convenciones de Commits

### **Tipos de Commit**
- `feat:` Nueva funcionalidad
- `fix:` Corrección de bug
- `docs:` Cambios en documentación
- `style:` Cambios de formato (espacios, comas, etc.)
- `refactor:` Refactorización de código
- `test:` Agregar o modificar tests
- `chore:` Cambios en el build process o herramientas

### **Formato de Commit**
```
tipo: descripción breve

Descripción más detallada si es necesario.

- Cambio específico 1
- Cambio específico 2

Closes #123
```

### **Ejemplos de Buenos Commits**
```bash
feat: add user authentication with JWT tokens

- Implement login and logout functionality
- Add AuthContext for state management
- Create protected routes wrapper
- Add JWT token refresh mechanism

Closes #45

fix: resolve navigation menu mobile responsive issue

The hamburger menu was not closing properly on mobile devices
after navigation. Fixed by adding proper event handlers.

Closes #78

docs: update installation guide with MongoDB setup

- Add MongoDB installation steps
- Update environment variables section
- Include troubleshooting guide

chore: update dependencies to latest versions

- React 18.2.0 → 18.3.0
- Vite 4.5.0 → 5.0.0
- Tailwind CSS 3.3.0 → 3.4.0
```

## 🔄 Comandos Útiles

### **Información del Repositorio**
```bash
# Ver todas las ramas
git branch -a

# Ver historial gráfico
git log --oneline --graph --all

# Ver estado del working directory
git status
```

### **Sincronización**
```bash
# Actualizar todas las ramas
git fetch --all

# Sincronizar develop
git checkout develop
git pull origin develop

# Sincronizar main
git checkout main
git pull origin main
```

### **Limpieza**
```bash
# Eliminar ramas locales ya mergeadas
git branch --merged develop | grep -v develop | xargs git branch -d

# Eliminar referencias a ramas remotas eliminadas
git remote prune origin
```

## 📋 Checklist para Pull Requests

### **Antes de crear PR**
- [ ] Código actualizado con la última versión de develop
- [ ] Tests pasando (cuando los tengamos implementados)
- [ ] Linting sin errores (`npm run lint`)
- [ ] Build exitoso (`npm run build`)
- [ ] Documentación actualizada si es necesario

### **Información del PR**
- [ ] Título descriptivo
- [ ] Descripción detallada de los cambios
- [ ] Screenshots si hay cambios visuales
- [ ] Referencias a issues relacionados
- [ ] Reviewer asignado

### **Ejemplo de Template para PR**
```markdown
## 📋 Descripción
Breve descripción de los cambios realizados.

## 🔧 Tipo de Cambio
- [ ] Bug fix (cambio que corrige un issue)
- [ ] Nueva feature (cambio que agrega funcionalidad)
- [ ] Breaking change (cambio que podría romper funcionalidad existente)
- [ ] Documentación

## ✅ Testing
- [ ] Tests pasando
- [ ] Funcionalidad testeada manualmente
- [ ] Responsive design verificado

## 📸 Screenshots
Si hay cambios visuales, incluir screenshots.

## 📝 Notas Adicionales
Cualquier información adicional para los reviewers.
```

## 🎯 Estado Actual

**Rama Actual:** `feature/initial-setup`
**Último Commit:** Configuración inicial completa con migración MongoDB
**Próximos Pasos:**
1. Testing de funcionalidades
2. Optimizaciones de rendimiento
3. Documentación adicional
4. Preparar primer release v1.0.0

---

**¡Git Flow configurado y listo para el desarrollo colaborativo!** 🚀