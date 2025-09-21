import { useState, useEffect, useContext } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  Users, 
  FolderOpen, 
  CheckSquare, 
  Calendar,
  TrendingUp,
  Clock,
  Plus,
  ArrowRight,
  Upload,
  Star,
  AlertTriangle
} from 'lucide-react'
import { AuthContext } from '../context/AuthContext'
import { projectService, assignmentService, eventService } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'
import ProjectCard from '../components/ProjectCard'
import AssignmentCard from '../components/AssignmentCard'
import SubmissionCard from '../components/SubmissionCard'
import { useAssignments } from '../hooks/useAssignments'
import { useSubmissions } from '../hooks/useSubmissions'
import { formatDate, ASSIGNMENT_PRIORITY, getPriorityColor } from '../utils/mongodb'
import { toast } from 'react-hot-toast'

const Dashboard = () => {
  const { user, loading: authLoading } = useContext(AuthContext)
  const [dashboardData, setDashboardData] = useState({
    projects: [],
    upcomingEvents: [],
    stats: {
      totalProjects: 0,
      myProjects: 0,
      upcomingEvents: 0
    }
  })
  const [loading, setLoading] = useState(true)

  // Usar hooks especializados con manejo de errores completo
  const assignmentsResult = useAssignments({ 
    limit: 5, 
    sortBy: 'dueDate',
    sortOrder: 'asc'
  })

  const submissionsResult = useSubmissions({ 
    limit: 5,
    sortBy: 'submittedAt',
    sortOrder: 'desc'
  })

  // Extraer datos con fallbacks seguros
  const assignments = assignmentsResult?.assignments || []
  const assignmentStats = assignmentsResult?.stats || { pendientes: 0, total: 0 }
  const assignmentsLoading = assignmentsResult?.loading || false

  const submissions = submissionsResult?.submissions || []
  const submissionStats = submissionsResult?.stats || { total: 0 }
  const submissionsLoading = submissionsResult?.loading || false

  // Hook para estadísticas globales simplificado (con fallbacks seguros)
  const globalAssignmentStats = {
    totalAssignments: assignments.length || 0,
    totalSubmissions: submissions.length || 0,
    averageGrade: 0,
    pendingReviews: 0
  }

  useEffect(() => {
    if (user && !authLoading) {
      fetchDashboardData()
    }
  }, [user, authLoading])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Cargar solo Projects y Events - evitar rutas problemáticas por ahora
      const promises = [
        // Proyectos con manejo de errores
        projectService.getProjects({ limit: 6 })
          .then(res => res.success ? res : { projects: [], pagination: { total: 0 } })
          .catch(err => {
            console.warn('Projects endpoint error:', err.message)
            return { projects: [], pagination: { total: 0 } }
          }),
        
        // Eventos próximos
        eventService.getEvents({ limit: 5 })
          .then(res => res.success ? res : { events: [] })
          .catch(err => {
            console.warn('Events endpoint error:', err.message)
            return { events: [] }
          })
      ]

      const [projectsRes, eventsRes] = await Promise.all(promises)

      // Calcular estadísticas basadas en datos reales del backend
      const totalProjects = projectsRes.pagination?.total || projectsRes.projects?.length || 0
      const upcomingEventsCount = eventsRes.events?.length || 0

      setDashboardData({
        projects: projectsRes.projects?.slice(0, 3) || [],
        upcomingEvents: eventsRes.events || [],
        stats: {
          totalProjects,
          myProjects: 0, // Será calculado por assignments/submissions hooks
          upcomingEvents: upcomingEventsCount
        }
      })

      console.log('Dashboard data loaded successfully', {
        totalProjects,
        events: eventsRes.events?.length || 0
      })

    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      toast.error('Error al cargar el dashboard')
      
      // Fallback con datos vacíos para mantener UI funcional
      setDashboardData({
        projects: [],
        upcomingEvents: [],
        stats: {
          totalProjects: 0,
          myProjects: 0,
          upcomingEvents: 0
        }
      })
    } finally {
      setLoading(false)
    }
  }

  if (authLoading || !user) {
    return (
      <div className="pt-16 min-h-screen bg-gradient-soft flex items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    )
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

  // Estadísticas dinámicas usando datos reales de los hooks
  const statCards = [
    {
      title: 'Total Proyectos',
      value: dashboardData.stats.totalProjects,
      icon: FolderOpen,
      color: 'bg-blue-500',
      link: '/projects'
    },
    {
      title: 'Mis Proyectos',
      value: dashboardData.stats.myProjects,
      icon: Users,
      color: 'bg-green-500',
      link: '/projects'
    },
    {
      title: 'Tareas Pendientes',
      value: assignmentStats.pendientes || 0,
      icon: CheckSquare,
      color: 'bg-yellow-500',
      link: '/assignments'
    },
    {
      title: user.role === 'estudiante' ? 'Mis Entregas' : 'Total Entregas',
      value: user.role === 'estudiante' ? submissionStats.total : globalAssignmentStats.totalSubmissions || 0,
      icon: Upload,
      color: 'bg-purple-500',
      link: '/assignments'
    }
  ]

  // Filtrar assignments próximos a vencer (menos de 3 días) con fallback seguro
  const urgentAssignments = (assignments || []).filter(assignment => {
    try {
      const dueDate = new Date(assignment.dueDate)
      const now = new Date()
      const diffTime = dueDate.getTime() - now.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      return diffDays <= 3 && diffDays > 0
    } catch (error) {
      console.warn('Error calculating due date for assignment:', assignment._id)
      return false
    }
  })

  // Submissions recientes para estudiantes con fallback seguro
  const recentSubmissions = (submissions || []).slice(0, 3)

  return (
    <div className="pt-16 min-h-screen bg-gradient-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-gradient mb-2">
              ¡Hola, {user.name}!
            </h1>
            <p className="text-xl text-gray-600">
              Bienvenido de vuelta al Semillero GUIA
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link
                  to={stat.link}
                  className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 p-6 group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 group-hover:text-gray-800">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stat.value}
                      </p>
                    </div>
                    <div className={`${stat.color} p-3 rounded-lg text-white`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Projects */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-heading font-semibold text-gray-800">
                  Proyectos Recientes
                </h2>
                <Link
                  to="/projects"
                  className="flex items-center text-primary-600 hover:text-primary-700 transition-colors duration-200"
                >
                  Ver todos
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
              
              {dashboardData.projects.length === 0 ? (
                <div className="text-center py-8">
                  <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 mb-4">No hay proyectos disponibles</p>
                  {(user.role === 'docente' || user.role === 'admin') && (
                    <Link
                      to="/projects/create"
                      className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors duration-200"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Crear Proyecto
                    </Link>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {dashboardData.projects.map((project) => (
                    <div key={project._id} className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-medium text-gray-800 mb-2">{project.title}</h3>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {project.description}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{project.members?.length || 0} miembros</span>
                        <span>{project.category}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Assignments & Submissions Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-heading font-semibold text-gray-800">
                  {user.role === 'estudiante' ? 'Mis Tareas' : 'Tareas Urgentes'}
                </h2>
                <Link
                  to="/assignments"
                  className="flex items-center text-primary-600 hover:text-primary-700 transition-colors duration-200"
                >
                  Ver todas
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
              
              {(assignments && assignments.length === 0) ? (
                <div className="text-center py-8">
                  <CheckSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 mb-4">No hay tareas pendientes</p>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-sm text-green-700">
                      ¡Excelente! Estás al día con todas tus tareas
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {urgentAssignments.length > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                        <span className="text-sm font-medium text-red-600">Urgentes (vencen pronto)</span>
                      </div>
                      {urgentAssignments.slice(0, 2).map((assignment) => (
                        <div key={assignment._id} className="mb-3">
                          <AssignmentCard 
                            assignment={assignment} 
                            compact={true}
                            showUrgent={true}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {assignments && assignments.length > 0 && (
                    <div>
                      <span className="text-sm font-medium text-gray-600 mb-2 block">Próximas tareas</span>
                      {assignments.slice(0, 3).map((assignment) => {
                        try {
                          return (
                            <div key={assignment._id || assignment.id || Math.random()} className="mb-3">
                              <AssignmentCard 
                                assignment={assignment} 
                                compact={true}
                              />
                            </div>
                          )
                        } catch (error) {
                          console.warn('Error rendering assignment card:', error)
                          return null
                        }
                      })}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </div>

          {/* Student Submissions Section */}
          {user.role === 'estudiante' && recentSubmissions && recentSubmissions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-8 bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-heading font-semibold text-gray-800">
                  Mis Entregas Recientes
                </h2>
                <Link
                  to="/assignments"
                  className="flex items-center text-primary-600 hover:text-primary-700 transition-colors duration-200"
                >
                  Ver todas
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
              
              <div className="space-y-4">
                {recentSubmissions.map((submission) => {
                  try {
                    return (
                      <SubmissionCard 
                        key={submission._id || submission.id || Math.random()} 
                        submission={submission}
                        assignment={(assignments || []).find(a => a._id === submission.assignmentId)}
                        compact={true}
                      />
                    )
                  } catch (error) {
                    console.warn('Error rendering submission card:', error)
                    return null
                  }
                })}
              </div>
            </motion.div>
          )}

          {/* Teacher Dashboard Statistics */}
          {(user.role === 'docente' || user.role === 'admin') && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-8 bg-white rounded-lg shadow-md p-6"
            >
              <h2 className="text-xl font-heading font-semibold text-gray-800 mb-6">
                Estadísticas de Enseñanza
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {globalAssignmentStats.totalAssignments || 0}
                  </div>
                  <div className="text-sm text-gray-600">Tareas Creadas</div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {globalAssignmentStats.averageGrade?.toFixed(1) || '0.0'}
                  </div>
                  <div className="text-sm text-gray-600">Promedio General</div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {globalAssignmentStats.pendingReviews || 0}
                  </div>
                  <div className="text-sm text-gray-600">Pendientes de Revisar</div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Upcoming Events */}
          {dashboardData.upcomingEvents.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-8 bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-heading font-semibold text-gray-800">
                  Próximos Eventos
                </h2>
                <Link
                  to="/eventos"
                  className="flex items-center text-primary-600 hover:text-primary-700 transition-colors duration-200"
                >
                  Ver todos
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dashboardData.upcomingEvents.map((event) => (
                  <div key={event._id} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-medium text-gray-800 mb-2">{event.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {formatDate(event.startDate)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {event.location || 'Ubicación virtual'}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default Dashboard