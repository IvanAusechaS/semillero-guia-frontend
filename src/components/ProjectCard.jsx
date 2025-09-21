import { motion } from 'framer-motion'
import { Calendar, Users, User, Eye, Edit } from 'lucide-react'
import { 
  getProjectStatusColor, 
  formatDate, 
  PROJECT_STATUS, 
  PROJECT_CATEGORIES 
} from '../utils/mongodb'

const ProjectCard = ({ project, onView, onEdit, onJoin, onLeave, currentUser, canEdit = false }) => {
  const isProjectMember = project.members?.some(member => 
    (typeof member === 'string' ? member : member._id) === currentUser?._id
  )
  const isProjectLeader = (typeof project.leader === 'string' ? project.leader : project.leader?._id) === currentUser?._id

  const handleActionClick = (action, e) => {
    e.stopPropagation()
    action()
  }

  const getStatusText = (status) => {
    const statusTexts = {
      [PROJECT_STATUS.PLANNING]: 'Planificación',
      [PROJECT_STATUS.IN_PROGRESS]: 'En Progreso',
      [PROJECT_STATUS.COMPLETED]: 'Completado',
      [PROJECT_STATUS.PAUSED]: 'Pausado'
    }
    return statusTexts[status] || status
  }

  const getCategoryText = (category) => {
    const categoryTexts = {
      [PROJECT_CATEGORIES.RESEARCH]: 'Investigación',
      [PROJECT_CATEGORIES.DEVELOPMENT]: 'Desarrollo',
      [PROJECT_CATEGORIES.EXTENSION]: 'Extensión'
    }
    return categoryTexts[category] || category
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 p-6 cursor-pointer"
      onClick={() => onView && onView(project._id)}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-heading font-semibold text-gray-800 mb-2 line-clamp-2">
            {project.title}
          </h3>
          <div className="flex flex-wrap gap-2 mb-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getProjectStatusColor(project.status)}`}>
              {getStatusText(project.status)}
            </span>
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {getCategoryText(project.category)}
            </span>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
        {project.description}
      </p>

      {/* Project Info */}
      <div className="space-y-2 mb-4">
        {/* Leader */}
        <div className="flex items-center text-sm text-gray-600">
          <User className="w-4 h-4 mr-2" />
          <span>
            Líder: {typeof project.leader === 'string' 
              ? 'Usuario' 
              : project.leader?.name || 'No asignado'}
          </span>
        </div>

        {/* Members count */}
        <div className="flex items-center text-sm text-gray-600">
          <Users className="w-4 h-4 mr-2" />
          <span>
            {project.members?.length || 0} miembro{project.members?.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Dates */}
        {project.startDate && (
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-2" />
            <span>Inicio: {formatDate(project.startDate)}</span>
          </div>
        )}
        
        {project.endDate && (
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-2" />
            <span>Fin: {formatDate(project.endDate)}</span>
          </div>
        )}
      </div>

      {/* Tags */}
      {project.tags && project.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {project.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
            >
              {tag}
            </span>
          ))}
          {project.tags.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
              +{project.tags.length - 3} más
            </span>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
        <button
          onClick={(e) => handleActionClick(() => onView(project._id), e)}
          className="flex items-center px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
        >
          <Eye className="w-4 h-4 mr-1" />
          Ver
        </button>

        {canEdit && (isProjectLeader || currentUser?.role === 'admin' || currentUser?.role === 'docente') && (
          <button
            onClick={(e) => handleActionClick(() => onEdit(project._id), e)}
            className="flex items-center px-3 py-2 text-sm bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors duration-200"
          >
            <Edit className="w-4 h-4 mr-1" />
            Editar
          </button>
        )}

        {/* Join/Leave project buttons */}
        {currentUser && project.status !== PROJECT_STATUS.COMPLETED && (
          <>
            {!isProjectMember && !isProjectLeader && onJoin && (
              <button
                onClick={(e) => handleActionClick(() => onJoin(project._id), e)}
                className="flex items-center px-3 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200"
              >
                <Users className="w-4 h-4 mr-1" />
                Unirse
              </button>
            )}

            {isProjectMember && !isProjectLeader && onLeave && (
              <button
                onClick={(e) => handleActionClick(() => onLeave(project._id), e)}
                className="flex items-center px-3 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200"
              >
                <Users className="w-4 h-4 mr-1" />
                Salir
              </button>
            )}
          </>
        )}
      </div>
    </motion.div>
  )
}

export default ProjectCard