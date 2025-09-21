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
  ArrowRight
} from 'lucide-react'
import { AuthContext } from '../context/AuthContext'
import { projectService, assignmentService, eventService } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'
import ProjectCard from '../components/ProjectCard'
import { formatDate, ASSIGNMENT_PRIORITY, getPriorityColor } from '../utils/mongodb'
import toast from 'react-hot-toast'

const Dashboard = () => {
  const { user, loading: authLoading } = useContext(AuthContext)
  const [dashboardData, setDashboardData] = useState({
    projects: [],
    assignments: [],
    upcomingEvents: [],
    stats: {
      totalProjects: 0,
      myProjects: 0,
      pendingAssignments: 0,
      upcomingEvents: 0
    }
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user && !authLoading) {
      fetchDashboardData()
    }
  }, [user, authLoading])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Fetch data in parallel
      const [projectsRes, assignmentsRes, eventsRes] = await Promise.all([
        projectService.getProjects({ limit: 6 }),
        assignmentService.getMyAssignments({ status: 'pendiente', limit: 5 }),
        eventService.getEvents({ upcoming: true, limit: 5 })
      ])

      // Calculate stats
      const myProjectsCount = projectsRes.projects?.filter(project => 
        project.members?.some(member => 
          (typeof member === 'string' ? member : member._id) === user._id
        ) || 
        (typeof project.leader === 'string' ? project.leader : project.leader?._id) === user._id
      ).length || 0

      setDashboardData({
        projects: projectsRes.projects?.slice(0, 3) || [],
        assignments: assignmentsRes.assignments || [],
        upcomingEvents: eventsRes.events || [],
        stats: {
          totalProjects: projectsRes.pagination?.total || 0,
          myProjects: myProjectsCount,
          pendingAssignments: assignmentsRes.assignments?.length || 0,
          upcomingEvents: eventsRes.events?.length || 0
        }
      })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      toast.error('Error al cargar el dashboard')
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
      value: dashboardData.stats.pendingAssignments,
      icon: CheckSquare,
      color: 'bg-yellow-500',
      link: '/assignments'
    },
    {
      title: 'Próximos Eventos',
      value: dashboardData.stats.upcomingEvents,
      icon: Calendar,
      color: 'bg-purple-500',
      link: '/eventos'
    }
  ]

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

            {/* Pending Assignments */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-heading font-semibold text-gray-800">
                  Tareas Pendientes
                </h2>
                <Link
                  to="/assignments"
                  className="flex items-center text-primary-600 hover:text-primary-700 transition-colors duration-200"
                >
                  Ver todas
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
              
              {dashboardData.assignments.length === 0 ? (
                <div className="text-center py-8">
                  <CheckSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">¡Todas las tareas completadas!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {dashboardData.assignments.map((assignment) => (
                    <div key={assignment._id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-medium text-gray-800 text-sm">
                          {assignment.title}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(assignment.priority)}`}>
                          {assignment.priority}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">
                        {assignment.description}
                      </p>
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="w-3 h-3 mr-1" />
                        <span>Vence: {formatDate(assignment.dueDate)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

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