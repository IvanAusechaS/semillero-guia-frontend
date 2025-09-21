# Configuración de Seguridad - Frontend

## 🔒 Autenticación Segura con Cookies HTTPOnly

### ⚠️ Cambio Crítico de Seguridad

Se ha actualizado la configuración de autenticación para usar **cookies HTTPOnly** en lugar de localStorage, mejorando significativamente la seguridad de la aplicación.

### 🛡️ ¿Por qué Cookies HTTPOnly?

#### ❌ Problemas con localStorage:
- **Vulnerable a XSS**: Scripts maliciosos pueden acceder fácilmente a `localStorage.getItem('token')`
- **Persistencia peligrosa**: Los tokens permanecen accesibles desde JavaScript
- **No seguro para producción**: Especialmente en aplicaciones desplegadas

#### ✅ Ventajas de Cookies HTTPOnly:
- **Protección XSS**: Inaccesibles desde JavaScript malicioso
- **Gestión automática**: El navegador las envía automáticamente
- **Expiración segura**: Control completo del servidor sobre la sesión
- **Estándar de la industria**: Práctica recomendada para aplicaciones web

### 🔧 Configuración Implementada

#### Frontend (React)
```javascript
// Configuración de axios
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: true, // CRÍTICO: Permite cookies HTTPOnly
  timeout: 15000
});

// NO se manejan tokens manualmente
// Las cookies se envían automáticamente
```

#### AuthService Actualizado
```javascript
// Login - Solo guarda datos no sensibles
login: async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  // Solo guardamos datos del usuario (NO tokens)
  localStorage.setItem('user', JSON.stringify(user));
  return { success: true, user };
}

// Logout - Limpia cookies en el servidor
logout: async () => {
  await api.post('/auth/logout'); // Limpia cookies HTTPOnly
  localStorage.removeItem('user'); // Solo datos no sensibles
  window.location.href = '/login';
}
```

### 🔴 Requisitos del Backend

Para que esta configuración funcione, tu backend MongoDB **DEBE** implementar:

#### 1. CORS con Credentials
```javascript
app.use(cors({
  origin: 'http://localhost:5173', // URL del frontend
  credentials: true // CRÍTICO: Permite cookies
}));
```

#### 2. Configuración de Cookies HTTPOnly
```javascript
// En el login
res.cookie('token', jwt_token, {
  httpOnly: true,     // CRÍTICO: No accesible desde JS
  secure: process.env.NODE_ENV === 'production', // HTTPS en producción
  sameSite: 'lax',    // Protección CSRF
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 días
});
```

#### 3. Middleware de Autenticación
```javascript
// Leer token desde cookies (no desde headers)
const token = req.cookies.token;
if (!token) {
  return res.status(401).json({ message: 'No autorizado' });
}
```

#### 4. Endpoint de Logout
```javascript
app.post('/auth/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ status: 'success', message: 'Logout exitoso' });
});
```

### 📋 Checklist de Migración

- [x] ✅ Frontend configurado con `withCredentials: true`
- [x] ✅ AuthService actualizado para no manejar tokens
- [x] ✅ AuthContext adaptado a cookies HTTPOnly
- [x] ✅ Interceptores de axios configurados correctamente
- [ ] ⚠️ Backend configurado con CORS credentials
- [ ] ⚠️ Backend configurando cookies HTTPOnly
- [ ] ⚠️ Middleware de auth leyendo desde cookies
- [ ] ⚠️ Endpoint de logout implementado

### 🚀 Despliegue en Producción

#### Variables de Entorno Críticas:
```bash
# Frontend
VITE_API_URL=https://tu-backend.com

# Backend  
NODE_ENV=production
FRONTEND_URL=https://tu-frontend.com
BACKEND_PORT=3000
```

#### Configuración HTTPS:
- **Obligatorio** para cookies HTTPOnly en producción
- Certificados SSL válidos
- Secure cookies habilitadas

### 🔍 Validación de Seguridad

#### Verificar en DevTools:
1. **Application → Cookies**: Token debe aparecer como HTTPOnly
2. **Network → Headers**: `Cookie: token=...` en requests
3. **Console**: No debe ser posible acceder al token via JavaScript

#### Test de Seguridad:
```javascript
// Esto debe retornar undefined en producción
console.log(document.cookie); // No debe mostrar el token
```

### 📚 Recursos Adicionales

- [OWASP - Secure Cookie Configuration](https://owasp.org/www-community/controls/SecureCookieAttribute)
- [MDN - HTTP Cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)
- [Express.js - Cookie Security](https://expressjs.com/en/advanced/best-practice-security.html)

---

**⚠️ IMPORTANTE**: Esta configuración requiere que el backend esté actualizado para manejar cookies HTTPOnly. Sin esta actualización, la autenticación no funcionará.