import React, { useState, useRef, useCallback } from 'react'
import { useFileUpload } from '../hooks/useSubmissions'
import { FILE_CONFIG } from '../services/api'

const SubmissionForm = ({ 
  assignment, 
  existingSubmission = null, 
  onSubmit, 
  onCancel 
}) => {
  const [content, setContent] = useState(existingSubmission?.content || '')
  const [selectedFiles, setSelectedFiles] = useState([])
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef(null)
  
  const { 
    uploading, 
    progress, 
    error, 
    success, 
    validateFiles, 
    createSubmission, 
    updateSubmission, 
    reset 
  } = useFileUpload()

  // Verificar si el assignment permite entregas
  const canSubmit = assignment && 
    new Date() <= new Date(assignment.dueDate) && 
    assignment.status === 'activo'

  const isEditing = Boolean(existingSubmission)
  const canEdit = existingSubmission && 
    ['enviado', 'revisado'].includes(existingSubmission.status)

  // Formatear tamaño de archivo
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Manejar selección de archivos
  const handleFileSelect = useCallback((files) => {
    const fileArray = Array.from(files)
    
    // Validar archivos
    const validation = validateFiles(fileArray)
    if (!validation.isValid) {
      alert(validation.errors.join('\n'))
      return
    }

    setSelectedFiles(fileArray)
  }, [validateFiles])

  // Manejar clic en input de archivo
  const handleFileButtonClick = () => {
    fileInputRef.current?.click()
  }

  // Manejar cambio en input de archivo
  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelect(e.target.files)
    }
  }

  // Manejar drag and drop
  const handleDrag = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files)
    }
  }, [handleFileSelect])

  // Remover archivo seleccionado
  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!content.trim()) {
      alert('Por favor ingresa el contenido de tu entrega')
      return
    }

    try {
      let result
      if (isEditing) {
        result = await updateSubmission(existingSubmission._id, content, selectedFiles)
      } else {
        result = await createSubmission(assignment._id, content, selectedFiles)
      }

      if (result.success) {
        // Resetear formulario
        setContent('')
        setSelectedFiles([])
        reset()
        
        // Llamar callback del padre
        if (onSubmit) {
          onSubmit(result)
        }
      }
    } catch (err) {
      console.error('Error submitting:', err)
    }
  }

  // Mostrar mensaje si no se puede enviar
  if (!canSubmit && !isEditing) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <div className="text-red-600 mb-2">
          <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-red-800 mb-2">
          No se pueden enviar entregas
        </h3>
        <p className="text-red-600">
          {assignment?.status !== 'activo' 
            ? 'Esta tarea no está activa' 
            : 'La fecha límite ha pasado'}
        </p>
      </div>
    )
  }

  // Mostrar mensaje si no se puede editar
  if (isEditing && !canEdit) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
        <div className="text-gray-600 mb-2">
          <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Entrega ya calificada
        </h3>
        <p className="text-gray-600">
          No puedes editar una entrega que ya ha sido calificada
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">
          {isEditing ? 'Editar Entrega' : 'Nueva Entrega'}
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          {assignment?.title}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Contenido de la entrega */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
            Contenido de la entrega *
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Describe tu entrega, incluye comentarios, enlaces, o cualquier información relevante..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={6}
            required
            disabled={uploading}
          />
          <p className="text-xs text-gray-500 mt-1">
            Mínimo 10 caracteres requeridos
          </p>
        </div>

        {/* Archivos existentes (solo en modo edición) */}
        {isEditing && existingSubmission?.files && existingSubmission.files.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Archivos actuales
            </h3>
            <div className="space-y-2">
              {existingSubmission.files.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{file.originalName}</p>
                      <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  <p className="text-xs text-green-600">Subido</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload de archivos */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Archivos (opcional)
          </label>
          
          {/* Zona de drag and drop */}
          <div
            className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              dragActive 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileInputChange}
              className="hidden"
              accept={FILE_CONFIG.ALLOWED_TYPES.map(type => `.${type}`).join(',')}
              disabled={uploading}
            />
            
            <div className="space-y-2">
              <svg className="w-8 h-8 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <div>
                <button
                  type="button"
                  onClick={handleFileButtonClick}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                  disabled={uploading}
                >
                  Seleccionar archivos
                </button>
                <p className="text-sm text-gray-500">o arrastra y suelta aquí</p>
              </div>
              <div className="text-xs text-gray-500 space-y-1">
                <p>Máximo {FILE_CONFIG.MAX_FILES} archivos</p>
                <p>Tamaño máximo: 10MB por archivo</p>
                <p>Tipos permitidos: {FILE_CONFIG.ALLOWED_TYPES.join(', ')}</p>
              </div>
            </div>
          </div>

          {/* Lista de archivos seleccionados */}
          {selectedFiles.length > 0 && (
            <div className="mt-4 space-y-2">
              <h4 className="text-sm font-medium text-gray-700">
                Archivos seleccionados ({selectedFiles.length}/{FILE_CONFIG.MAX_FILES})
              </h4>
              {selectedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{file.name}</p>
                      <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="text-red-500 hover:text-red-700"
                    disabled={uploading}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Barra de progreso */}
        {uploading && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subiendo...</span>
              <span className="text-gray-600">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Mensajes de error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <div className="flex">
              <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Mensaje de éxito */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-md p-3">
            <div className="flex">
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="ml-3">
                <p className="text-sm text-green-700">
                  {isEditing ? 'Entrega actualizada exitosamente' : 'Entrega enviada exitosamente'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Botones de acción */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={uploading}
            >
              Cancelar
            </button>
          )}
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={uploading || !content.trim()}
          >
            {uploading ? (
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                <span>Subiendo...</span>
              </div>
            ) : (
              isEditing ? 'Actualizar Entrega' : 'Enviar Entrega'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default SubmissionForm