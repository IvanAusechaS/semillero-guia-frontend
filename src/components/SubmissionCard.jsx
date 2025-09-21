import React from 'react'
import { SUBMISSION_STATUS } from '../services/api'
import { useFileDownload } from '../hooks/useSubmissions'

const SubmissionCard = ({ 
  submission, 
  assignment, 
  isTeacher = false, 
  onEdit, 
  onGrade, 
  onViewDetails,
  showStudentInfo = false,
  compact = false 
}) => {
  const { downloading, downloadFile } = useFileDownload()

  // Formatear fecha
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Formatear tamaño de archivo
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Obtener configuración de estado
  const getStatusConfig = (status) => {
    const configs = {
      [SUBMISSION_STATUS.ENVIADO]: {
        label: 'Enviado',
        color: 'bg-blue-100 text-blue-800',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        )
      },
      [SUBMISSION_STATUS.REVISADO]: {
        label: 'Revisado',
        color: 'bg-yellow-100 text-yellow-800',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        )
      },
      [SUBMISSION_STATUS.APROBADO]: {
        label: 'Aprobado',
        color: 'bg-green-100 text-green-800',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      },
      [SUBMISSION_STATUS.RECHAZADO]: {
        label: 'Rechazado',
        color: 'bg-red-100 text-red-800',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        )
      }
    }
    return configs[status] || configs[SUBMISSION_STATUS.ENVIADO]
  }

  // Verificar si la entrega está retrasada
  const isLate = assignment && submission && 
    new Date(submission.submittedAt) > new Date(assignment.dueDate)

  // Manejar descarga de archivo
  const handleFileDownload = async (file) => {
    await downloadFile(submission._id, file.filename, file.originalName)
  }

  const statusConfig = getStatusConfig(submission.status)

  // Versión compacta para dashboard
  if (compact) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-all duration-200">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="font-medium text-gray-800 text-sm line-clamp-1">
              {assignment?.title || 'Tarea'}
            </h3>
            <p className="text-xs text-gray-500">
              Enviado: {formatDate(submission.submittedAt)}
              {isLate && <span className="text-red-500 ml-1">(Tardío)</span>}
            </p>
          </div>
          <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig.color}`}>
            {statusConfig.icon}
            <span>{statusConfig.label}</span>
          </span>
        </div>
        
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            {submission.files && submission.files.length > 0 && (
              <span className="text-gray-500">📎 {submission.files.length} archivo{submission.files.length > 1 ? 's' : ''}</span>
            )}
            {submission.grade !== undefined && submission.grade !== null && (
              <span className={`font-medium ${submission.grade >= 70 ? 'text-green-600' : 'text-red-600'}`}>
                {submission.grade}/100
              </span>
            )}
          </div>
          
          {onViewDetails && (
            <button
              onClick={() => onViewDetails(submission)}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Ver →
            </button>
          )}
        </div>
      </div>
    )
  }

  // Versión completa normal

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {/* Información del estudiante (solo para profesores) */}
            {showStudentInfo && submission.student && (
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-600">
                    {submission.student.name?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {submission.student.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {submission.student.email}
                  </p>
                </div>
              </div>
            )}

            {/* Título de la tarea */}
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {assignment?.title || 'Tarea'}
            </h3>
            
            {/* Fechas */}
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Enviado: {formatDate(submission.submittedAt)}</span>
              </div>
              {isLate && (
                <div className="flex items-center space-x-1 text-red-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium">Entrega tardía</span>
                </div>
              )}
            </div>
          </div>

          {/* Estado */}
          <div className="flex items-center space-x-2">
            <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.color}`}>
              {statusConfig.icon}
              <span>{statusConfig.label}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-4 space-y-4">
        {/* Contenido de la entrega */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Contenido</h4>
          <div className="bg-gray-50 rounded-md p-3">
            <p className="text-sm text-gray-700 whitespace-pre-wrap">
              {submission.content}
            </p>
          </div>
        </div>

        {/* Archivos adjuntos */}
        {submission.files && submission.files.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Archivos adjuntos ({submission.files.length})
            </h4>
            <div className="space-y-2">
              {submission.files.map((file, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {file.originalName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleFileDownload(file)}
                    disabled={downloading}
                    className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {downloading ? (
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    )}
                    <span className="ml-1">Descargar</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Calificación */}
        {submission.grade !== undefined && submission.grade !== null && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Calificación</h4>
            <div className="bg-blue-50 rounded-md p-3">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-blue-600">
                  {submission.grade}/100
                </span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  submission.grade >= 70 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {submission.grade >= 70 ? 'Aprobado' : 'Reprobado'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Feedback del profesor */}
        {submission.feedback && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Comentarios del profesor</h4>
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                {submission.feedback}
              </p>
              {submission.gradedAt && (
                <p className="text-xs text-gray-500 mt-2">
                  Calificado el {formatDate(submission.gradedAt)}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Acciones */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 rounded-b-lg">
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            {onViewDetails && (
              <button
                onClick={() => onViewDetails(submission)}
                className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Ver detalles
              </button>
            )}
          </div>

          <div className="flex space-x-2">
            {/* Botón editar (solo para estudiantes en sus propias entregas) */}
            {!isTeacher && onEdit && ['enviado', 'revisado'].includes(submission.status) && (
              <button
                onClick={() => onEdit(submission)}
                className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Editar
              </button>
            )}

            {/* Botón calificar (solo para profesores) */}
            {isTeacher && onGrade && (
              <button
                onClick={() => onGrade(submission)}
                className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                {submission.grade !== undefined ? 'Recalificar' : 'Calificar'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SubmissionCard