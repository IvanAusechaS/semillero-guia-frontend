import { useState, useEffect, useContext } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  CheckSquare,
  Clock,
  Calendar,
  Filter,
  Eye,
  RefreshCw,
  AlertTriangle
} from 'lucide-react'
import { assignmentService } from '../services/api'
import { AuthContext } from '../context/AuthContext'
import LoadingSpinner from '../components/LoadingSpinner'
import { 
  formatDate, 
  formatDateTime,
  getPriorityColor,
  ASSIGNMENT_PRIORITY,
  ASSIGNMENT_STATUS 
} from '../utils/mongodb'
import toast from 'react-hot-toast'

const AssignmentList = () => {
  const { user } = useContext(AuthContext)
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    status: '',
    priority: ''
  })
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  })

  useEffect(() => {
    if (user) {
      fetchAssignments()
    }
  }, [user, filters, pagination.page])

  const fetchAssignments = async () => {
    try {
      setLoading(true)
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...(filters.status && { status: filters.status }),
        ...(filters.priority && { priority: filters.priority })
      }

      const response = await assignmentService.getMyAssignments(params)
      setAssignments(response.assignments || [])
      setPagination(prev => ({
        ...prev,
        total: response.pagination?.total || 0,
        totalPages: response.pagination?.totalPages || 0
      }))
    } catch (error) {
      console.error('Error fetching assignments:', error)
      
      // Check if it's a 404 error (endpoint not implemented)
      if (error.response?.status === 404) {
        toast.error('Sistema de asignaciones en desarrollo. Próximamente disponible.')
        // Set empty data to show proper UI message
        setAssignments([])
        setPagination(prev => ({
          ...prev,
          total: 0,
          totalPages: 0
        }))
      } else {
        toast.error('Error al cargar las asignaciones')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }))
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  const getStatusColor = (status) => {
    const colors = {
      [ASSIGNMENT_STATUS.PENDING]: 'bg-yellow-100 text-yellow-800',
      [ASSIGNMENT_STATUS.IN_PROGRESS]: 'bg-blue-100 text-blue-800',
      [ASSIGNMENT_STATUS.COMPLETED]: 'bg-green-100 text-green-800',
      [ASSIGNMENT_STATUS.OVERDUE]: 'bg-red-100 text-red-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getStatusText = (status) => {
    const statusTexts = {
      [ASSIGNMENT_STATUS.PENDING]: 'Pendiente',
      [ASSIGNMENT_STATUS.IN_PROGRESS]: 'En Progreso',
      [ASSIGNMENT_STATUS.COMPLETED]: 'Completado',
      [ASSIGNMENT_STATUS.OVERDUE]: 'Vencido'
    }
    return statusTexts[status] || status
  }

  const getPriorityText = (priority) => {
    const priorityTexts = {
      [ASSIGNMENT_PRIORITY.LOW]: 'Baja',
      [ASSIGNMENT_PRIORITY.MEDIUM]: 'Media',
      [ASSIGNMENT_PRIORITY.HIGH]: 'Alta',
      [ASSIGNMENT_PRIORITY.CRITICAL]: 'Crítica'
    }
    return priorityTexts[priority] || priority
  }

  const isOverdue = (dueDate, status) => {
    return status !== ASSIGNMENT_STATUS.COMPLETED && new Date(dueDate) < new Date()
  }

  const getDaysUntilDue = (dueDate) => {
    const due = new Date(dueDate)
    const now = new Date()
    const diffTime = due - now
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  if (!user) {
    return (
      <div className="pt-16 min-h-screen bg-gradient-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Acceso Requerido
            </h1>
            <p className="text-gray-600 mb-8">
              Debes iniciar sesión para ver tus asignaciones
            </p>
            <Link to="/login" className="btn-primary">
              Iniciar Sesión
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-16 min-h-screen bg-gradient-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-heading font-bold text-gradient mb-2">
                Mis Asignaciones
              </h1>
              <p className="text-gray-600">
                Gestiona y realiza seguimiento a tus tareas asignadas
              </p>
            </div>
            
            <button
              onClick={fetchAssignments}
              className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors duration-200"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualizar
            </button>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Todos los estados</option>
                  <option value={ASSIGNMENT_STATUS.PENDING}>Pendiente</option>
                  <option value={ASSIGNMENT_STATUS.IN_PROGRESS}>En Progreso</option>
                  <option value={ASSIGNMENT_STATUS.COMPLETED}>Completado</option>
                  <option value={ASSIGNMENT_STATUS.OVERDUE}>Vencido</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prioridad
                </label>
                <select
                  value={filters.priority}
                  onChange={(e) => handleFilterChange('priority', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Todas las prioridades</option>
                  <option value={ASSIGNMENT_PRIORITY.LOW}>Baja</option>
                  <option value={ASSIGNMENT_PRIORITY.MEDIUM}>Media</option>
                  <option value={ASSIGNMENT_PRIORITY.HIGH}>Alta</option>
                  <option value={ASSIGNMENT_PRIORITY.CRITICAL}>Crítica</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => {
                    setFilters({ status: '', priority: '' })
                    setPagination(prev => ({ ...prev, page: 1 }))
                  }}
                  className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-200"
                >
                  Limpiar Filtros
                </button>
              </div>
            </div>
          </div>

          {/* Results Info */}
          <div className="flex items-center justify-between text-sm text-gray-600 mb-6">
            <span>
              Mostrando {assignments.length} de {pagination.total} asignaciones
            </span>
            {pagination.totalPages > 1 && (
              <span>
                Página {pagination.page} de {pagination.totalPages}
              </span>
            )}
          </div>

          {/* Assignments List */}
          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="xl" />
            </div>
          ) : assignments.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <div className="bg-white rounded-lg shadow-sm p-8">
                <CheckSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  Sistema de Asignaciones
                </h3>
                <p className="text-gray-600 mb-4">
                  {Object.values(filters).some(filter => filter) 
                    ? 'No se encontraron asignaciones con los filtros seleccionados' 
                    : 'El sistema de asignaciones está siendo desarrollado. Próximamente estará disponible con todas las funcionalidades para gestionar tus tareas académicas.'}
                </p>
                {!Object.values(filters).some(filter => filter) && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-blue-700">
                          <strong>Próximamente:</strong> Gestión completa de asignaciones, envío de tareas, calificaciones y retroalimentación.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <>
              <div className="space-y-4">
                {assignments.map((assignment) => {
                  const daysUntilDue = getDaysUntilDue(assignment.dueDate)
                  const overdue = isOverdue(assignment.dueDate, assignment.status)
                  
                  return (
                    <motion.div
                      key={assignment._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 p-6"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h3 className="text-lg font-heading font-semibold text-gray-800 mb-2">
                                {assignment.title}
                              </h3>
                              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                {assignment.description}
                              </p>
                            </div>
                            
                            {overdue && (
                              <div className="ml-4">
                                <AlertTriangle className="w-5 h-5 text-red-500" />
                              </div>
                            )}
                          </div>

                          <div className="flex flex-wrap gap-2 mb-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(assignment.status)}`}>
                              {getStatusText(assignment.status)}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(assignment.priority)}`}>
                              {getPriorityText(assignment.priority)}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              <span>
                                Vence: {formatDate(assignment.dueDate)}
                                {!overdue && daysUntilDue >= 0 && (
                                  <span className={`ml-2 ${daysUntilDue <= 3 ? 'text-red-600 font-medium' : ''}`}>
                                    ({daysUntilDue === 0 ? 'Hoy' : `${daysUntilDue} día${daysUntilDue > 1 ? 's' : ''}`})
                                  </span>
                                )}
                                {overdue && (
                                  <span className="ml-2 text-red-600 font-medium">
                                    (Vencido hace {Math.abs(daysUntilDue)} día{Math.abs(daysUntilDue) > 1 ? 's' : ''})
                                  </span>
                                )}
                              </span>
                            </div>
                            
                            {assignment.project && (
                              <div className="flex items-center">
                                <CheckSquare className="w-4 h-4 mr-1" />
                                <span>
                                  Proyecto: {typeof assignment.project === 'string' 
                                    ? 'Proyecto' 
                                    : assignment.project.title || 'Sin título'}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Link
                            to={`/assignments/${assignment._id}`}
                            className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors duration-200"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Ver Detalles
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                      disabled={pagination.page === 1}
                      className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Anterior
                    </button>
                    
                    {[...Array(pagination.totalPages)].map((_, index) => {
                      const page = index + 1
                      const isCurrentPage = page === pagination.page
                      
                      if (
                        page === 1 ||
                        page === pagination.totalPages ||
                        (page >= pagination.page - 1 && page <= pagination.page + 1)
                      ) {
                        return (
                          <button
                            key={page}
                            onClick={() => setPagination(prev => ({ ...prev, page }))}
                            className={`px-3 py-2 text-sm rounded-md ${
                              isCurrentPage
                                ? 'bg-primary-600 text-white'
                                : 'bg-white border border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        )
                      } else if (
                        page === pagination.page - 2 ||
                        page === pagination.page + 2
                      ) {
                        return (
                          <span key={page} className="px-3 py-2 text-sm text-gray-500">
                            ...
                          </span>
                        )
                      }
                      return null
                    })}
                    
                    <button
                      onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                      disabled={pagination.page === pagination.totalPages}
                      className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Siguiente
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default AssignmentList