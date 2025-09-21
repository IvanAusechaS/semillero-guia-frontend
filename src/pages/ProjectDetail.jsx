import { useState, useEffect, useContext } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  Users, 
  User, 
  Calendar, 
  Edit, 
  Trash2,
  UserPlus,
  UserMinus,
  CheckSquare,
  Plus
} from 'lucide-react'
import { projectService, assignmentService } from '../services/api'
import { AuthContext } from '../context/AuthContext'
import LoadingSpinner from '../components/LoadingSpinner'
import { 
  getProjectStatusColor, 
  formatDate, 
  PROJECT_STATUS,
  PROJECT_CATEGORIES 
} from '../utils/mongodb'
import toast from 'react-hot-toast'

const ProjectDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)
  const [project, setProject] = useState(null)
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)
  const [assignmentsLoading, setAssignmentsLoading] = useState(false)

  useEffect(() => {
    if (id) {
      fetchProjectDetail()
      fetchProjectAssignments()
    }
  }, [id])

  const fetchProjectDetail = async () => {
    try {
      setLoading(true)
      const response = await projectService.getProjectById(id)
      setProject(response.project)
    } catch (error) {
      console.error('Error fetching project:', error)
      toast.error('Error al cargar el proyecto')
      navigate('/projects')
    } finally {
      setLoading(false)
    }
  }

  const fetchProjectAssignments = async () => {
    try {
      setAssignmentsLoading(true)
      // TODO: Implementar endpoint para obtener asignaciones de un proyecto
      // const response = await assignmentService.getByProject(id)
      // setAssignments(response.assignments)
    } catch (error) {
      console.error('Error fetching assignments:', error)
    } finally {
      setAssignmentsLoading(false)
    }
  }

  const handleJoinProject = async () => {
    try {
      await projectService.joinProject(id)
      toast.success('Te has unido al proyecto exitosamente')
      fetchProjectDetail() // Refresh project data
    } catch (error) {
      console.error('Error joining project:', error)
      toast.error(error.response?.data?.message || 'Error al unirse al proyecto')
    }
  }

  const handleLeaveProject = async () => {
    if (window.confirm('¿Estás seguro de que quieres salir de este proyecto?')) {
      try {
        await projectService.leaveProject(id)
        toast.success('Has salido del proyecto')
        fetchProjectDetail() // Refresh project data
      } catch (error) {
        console.error('Error leaving project:', error)
        toast.error(error.response?.data?.message || 'Error al salir del proyecto')
      }
    }
  }

  const handleDeleteProject = async () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este proyecto? Esta acción no se puede deshacer.')) {
      try {
        await projectService.deleteProject(id)
        toast.success('Proyecto eliminado exitosamente')
        navigate('/projects')
      } catch (error) {
        console.error('Error deleting project:', error)
        toast.error(error.response?.data?.message || 'Error al eliminar el proyecto')
      }
    }
  }

  if (loading) {
    return (
      <div className="pt-16 min-h-screen bg-gradient-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex justify-center">
            <LoadingSpinner size="xl" />
          </div>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="pt-16 min-h-screen bg-gradient-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Proyecto no encontrado</h1>
            <Link to="/projects" className="btn-primary">
              Volver a Proyectos
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const isProjectMember = project.members?.some(member => 
    (typeof member === 'string' ? member : member._id) === user?._id
  )
  const isProjectLeader = (typeof project.leader === 'string' ? project.leader : project.leader?._id) === user?._id
  const canEdit = user && (isProjectLeader || user.role === 'admin' || user.role === 'docente')
  const canJoinLeave = user && project.status !== PROJECT_STATUS.COMPLETED

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
    <div className="pt-16 min-h-screen bg-gradient-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Back button */}
          <div className="mb-6">
            <button
              onClick={() => navigate('/projects')}
              className="flex items-center text-gray-600 hover:text-gray-800 transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Volver a Proyectos
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-primary text-white p-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex-1">
                  <h1 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                    {project.title}
                  </h1>
                  <div className="flex flex-wrap gap-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium bg-white bg-opacity-20`}>
                      {getStatusText(project.status)}
                    </span>
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-white bg-opacity-20">
                      {getCategoryText(project.category)}
                    </span>
                  </div>
                </div>
                
                {/* Action buttons */}
                <div className="flex flex-wrap gap-2">
                  {canEdit && (
                    <>
                      <button
                        onClick={() => navigate(`/projects/${id}/edit`)}
                        className="flex items-center px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-md transition-colors duration-200"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Editar
                      </button>
                      <button
                        onClick={handleDeleteProject}
                        className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md transition-colors duration-200"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Eliminar
                      </button>
                    </>
                  )}
                  
                  {canJoinLeave && (
                    <>
                      {!isProjectMember && !isProjectLeader && (
                        <button
                          onClick={handleJoinProject}
                          className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md transition-colors duration-200"
                        >
                          <UserPlus className="w-4 h-4 mr-2" />
                          Unirse
                        </button>
                      )}
                      
                      {isProjectMember && !isProjectLeader && (
                        <button
                          onClick={handleLeaveProject}
                          className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md transition-colors duration-200"
                        >
                          <UserMinus className="w-4 h-4 mr-2" />
                          Salir
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main content */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Description */}
                  <div>
                    <h2 className="text-2xl font-heading font-semibold text-gray-800 mb-4">
                      Descripción
                    </h2>
                    <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                      {project.description}
                    </p>
                  </div>

                  {/* Tags */}
                  {project.tags && project.tags.length > 0 && (
                    <div>
                      <h3 className="text-lg font-heading font-semibold text-gray-800 mb-3">
                        Etiquetas
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Assignments */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-heading font-semibold text-gray-800">
                        Asignaciones
                      </h3>
                      {(isProjectLeader || user?.role === 'docente' || user?.role === 'admin') && (
                        <button className="flex items-center px-3 py-2 text-sm bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors duration-200">
                          <Plus className="w-4 h-4 mr-1" />
                          Nueva Asignación
                        </button>
                      )}
                    </div>
                    
                    {assignmentsLoading ? (
                      <div className="flex justify-center py-8">
                        <LoadingSpinner />
                      </div>
                    ) : assignments.length === 0 ? (
                      <div className="text-center py-8 bg-gray-50 rounded-lg">
                        <CheckSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-600">No hay asignaciones para este proyecto</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {assignments.map((assignment) => (
                          <div
                            key={assignment._id}
                            className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors duration-200"
                          >
                            <h4 className="font-medium text-gray-800 mb-2">
                              {assignment.title}
                            </h4>
                            <p className="text-sm text-gray-600 mb-2">
                              {assignment.description}
                            </p>
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <span>Vence: {formatDate(assignment.dueDate)}</span>
                              <span className={`px-2 py-1 rounded-full font-medium ${getPriorityColor(assignment.priority)}`}>
                                {assignment.priority}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Project Info */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-heading font-semibold text-gray-800 mb-4">
                      Información del Proyecto
                    </h3>
                    
                    <div className="space-y-4">
                      {/* Leader */}
                      <div className="flex items-center">
                        <User className="w-5 h-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">Líder</p>
                          <p className="text-sm text-gray-600">
                            {typeof project.leader === 'string' 
                              ? 'Usuario' 
                              : project.leader?.name || 'No asignado'}
                          </p>
                        </div>
                      </div>

                      {/* Members count */}
                      <div className="flex items-center">
                        <Users className="w-5 h-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">Miembros</p>
                          <p className="text-sm text-gray-600">
                            {project.members?.length || 0} miembro{project.members?.length !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>

                      {/* Dates */}
                      {project.startDate && (
                        <div className="flex items-center">
                          <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                          <div>
                            <p className="text-sm font-medium text-gray-700">Fecha de inicio</p>
                            <p className="text-sm text-gray-600">{formatDate(project.startDate)}</p>
                          </div>
                        </div>
                      )}

                      {project.endDate && (
                        <div className="flex items-center">
                          <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                          <div>
                            <p className="text-sm font-medium text-gray-700">Fecha de fin</p>
                            <p className="text-sm text-gray-600">{formatDate(project.endDate)}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Members list */}
                  {project.members && project.members.length > 0 && (
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-lg font-heading font-semibold text-gray-800 mb-4">
                        Miembros del Equipo
                      </h3>
                      
                      <div className="space-y-3">
                        {project.members.map((member, index) => (
                          <div key={index} className="flex items-center">
                            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                              <User className="w-4 h-4 text-gray-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-800">
                                {typeof member === 'string' ? 'Usuario' : member.name || 'Usuario'}
                              </p>
                              <p className="text-xs text-gray-600">
                                {typeof member === 'string' ? 'Miembro' : member.role || 'Miembro'}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default ProjectDetail