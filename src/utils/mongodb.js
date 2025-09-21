/**
 * Utilidades para MongoDB y ObjectIds
 */

/**
 * Valida si un string es un ObjectId válido de MongoDB
 * @param {string} id - El ID a validar
 * @returns {boolean} - True si es un ObjectId válido
 */
export const isValidObjectId = (id) => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

/**
 * Extrae el ID de un objeto, manejando tanto 'id' como '_id'
 * @param {Object} obj - El objeto del cual extraer el ID
 * @returns {string} - El ID extraído
 */
export const extractId = (obj) => {
  return obj._id || obj.id;
};

/**
 * Convierte respuesta de API para usar _id consistentemente
 * @param {Object} data - Los datos de respuesta
 * @returns {Object} - Los datos con IDs normalizados
 */
export const normalizeResponse = (data) => {
  if (Array.isArray(data)) {
    return data.map(item => ({
      ...item,
      _id: extractId(item)
    }));
  }
  
  if (data && typeof data === 'object') {
    return {
      ...data,
      _id: extractId(data)
    };
  }
  
  return data;
};

/**
 * Estados y enums para el nuevo sistema
 */
export const PROJECT_STATUS = {
  PLANNING: 'planificado',
  IN_PROGRESS: 'en-desarrollo', // CORREGIDO: backend usa 'en-desarrollo'
  COMPLETED: 'completado',
  PAUSED: 'pausado'
};

export const PROJECT_CATEGORIES = {
  RESEARCH: 'investigacion',
  DEVELOPMENT: 'desarrollo',
  EXTENSION: 'extension'
};

export const EVENT_TYPES = {
  SEMINAR: 'seminario',
  WORKSHOP: 'taller',
  CONFERENCE: 'conferencia',
  MEETING: 'reunion',
  PRESENTATION: 'presentacion'
};

export const ASSIGNMENT_PRIORITY = {
  LOW: 'baja',
  MEDIUM: 'media',
  HIGH: 'alta',
  CRITICAL: 'critica'
};

export const ASSIGNMENT_STATUS = {
  PENDING: 'pendiente',
  IN_PROGRESS: 'en_progreso',
  COMPLETED: 'completado',
  OVERDUE: 'vencido'
};

export const USER_ROLES = {
  STUDENT: 'estudiante',
  TEACHER: 'docente',
  ADMIN: 'admin'
};

/**
 * Obtiene el color para mostrar según la prioridad
 * @param {string} priority - La prioridad de la asignación
 * @returns {string} - La clase CSS para el color
 */
export const getPriorityColor = (priority) => {
  const colors = {
    [ASSIGNMENT_PRIORITY.LOW]: 'bg-green-100 text-green-800',
    [ASSIGNMENT_PRIORITY.MEDIUM]: 'bg-yellow-100 text-yellow-800',
    [ASSIGNMENT_PRIORITY.HIGH]: 'bg-orange-100 text-orange-800',
    [ASSIGNMENT_PRIORITY.CRITICAL]: 'bg-red-100 text-red-800'
  };
  return colors[priority] || 'bg-gray-100 text-gray-800';
};

/**
 * Obtiene el color para mostrar según el estado del proyecto
 * @param {string} status - El estado del proyecto
 * @returns {string} - La clase CSS para el color
 */
export const getProjectStatusColor = (status) => {
  const colors = {
    [PROJECT_STATUS.PLANNING]: 'bg-blue-100 text-blue-800',
    [PROJECT_STATUS.IN_PROGRESS]: 'bg-yellow-100 text-yellow-800',
    [PROJECT_STATUS.COMPLETED]: 'bg-green-100 text-green-800',
    [PROJECT_STATUS.PAUSED]: 'bg-gray-100 text-gray-800'
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

/**
 * Formatea una fecha para mostrar
 * @param {string|Date} date - La fecha a formatear
 * @returns {string} - La fecha formateada
 */
export const formatDate = (date) => {
  if (!date) return 'No definida';
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Formatea una fecha y hora para mostrar
 * @param {string|Date} date - La fecha a formatear
 * @returns {string} - La fecha y hora formateadas
 */
export const formatDateTime = (date) => {
  if (!date) return 'No definida';
  return new Date(date).toLocaleString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};