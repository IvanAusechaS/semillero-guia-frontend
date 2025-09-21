import { useState, useContext, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  MessageSquare, 
  Upload, 
  Download, 
  Calendar, 
  User, 
  FileText,
  Plus,
  Search,
  Filter
} from 'lucide-react'
import { AuthContext } from '../context/AuthContext'

const Forum = () => {
  const { user } = useContext(AuthContext)
  const [assignments, setAssignments] = useState([])
  const [selectedAssignment, setSelectedAssignment] = useState(null)
  const [loading, setLoading] = useState(true)

  // Datos de ejemplo - estos se obtendrían de la API
  const mockAssignments = [
    {
      id: 1,
      title: 'Implementación de Red Neuronal',
      description: 'Crear una red neuronal básica para clasificación de imágenes usando TensorFlow',
      dueDate: '2024-12-15',
      subject: 'Machine Learning',
      professor: 'Prof. María López',
      submissions: 8,
      maxSubmissions: 12,
      status: 'active'
    },
    {
      id: 2,
      title: 'Análisis de Sentimientos con NLP',
      description: 'Desarrollar un modelo para análisis de sentimientos en tweets usando técnicas de NLP',
      dueDate: '2024-12-20',
      subject: 'Procesamiento de Lenguaje Natural',
      professor: 'Prof. Carlos Ruiz',
      submissions: 5,
      maxSubmissions: 10,
      status: 'active'
    },
    {
      id: 3,
      title: 'Proyecto Final - Visión por Computador',
      description: 'Implementar un sistema de detección de objetos en tiempo real',
      dueDate: '2024-11-30',
      subject: 'Computer Vision',
      professor: 'Prof. Ana Gómez',
      submissions: 12,
      maxSubmissions: 12,
      status: 'completed'
    }
  ]

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setAssignments(mockAssignments)
      setLoading(false)
    }, 1000)
  }, [])

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'completed':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'active':
        return 'Activa'
      case 'completed':
        return 'Completada'
      default:
        return 'Pendiente'
    }
  }

  if (!user) {
    return (
      <div className="pt-16 min-h-screen bg-gradient-soft flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-heading font-bold text-gray-800 mb-4">
            Acceso Restringido
          </h1>
          <p className="text-gray-600 mb-8">
            Debes iniciar sesión para acceder al foro del semillero.
          </p>
          <a href="/login" className="btn-primary">
            Iniciar Sesión
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-16 min-h-screen bg-gradient-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-heading font-bold text-gray-800 mb-2">
                Foro del Semillero
              </h1>
              <p className="text-gray-600">
                Bienvenido, {user.name} ({user.role})
              </p>
            </div>
            
            {user.role === 'docente' && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary mt-4 md:mt-0"
              >
                <Plus className="w-5 h-5 mr-2" />
                Nueva Tarea
              </motion.button>
            )}
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar tareas..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <button className="btn-secondary flex items-center justify-center px-6">
              <Filter className="w-5 h-5 mr-2" />
              Filtros
            </button>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Assignments List */}
            <div className="lg:col-span-2">
              <div className="space-y-6">
                {assignments.map((assignment, index) => (
                  <motion.div
                    key={assignment.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={`card cursor-pointer transition-all duration-300 ${
                      selectedAssignment?.id === assignment.id 
                        ? 'ring-2 ring-primary-500 shadow-xl' 
                        : 'hover:shadow-xl'
                    }`}
                    onClick={() => setSelectedAssignment(assignment)}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-xl font-heading font-bold text-gray-800">
                            {assignment.title}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(assignment.status)}`}>
                            {getStatusText(assignment.status)}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-3">
                          {assignment.description}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        {formatDate(assignment.dueDate)}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <User className="w-4 h-4 mr-2" />
                        {assignment.professor}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <FileText className="w-4 h-4 mr-2" />
                        {assignment.subject}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Upload className="w-4 h-4 mr-2" />
                        {assignment.submissions}/{assignment.maxSubmissions}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Assignment Detail Sidebar */}
            <div className="lg:col-span-1">
              {selectedAssignment ? (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="card sticky top-24"
                >
                  <h3 className="text-xl font-heading font-bold text-gray-800 mb-4">
                    Detalles de la Tarea
                  </h3>
                  
                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Título:</label>
                      <p className="text-gray-900">{selectedAssignment.title}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700">Descripción:</label>
                      <p className="text-gray-600">{selectedAssignment.description}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700">Fecha límite:</label>
                      <p className="text-gray-900">{formatDate(selectedAssignment.dueDate)}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700">Profesor:</label>
                      <p className="text-gray-900">{selectedAssignment.professor}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700">Entregas:</label>
                      <p className="text-gray-900">
                        {selectedAssignment.submissions} de {selectedAssignment.maxSubmissions}
                      </p>
                    </div>
                  </div>

                  {user.role === 'estudiante' && selectedAssignment.status === 'active' && (
                    <div className="space-y-3">
                      <button className="w-full btn-primary flex items-center justify-center">
                        <Upload className="w-5 h-5 mr-2" />
                        Subir Entrega
                      </button>
                      <button className="w-full btn-secondary flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 mr-2" />
                        Comentarios
                      </button>
                    </div>
                  )}

                  {user.role === 'docente' && (
                    <div className="space-y-3">
                      <button className="w-full btn-primary flex items-center justify-center">
                        <Download className="w-5 h-5 mr-2" />
                        Ver Entregas
                      </button>
                      <button className="w-full btn-secondary flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 mr-2" />
                        Retroalimentación
                      </button>
                    </div>
                  )}
                </motion.div>
              ) : (
                <div className="card text-center text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Selecciona una tarea para ver los detalles</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Forum