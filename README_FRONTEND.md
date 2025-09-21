# 🧠 Semillero GUIA - Frontend

Frontend del Semillero de Investigación en Inteligencia Artificial de la Universidad del Valle.

## 🚀 Características

- **Dashboard interactivo** con estadísticas y resumen de actividades
- **Gestión de proyectos** con sistema de participación y seguimiento
- **Sistema de asignaciones** para estudiantes con envío de tareas
- **Calendario de eventos** con registro automático
- **Biblioteca de recursos** con sistema de búsqueda y categorización
- **Autenticación segura** con JWT y roles de usuario
- **Interfaz responsiva** optimizada para dispositivos móviles
- **Animaciones fluidas** con Framer Motion

## 🛠️ Tecnologías

- **React 18** con Hooks
- **Vite** como bundler y dev server
- **Tailwind CSS** para estilos
- **Framer Motion** para animaciones
- **React Router** para navegación
- **Axios** para peticiones HTTP
- **React Hook Form** para formularios
- **Lucide React** para iconos

## 📋 Migración MongoDB

El proyecto ha sido actualizado para trabajar con MongoDB en lugar de SQLite:

### Cambios principales:
- ✅ **IDs**: Cambio de `id` a `_id` (ObjectIds de MongoDB)
- ✅ **API Service**: Nuevo servicio con validación de ObjectIds
- ✅ **Proyectos**: Sistema completo de gestión de proyectos
- ✅ **Asignaciones**: Sistema de tareas con envío de archivos
- ✅ **Dashboard**: Vista consolidada con estadísticas
- ✅ **Navegación**: Menús actualizados para usuarios logueados

### Nuevos modelos soportados:
- **User** (actualizado con nuevos campos)
- **Project** (nuevo modelo completo)
- **Assignment** (nuevo sistema de tareas)
- **Submission** (envío de tareas)
- **Event** (actualizado)
- **Resource** (actualizado)

## 🔧 Instalación y Desarrollo

### Prerrequisitos
- Node.js 18+ 
- npm o yarn
- Backend de Semillero GUIA ejecutándose

### Configuración

1. **Clonar el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd frontend
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   # Copiar archivo de ejemplo
   cp .env.example .env
   
   # Editar .env con tu configuración
   VITE_API_URL=http://localhost:4000
   ```

4. **Ejecutar en desarrollo**
   ```bash
   npm run dev
   ```

   La aplicación estará disponible en `http://localhost:3000`

### Scripts disponibles

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview

# Linting
npm run lint

# Build para Vercel
npm run vercel-build
```

## 🌐 Despliegue en Vercel

### Configuración automática

1. **Conectar repositorio** en Vercel
2. **Configurar variables de entorno**:
   ```
   VITE_API_URL=https://tu-backend-url.herokuapp.com
   ```
3. **Deploy automático** en cada push a main

### Configuración manual

1. **Instalar Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel --prod
   ```

### Variables de entorno requeridas en Vercel:
- `VITE_API_URL`: URL del backend en producción

## 📁 Estructura del proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── Navbar.jsx      # Navegación principal
│   ├── Footer.jsx      # Footer del sitio
│   ├── ProjectCard.jsx # Tarjeta de proyecto
│   ├── ProjectList.jsx # Lista de proyectos
│   └── LoadingSpinner.jsx # Spinner de carga
├── pages/              # Páginas principales
│   ├── Home.jsx        # Página de inicio
│   ├── Dashboard.jsx   # Dashboard de usuario
│   ├── Projects.jsx    # Lista de proyectos
│   ├── ProjectDetail.jsx # Detalle de proyecto
│   ├── ProjectForm.jsx # Formulario de proyecto
│   ├── AssignmentList.jsx # Lista de asignaciones
│   ├── AssignmentDetail.jsx # Detalle de asignación
│   ├── Login.jsx       # Página de login
│   └── Register.jsx    # Página de registro
├── context/            # Context de React
│   └── AuthContext.jsx # Contexto de autenticación
├── services/           # Servicios de API
│   └── api.js         # Cliente HTTP configurado
├── utils/              # Utilidades
│   └── mongodb.js     # Helpers para MongoDB
└── App.jsx            # Componente principal
```

## 🔐 Autenticación y Roles

### Roles de usuario:
- **Estudiante**: Puede ver proyectos, unirse, ver tareas asignadas
- **Docente**: Puede crear proyectos, asignar tareas, calificar
- **Admin**: Acceso completo al sistema

### Funcionalidades por rol:

| Funcionalidad | Estudiante | Docente | Admin |
|--------------|------------|---------|-------|
| Ver proyectos | ✅ | ✅ | ✅ |
| Unirse a proyectos | ✅ | ✅ | ✅ |
| Crear proyectos | ❌ | ✅ | ✅ |
| Crear asignaciones | ❌ | ✅ | ✅ |
| Calificar envíos | ❌ | ✅ | ✅ |
| Gestionar usuarios | ❌ | ❌ | ✅ |

## 🎨 Diseño y UX

### Paleta de colores:
- **Primario**: Gradiente azul/violeta (`#667eea` → `#764ba2`)
- **Secundario**: Grises (`#gray-50` → `#gray-900`)
- **Acentos**: Verde para éxito, rojo para errores, amarillo para advertencias

### Componentes de UI:
- **Cards**: Tarjetas con sombras suaves y hover effects
- **Buttons**: Gradientes con transiciones fluidas
- **Forms**: Campos con focus states y validación visual
- **Navigation**: Menú responsive con animaciones

### Responsive Design:
- **Mobile First**: Diseñado primero para móviles
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Grid System**: CSS Grid y Flexbox para layouts

## 🧪 Testing

### Recomendaciones para testing:

1. **Componentes principales**:
   - ProjectCard rendering
   - Navigation con diferentes roles
   - Formularios de autenticación

2. **Servicios de API**:
   - Validación de ObjectIds
   - Manejo de errores HTTP
   - Transformación de respuestas

3. **Flujos de usuario**:
   - Login/logout completo
   - Creación y unión a proyectos
   - Envío de asignaciones

## 🔧 Configuración adicional

### Tailwind CSS
El proyecto utiliza Tailwind con configuración personalizada en `tailwind.config.js`:
- Colores extendidos para gradientes
- Fuentes personalizadas
- Animaciones adicionales

### Vite Configuration
Configuración optimizada en `vite.config.js`:
- Proxy para desarrollo local
- Build optimizado para producción
- Source maps habilitados

## 📞 Soporte y Contribución

### Reportar issues:
1. Usar el template de issue del repositorio
2. Incluir pasos para reproducir
3. Especificar navegador y versión

### Contribuir:
1. Fork del repositorio
2. Crear branch feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit con mensajes descriptivos
4. Pull request con descripción detallada

## 📄 Licencia

Este proyecto es para uso académico del Semillero GUIA - Universidad del Valle.

---

**Desarrollado con ❤️ para el Semillero GUIA**