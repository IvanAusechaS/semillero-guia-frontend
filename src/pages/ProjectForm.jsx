import { useState, useEffect, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { ArrowLeft, Save, X } from 'lucide-react'
import { projectService, userService } from '../services/api'
import { AuthContext } from '../context/AuthContext'
import LoadingSpinner from '../components/LoadingSpinner'
import { PROJECT_STATUS, PROJECT_CATEGORIES } from '../utils/mongodb'
import toast from 'react-hot-toast'

const ProjectForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)
  const [loading, setLoading] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [availableUsers, setAvailableUsers] = useState([])
  const [selectedMembers, setSelectedMembers] = useState([])
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState([])

  const isEditing = Boolean(id)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset
  } = useForm()

  useEffect(() => {
    fetchAvailableUsers()
    if (isEditing) {
      fetchProjectData()
    }
  }, [id])

  const fetchAvailableUsers = async () => {
    try {
      const response = await userService.getUsers({ role: 'estudiante', limit: 100 })
      setAvailableUsers(response.users || [])
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  const fetchProjectData = async () => {
    try {
      setLoading(true)
      const response = await projectService.getProjectById(id)
      const project = response.project

      // Fill form with project data
      reset({
        title: project.title,
        description: project.description,
        category: project.category,
        status: project.status,
        startDate: project.startDate ? new Date(project.startDate).toISOString().split('T')[0] : '',
        endDate: project.endDate ? new Date(project.endDate).toISOString().split('T')[0] : '',
        visibility: project.visibility || 'publico'
      })

      // Set members
      if (project.members) {
        setSelectedMembers(project.members.map(member => 
          typeof member === 'string' ? member : member._id
        ))
      }

      // Set tags
      if (project.tags) {
        setTags(project.tags)
      }
    } catch (error) {
      console.error('Error fetching project:', error)
      toast.error('Error al cargar el proyecto')
      navigate('/projects')
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data) => {
    try {
      setSubmitLoading(true)

      const projectData = {
        ...data,
        members: selectedMembers,
        tags: tags.filter(tag => tag.trim() !== '')
      }

      // Convert dates to ISO format
      if (data.startDate) {
        projectData.startDate = new Date(data.startDate).toISOString()
      }
      if (data.endDate) {
        projectData.endDate = new Date(data.endDate).toISOString()
      }

      let response
      if (isEditing) {
        response = await projectService.updateProject(id, projectData)
        toast.success('Proyecto actualizado exitosamente')
      } else {
        response = await projectService.createProject(projectData)
        toast.success('Proyecto creado exitosamente')
      }

      navigate(`/projects/${response.project._id}`)
    } catch (error) {
      console.error('Error saving project:', error)
      toast.error(error.response?.data?.message || `Error al ${isEditing ? 'actualizar' : 'crear'} el proyecto`)
    } finally {
      setSubmitLoading(false)
    }
  }

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim()
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag])
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTag()
    }
  }

  const toggleMember = (userId) => {
    if (selectedMembers.includes(userId)) {
      setSelectedMembers(selectedMembers.filter(id => id !== userId))
    } else {
      setSelectedMembers([...selectedMembers, userId])
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

  return (
    <div className="pt-16 min-h-screen bg-gradient-soft">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate('/projects')}
              className="flex items-center text-gray-600 hover:text-gray-800 transition-colors duration-200 mb-4"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Volver a Proyectos
            </button>
            
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-gradient">
              {isEditing ? 'Editar Proyecto' : 'Nuevo Proyecto'}
            </h1>
            <p className="text-gray-600 mt-2">
              {isEditing 
                ? 'Actualiza la información del proyecto' 
                : 'Crea un nuevo proyecto para el semillero'}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Title */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título del Proyecto *
                  </label>
                  <input
                    type="text"
                    {...register('title', {
                      required: 'El título es requerido',
                      minLength: {
                        value: 5,
                        message: 'El título debe tener al menos 5 caracteres'
                      }
                    })}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                      errors.title ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Ingresa el título del proyecto"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                  )}
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoría *
                  </label>
                  <select
                    {...register('category', { required: 'La categoría es requerida' })}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                      errors.category ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Selecciona una categoría</option>
                    <option value={PROJECT_CATEGORIES.RESEARCH}>Investigación</option>
                    <option value={PROJECT_CATEGORIES.DEVELOPMENT}>Desarrollo</option>
                    <option value={PROJECT_CATEGORIES.EXTENSION}>Extensión</option>
                  </select>
                  {errors.category && (
                    <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                  )}
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estado *
                  </label>
                  <select
                    {...register('status', { required: 'El estado es requerido' })}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                      errors.status ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Selecciona un estado</option>
                    <option value={PROJECT_STATUS.PLANNING}>Planificación</option>
                    <option value={PROJECT_STATUS.IN_PROGRESS}>En Progreso</option>
                    <option value={PROJECT_STATUS.COMPLETED}>Completado</option>
                    <option value={PROJECT_STATUS.PAUSED}>Pausado</option>
                  </select>
                  {errors.status && (
                    <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
                  )}
                </div>

                {/* Start Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de Inicio
                  </label>
                  <input
                    type="date"
                    {...register('startDate')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                {/* End Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de Fin
                  </label>
                  <input
                    type="date"
                    {...register('endDate')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción *
                </label>
                <textarea
                  {...register('description', {
                    required: 'La descripción es requerida',
                    minLength: {
                      value: 20,
                      message: 'La descripción debe tener al menos 20 caracteres'
                    }
                  })}
                  rows={6}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Describe detalladamente el proyecto, sus objetivos y metodología"
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Etiquetas
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-2 text-primary-500 hover:text-primary-700"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Agregar etiqueta (presiona Enter)"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
                  >
                    Agregar
                  </button>
                </div>
              </div>

              {/* Members */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Miembros del Proyecto
                </label>
                <div className="max-h-60 overflow-y-auto border border-gray-300 rounded-lg p-4">
                  {availableUsers.length === 0 ? (
                    <p className="text-gray-500 text-center">No hay usuarios disponibles</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {availableUsers.map((availableUser) => (
                        <label
                          key={availableUser._id}
                          className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedMembers.includes(availableUser._id)}
                            onChange={() => toggleMember(availableUser._id)}
                            className="mr-3 text-primary-600 focus:ring-primary-500"
                          />
                          <div>
                            <p className="text-sm font-medium text-gray-800">
                              {availableUser.name}
                            </p>
                            <p className="text-xs text-gray-600">
                              {availableUser.career} - Semestre {availableUser.semester}
                            </p>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  {selectedMembers.length} miembro{selectedMembers.length !== 1 ? 's' : ''} seleccionado{selectedMembers.length !== 1 ? 's' : ''}
                </p>
              </div>

              {/* Visibility */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Visibilidad
                </label>
                <select
                  {...register('visibility')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="publico">Público</option>
                  <option value="semillero">Solo Semillero</option>
                  <option value="privado">Privado</option>
                </select>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => navigate('/projects')}
                  className="flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="flex items-center justify-center flex-1 px-6 py-3 bg-gradient-primary text-white rounded-lg hover:bg-gradient-primary-dark transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitLoading ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      {isEditing ? 'Actualizando...' : 'Creando...'}
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5 mr-2" />
                      {isEditing ? 'Actualizar Proyecto' : 'Crear Proyecto'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default ProjectForm