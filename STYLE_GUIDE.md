# 🎨 GUÍA DE ESTILOS INSTITUCIONAL - SEMILLERO GUIA

## 📋 RESUMEN DE CAMBIOS APLICADOS

Se ha implementado la nueva identidad visual de la universidad con:
- ✅ Paleta de colores institucional
- ✅ Tipografía acorde a estándares universitarios 
- ✅ Componentes con estilo académico y profesional
- ✅ Mantención de todas las animaciones existentes

---

## 🎯 PALETA DE COLORES INSTITUCIONAL

### Colores Principales
- **Rojo Institucional**: `#B40000` - Para elementos principales, botones, logo
- **Azul Oscuro**: `#003366` - Para enlaces, elementos secundarios
- **Negro**: `#000000` - Para encabezados y texto principal
- **Blanco Puro**: `#FFFFFF` - Para fondos y texto sobre elementos oscuros

### Colores de Apoyo
- **Gris Claro**: `#F5F5F5` - Para fondos de sección
- **Gris Medio**: `#666666` - Para texto secundario y descriptivo
- **Gris Oscuro**: `#333333` - Para elementos de contraste

---

## 🔤 TIPOGRAFÍA INSTITUCIONAL

### Fuentes Aplicadas
- **Fuente Principal**: Open Sans, Roboto, Lato (sans-serif moderna)
- **Encabezados**: Peso bold, color negro institucional
- **Cuerpo**: Peso regular, color gris medio

### Escalado de Tamaños
- **H1**: 32px - Títulos principales
- **H2**: 24px - Subtítulos de sección  
- **H3**: 18px - Subtítulos de contenido
- **P**: 16px - Texto de párrafo
- **Enlaces**: Color azul institucional con hover

---

## 🧩 CLASES CSS DISPONIBLES

### Botones Institucionales
```css
.btn-primary          /* Botón rojo institucional */
.btn-secondary        /* Botón blanco con borde rojo */
.btn-outline          /* Botón azul con borde */
```

### Cards Académicas
```css
.card                 /* Card básica con sombra sutil */
.card-institutional   /* Card con borde izquierdo rojo */
.card-gradient        /* Card con gradiente institucional */
```

### Texto y Títulos
```css
.hero-text           /* Texto hero en negro */
.hero-text-gradient  /* Texto hero con gradiente */
.section-title       /* Título de sección negro */
.section-title-red   /* Título de sección rojo */
.section-subtitle    /* Subtítulo gris medio */
```

### Navegación
```css
.navbar-item         /* Elemento de menú */
.navbar-item-active  /* Elemento activo (rojo) */
```

### Colores Utilitarios
```css
.text-institutional-red    /* Texto rojo #B40000 */
.text-institutional-blue   /* Texto azul #003366 */
.text-institutional-gray   /* Texto gris #666666 */
.bg-institutional-red      /* Fondo rojo */
.bg-institutional-blue     /* Fondo azul */
.bg-institutional-light    /* Fondo gris claro */
```

---

## 🌈 GRADIENTES INSTITUCIONALES

### Gradientes Disponibles
```css
bg-gradient-primary        /* Rojo → Azul → Rojo */
bg-gradient-institutional  /* Rojo → Azul (horizontal) */
bg-gradient-soft          /* Gris claro → Blanco */
bg-gradient-dark          /* Negro → Azul → Rojo */
bg-gradient-light         /* Blanco → Gris claro */
```

### Gradientes de Texto
```css
.text-gradient            /* Gradiente institucional en texto */
.text-gradient-primary    /* Gradiente primario en texto */
```

---

## 🎯 COMPONENTES ACTUALIZADOS

### Navbar
- ✅ Fondo blanco con borde inferior rojo
- ✅ Logo con fondo rojo institucional
- ✅ Texto del logo en rojo
- ✅ Menú con hover rojo y underline animado
- ✅ Estados activos en rojo

### Botones
- ✅ Primarios: Fondo rojo, texto blanco
- ✅ Secundarios: Fondo blanco, borde rojo, texto rojo
- ✅ Hover: Transiciones suaves con efectos de escala

### Cards
- ✅ Fondo blanco con sombra sutil
- ✅ Borde gris claro
- ✅ Variante institucional con borde izquierdo rojo
- ✅ Hover con elevación sutil

### Scrollbar
- ✅ Track en gris claro institucional
- ✅ Thumb con gradiente rojo-azul
- ✅ Hover más oscuro

---

## 🚀 CONFIGURACIÓN TAILWIND

### Colores Personalizados Agregados
```javascript
// En tailwind.config.js
institutional: {
  red: '#B40000',
  white: '#FFFFFF', 
  lightGray: '#F5F5F5',
  mediumGray: '#666666',
  black: '#000000',
  blue: '#003366',
}

primary: {
  500: '#B40000',  // Rojo institucional como primary
  // ... escalas completas
}

secondary: {
  500: '#003366',  // Azul institucional como secondary
  // ... escalas completas  
}
```

---

## 📱 RESPONSIVE Y ACCESIBILIDAD

### Características Mantenidas
- ✅ **Responsive completo**: Todos los breakpoints funcionan
- ✅ **Animaciones suaves**: Transiciones y efectos mantenidos
- ✅ **Contraste alto**: Cumple estándares de accesibilidad
- ✅ **Navegación semántica**: Estructura HTML accesible
- ✅ **Estados de hover/focus**: Claramente definidos

### Mejoras de Accesibilidad
- ✅ Contraste mejorado entre texto y fondo
- ✅ Enlaces en azul institucional para mejor identificación
- ✅ Botones con tamaños adecuados (mínimo 44px)
- ✅ Espaciado generoso para facilitar lectura

---

## 🎨 EJEMPLOS DE USO

### Hero Section
```jsx
<h1 className="hero-text">
  Título Principal
  <span className="text-gradient">Con Gradiente</span>
</h1>
```

### Botones
```jsx
<button className="btn-primary">Acción Principal</button>
<button className="btn-secondary">Acción Secundaria</button>
<button className="btn-outline">Acción Terciaria</button>
```

### Cards
```jsx
<div className="card-institutional">
  <h3 className="section-title-red">Título Rojo</h3>
  <p className="text-accent-medium">Descripción en gris medio</p>
</div>
```

### Navegación
```jsx
<a className="navbar-item navbar-item-active">Enlace Activo</a>
<a className="navbar-item">Enlace Normal</a>
```

---

## 🔧 PRÓXIMOS PASOS RECOMENDADOS

### Opcional - Ajustes Adicionales
1. **Logo Institucional**: Reemplazar el logo actual con el oficial de la universidad
2. **Imágenes**: Usar fotografías institucionales en hero sections
3. **Iconografía**: Considerar íconos más académicos/institucionales
4. **Footer**: Agregar información de contacto universitario

### Mantenimiento
- Los estilos son escalables y fáciles de mantener
- Todos los componentes existentes funcionan con la nueva paleta
- Las animaciones y efectos se mantienen intactos
- Compatible con futuros componentes

---

## 📊 COMPARACIÓN ANTES/DESPUÉS

| Aspecto | Antes | Después |
|---------|-------|---------|
| **Color Principal** | Azul (#3B82F6) | Rojo Institucional (#B40000) |
| **Color Secundario** | Púrpura (#8B5CF6) | Azul Institucional (#003366) |
| **Tipografía** | Poppins/Roboto | Open Sans (Institucional) |
| **Gradientes** | Azul-Púrpura-Rojo | Rojo-Azul (Institucional) |
| **Estilo** | Tech/Moderno | Académico/Profesional |
| **Contraste** | Bueno | Excelente (Universitario) |

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

- [x] **Paleta de colores** actualizada en Tailwind
- [x] **Tipografía** configurada según especificaciones
- [x] **Componentes CSS** adaptados a identidad institucional
- [x] **Navbar** actualizado con colores universitarios
- [x] **Gradientes** rediseñados con colores institucionales
- [x] **Scrollbar** personalizado con paleta institucional
- [x] **Accesibilidad** verificada y mejorada
- [x] **Responsive** mantenido en todos los dispositivos
- [x] **Animaciones** preservadas con nueva paleta

---

**🎓 El diseño ahora refleja la identidad visual universitaria manteniendo toda la funcionalidad y experiencia de usuario moderna.**