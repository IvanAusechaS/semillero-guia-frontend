import { useState, useEffect, useContext } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Users,
  CheckSquare,
  Upload,
  Download,
  FileText,
  AlertTriangle,
  Clock,
  X
} from 'lucide-react'
import { assignmentService, submissionService } from '../services/api'
import { AuthContext } from '../context/AuthContext'
import LoadingSpinner from '../components/LoadingSpinner'
import { 
  formatDate, 
  formatDateTime,
  getPriorityColor,
  ASSIGNMENT_STATUS,
  ASSIGNMENT_PRIORITY 
} from '../utils/mongodb'
import toast from 'react-hot-toast'

const AssignmentDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)
  const [assignment, setAssignment] = useState(null)
  const [submissions, setSubmissions] = useState([])
  const [mySubmission, setMySubmission] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submissionsLoading, setSubmissionsLoading] = useState(false)
  const [showSubmissionForm, setShowSubmissionForm] = useState(false)
  const [submissionData, setSubmissionData] = useState({
    content: '',
    attachments: []
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (id) {
      fetchAssignmentDetail()
      fetchSubmissions()
    }
  }, [id])

  const fetchAssignmentDetail = async () => {
    try {
      setLoading(true)
      const response = await assignmentService.getAssignmentById(id)
      setAssignment(response.assignment)
    } catch (error) {
      console.error('Error fetching assignment:', error)
      toast.error('Error al cargar la asignación')
      navigate('/assignments')
    } finally {
      setLoading(false)
    }
  }

  const fetchSubmissions = async () => {
    try {
      setSubmissionsLoading(true)
      const response = await submissionService.getSubmissionsByAssignment(id)
      setSubmissions(response.submissions || [])
      
      // Find current user's submission
      const userSubmission = response.submissions?.find(sub => 
        (typeof sub.student === 'string' ? sub.student : sub.student._id) === user?._id
      )
      setMySubmission(userSubmission || null)
    } catch (error) {
      console.error('Error fetching submissions:', error)
    } finally {
      setSubmissionsLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!submissionData.content.trim()) {
      toast.error('El contenido del envío es requerido')
      return
    }

    try {
      setSubmitting(true)
      const formData = {
        assignment: id,
        content: submissionData.content,
        attachments: submissionData.attachments
      }

      await submissionService.createSubmission(formData)
      toast.success('Envío realizado exitosamente')
      
      // Reset form and refresh data
      setSubmissionData({ content: '', attachments: [] })
      setShowSubmissionForm(false)
      fetchSubmissions()
    } catch (error) {
      console.error('Error submitting assignment:', error)
      toast.error(error.response?.data?.message || 'Error al enviar la asignación')
    } finally {
      setSubmitting(false)
    }
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    setSubmissionData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...files]
    }))
  }

  const removeFile = (index) => {
    setSubmissionData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }))
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

  if (!assignment) {
    return (
      <div className="pt-16 min-h-screen bg-gradient-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Asignación no encontrada</h1>
            <Link to="/assignments" className="btn-primary">
              Volver a Asignaciones
            </Link>
          </div>
        </div>
      </div>
    )
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

  const isOverdue = new Date(assignment.dueDate) < new Date() && assignment.status !== ASSIGNMENT_STATUS.COMPLETED
  const canSubmit = user && !mySubmission && !isOverdue
  const isAssignedToUser = assignment.assignedTo?.some(assignee => 
    (typeof assignee === 'string' ? assignee : assignee._id) === user?._id
  )

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
              onClick={() => navigate('/assignments')}
              className="flex items-center text-gray-600 hover:text-gray-800 transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Volver a Asignaciones
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-primary text-white p-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex-1">
                  <h1 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                    {assignment.title}
                  </h1>
                  <div className="flex flex-wrap gap-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium bg-white bg-opacity-20`}>
                      {getStatusText(assignment.status)}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium bg-white bg-opacity-20`}>
                      Prioridad: {getPriorityText(assignment.priority)}
                    </span>
                    {isOverdue && (
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-600">
                        Vencido
                      </span>
                    )}
                  </div>
                </div>
                
                {isOverdue && (
                  <div className="flex items-center text-red-200">
                    <AlertTriangle className="w-6 h-6 mr-2" />
                    <span className="text-sm font-medium">Asignación Vencida</span>
                  </div>
                )}
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
                      {assignment.description}
                    </p>
                  </div>

                  {/* Attachments */}
                  {assignment.attachments && assignment.attachments.length > 0 && (
                    <div>
                      <h3 className="text-lg font-heading font-semibold text-gray-800 mb-3">
                        Archivos Adjuntos
                      </h3>
                      <div className="space-y-2">
                        {assignment.attachments.map((attachment, index) => (
                          <div
                            key={index}
                            className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                          >
                            <FileText className="w-5 h-5 text-gray-500 mr-3" />
                            <span className="flex-1 text-sm text-gray-700">{attachment}</span>
                            <button className="text-primary-600 hover:text-primary-700">
                              <Download className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Submission Form */}
                  {canSubmit && isAssignedToUser && (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-heading font-semibold text-gray-800">
                          Mi Envío
                        </h3>
                        {!showSubmissionForm && (
                          <button
                            onClick={() => setShowSubmissionForm(true)}
                            className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors duration-200"
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            Realizar Envío
                          </button>
                        )}
                      </div>

                      {showSubmissionForm && (
                        <form onSubmit={handleSubmit} className="bg-gray-50 rounded-lg p-6">
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Contenido del Envío *
                              </label>
                              <textarea
                                value={submissionData.content}
                                onChange={(e) => setSubmissionData(prev => ({ ...prev, content: e.target.value }))}
                                rows={6}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                placeholder="Describe tu trabajo, metodología, resultados o cualquier información relevante..."
                                required
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Archivos Adjuntos
                              </label>
                              <input
                                type="file"
                                multiple
                                onChange={handleFileChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                              />
                              
                              {submissionData.attachments.length > 0 && (
                                <div className="mt-3 space-y-2">
                                  {submissionData.attachments.map((file, index) => (
                                    <div
                                      key={index}
                                      className="flex items-center justify-between p-2 bg-white rounded border"
                                    >
                                      <span className="text-sm text-gray-700">{file.name}</span>
                                      <button
                                        type="button"
                                        onClick={() => removeFile(index)}
                                        className="text-red-600 hover:text-red-700"
                                      >
                                        <X className="w-4 h-4" />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>

                            <div className="flex gap-3">
                              <button
                                type="submit"
                                disabled={submitting}
                                className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors duration-200 disabled:opacity-50"
                              >
                                {submitting ? (
                                  <>
                                    <LoadingSpinner size="sm" className="mr-2" />
                                    Enviando...
                                  </>
                                ) : (
                                  <>
                                    <Upload className="w-4 h-4 mr-2" />
                                    Enviar
                                  </>
                                )}
                              </button>
                              <button
                                type="button"
                                onClick={() => setShowSubmissionForm(false)}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-200"
                              >
                                Cancelar
                              </button>
                            </div>
                          </div>
                        </form>
                      )}
                    </div>
                  )}

                  {/* My Submission Status */}
                  {mySubmission && (
                    <div>
                      <h3 className="text-lg font-heading font-semibold text-gray-800 mb-4">
                        Mi Envío
                      </h3>
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center mb-2">
                          <CheckSquare className="w-5 h-5 text-green-600 mr-2" />
                          <span className="font-medium text-green-800">Envío Realizado</span>
                        </div>
                        <p className="text-sm text-green-700 mb-2">
                          Enviado el: {formatDateTime(mySubmission.submittedAt)}
                        </p>
                        {mySubmission.grade !== undefined && (
                          <p className="text-sm text-green-700">
                            Calificación: {mySubmission.grade}/10
                          </p>
                        )}
                        {mySubmission.feedback && (
                          <div className="mt-3">
                            <p className="text-sm font-medium text-green-800 mb-1">Retroalimentación:</p>
                            <p className="text-sm text-green-700">{mySubmission.feedback}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Assignment Info */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-heading font-semibold text-gray-800 mb-4">
                      Información
                    </h3>
                    
                    <div className="space-y-4">
                      {/* Assigned by */}
                      <div className="flex items-center">
                        <User className="w-5 h-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">Asignado por</p>
                          <p className="text-sm text-gray-600">
                            {typeof assignment.assignedBy === 'string' 
                              ? 'Docente' 
                              : assignment.assignedBy?.name || 'No especificado'}
                          </p>
                        </div>
                      </div>

                      {/* Due date */}
                      <div className="flex items-center">
                        <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">Fecha límite</p>
                          <p className={`text-sm ${isOverdue ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
                            {formatDateTime(assignment.dueDate)}
                          </p>
                        </div>
                      </div>

                      {/* Project */}
                      {assignment.project && (
                        <div className="flex items-center">
                          <CheckSquare className="w-5 h-5 text-gray-400 mr-3" />
                          <div>
                            <p className="text-sm font-medium text-gray-700">Proyecto</p>
                            <p className="text-sm text-gray-600">
                              {typeof assignment.project === 'string' 
                                ? 'Proyecto' 
                                : assignment.project.title || 'Sin título'}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Created */}
                      <div className="flex items-center">
                        <Clock className="w-5 h-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">Creado</p>
                          <p className="text-sm text-gray-600">
                            {formatDate(assignment.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Assigned users */}
                  {assignment.assignedTo && assignment.assignedTo.length > 0 && (
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-lg font-heading font-semibold text-gray-800 mb-4">
                        Asignado a
                      </h3>
                      
                      <div className="space-y-3">
                        {assignment.assignedTo.map((assignee, index) => (
                          <div key={index} className="flex items-center">
                            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                              <User className="w-4 h-4 text-gray-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-800">
                                {typeof assignee === 'string' ? 'Usuario' : assignee.name || 'Usuario'}
                              </p>
                              <p className="text-xs text-gray-600">
                                {typeof assignee === 'string' ? 'Estudiante' : assignee.role || 'Estudiante'}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Submissions count */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-heading font-semibold text-gray-800 mb-2">
                      Estado de Envíos
                    </h3>
                    {submissionsLoading ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      <div className="text-sm text-gray-600">
                        <p>{submissions.length} envío{submissions.length !== 1 ? 's' : ''} realizado{submissions.length !== 1 ? 's' : ''}</p>
                        <p>{assignment.assignedTo?.length || 0} estudiante{(assignment.assignedTo?.length || 0) !== 1 ? 's' : ''} asignado{(assignment.assignedTo?.length || 0) !== 1 ? 's' : ''}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default AssignmentDetail