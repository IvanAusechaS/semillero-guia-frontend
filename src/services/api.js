import axios from 'axios';
import { normalizeResponse, isValidObjectId } from '../utils/mongodb';

// Configuración base de la API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// Crear instancia de axios
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Interceptor para agregar token automáticamente
api.interceptors.request.use(
  (config) => {
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('token='))
      ?.split('=')[1];
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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
    // Normalizar respuestas para usar _id consistentemente
    if (response.data && response.data.data) {
      response.data.data = normalizeResponse(response.data.data);
    }
    if (response.data && response.data.user) {
      response.data.user = normalizeResponse(response.data.user);
    }
    if (response.data && response.data.users) {
      response.data.users = normalizeResponse(response.data.users);
    }
    if (response.data && response.data.projects) {
      response.data.projects = normalizeResponse(response.data.projects);
    }
    if (response.data && response.data.assignments) {
      response.data.assignments = normalizeResponse(response.data.assignments);
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

/**
 * Servicio de autenticación
 */
export const authService = {
  login: async (email, password) => {
    const response = await api.post('/api/auth/login', { email, password });
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/api/auth/register', userData);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/api/auth/me');
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.put('/api/auth/profile', profileData);
    return response.data;
  }
};

/**
 * Servicio de usuarios
 */
export const userService = {
  getUsers: async (params = {}) => {
    const response = await api.get('/api/users', { params });
    return response.data;
  },

  getUserById: async (id) => {
    if (!isValidObjectId(id)) {
      throw new Error('ID de usuario inválido');
    }
    const response = await api.get(`/api/users/${id}`);
    return response.data;
  },

  updateUser: async (id, userData) => {
    if (!isValidObjectId(id)) {
      throw new Error('ID de usuario inválido');
    }
    const response = await api.put(`/api/users/${id}`, userData);
    return response.data;
  },

  deleteUser: async (id) => {
    if (!isValidObjectId(id)) {
      throw new Error('ID de usuario inválido');
    }
    const response = await api.delete(`/api/users/${id}`);
    return response.data;
  }
};

/**
 * Servicio de proyectos
 */
export const projectService = {
  getProjects: async (params = {}) => {
    const response = await api.get('/api/projects', { params });
    return response.data;
  },

  getProjectById: async (id) => {
    if (!isValidObjectId(id)) {
      throw new Error('ID de proyecto inválido');
    }
    const response = await api.get(`/api/projects/${id}`);
    return response.data;
  },

  createProject: async (projectData) => {
    const response = await api.post('/api/projects', projectData);
    return response.data;
  },

  updateProject: async (id, projectData) => {
    if (!isValidObjectId(id)) {
      throw new Error('ID de proyecto inválido');
    }
    const response = await api.put(`/api/projects/${id}`, projectData);
    return response.data;
  },

  deleteProject: async (id) => {
    if (!isValidObjectId(id)) {
      throw new Error('ID de proyecto inválido');
    }
    const response = await api.delete(`/api/projects/${id}`);
    return response.data;
  },

  joinProject: async (id) => {
    if (!isValidObjectId(id)) {
      throw new Error('ID de proyecto inválido');
    }
    const response = await api.post(`/api/projects/${id}/join`);
    return response.data;
  },

  leaveProject: async (id) => {
    if (!isValidObjectId(id)) {
      throw new Error('ID de proyecto inválido');
    }
    const response = await api.post(`/api/projects/${id}/leave`);
    return response.data;
  }
};

/**
 * Servicio de asignaciones
 */
export const assignmentService = {
  getMyAssignments: async (params = {}) => {
    const response = await api.get('/api/assignments/my', { params });
    return response.data;
  },

  getAssignmentById: async (id) => {
    if (!isValidObjectId(id)) {
      throw new Error('ID de asignación inválido');
    }
    const response = await api.get(`/api/assignments/${id}`);
    return response.data;
  },

  createAssignment: async (assignmentData) => {
    const response = await api.post('/api/assignments', assignmentData);
    return response.data;
  },

  updateAssignment: async (id, assignmentData) => {
    if (!isValidObjectId(id)) {
      throw new Error('ID de asignación inválido');
    }
    const response = await api.put(`/api/assignments/${id}`, assignmentData);
    return response.data;
  },

  deleteAssignment: async (id) => {
    if (!isValidObjectId(id)) {
      throw new Error('ID de asignación inválido');
    }
    const response = await api.delete(`/api/assignments/${id}`);
    return response.data;
  }
};

/**
 * Servicio de envíos
 */
export const submissionService = {
  createSubmission: async (submissionData) => {
    const formData = new FormData();
    
    // Agregar campos de texto
    Object.keys(submissionData).forEach(key => {
      if (key !== 'attachments') {
        formData.append(key, submissionData[key]);
      }
    });

    // Agregar archivos si existen
    if (submissionData.attachments) {
      submissionData.attachments.forEach(file => {
        formData.append('attachments', file);
      });
    }

    const response = await api.post('/api/submissions', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getSubmissionsByAssignment: async (assignmentId) => {
    if (!isValidObjectId(assignmentId)) {
      throw new Error('ID de asignación inválido');
    }
    const response = await api.get(`/api/assignments/${assignmentId}/submissions`);
    return response.data;
  },

  gradeSubmission: async (id, gradeData) => {
    if (!isValidObjectId(id)) {
      throw new Error('ID de envío inválido');
    }
    const response = await api.put(`/api/submissions/${id}/grade`, gradeData);
    return response.data;
  }
};

/**
 * Servicio de eventos
 */
export const eventService = {
  getEvents: async (params = {}) => {
    const response = await api.get('/api/events', { params });
    return response.data;
  },

  getEventById: async (id) => {
    if (!isValidObjectId(id)) {
      throw new Error('ID de evento inválido');
    }
    const response = await api.get(`/api/events/${id}`);
    return response.data;
  },

  createEvent: async (eventData) => {
    const response = await api.post('/api/events', eventData);
    return response.data;
  },

  updateEvent: async (id, eventData) => {
    if (!isValidObjectId(id)) {
      throw new Error('ID de evento inválido');
    }
    const response = await api.put(`/api/events/${id}`, eventData);
    return response.data;
  },

  deleteEvent: async (id) => {
    if (!isValidObjectId(id)) {
      throw new Error('ID de evento inválido');
    }
    const response = await api.delete(`/api/events/${id}`);
    return response.data;
  },

  registerToEvent: async (id) => {
    if (!isValidObjectId(id)) {
      throw new Error('ID de evento inválido');
    }
    const response = await api.post(`/api/events/${id}/register`);
    return response.data;
  },

  unregisterFromEvent: async (id) => {
    if (!isValidObjectId(id)) {
      throw new Error('ID de evento inválido');
    }
    const response = await api.delete(`/api/events/${id}/register`);
    return response.data;
  }
};

/**
 * Servicio de recursos
 */
export const resourceService = {
  getResources: async (params = {}) => {
    const response = await api.get('/api/resources', { params });
    return response.data;
  },

  getResourceById: async (id) => {
    if (!isValidObjectId(id)) {
      throw new Error('ID de recurso inválido');
    }
    const response = await api.get(`/api/resources/${id}`);
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

    const response = await api.post('/api/resources', formData, {
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
    const response = await api.put(`/api/resources/${id}`, resourceData);
    return response.data;
  },

  deleteResource: async (id) => {
    if (!isValidObjectId(id)) {
      throw new Error('ID de recurso inválido');
    }
    const response = await api.delete(`/api/resources/${id}`);
    return response.data;
  },

  downloadResource: async (id) => {
    if (!isValidObjectId(id)) {
      throw new Error('ID de recurso inválido');
    }
    const response = await api.get(`/api/resources/${id}/download`, {
      responseType: 'blob',
    });
    return response;
  }
};

export default api;