import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Calendar, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  Play,
  BookOpen,
  User,
  FileText
} from 'lucide-react'
import { ASSIGNMENT_STATUS, ASSIGNMENT_PRIORITY } from '../services/api'

/**
 * Componente AssignmentCard - Para mostrar asignaciones en el Dashboard
 * Compatible con la estructura MongoDB del backend
 */
const AssignmentCard = ({ assignment, onUpdate, compact = false, showUrgent = false }) => {
  const [isHovered, setIsHovered] = useState(false)

  // Colores para prioridades según backend
  const getPriorityColor = (priority) => {
    const colors = {
      [ASSIGNMENT_PRIORITY.LOW]: 'bg-green-100 text-green-800 border-green-200',
      [ASSIGNMENT_PRIORITY.MEDIUM]: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      [ASSIGNMENT_PRIORITY.HIGH]: 'bg-orange-100 text-orange-800 border-orange-200',
      [ASSIGNMENT_PRIORITY.CRITICAL]: 'bg-red-100 text-red-800 border-red-200'
    }
    return colors[priority] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  // Colores para estados según backend
  const getStatusColor = (status) => {
    const colors = {
      [ASSIGNMENT_STATUS.PENDING]: 'bg-gray-100 text-gray-800 border-gray-200',
      [ASSIGNMENT_STATUS.IN_PROGRESS]: 'bg-blue-100 text-blue-800 border-blue-200',
      [ASSIGNMENT_STATUS.COMPLETED]: 'bg-green-100 text-green-800 border-green-200',
      [ASSIGNMENT_STATUS.OVERDUE]: 'bg-red-100 text-red-800 border-red-200'
    }
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  // Texto legible para estados
  const getStatusText = (status) => {
    const statusTexts = {
      [ASSIGNMENT_STATUS.PENDING]: 'Pendiente',
      [ASSIGNMENT_STATUS.IN_PROGRESS]: 'En Progreso',
      [ASSIGNMENT_STATUS.COMPLETED]: 'Completado',
      [ASSIGNMENT_STATUS.OVERDUE]: 'Vencido'
    }
    return statusTexts[status] || status
  }

  // Texto legible para prioridades
  const getPriorityText = (priority) => {
    const priorityTexts = {
      [ASSIGNMENT_PRIORITY.LOW]: 'Baja',
      [ASSIGNMENT_PRIORITY.MEDIUM]: 'Media', 
      [ASSIGNMENT_PRIORITY.HIGH]: 'Alta',
      [ASSIGNMENT_PRIORITY.CRITICAL]: 'Crítica'
    }
    return priorityTexts[priority] || priority
  }

  // Verificar si está vencido
  const isOverdue = () => {
    return assignment.status !== ASSIGNMENT_STATUS.COMPLETED && 
           new Date(assignment.dueDate) < new Date()
  }

  // Calcular días restantes
  const getDaysUntilDue = () => {
    const due = new Date(assignment.dueDate)
    const now = new Date()
    const diffTime = due - now
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  // Formatear fecha
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Obtener icono según estado
  const getStatusIcon = (status) => {
    const icons = {
      [ASSIGNMENT_STATUS.PENDING]: <Clock className="w-4 h-4" />,
      [ASSIGNMENT_STATUS.IN_PROGRESS]: <Play className="w-4 h-4" />,
      [ASSIGNMENT_STATUS.COMPLETED]: <CheckCircle className="w-4 h-4" />,
      [ASSIGNMENT_STATUS.OVERDUE]: <AlertTriangle className="w-4 h-4" />
    }
    return icons[status] || <Clock className="w-4 h-4" />
  }

  const daysUntilDue = getDaysUntilDue()
  const overdue = isOverdue()

  // Versión compacta para dashboard
  if (compact) {
    return (
      <div className={`border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-all duration-200 ${showUrgent ? 'border-red-300 bg-red-50' : 'bg-white'}`}>
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-medium text-gray-800 text-sm line-clamp-1">
            {assignment.title}
          </h3>
          <div className="flex items-center space-x-1">
            {showUrgent && (
              <AlertTriangle className="w-4 h-4 text-red-500" />
            )}
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(assignment.priority)}`}>
              {assignment.priority}
            </span>
          </div>
        </div>
        
        <p className="text-xs text-gray-600 mb-2 line-clamp-2">
          {assignment.description}
        </p>
        
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            <span>
              {formatDate(assignment.dueDate)}
              {daysUntilDue >= 0 ? (
                <span className={`ml-1 ${daysUntilDue <= 3 ? 'text-red-600 font-medium' : 'text-green-600'}`}>
                  ({daysUntilDue === 0 ? 'Hoy' : `${daysUntilDue}d`})
                </span>
              ) : (
                <span className="ml-1 text-red-600 font-medium">
                  (Vencido)
                </span>
              )}
            </span>
          </div>
          
          <Link
            to={`/assignments/${assignment._id}`}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Ver →
          </Link>
        </div>
      </div>
    )
  }

  // Versión completa normal

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`
        bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-6 border
        ${overdue ? 'border-l-4 border-l-red-500' : 'border-l-4 border-l-primary-500'}
        ${isHovered ? 'transform -translate-y-1' : ''}
      `}
    >
      {/* Header con título y badges */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-heading font-semibold text-gray-800 mb-2 line-clamp-2">
            {assignment.title}
          </h3>
          
          <div className="flex flex-wrap gap-2">
            {/* Badge de estado */}
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(assignment.status)}`}>
              {getStatusIcon(assignment.status)}
              <span className="ml-1">{getStatusText(assignment.status)}</span>
            </span>
            
            {/* Badge de prioridad */}
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(assignment.priority)}`}>
              {getPriorityText(assignment.priority)}
            </span>
          </div>
        </div>
        
        {/* Indicador de vencimiento */}
        {overdue && (
          <div className="ml-4">
            <AlertTriangle className="w-6 h-6 text-red-500" />
          </div>
        )}
      </div>

      {/* Descripción */}
      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
        {assignment.description}
      </p>

      {/* Información adicional */}
      <div className="space-y-2 mb-4">
        {/* Proyecto */}
        {assignment.project && (
          <div className="flex items-center text-sm text-gray-600">
            <BookOpen className="w-4 h-4 mr-2 text-gray-400" />
            <span>
              <strong>Proyecto:</strong> {
                typeof assignment.project === 'string' 
                  ? assignment.project 
                  : assignment.project.title || 'Sin título'
              }
            </span>
          </div>
        )}

        {/* Fecha de vencimiento */}
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="w-4 h-4 mr-2 text-gray-400" />
          <span>
            <strong>Vence:</strong> {formatDate(assignment.dueDate)}
            {!overdue && daysUntilDue >= 0 && (
              <span className={`ml-2 ${daysUntilDue <= 3 ? 'text-red-600 font-medium' : 'text-green-600'}`}>
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

        {/* Asignado por */}
        {assignment.assignedBy && (
          <div className="flex items-center text-sm text-gray-600">
            <User className="w-4 h-4 mr-2 text-gray-400" />
            <span>
              <strong>Asignado por:</strong> {
                typeof assignment.assignedBy === 'string'
                  ? 'Docente'
                  : assignment.assignedBy.name
              }
            </span>
          </div>
        )}

        {/* Horas estimadas */}
        {assignment.estimatedHours && (
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="w-4 h-4 mr-2 text-gray-400" />
            <span>
              <strong>Tiempo estimado:</strong> {assignment.estimatedHours}h
            </span>
          </div>
        )}

        {/* Puntos máximos */}
        {assignment.maxPoints && (
          <div className="flex items-center text-sm text-gray-600">
            <FileText className="w-4 h-4 mr-2 text-gray-400" />
            <span>
              <strong>Puntos:</strong> {assignment.maxPoints} pts
            </span>
          </div>
        )}
      </div>

      {/* Tags */}
      {assignment.tags && assignment.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {assignment.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-md"
            >
              #{tag}
            </span>
          ))}
          {assignment.tags.length > 3 && (
            <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-md">
              +{assignment.tags.length - 3} más
            </span>
          )}
        </div>
      )}

      {/* Acciones */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex gap-2">
          <Link
            to={`/assignments/${assignment._id}`}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-md transition-colors duration-200"
          >
            <FileText className="w-4 h-4 mr-1" />
            Ver Detalles
          </Link>
          
          {assignment.status !== ASSIGNMENT_STATUS.COMPLETED && (
            <Link
              to={`/assignments/${assignment._id}/submit`}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md transition-colors duration-200"
            >
              <Play className="w-4 h-4 mr-1" />
              {assignment.status === ASSIGNMENT_STATUS.PENDING ? 'Comenzar' : 'Continuar'}
            </Link>
          )}
        </div>

        {/* Indicador de progreso */}
        <div className="text-xs text-gray-500">
          {assignment.progress && (
            <span>{assignment.progress}% completado</span>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default AssignmentCard