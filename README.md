# 🧠 Semillero GUIA Frontend

[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black.svg)](https://vercel.com)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-green.svg)](https://mongodb.com)

Frontend moderno del **Semillero GUIA** (Grupo Universitario de Inteligencia Artificial), una plataforma web completa para la gestión de proyectos de investigación, asignaciones académicas, eventos y recursos educativos en el campo de la inteligencia artificial.

## 🆕 Novedades de la Migración

Este frontend ha sido completamente migrado para trabajar con **MongoDB** y incluye nuevas funcionalidades:

### ✨ **Nuevas Características**
- 🏗️ **Sistema de Gestión de Proyectos** - CRUD completo con equipos y asignaciones
- 📝 **Sistema de Asignaciones** - Tareas, entregas y seguimiento de progreso
- 📊 **Dashboard Intuitivo** - Resumen personalizado por rol de usuario
- 🔄 **Arquitectura MongoDB** - Optimizada para escalabilidad y rendimiento
- 🚀 **Despliegue en Vercel** - Configuración completa para producción

### 🔧 **Mejoras Técnicas**
- **API Service Layer** - Capa de servicios robusta con manejo de errores
- **MongoDB ObjectIDs** - Soporte completo para identificadores MongoDB
- **Validación Avanzada** - Validación tanto en frontend como backend
- **Sistema de Roles** - Estudiante, Profesor, Administrador
- **Autenticación JWT** - Tokens seguros con renovación automática

## 🚀 Tecnologías y Stack

### **Frontend Core**
- **React 18** - Biblioteca principal con hooks modernos
- **Vite 5** - Build tool ultrarrápido para desarrollo y producción
- **Tailwind CSS 3** - Framework de utilidades CSS moderno
- **Framer Motion** - Animaciones fluidas y transiciones

### **Estado y Datos**
- **React Context** - Gestión de estado global para autenticación
- **Axios** - Cliente HTTP con interceptores y manejo de errores
- **MongoDB ObjectIDs** - Soporte nativo para identificadores MongoDB

### **Herramientas de Desarrollo**
- **ESLint** - Linting y análisis de código
- **PostCSS** - Procesamiento avanzado de CSS
- **Vercel CLI** - Herramientas de despliegue

## 🏗️ Arquitectura del Proyecto

```
src/
├── components/              # Componentes reutilizables
│   ├── project/            # Sistema de proyectos
│   │   ├── ProjectCard.jsx     # Tarjeta de proyecto
│   │   ├── ProjectList.jsx     # Lista de proyectos
│   │   ├── ProjectDetail.jsx   # Detalles del proyecto
│   │   └── ProjectForm.jsx     # Formulario de proyecto
│   ├── assignment/         # Sistema de asignaciones
│   │   ├── AssignmentList.jsx  # Lista de asignaciones
│   │   └── AssignmentDetail.jsx # Detalles de asignación
│   ├── common/             # Componentes comunes
│   │   ├── Footer.jsx          # Pie de página
│   │   └── Navbar.jsx          # Navegación principal
│   └── dashboard/          # Dashboard
│       └── Dashboard.jsx       # Panel principal
├── context/                # Contextos React
│   └── AuthContext.jsx         # Gestión de autenticación
├── pages/                  # Páginas principales
│   ├── About.jsx              # Acerca de
│   ├── Contact.jsx            # Contacto
│   ├── Events.jsx             # Eventos
│   ├── Forum.jsx              # Foro
│   ├── Home.jsx               # Página principal
│   ├── Login.jsx              # Inicio de sesión
│   ├── Projects.jsx           # Gestión de proyectos
│   ├── Register.jsx           # Registro
│   ├── Resources.jsx          # Recursos
│   └── Team.jsx               # Equipo
├── services/               # Servicios API
│   ├── api.js                 # Cliente API principal
│   └── mongodb.js             # Utilidades MongoDB
├── App.jsx                 # Componente raíz
├── index.css              # Estilos globales
└── main.jsx               # Punto de entrada
```

## 🛠️ Instalación y Configuración

### **Prerrequisitos**
- **Node.js** 18+ 
- **npm** 9+ o **yarn** 1.22+
- **Backend MongoDB** ejecutándose

### **Instalación Rápida**

```bash
# 1. Clonar repositorio
git clone [URL_REPOSITORIO]
cd frontend

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con tu configuración

# 4. Ejecutar en desarrollo
npm run dev
```

### **Variables de Entorno**

Crear `.env` en la raíz:

```env
# 🔗 API Configuration
VITE_API_URL=http://localhost:3000/api

# 🔒 Security (opcional para desarrollo)
VITE_JWT_SECRET=your-jwt-secret

# 🌐 Environment
VITE_NODE_ENV=development
```

## 📦 Scripts de Desarrollo

```bash
# 🚀 Desarrollo
npm run dev          # Servidor de desarrollo (puerto 5173)
npm run dev:host     # Desarrollo con acceso de red

# 🏗️ Construcción
npm run build        # Build para producción
npm run preview      # Preview del build

# 🔍 Calidad de Código
npm run lint         # Ejecutar ESLint
npm run lint:fix     # Arreglar problemas automáticamente

# 🧹 Mantenimiento
npm run clean        # Limpiar cache y node_modules
npm audit fix        # Arreglar vulnerabilidades
```

## 🚀 Despliegue en Vercel

### **Método 1: Scripts Automatizados**

**Windows (Batch):**
```bash
./deploy.bat
```

**Windows (PowerShell):**
```powershell
./deploy.ps1
# Con opciones:
./deploy.ps1 -Production
./deploy.ps1 -SkipLint -ApiUrl "https://tu-api.com"
```

**Linux/Mac:**
```bash
./deploy.sh
```

### **Método 2: Manual**

```bash
# 1. Instalar Vercel CLI
npm install -g vercel

# 2. Login en Vercel
vercel login

# 3. Configurar proyecto
vercel

# 4. Desplegar
vercel --prod
```

### **Variables de Entorno en Vercel**

Configurar en el dashboard de Vercel:

| Variable | Valor | Descripción |
|----------|-------|-------------|
| `VITE_API_URL` | `https://tu-backend.com/api` | URL del backend en producción |
| `VITE_NODE_ENV` | `production` | Entorno de ejecución |

## 🎨 Características de la UI/UX

### **🎭 Diseño Moderno**
- **Responsive Design** - Optimizado para móvil, tablet y desktop
- **Dark Mode Ready** - Preparado para modo oscuro
- **Gradientes Modernos** - Esquema de colores atractivo
- **Iconografía Coherente** - Lucide React icons

### **⚡ Rendimiento**
- **Code Splitting** - Carga optimizada de componentes
- **Lazy Loading** - Carga diferida de imágenes y rutas
- **Bundle Optimization** - Build optimizado para producción
- **Fast Refresh** - Desarrollo con recarga instantánea

### **🔧 Funcionalidades Avanzadas**
- **Manejo de Estados** - Context API para estado global
- **Validación de Formularios** - Validación en tiempo real
- **Notificaciones** - Sistema de alertas y notificaciones
- **Paginación** - Lista paginada para grandes datasets

## 📚 Funcionalidades por Módulo

### 🏠 **Dashboard**
- 📊 Estadísticas personalizadas por rol
- 📋 Lista de tareas pendientes
- 📅 Próximos eventos
- 🚀 Accesos rápidos a funcionalidades

### 🏗️ **Sistema de Proyectos**
- ➕ Crear y editar proyectos de investigación
- 👥 Gestión de equipos y colaboradores
- 🏷️ Sistema de etiquetas y categorías
- 📈 Seguimiento de progreso
- 💬 Comentarios y discusiones

### 📝 **Sistema de Asignaciones**
- 📋 Crear asignaciones con fechas límite
- 📎 Subida de archivos y entregables
- ⭐ Sistema de prioridades
- 📊 Seguimiento de progreso
- ✅ Evaluaciones y retroalimentación

### 📅 **Gestión de Eventos**
- 📆 Calendario interactivo
- 🎫 Sistema de inscripciones
- 🏷️ Categorización de eventos
- 📧 Notificaciones automáticas

### 👥 **Gestión de Usuarios**
- 🔐 Autenticación JWT segura
- 👤 Perfiles personalizables
- 🎭 Sistema de roles (Estudiante, Profesor, Admin)
- 🔄 Renovación automática de tokens

### 📖 **Recursos Educativos**
- 📚 Biblioteca de recursos
- 🔍 Búsqueda avanzada
- 📁 Organización por categorías
- ⭐ Sistema de favoritos

## 🔐 Seguridad y Autenticación

### **🛡️ Características de Seguridad**
- **JWT Tokens** - Autenticación stateless
- **Renovación Automática** - Tokens refreshed automáticamente
- **Roles y Permisos** - Control de acceso granular
- **Validación de Entrada** - Sanitización de datos
- **HTTPS Ready** - Configurado para conexiones seguras

### **👥 Tipos de Usuario**

| Rol | Permisos | Funcionalidades |
|-----|----------|-----------------|
| **Estudiante** | Básicos | Ver proyectos, unirse a equipos, completar asignaciones |
| **Profesor** | Moderador | Crear proyectos, asignar tareas, evaluar entregas |
| **Administrador** | Completos | Gestión total del sistema, usuarios, configuración |

## 🔧 API Integration

### **🌐 Servicios Disponibles**

```javascript
// Ejemplos de uso de la API

// Autenticación
const user = await authService.login(email, password);
const profile = await authService.getProfile();

// Proyectos
const projects = await projectService.getAll();
const project = await projectService.create(projectData);
await projectService.joinProject(projectId);

// Asignaciones
const assignments = await assignmentService.getByProject(projectId);
await assignmentService.submitAssignment(assignmentId, data);

// Eventos
const events = await eventService.getUpcoming();
await eventService.register(eventId);
```

### **🔄 Manejo de Errores**

La aplicación incluye manejo robusto de errores:
- **Network Errors** - Retry automático con backoff
- **Authentication Errors** - Redirect automático al login
- **Validation Errors** - Mensajes de usuario amigables
- **Server Errors** - Fallbacks y notificaciones

## 🧪 Testing y Calidad

### **📋 Lista de Verificación**

- [ ] **Funcionalidad**
  - [ ] Registro y login funcionando
  - [ ] CRUD de proyectos completo
  - [ ] Sistema de asignaciones operativo
  - [ ] Dashboard mostrando datos correctos

- [ ] **UI/UX**
  - [ ] Responsive en móvil y desktop
  - [ ] Navegación intuitiva
  - [ ] Formularios con validación
  - [ ] Notificaciones funcionando

- [ ] **Performance**
  - [ ] Tiempo de carga < 3 segundos
  - [ ] Imágenes optimizadas
  - [ ] Bundle size < 500KB
  - [ ] Lazy loading activo

## 🤝 Contribución

### **🔄 Workflow de Desarrollo**

1. **Fork** el proyecto
2. **Crear branch** feature (`git checkout -b feature/nueva-funcionalidad`)
3. **Commits** descriptivos (`git commit -m 'feat: agregar sistema de notificaciones'`)
4. **Push** al branch (`git push origin feature/nueva-funcionalidad`)
5. **Pull Request** con descripción detallada

### **📝 Convenciones**

```javascript
// 📁 Naming conventions
- Componentes: PascalCase (ProjectCard.jsx)
- Funciones: camelCase (getUserProjects)
- Constantes: UPPER_SNAKE_CASE (API_ENDPOINTS)
- Archivos: kebab-case (user-profile.css)

// 🏷️ Commit messages
feat: nueva funcionalidad
fix: corrección de bug
docs: actualización de documentación
style: cambios de formato
refactor: refactorización de código
test: agregado de tests
```

## 📄 Licencia

Este proyecto está bajo la **Licencia MIT**. Ver `LICENSE` para más detalles.

## 📞 Soporte y Contacto

### **🆘 Obtener Ayuda**

- **Issues**: Reportar bugs en GitHub Issues
- **Discusiones**: Participar en GitHub Discussions  
- **Email**: semillero.guia@universidad.edu
- **Discord**: [Servidor del Semillero GUIA]

### **📚 Recursos Adicionales**

- [📖 Documentación del Backend](../backend/README.md)
- [🔧 Guía de Migración](./MIGRATION_SUMMARY.md)
- [🚀 Guía de Despliegue](./FRONTEND_MIGRATION_GUIDE.md)
- [📋 Changelog](./CHANGELOG.md)

---

**🎯 ¡El futuro de la IA empieza aquí!** 🚀

*Desarrollado con ❤️ por el Semillero GUIA*