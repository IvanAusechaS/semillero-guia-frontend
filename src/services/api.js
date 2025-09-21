import axios from 'axios';

// Configuración base de la API - MongoDB Backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://semillero-guia-backend-0fb6e19b1407.herokuapp.com';

// Crear instancia de axios con configuración segura para cookies HTTPOnly
const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 30000, // Aumentar timeout para manejar delays
  withCredentials: true, // CRÍTICO: Permite envío automático de cookies HTTPOnly
  headers: {
    'Content-Type': 'application/json',
  }
});

// Sistema de rate limiting para evitar error 429
let lastRequestTime = 0;
const MIN_REQUEST_DELAY = 1000; // 1 segundo entre peticiones
let rateLimitWarningShown = false;

// Función para añadir delay entre peticiones
const enforceRateLimit = async () => {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  
  if (timeSinceLastRequest < MIN_REQUEST_DELAY) {
    const delay = MIN_REQUEST_DELAY - timeSinceLastRequest;
    
    // Mostrar warning solo una vez para evitar spam
    if (!rateLimitWarningShown) {
      console.log(`⏱️ Aplicando rate limiting para evitar errores 429`);
      rateLimitWarningShown = true;
      // Reset warning después de 30 segundos
      setTimeout(() => { rateLimitWarningShown = false; }, 30000);
    }
    
    await new Promise(resolve => setTimeout(resolve, delay));
  }
  
  lastRequestTime = Date.now();
};

// Función de reintento con backoff exponencial
const retryWithBackoff = async (requestFn, maxRetries = 3, baseDelay = 2000) => {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      await enforceRateLimit();
      return await requestFn();
    } catch (error) {
      if (error.response?.status === 429 && attempt < maxRetries) {
        const delay = baseDelay * Math.pow(2, attempt); // Backoff exponencial
        console.log(`🔄 Reintento ${attempt + 1}/${maxRetries} en ${delay}ms debido a rate limit`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      throw error;
    }
  }
};

// Utilidades de validación para MongoDB
export const isValidObjectId = (id) => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

// Projects usa mock data temporalmente (IDs simples)
export const isValidProjectId = (id) => {
  return /^[1-9]\d*$/.test(id);
};

// Estados y enums implementados en el backend
export const ASSIGNMENT_STATUS = {
  PENDING: 'pendiente',
  IN_PROGRESS: 'en_progreso', 
  COMPLETED: 'completado',
  OVERDUE: 'vencido'
};

export const ASSIGNMENT_PRIORITY = {
  LOW: 'baja',
  MEDIUM: 'media',
  HIGH: 'alta',
  CRITICAL: 'critica'
};

// Estados de proyectos (según backend)
export const PROJECT_STATUS = {
  PLANNING: 'planificado',
  IN_PROGRESS: 'en-desarrollo', // CORRECTO: con guión, no underscore
  COMPLETED: 'completado',
  PAUSED: 'pausado'
};

export const SUBMISSION_STATUS = {
  SUBMITTED: 'enviado',
  UNDER_REVIEW: 'pendiente_revision',
  REVIEWED: 'revisado',
  APPROVED: 'aprobado',
  REJECTED: 'rechazado'
};

// Configuración de archivos implementada en el backend
export const FILE_CONFIG = {
  MAX_SIZE: 10485760, // 10MB
  MAX_FILES: 5,
  ALLOWED_TYPES: ['pdf', 'doc', 'docx', 'txt', 'zip', 'rar', 'jpg', 'jpeg', 'png', 'mp4', 'avi']
};

// Interceptor para configuración segura - NO maneja tokens manualmente
api.interceptors.request.use(
  (config) => {
    // Las cookies HTTPOnly se envían automáticamente por el navegador
    // NO almacenamos tokens en localStorage por seguridad
    
    // Debug: Log de requests importantes para diagnóstico
    if (config.url?.includes('assignment') || config.url?.includes('join') || config.url?.includes('login')) {
      console.log('🚀 API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        withCredentials: config.withCredentials,
        headers: config.headers
      });
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
  (response) => {
    // Debug: Log de responses críticas solamente
    if (response.config.url?.includes('login') || response.config.url?.includes('register')) {
      console.log('✅ API Response:', {
        status: response.status,
        url: response.config.url
      });
    }
    
    return response;
  },
  (error) => {
    // Manejo especial para rate limiting
    if (error.response?.status === 429) {
      console.warn('⚠️ Rate limit alcanzado - demasiadas peticiones');
      const retryAfter = error.response.headers['retry-after'];
      if (retryAfter) {
        console.log(`🕐 Servidor sugiere reintento en ${retryAfter} segundos`);
      }
    } else {
      // Log de otros errores con más detalles para debugging
      console.error('❌ API Error:', {
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
        url: error.config?.url,
        data: error.response?.data,
        method: error.config?.method?.toUpperCase()
      });
      
      // Log especial para errores de autenticación
      if (error.response?.status === 401) {
        console.warn('🔐 Error de autenticación - verifica cookies o login');
      } else if (error.response?.status === 403) {
        console.warn('🚫 Sin permisos - verifica rol de usuario');
      } else if (error.response?.status === 404) {
        console.warn('🔍 Endpoint no encontrado:', error.config?.url);
      }
    }
    
    if (error.response?.status === 401) {
      // Token expirado o inválido - Las cookies HTTPOnly son limpiadas automáticamente por el backend
      // Solo eliminamos datos no sensibles del localStorage
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

/**
 * Servicio de autenticación - Compatible con MongoDB Backend
 */
export const authService = {
  login: async (email, password) => {
    try {
      // Usar sistema de reintentos para login debido a rate limiting
      const response = await retryWithBackoff(async () => {
        return await api.post('/auth/login', { email, password });
      });
      
      if (response.data.status === 'success') {
        const { user } = response.data;
        // Solo guardamos datos no sensibles del usuario en localStorage
        // El token JWT se maneja automáticamente vía cookies HTTPOnly
        localStorage.setItem('user', JSON.stringify(user));
        return { success: true, user };
      }
      
      return { success: false, message: response.data.message };
    } catch (error) {
      if (error.response?.status === 429) {
        return { 
          success: false, 
          message: 'Demasiados intentos de login. Por favor espera un momento antes de intentar nuevamente.' 
        };
      }
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error de conexión' 
      };
    }
  },

  register: async (userData) => {
    try {
      // Usar sistema de reintentos para register también
      const response = await retryWithBackoff(async () => {
        return await api.post('/auth/register', userData);
      });
      
      if (response.data.status === 'success') {
        const { user } = response.data;
        // Solo guardamos datos no sensibles del usuario en localStorage
        // El token JWT se maneja automáticamente vía cookies HTTPOnly
        localStorage.setItem('user', JSON.stringify(user));
        return { success: true, user };
      }
      
      return { success: false, message: response.data.message };
    } catch (error) {
      if (error.response?.status === 429) {
        return { 
          success: false, 
          message: 'Demasiados intentos de registro. Por favor espera un momento antes de intentar nuevamente.' 
        };
      }
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error de registro' 
      };
    }
  },

  getProfile: async () => {
    try {
      const response = await api.get('/auth/me');
      
      if (response.data.status === 'success') {
        // Actualizar usuario en localStorage
        localStorage.setItem('user', JSON.stringify(response.data.user));
        return { success: true, user: response.data.user };
      }
      
      return { success: false, message: response.data.message };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error al obtener perfil' 
      };
    }
  },

  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/auth/profile', profileData);
      
      if (response.data.status === 'success') {
        // Actualizar usuario en localStorage
        localStorage.setItem('user', JSON.stringify(response.data.user));
        return { success: true, user: response.data.user };
      }
      
      return { success: false, message: response.data.message };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error al actualizar perfil' 
      };
    }
  },

  logout: async () => {
    try {
      // Llamar al endpoint de logout para limpiar cookies HTTPOnly en el servidor
      await api.post('/auth/logout');
    } catch (error) {
      console.warn('Error during logout:', error.message);
    } finally {
      // Limpiar datos locales no sensibles
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
  },

  // Verificar autenticación basado en la presencia de datos de usuario
  // La validación real del token se hace en el backend vía cookies HTTPOnly
  isAuthenticated: () => {
    const user = localStorage.getItem('user');
    return !!user;
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  hasRole: (role) => {
    const user = authService.getCurrentUser();
    return user?.role === role;
  },

  canCreateAssignments: () => {
    const user = authService.getCurrentUser();
    return ['docente', 'admin'].includes(user?.role);
  },

  canGradeSubmissions: () => {
    const user = authService.getCurrentUser();
    return ['docente', 'admin'].includes(user?.role);
  }
};

/**
 * Servicio de usuarios
 */
export const userService = {
  getUsers: async (params = {}) => {
    const response = await api.get('/users', { params }); // Eliminado /api/
    return response.data;
  },

  getUserById: async (id) => {
    if (!isValidObjectId(id)) {
      throw new Error('ID de usuario inválido');
    }
    const response = await api.get(`/users/${id}`); // Eliminado /api/
    return response.data;
  },

  updateUser: async (id, userData) => {
    if (!isValidObjectId(id)) {
      throw new Error('ID de usuario inválido');
    }
    const response = await api.put(`/users/${id}`, userData); // Eliminado /api/
    return response.data;
  },

  deleteUser: async (id) => {
    if (!isValidObjectId(id)) {
      throw new Error('ID de usuario inválido');
    }
    const response = await api.delete(`/users/${id}`); // Eliminado /api/
    return response.data;
  }
};

/**
 * Servicio de proyectos
 */
export const projectService = {
  // Obtener todos los proyectos con filtros
  getProjects: async (filters = {}) => {
    try {
      await enforceRateLimit();
      
      const params = new URLSearchParams({
        page: filters.page || 1,
        limit: filters.limit || 20,
        ...(filters.status && { status: filters.status }),
        ...(filters.category && { category: filters.category }),
        ...(filters.search && { search: filters.search })
      });

      const response = await api.get(`/projects?${params}`);
      
      // Backend usa "success" y "data", no "status" y "projects"
      if (response.data.success) {
        return {
          success: true,
          projects: response.data.data,  // Backend usa "data"
          pagination: response.data.pagination
        };
      }
      
      return { success: false, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al obtener proyectos'
      };
    }
  },

  // Obtener proyecto por ID
  getProjectById: async (id) => {
    if (!isValidObjectId(id)) {
      return { success: false, message: 'ID de proyecto inválido' };
    }

    try {
      const response = await api.get(`/projects/${id}`);
      
      // Backend usa "success" y "data", no "status" y "project"
      if (response.data.success) {
        return { success: true, project: response.data.data };
      }
      
      return { success: false, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al obtener proyecto'
      };
    }
  },

  // Obtener mis proyectos
  getMyProjects: async () => {
    try {
      // Usar filtro en lugar de ruta específica
      const response = await api.get('/projects?filter=my');
      
      // Backend usa "success" y "data"
      if (response.data.success) {
        return { success: true, projects: response.data.projects };
      }
      
      return { success: false, message: response.data.message };
    } catch (error) {
      // Fallback: usar projects generales si la ruta específica no existe
      console.warn('My projects endpoint not available, falling back to general projects');
      try {
        const fallbackResponse = await api.get('/projects?limit=5');
        return { 
          success: true, 
          projects: fallbackResponse.data.projects || [] 
        };
      } catch (fallbackError) {
        return {
          success: false,
          message: 'Error al obtener proyectos'
        };
      }
    }
  },

  // Crear proyecto
  createProject: async (projectData) => {
    try {
      const response = await api.post('/projects', projectData);
      
      // Backend usa "success" y "data"
      if (response.data.success) {
        return { success: true, project: response.data.data };
      }
      
      return { success: false, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al crear proyecto'
      };
    }
  },

  // Actualizar proyecto
  updateProject: async (id, projectData) => {
    // TEMPORAL: Projects usa IDs string hasta migración completa a MongoDB
    if (!id || typeof id !== 'string') {
      return { success: false, message: 'ID de proyecto inválido' };
    }

    try {
      const response = await api.put(`/projects/${id}`, projectData);
      
      // Backend usa "success" y "data"
      if (response.data.success) {
        return { success: true, project: response.data.data };
      }
      
      return { success: false, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al actualizar proyecto'
      };
    }
  },

  // Eliminar proyecto
  deleteProject: async (id) => {
    // TEMPORAL: Projects usa IDs string hasta migración completa a MongoDB
    if (!id || typeof id !== 'string') {
      return { success: false, message: 'ID de proyecto inválido' };
    }

    try {
      const response = await api.delete(`/projects/${id}`);
      
      if (response.data.status === 'success') {
        return { success: true, message: 'Proyecto eliminado' };
      }
      
      return { success: false, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al eliminar proyecto'
      };
    }
  },

  // Unirse a proyecto
  joinProject: async (id) => {
    // TEMPORAL: Projects usa IDs string hasta migración completa a MongoDB
    if (!id || typeof id !== 'string') {
      return { success: false, message: 'ID de proyecto inválido' };
    }

    try {
      // Intentar endpoint específico de join, si no existe usar PUT para actualizar team
      let response;
      try {
        response = await api.post(`/projects/${id}/join`);
      } catch (joinError) {
        if (joinError.response?.status === 404) {
          console.warn('Join endpoint not found, trying alternative approach');
          // Fallback: obtener proyecto actual y agregarse al team
          const projectResponse = await api.get(`/projects/${id}`);
          if (projectResponse.data.success) {
            const project = projectResponse.data.data;
            // Esta funcionalidad podría necesitar implementarse en el backend
            return { 
              success: false, 
              message: 'Funcionalidad de unirse a proyecto no disponible. Contacta al docente.' 
            };
          }
        }
        throw joinError;
      }
      
      // Backend usa "success" y "data"
      if (response.data.success) {
        return { success: true, message: 'Te has unido al proyecto exitosamente' };
      }
      
      return { success: false, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al unirse al proyecto'
      };
    }
  },

  // Salir de proyecto
  leaveProject: async (id) => {
    // TEMPORAL: Projects usa IDs string hasta migración completa a MongoDB
    if (!id || typeof id !== 'string') {
      return { success: false, message: 'ID de proyecto inválido' };
    }

    try {
      const response = await api.post(`/projects/${id}/leave`);
      
      if (response.data.status === 'success') {
        return { success: true, message: 'Has salido del proyecto' };
      }
      
      return { success: false, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al salir del proyecto'
      };
    }
  }
};

/**
 * Servicio de asignaciones - CRÍTICO para Dashboard
 */
export const assignmentService = {
  // CRÍTICO - Obtener MIS asignaciones (para estudiantes)
  getMyAssignments: async (filters = {}) => {
    try {
      await enforceRateLimit();
      
      const params = new URLSearchParams({
        page: filters.page || 1,
        limit: filters.limit || 10,
        ...(filters.status && { status: filters.status }),
        ...(filters.priority && { priority: filters.priority }),
        ...(filters.search && { search: filters.search })
      });
      
      // Intentar primero /assignments/my, luego fallback a /assignments con filtro
      let response;
      try {
        response = await api.get(`/assignments/my?${params}`);
      } catch (myAssignmentsError) {
        console.warn('Trying fallback for my assignments:', myAssignmentsError.message);
        // Fallback: usar /assignments general con filtro por usuario actual
        response = await api.get(`/assignments?${params}&my=true`);
      }
      
      if (response.data.status === 'success') {
        return {
          success: true,
          assignments: response.data.assignments || response.data.data || [],
          pagination: response.data.pagination || { page: 1, total: 0, totalPages: 0 }
        };
      }
      
      return { success: false, message: response.data.message };
    } catch (error) {
      // Fallback seguro para evitar errores de render
      console.warn('My assignments endpoint error:', error.message);
      return {
        success: true, // Retornar success con array vacío
        assignments: [],
        pagination: { page: 1, total: 0, totalPages: 0 }
      };
    }
  },

  // CRÍTICO - Obtener asignación por ID (para detalles)
  getAssignmentById: async (id) => {
    if (!isValidObjectId(id)) {
      return { success: false, message: 'ID de asignación inválido' };
    }

    try {
      const response = await api.get(`/assignments/${id}`);
      
      if (response.data.status === 'success') {
        return { success: true, assignment: response.data.assignment };
      }
      
      return { success: false, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al obtener asignación'
      };
    }
  },

  // Para docentes - Listar TODAS las asignaciones
  getAllAssignments: async (filters = {}) => {
    try {
      const params = new URLSearchParams({
        page: filters.page || 1,
        limit: filters.limit || 20,
        ...(filters.status && { status: filters.status }),
        ...(filters.priority && { priority: filters.priority }),
        ...(filters.project && { project: filters.project }),
        ...(filters.search && { search: filters.search })
      });

      const response = await api.get(`/assignments?${params}`);
      
      if (response.data.status === 'success') {
        return {
          success: true,
          assignments: response.data.assignments,
          pagination: response.data.pagination
        };
      }
      
      return { success: false, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al obtener asignaciones'
      };
    }
  },

  // Crear asignación (para docentes)
  createAssignment: async (assignmentData) => {
    try {
      const response = await api.post('/assignments', assignmentData);
      
      if (response.data.status === 'success') {
        return { success: true, assignment: response.data.assignment };
      }
      
      return { success: false, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al crear asignación'
      };
    }
  },

  // Actualizar asignación
  updateAssignment: async (id, updateData) => {
    if (!isValidObjectId(id)) {
      return { success: false, message: 'ID de asignación inválido' };
    }

    try {
      const response = await api.put(`/assignments/${id}`, updateData);
      
      if (response.data.status === 'success') {
        return { success: true, assignment: response.data.assignment };
      }
      
      return { success: false, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al actualizar asignación'
      };
    }
  },

  // Eliminar asignación
  deleteAssignment: async (id) => {
    if (!isValidObjectId(id)) {
      return { success: false, message: 'ID de asignación inválido' };
    }

    try {
      const response = await api.delete(`/assignments/${id}`);
      
      if (response.data.status === 'success') {
        return { success: true, message: 'Asignación eliminada' };
      }
      
      return { success: false, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al eliminar asignación'
      };
    }
  },

  // Obtener estadísticas de asignaciones (para Dashboard)
  getAssignmentStats: async () => {
    try {
      await enforceRateLimit();
      
      // Usar ruta simple para obtener estadísticas básicas
      const response = await api.get('/assignments/my?limit=100');
      
      if (response.data.status === 'success') {
        const assignments = response.data.assignments || [];
        
        // Calcular estadísticas básicas
        const stats = {
          total: assignments.length,
          pendiente: assignments.filter(a => a.status === 'pendiente').length,
          en_progreso: assignments.filter(a => a.status === 'en_progreso').length,
          completado: assignments.filter(a => a.status === 'completado').length,
          vencido: assignments.filter(a => a.status === 'vencido').length,
          prioridad_alta: assignments.filter(a => a.priority === 'alta').length,
          prioridad_critica: assignments.filter(a => a.priority === 'critica').length
        };
        
        return { success: true, stats };
      }
      
      return { success: false, message: response.data.message };
    } catch (error) {
      // Fallback: calcular estadísticas básicas desde assignments generales
      console.warn('Assignment stats endpoint not available, using fallback');
      try {
        const assignmentsResponse = await api.get('/assignments?limit=100');
        if (assignmentsResponse.data.status === 'success') {
          const assignments = assignmentsResponse.data.assignments || [];
          const stats = {
            totalAssignments: assignments.length,
            pending: assignments.filter(a => a.status === 'pending').length,
            completed: assignments.filter(a => a.status === 'completed').length,
            averageGrade: 0,
            pendingReviews: 0
          };
          return { success: true, stats };
        }
      } catch (fallbackError) {
        console.warn('Fallback stats calculation failed');
      }
      
      // Fallback final con datos vacíos
      return {
        success: true,
        stats: {
          totalAssignments: 0,
          pending: 0,
          completed: 0,
          averageGrade: 0,
          pendingReviews: 0
        }
      };
    }
  }
};

/**
 * Servicio de entregas (submissions) - Sistema de archivos con Multer
 */
export const submissionService = {
  // CRÍTICO - Obtener MIS entregas (para estudiantes)
  getMySubmissions: async (filters = {}) => {
    try {
      const params = new URLSearchParams({
        page: filters.page || 1,
        limit: filters.limit || 10,
        ...(filters.assignment && { assignment: filters.assignment }),
        ...(filters.status && { status: filters.status })
      });

      // Usar filtro en lugar de ruta específica
      const response = await api.get(`/submissions?${params}&filter=my`);
      
      if (response.data.status === 'success') {
        return {
          success: true,
          submissions: response.data.submissions,
          pagination: response.data.pagination
        };
      }
      
      return { success: false, message: response.data.message };
    } catch (error) {
      // Fallback seguro para evitar errores de render
      console.warn('My submissions endpoint error:', error.message);
      return {
        success: true, // Retornar success con array vacío
        submissions: [],
        pagination: { page: 1, total: 0, totalPages: 0 }
      };
    }
  },

  // CRÍTICO - Crear entrega con archivos (máximo 5 archivos, 10MB cada uno)
  createSubmission: async (submissionData, files = []) => {
    try {
      // Validar límites de archivos
      if (files.length > 5) {
        return { success: false, message: 'Máximo 5 archivos permitidos' };
      }

      // Validar tamaño de archivos (10MB = 10 * 1024 * 1024 bytes)
      const maxSize = 10 * 1024 * 1024;
      for (const file of files) {
        if (file.size > maxSize) {
          return { 
            success: false, 
            message: `El archivo ${file.name} excede el límite de 10MB` 
          };
        }
      }

      const formData = new FormData();
      
      // Añadir datos de la entrega
      formData.append('assignment', submissionData.assignment);
      formData.append('content', submissionData.content || '');
      if (submissionData.comments) {
        formData.append('comments', submissionData.comments);
      }

      // Añadir archivos
      files.forEach((file, index) => {
        formData.append('files', file);
      });

      const response = await api.post('/submissions', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (response.data.status === 'success') {
        return { success: true, submission: response.data.submission };
      }
      
      return { success: false, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al crear entrega'
      };
    }
  },

  // Obtener entrega por ID
  getSubmissionById: async (id) => {
    if (!isValidObjectId(id)) {
      return { success: false, message: 'ID de entrega inválido' };
    }

    try {
      const response = await api.get(`/submissions/${id}`);
      
      if (response.data.status === 'success') {
        return { success: true, submission: response.data.submission };
      }
      
      return { success: false, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al obtener entrega'
      };
    }
  },

  // Para docentes - Obtener entregas de una asignación específica
  getSubmissionsByAssignment: async (assignmentId, filters = {}) => {
    if (!isValidObjectId(assignmentId)) {
      return { success: false, message: 'ID de asignación inválido' };
    }

    try {
      const params = new URLSearchParams({
        page: filters.page || 1,
        limit: filters.limit || 20,
        ...(filters.status && { status: filters.status }),
        ...(filters.student && { student: filters.student })
      });

      const response = await api.get(`/assignments/${assignmentId}/submissions?${params}`);
      
      if (response.data.status === 'success') {
        return {
          success: true,
          submissions: response.data.submissions,
          pagination: response.data.pagination
        };
      }
      
      return { success: false, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al obtener entregas'
      };
    }
  },

  // Actualizar entrega (antes de la fecha límite)
  updateSubmission: async (id, updateData, newFiles = []) => {
    if (!isValidObjectId(id)) {
      return { success: false, message: 'ID de entrega inválido' };
    }

    try {
      // Si hay archivos nuevos, usar FormData
      if (newFiles.length > 0) {
        // Validar límites
        if (newFiles.length > 5) {
          return { success: false, message: 'Máximo 5 archivos permitidos' };
        }

        const maxSize = 10 * 1024 * 1024;
        for (const file of newFiles) {
          if (file.size > maxSize) {
            return { 
              success: false, 
              message: `El archivo ${file.name} excede el límite de 10MB` 
            };
          }
        }

        const formData = new FormData();
        Object.keys(updateData).forEach(key => {
          formData.append(key, updateData[key]);
        });
        
        newFiles.forEach((file) => {
          formData.append('files', file);
        });

        const response = await api.put(`/submissions/${id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        
        if (response.data.status === 'success') {
          return { success: true, submission: response.data.submission };
        }
        
        return { success: false, message: response.data.message };
      } else {
        // Solo actualizar texto sin archivos
        const response = await api.put(`/submissions/${id}`, updateData);
        
        if (response.data.status === 'success') {
          return { success: true, submission: response.data.submission };
        }
        
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al actualizar entrega'
      };
    }
  },

  // Calificar entrega (solo docentes)
  gradeSubmission: async (id, gradeData) => {
    if (!isValidObjectId(id)) {
      return { success: false, message: 'ID de entrega inválido' };
    }

    try {
      const response = await api.put(`/submissions/${id}/grade`, gradeData);
      
      if (response.data.status === 'success') {
        return { success: true, submission: response.data.submission };
      }
      
      return { success: false, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al calificar entrega'
      };
    }
  },

  // Descargar archivo de entrega
  downloadFile: async (submissionId, filename) => {
    if (!isValidObjectId(submissionId)) {
      return { success: false, message: 'ID de entrega inválido' };
    }

    try {
      const response = await api.get(`/submissions/${submissionId}/files/${filename}`, {
        responseType: 'blob'
      });
      
      // Crear URL del blob para descarga
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      return { success: true, message: 'Archivo descargado' };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al descargar archivo'
      };
    }
  },

  // Eliminar entrega (antes de la fecha límite)
  deleteSubmission: async (id) => {
    if (!isValidObjectId(id)) {
      return { success: false, message: 'ID de entrega inválido' };
    }

    try {
      const response = await api.delete(`/submissions/${id}`);
      
      if (response.data.status === 'success') {
        return { success: true, message: 'Entrega eliminada' };
      }
      
      return { success: false, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al eliminar entrega'
      };
    }
  }
};

/**
 * Servicio de eventos
 */
export const eventService = {
  // Obtener todos los eventos con filtros
  getEvents: async (filters = {}) => {
    try {
      await enforceRateLimit();
      
      const params = new URLSearchParams({
        page: filters.page || 1,
        limit: filters.limit || 20,
        ...(filters.category && { category: filters.category }),
        ...(filters.date && { date: filters.date }),
        ...(filters.search && { search: filters.search })
      });

      const response = await api.get(`/events?${params}`);
      
      if (response.data.status === 'success') {
        return {
          success: true,
          events: response.data.events,
          pagination: response.data.pagination
        };
      }
      
      return { success: false, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al obtener eventos'
      };
    }
  },

  // Obtener evento por ID
  getEventById: async (id) => {
    if (!isValidObjectId(id)) {
      return { success: false, message: 'ID de evento inválido' };
    }

    try {
      const response = await api.get(`/events/${id}`);
      
      if (response.data.status === 'success') {
        return { success: true, event: response.data.event };
      }
      
      return { success: false, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al obtener evento'
      };
    }
  },

  // Crear evento (para docentes/admin)
  createEvent: async (eventData) => {
    try {
      const response = await api.post('/events', eventData);
      
      if (response.data.status === 'success') {
        return { success: true, event: response.data.event };
      }
      
      return { success: false, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al crear evento'
      };
    }
  },

  // Actualizar evento
  updateEvent: async (id, eventData) => {
    if (!isValidObjectId(id)) {
      return { success: false, message: 'ID de evento inválido' };
    }

    try {
      const response = await api.put(`/events/${id}`, eventData);
      
      if (response.data.status === 'success') {
        return { success: true, event: response.data.event };
      }
      
      return { success: false, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al actualizar evento'
      };
    }
  },

  // Eliminar evento
  deleteEvent: async (id) => {
    if (!isValidObjectId(id)) {
      return { success: false, message: 'ID de evento inválido' };
    }

    try {
      const response = await api.delete(`/events/${id}`);
      
      if (response.data.status === 'success') {
        return { success: true, message: 'Evento eliminado' };
      }
      
      return { success: false, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al eliminar evento'
      };
    }
  },

  // Registrarse a un evento
  registerToEvent: async (id) => {
    if (!isValidObjectId(id)) {
      return { success: false, message: 'ID de evento inválido' };
    }

    try {
      const response = await api.post(`/events/${id}/register`);
      
      if (response.data.status === 'success') {
        return { success: true, message: 'Registrado exitosamente' };
      }
      
      return { success: false, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al registrarse al evento'
      };
    }
  },

  // Cancelar registro de evento
  unregisterFromEvent: async (id) => {
    if (!isValidObjectId(id)) {
      return { success: false, message: 'ID de evento inválido' };
    }

    try {
      const response = await api.delete(`/events/${id}/register`);
      
      if (response.data.status === 'success') {
        return { success: true, message: 'Registro cancelado' };
      }
      
      return { success: false, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al cancelar registro'
      };
    }
  },

  // Obtener mis eventos registrados
  getMyEvents: async () => {
    try {
      const response = await api.get('/events/my');
      
      if (response.data.status === 'success') {
        return { success: true, events: response.data.events };
      }
      
      return { success: false, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al obtener mis eventos'
      };
    }
  }
};

/**
 * Servicio de recursos
 */
export const resourceService = {
  getResources: async (params = {}) => {
    const response = await api.get('/resources', { params }); // Eliminado /api/
    return response.data;
  },

  getResourceById: async (id) => {
    if (!isValidObjectId(id)) {
      throw new Error('ID de recurso inválido');
    }
    const response = await api.get(`/resources/${id}`); // Eliminado /api/
    return response.data;
  },

  uploadResource: async (resourceData) => {
    const formData = new FormData();
    
    // Agregar campos de texto
    Object.keys(resourceData).forEach(key => {
      if (key !== 'file') {
        formData.append(key, resourceData[key]);
      }
    });

    // Agregar archivo
    if (resourceData.file) {
      formData.append('file', resourceData.file);
    }

    const response = await api.post('/resources', formData, { // Eliminado /api/
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updateResource: async (id, resourceData) => {
    if (!isValidObjectId(id)) {
      throw new Error('ID de recurso inválido');
    }
    const response = await api.put(`/resources/${id}`, resourceData); // Eliminado /api/
    return response.data;
  },

  deleteResource: async (id) => {
    if (!isValidObjectId(id)) {
      throw new Error('ID de recurso inválido');
    }
    const response = await api.delete(`/resources/${id}`); // Eliminado /api/
    return response.data;
  },

  downloadResource: async (id) => {
    if (!isValidObjectId(id)) {
      throw new Error('ID de recurso inválido');
    }
    const response = await api.get(`/resources/${id}/download`, { // Eliminado /api/
      responseType: 'blob',
    });
    return response;
  }
};

// Funciones de debugging para problemas de estudiantes
export const debugService = {
  // Verificar estado de autenticación del estudiante
  checkAuthStatus: async () => {
    try {
      const response = await api.get('/auth/me');
      console.log('🟢 Usuario autenticado:', response.data);
      return { authenticated: true, user: response.data.user };
    } catch (error) {
      console.log('🔴 Usuario NO autenticado:', error.message);
      return { authenticated: false, error: error.message };
    }
  },

  // Probar endpoints de asignaciones con diferentes rutas
  testAssignmentEndpoints: async () => {
    const endpoints = [
      '/assignments/my',
      '/assignments?my=true',
      '/assignments',
    ];
    
    for (const endpoint of endpoints) {
      try {
        console.log(`🧪 Probando: ${endpoint}`);
        const response = await api.get(endpoint);
        console.log(`✅ ${endpoint} funciona:`, response.data);
      } catch (error) {
        console.log(`❌ ${endpoint} falló:`, error.response?.status, error.message);
      }
    }
  },

  // Verificar cookies del navegador
  checkCookies: () => {
    const cookies = document.cookie;
    console.log('🍪 Cookies disponibles:', cookies);
    
    if (!cookies.includes('jwt')) {
      console.warn('⚠️ No se encontró cookie JWT - usuario puede no estar autenticado');
    } else {
      console.log('✅ Cookie JWT encontrada');
    }
  }
};

export default api;