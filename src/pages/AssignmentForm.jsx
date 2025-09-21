import { useState, useEffect, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { ArrowLeft, Save, X, Plus, Trash2, Calendar, Clock, Users } from 'lucide-react'
import { assignmentService, projectService, userService } from '../services/api'
import { AuthContext } from '../context/AuthContext'
import LoadingSpinner from '../components/LoadingSpinner'
import { ASSIGNMENT_PRIORITY, ASSIGNMENT_STATUS } from '../utils/mongodb'
import toast from 'react-hot-toast'

const AssignmentForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)
  const [loading, setLoading] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [availableUsers, setAvailableUsers] = useState([])
  const [availableProjects, setAvailableProjects] = useState([])
  const [selectedStudents, setSelectedStudents] = useState([])
  const [deliverables, setDeliverables] = useState([''])
  const [instructions, setInstructions] = useState('')
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState([])
  const [fileTypes, setFileTypes] = useState(['pdf', 'doc', 'docx'])

  const isEditing = Boolean(id)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: {
      priority: 'media',
      maxPoints: 100,
      allowLateSubmissions: true,
      lateSubmissionPenalty: 10,
      maxFileSize: 10485760, // 10MB
      estimatedHours: 10
    }
  })

  const priority = watch('priority')
  const allowLateSubmissions = watch('allowLateSubmissions')

  useEffect(() => {
    fetchInitialData()
    if (isEditing) {
      fetchAssignmentData()
    }
  }, [id])

  const fetchInitialData = async () => {
    setLoading(true)
    try {
      // Cargar estudiantes y proyectos en paralelo
      const [usersResponse, projectsResponse] = await Promise.all([
        userService.getUsers({ role: 'estudiante', limit: 100 }),
        projectService.getProjects({ limit: 50 })
      ])

      setAvailableUsers(usersResponse.users || [])
      setAvailableProjects(projectsResponse.projects || [])
    } catch (error) {
      console.error('Error fetching initial data:', error)
      toast.error('Error al cargar datos iniciales')
    } finally {
      setLoading(false)
    }
  }

  const fetchAssignmentData = async () => {
    try {
      setLoading(true)
      const response = await assignmentService.getAssignmentById(id)
      const assignment = response.assignment

      // Fill form with assignment data
      reset({
        title: assignment.title,
        description: assignment.description,
        project: assignment.project,
        dueDate: assignment.dueDate ? new Date(assignment.dueDate).toISOString().slice(0, 16) : '',
        priority: assignment.priority,
        estimatedHours: assignment.estimatedHours,
        maxPoints: assignment.maxPoints,
        allowLateSubmissions: assignment.allowLateSubmissions,
        lateSubmissionPenalty: assignment.lateSubmissionPenalty,
        maxFileSize: assignment.maxFileSize
      })

      // Set complex fields
      setSelectedStudents(assignment.assignedTo?.map(user => user._id || user.id) || [])
      setDeliverables(assignment.deliverables || [''])
      setInstructions(assignment.instructions || '')
      setTags(assignment.tags || [])
      setFileTypes(assignment.fileTypes || ['pdf', 'doc', 'docx'])

    } catch (error) {
      console.error('Error fetching assignment:', error)
      toast.error('Error al cargar la asignación')
      navigate('/assignments')
    } finally {
      setLoading(false)
    }
  }

  const handleStudentToggle = (studentId) => {
    setSelectedStudents(prev => 
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    )
  }

  const addDeliverable = () => {
    setDeliverables([...deliverables, ''])
  }

  const updateDeliverable = (index, value) => {
    const updated = [...deliverables]
    updated[index] = value
    setDeliverables(updated)
  }

  const removeDeliverable = (index) => {
    if (deliverables.length > 1) {
      setDeliverables(deliverables.filter((_, i) => i !== index))
    }
  }

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim()
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag])
      setTagInput('')
    }
  }

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleFileTypeToggle = (fileType) => {
    setFileTypes(prev => 
      prev.includes(fileType)
        ? prev.filter(type => type !== fileType)
        : [...prev, fileType]
    )
  }

  const onSubmit = async (data) => {
    try {
      setSubmitLoading(true)

      // Validaciones
      if (selectedStudents.length === 0) {
        toast.error('Debes asignar al menos un estudiante')
        return
      }

      if (deliverables.filter(d => d.trim()).length === 0) {
        toast.error('Debes especificar al menos un entregable')
        return
      }

      if (!instructions.trim()) {
        toast.error('Las instrucciones son obligatorias')
        return
      }

      // Preparar datos para el backend
      const assignmentData = {
        title: data.title,
        description: data.description,
        project: data.project,
        assignedTo: selectedStudents, // Array de ObjectIds de estudiantes
        dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : undefined,
        priority: data.priority,
        instructions: instructions,
        deliverables: deliverables.filter(d => d.trim()), // Filtrar entregables vacíos
        estimatedHours: Number(data.estimatedHours),
        maxPoints: Number(data.maxPoints),
        allowLateSubmissions: data.allowLateSubmissions,
        lateSubmissionPenalty: Number(data.lateSubmissionPenalty),
        fileTypes: fileTypes,
        maxFileSize: Number(data.maxFileSize),
        tags: tags
      }

      let response
      if (isEditing) {
        response = await assignmentService.updateAssignment(id, assignmentData)
        toast.success('Asignación actualizada exitosamente')
      } else {
        response = await assignmentService.createAssignment(assignmentData)
        toast.success('Asignación creada exitosamente')
      }

      // Verificar que la respuesta sea exitosa y tenga datos
      if (response.success && response.assignment) {
        const assignmentId = response.assignment._id || response.assignment.id
        navigate(`/assignments/${assignmentId}`)
      } else {
        throw new Error(response.message || 'Error en la respuesta del servidor')
      }

    } catch (error) {
      console.error('Error saving assignment:', error)
      toast.error(error.response?.data?.message || `Error al ${isEditing ? 'actualizar' : 'crear'} la asignación`)
    } finally {
      setSubmitLoading(false)
    }
  }

  const getPriorityColor = (priority) => {
    const colors = {
      'baja': 'bg-green-100 text-green-800',
      'media': 'bg-yellow-100 text-yellow-800', 
      'alta': 'bg-orange-100 text-orange-800',
      'critica': 'bg-red-100 text-red-800'
    }
    return colors[priority] || 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/assignments')}
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Volver a asignaciones
          </button>
          
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditing ? 'Editar Asignación' : 'Nueva Asignación'}
          </h1>
          <p className="mt-2 text-gray-600">
            {isEditing ? 'Modifica los detalles de la asignación' : 'Crea una nueva asignación para tus estudiantes'}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Información Básica */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Información Básica</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Título de la Asignación *
                </label>
                <input
                  id="title"
                  type="text"
                  {...register('title', { required: 'El título es obligatorio' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: Implementación de Red Neuronal Convolucional"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción *
                </label>
                <textarea
                  id="description"
                  rows={4}
                  {...register('description', { required: 'La descripción es obligatoria' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe detalladamente lo que deben hacer los estudiantes..."
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="project" className="block text-sm font-medium text-gray-700 mb-2">
                  Proyecto Asociado
                </label>
                <select
                  id="project"
                  {...register('project')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccionar proyecto (opcional)</option>
                  {availableProjects.map(project => (
                    <option key={project.id || project._id} value={project.id || project._id}>
                      {project.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                  Prioridad *
                </label>
                <select
                  id="priority"
                  {...register('priority', { required: 'La prioridad es obligatoria' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="baja">Baja</option>
                  <option value="media">Media</option>
                  <option value="alta">Alta</option>
                  <option value="critica">Crítica</option>
                </select>
                <div className="mt-2">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(priority)}`}>
                    {priority?.toUpperCase()}
                  </span>
                </div>
              </div>

              <div>
                <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Fecha de Entrega
                </label>
                <input
                  id="dueDate"
                  type="datetime-local"
                  {...register('dueDate')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="estimatedHours" className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Horas Estimadas
                </label>
                <input
                  id="estimatedHours"
                  type="number"
                  min="1"
                  max="200"
                  {...register('estimatedHours', { min: 1, max: 200 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </motion.div>

          {/* Estudiantes Asignados */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              <Users className="w-5 h-5 inline mr-2" />
              Estudiantes Asignados ({selectedStudents.length})
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {availableUsers.map(student => (
                <label
                  key={student._id || student.id}
                  className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedStudents.includes(student._id || student.id)
                      ? 'bg-blue-50 border-blue-200'
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedStudents.includes(student._id || student.id)}
                    onChange={() => handleStudentToggle(student._id || student.id)}
                    className="h-4 w-4 text-blue-600 rounded border-gray-300"
                  />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{student.name}</p>
                    <p className="text-xs text-gray-500">{student.email}</p>
                  </div>
                </label>
              ))}
            </div>
            
            {selectedStudents.length === 0 && (
              <p className="text-sm text-red-600 mt-2">Debes seleccionar al menos un estudiante</p>
            )}
          </motion.div>

          {/* Instrucciones y Entregables */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Instrucciones y Entregables</h2>
            
            <div className="space-y-6">
              <div>
                <label htmlFor="instructions" className="block text-sm font-medium text-gray-700 mb-2">
                  Instrucciones Detalladas *
                </label>
                <textarea
                  id="instructions"
                  rows={6}
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="1. Paso 1: Descripción detallada&#10;2. Paso 2: Otra instrucción&#10;3. Paso 3: Criterios de evaluación..."
                />
                {!instructions.trim() && (
                  <p className="text-sm text-red-600 mt-1">Las instrucciones son obligatorias</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Entregables *
                </label>
                <div className="space-y-2">
                  {deliverables.map((deliverable, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={deliverable}
                        onChange={(e) => updateDeliverable(index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={`Entregable ${index + 1}`}
                      />
                      {deliverables.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeDeliverable(index)}
                          className="p-2 text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addDeliverable}
                  className="mt-2 inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Agregar entregable
                </button>
              </div>
            </div>
          </motion.div>

          {/* Configuración de Archivos y Calificación */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Configuración de Archivos y Calificación</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="maxPoints" className="block text-sm font-medium text-gray-700 mb-2">
                  Puntuación Máxima
                </label>
                <input
                  id="maxPoints"
                  type="number"
                  min="1"
                  max="1000"
                  {...register('maxPoints', { min: 1, max: 1000 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="maxFileSize" className="block text-sm font-medium text-gray-700 mb-2">
                  Tamaño Máximo por Archivo (bytes)
                </label>
                <select
                  id="maxFileSize"
                  {...register('maxFileSize')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={5242880}>5 MB</option>
                  <option value={10485760}>10 MB</option>
                  <option value={20971520}>20 MB</option>
                  <option value={52428800}>50 MB</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    {...register('allowLateSubmissions')}
                    className="h-4 w-4 text-blue-600 rounded border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">Permitir entregas tardías</span>
                </label>
              </div>

              {allowLateSubmissions && (
                <div>
                  <label htmlFor="lateSubmissionPenalty" className="block text-sm font-medium text-gray-700 mb-2">
                    Penalización por Entrega Tardía (%)
                  </label>
                  <input
                    id="lateSubmissionPenalty"
                    type="number"
                    min="0"
                    max="100"
                    {...register('lateSubmissionPenalty', { min: 0, max: 100 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipos de Archivo Permitidos
                </label>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                  {['pdf', 'doc', 'docx', 'txt', 'zip', 'rar', 'jpg', 'jpeg', 'png', 'mp4', 'avi'].map(type => (
                    <label key={type} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={fileTypes.includes(type)}
                        onChange={() => handleFileTypeToggle(type)}
                        className="h-4 w-4 text-blue-600 rounded border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">{type.toUpperCase()}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Tags */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Etiquetas</h2>
            
            <div className="space-y-4">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Agregar etiqueta (ej: tensorflow, machine-learning)"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Submit Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex justify-end space-x-4"
          >
            <button
              type="button"
              onClick={() => navigate('/assignments')}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitLoading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {submitLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {isEditing ? 'Actualizando...' : 'Creando...'}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {isEditing ? 'Actualizar Asignación' : 'Crear Asignación'}
                </>
              )}
            </button>
          </motion.div>
        </form>
      </div>
    </div>
  )
}

export default AssignmentForm