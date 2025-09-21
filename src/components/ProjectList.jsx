import { useState, useEffect, useContext } from 'react'
import { motion } from 'framer-motion'
import { Plus, Search, Filter, RefreshCw } from 'lucide-react'
import { projectService } from '../services/api'
import { AuthContext } from '../context/AuthContext'
import ProjectCard from './ProjectCard'
import LoadingSpinner from './LoadingSpinner'
import { PROJECT_STATUS, PROJECT_CATEGORIES } from '../utils/mongodb'
import toast from 'react-hot-toast'

const ProjectList = ({ onCreateProject, onViewProject, onEditProject }) => {
  const { user } = useContext(AuthContext)
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    search: ''
  })
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0
  })

  useEffect(() => {
    fetchProjects()
  }, [filters, pagination.page])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...(filters.category && { category: filters.category }),
        ...(filters.status && { status: filters.status }),
        ...(filters.search && { search: filters.search })
      }

      const response = await projectService.getProjects(params)
      setProjects(response.projects || [])
      setPagination(prev => ({
        ...prev,
        total: response.pagination?.total || 0,
        totalPages: response.pagination?.totalPages || 0
      }))
    } catch (error) {
      console.error('Error fetching projects:', error)
      toast.error('Error al cargar los proyectos')
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }))
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  const handleJoinProject = async (projectId) => {
    try {
      await projectService.joinProject(projectId)
      toast.success('Te has unido al proyecto exitosamente')
      fetchProjects() // Recargar lista
    } catch (error) {
      console.error('Error joining project:', error)
      toast.error(error.response?.data?.message || 'Error al unirse al proyecto')
    }
  }

  const handleLeaveProject = async (projectId) => {
    if (window.confirm('¿Estás seguro de que quieres salir de este proyecto?')) {
      try {
        await projectService.leaveProject(projectId)
        toast.success('Has salido del proyecto')
        fetchProjects() // Recargar lista
      } catch (error) {
        console.error('Error leaving project:', error)
        toast.error(error.response?.data?.message || 'Error al salir del proyecto')
      }
    }
  }

  const canCreateProject = user && (user.role === 'docente' || user.role === 'admin')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-gray-800">
            Proyectos del Semillero
          </h2>
          <p className="text-gray-600 mt-1">
            Explora y participa en nuestros proyectos de investigación
          </p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={fetchProjects}
            className="flex items-center px-3 py-2 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors duration-200"
          >
            <RefreshCw className="w-4 h-4 mr-1" />
            Actualizar
          </button>
          
          {canCreateProject && onCreateProject && (
            <button
              onClick={onCreateProject}
              className="flex items-center px-4 py-2 bg-gradient-primary text-white rounded-md hover:bg-gradient-primary-dark transition-colors duration-200"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Proyecto
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Buscar proyectos
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="Buscar por título o descripción..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categoría
            </label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Todas las categorías</option>
              <option value={PROJECT_CATEGORIES.RESEARCH}>Investigación</option>
              <option value={PROJECT_CATEGORIES.DEVELOPMENT}>Desarrollo</option>
              <option value={PROJECT_CATEGORIES.EXTENSION}>Extensión</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estado
            </label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Todos los estados</option>
              <option value={PROJECT_STATUS.PLANNING}>Planificación</option>
              <option value={PROJECT_STATUS.IN_PROGRESS}>En Progreso</option>
              <option value={PROJECT_STATUS.COMPLETED}>Completado</option>
              <option value={PROJECT_STATUS.PAUSED}>Pausado</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Info */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>
          Mostrando {projects.length} de {pagination.total} proyectos
        </span>
        {pagination.totalPages > 1 && (
          <span>
            Página {pagination.page} de {pagination.totalPages}
          </span>
        )}
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : projects.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="text-gray-400 mb-4">
              <Filter className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              No se encontraron proyectos
            </h3>
            <p className="text-gray-600 mb-4">
              {Object.values(filters).some(filter => filter) 
                ? 'Intenta ajustar los filtros de búsqueda' 
                : 'Aún no hay proyectos creados'}
            </p>
            {canCreateProject && onCreateProject && (
              <button
                onClick={onCreateProject}
                className="btn-primary"
              >
                Crear primer proyecto
              </button>
            )}
          </div>
        </motion.div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
                currentUser={user}
                onView={onViewProject}
                onEdit={onEditProject}
                onJoin={handleJoinProject}
                onLeave={handleLeaveProject}
                canEdit={true}
              />
            ))}
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
    </div>
  )
}

export default ProjectList