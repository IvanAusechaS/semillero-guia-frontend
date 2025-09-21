# 🚀 Semillero GUIA - Frontend

Frontend del sitio web oficial del **Semillero de Investigación en Inteligencia Artificial (Semillero GUIA)** de la Universidad del Valle.

## 📋 Descripción

Aplicación web moderna y responsive desarrollada con React, Vite y TailwindCSS que presenta información sobre el semillero, permite el registro de usuarios y proporciona un sistema de foro para la gestión de tareas y proyectos.

## 🛠️ Tecnologías

- **Framework:** React 18
- **Build Tool:** Vite
- **Estilos:** TailwindCSS
- **Animaciones:** Framer Motion
- **Routing:** React Router DOM
- **Forms:** React Hook Form
- **HTTP Client:** Axios
- **Notificaciones:** React Hot Toast
- **Icons:** Lucide React

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js 18 o superior
- npm o yarn

### Instalación Local

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/semillero-guia-frontend.git
   cd semillero-guia-frontend
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp .env.example .env
   ```
   
   Editar `.env` con las configuraciones necesarias:
   ```env
   VITE_API_URL=http://localhost:4000
   VITE_APP_NAME="Semillero GUIA"
   VITE_APP_VERSION="1.0.0"
   ```

4. **Ejecutar en modo desarrollo**
   ```bash
   npm run dev
   ```
   
   La aplicación estará disponible en `http://localhost:3000`

## 🐳 Docker

### Desarrollo con Docker

```bash
# Construir imagen
docker build -t semillero-guia-frontend .

# Ejecutar contenedor
docker run -p 3000:3000 -v $(pwd):/app semillero-guia-frontend
```

### Docker Compose (Recomendado)

```bash
# Desde el directorio raíz del proyecto
docker-compose up frontend
```

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── Navbar.jsx      # Navegación principal
│   └── Footer.jsx      # Pie de página
├── context/            # Context API de React
│   └── AuthContext.jsx # Contexto de autenticación
├── pages/              # Páginas de la aplicación
│   ├── Home.jsx        # Página de inicio
│   ├── About.jsx       # Quiénes somos
│   ├── Team.jsx        # Equipo
│   ├── Projects.jsx    # Nuestro trabajo
│   ├── Resources.jsx   # Recursos
│   ├── Events.jsx      # Eventos
│   ├── Contact.jsx     # Contacto
│   ├── Login.jsx       # Inicio de sesión
│   ├── Register.jsx    # Registro
│   └── Forum.jsx       # Foro/Tareas
├── App.jsx             # Componente principal
├── main.jsx           # Punto de entrada
└── index.css          # Estilos globales
```

## 🎨 Diseño y Características

### Identidad Visual
- **Colores:** Azul (#3B82F6), Rojo (#EF4444), Morado (#8B5CF6)
- **Tipografías:** 
  - Títulos: Poppins, Montserrat, Orbitron
  - Texto: Roboto, Open Sans
- **Gradientes suaves** y **animaciones llamativas**

### Características Principales
- ✅ **Diseño responsive** (móvil, tablet, desktop)
- ✅ **Animaciones suaves** con Framer Motion
- ✅ **Accesibilidad** (contraste, alt text, navegación)
- ✅ **Performance optimizada**
- ✅ **Sistema de autenticación**
- ✅ **Foro interactivo**
- ✅ **Carrusel de proyectos**
- ✅ **Formularios validados**

### Páginas Implementadas

1. **Landing Page** - Hero section con animaciones
2. **Quiénes Somos** - Historia, misión, visión y objetivos
3. **Equipo** - Perfiles de miembros con información detallada
4. **Nuestro Trabajo** - Proyectos y publicaciones (en desarrollo)
5. **Recursos** - Materiales de estudio (en desarrollo)
6. **Eventos** - Calendario y actividades (en desarrollo)
7. **Contacto** - Formulario y información de contacto
8. **Login/Registro** - Sistema de autenticación completo
9. **Foro** - Gestión de tareas para estudiantes y docentes

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview

# Linting
npm run lint
```

## 🌐 Despliegue

### Vercel (Recomendado)

1. Conectar repositorio a Vercel
2. Configurar variables de entorno:
   - `VITE_API_URL`: URL del backend en producción
3. Deploy automático en cada push

### Netlify

1. Conectar repositorio a Netlify
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Configurar variables de entorno

### Docker en Producción

```bash
# Build imagen de producción
docker build -f Dockerfile.prod -t semillero-guia-frontend:prod .

# Ejecutar con nginx
docker run -p 80:80 semillero-guia-frontend:prod
```

## 🔗 Integración con Backend

La aplicación se conecta al backend mediante:

- **Base URL:** Configurada en `VITE_API_URL`
- **Autenticación:** JWT tokens almacenados en cookies
- **Interceptores:** Manejo automático de tokens en Axios

### Endpoints Utilizados

```
POST /api/auth/login       # Inicio de sesión
POST /api/auth/register    # Registro
GET  /api/auth/me         # Perfil del usuario
GET  /api/users/team      # Miembros del equipo
GET  /api/forum/assignments # Tareas del foro
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abrir un Pull Request

### Convenciones de Código

- Usar **camelCase** para variables y funciones
- Usar **PascalCase** para componentes
- Seguir las guías de **ESLint**
- Documentar componentes complejos

## 📝 Variables de Entorno

```env
# Backend API
VITE_API_URL=http://localhost:4000

# App Info
VITE_APP_NAME="Semillero GUIA"
VITE_APP_VERSION="1.0.0"
```

## 🐛 Problemas Conocidos

- Algunas páginas (Proyectos, Recursos, Eventos) están en desarrollo
- Falta integración completa con APIs del backend
- Pendiente implementación de subida de archivos

## 📞 Soporte

Para soporte técnico o preguntas:

- **Email:** semillero.guia@correounivalle.edu.co
- **Issues:** [GitHub Issues](https://github.com/tu-usuario/semillero-guia-frontend/issues)

## 📄 Licencia

MIT License - ver [LICENSE](LICENSE) para más detalles.

---

**Desarrollado con ❤️ por el Semillero GUIA - Universidad del Valle**