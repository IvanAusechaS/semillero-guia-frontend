import { useState, useEffect, useCallback } from 'react'
import { submissionService, FILE_CONFIG } from '../services/api'
import { toast } from 'react-hot-toast'

/**
 * Hook personalizado para manejar entregas/submissions
 * Compatible con la API MongoDB del backend y sistema de archivos Multer
 */
export const useSubmissions = (initialFilters = {}) => {
  const [submissions, setSubmissions] = useState([])
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  })
  const [stats, setStats] = useState({
    total: 0,
    enviado: 0,
    revisado: 0,
    aprobado: 0,
    rechazado: 0
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    ...initialFilters
  })

  // Función para obtener mis submissions
  const fetchSubmissions = useCallback(async (newFilters = {}) => {
    setLoading(true)
    setError(null)
    
    try {
      const queryFilters = { ...filters, ...newFilters }
      const result = await submissionService.getMySubmissions(queryFilters)
      
      if (result.success) {
        setSubmissions(result.submissions || [])
        setPagination(result.pagination || {
          page: 1,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false
        })
        setStats(result.stats || {
          total: 0,
          enviado: 0,
          revisado: 0,
          aprobado: 0,
          rechazado: 0
        })
        
        console.log('Submissions loaded:', result.submissions?.length || 0)
      } else {
        setError(result.message || 'Error al obtener entregas')
        setSubmissions([])
        toast.error(result.message || 'Error al cargar entregas')
      }
    } catch (err) {
      console.error('Error in useSubmissions:', err)
      const errorMessage = err.response?.data?.message || 'Error inesperado al obtener entregas'
      setError(errorMessage)
      setSubmissions([])
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [filters])

  // Actualizar filtros
  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: newFilters.page !== undefined ? newFilters.page : 1
    }))
  }, [])

  // Cambiar página
  const changePage = useCallback((page) => {
    updateFilters({ page })
  }, [updateFilters])

  // Refrescar datos
  const refresh = useCallback(() => {
    fetchSubmissions()
  }, [fetchSubmissions])

  // Efecto para cargar datos cuando cambian los filtros
  useEffect(() => {
    fetchSubmissions()
  }, [filters])

  return {
    submissions,
    pagination,
    stats,
    loading,
    error,
    filters,
    updateFilters,
    changePage,
    refresh,
    refetch: refresh
  }
}

/**
 * Hook para manejar upload de archivos en submissions
 */
export const useFileUpload = () => {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  // Validar archivos antes del upload
  const validateFiles = useCallback((files) => {
    const errors = []
    
    if (files.length > FILE_CONFIG.MAX_FILES) {
      errors.push(`Máximo ${FILE_CONFIG.MAX_FILES} archivos permitidos`)
      return { isValid: false, errors }
    }

    for (const file of files) {
      // Validar tamaño
      if (file.size > FILE_CONFIG.MAX_SIZE) {
        errors.push(`${file.name} excede el tamaño máximo de 10MB`)
      }
      
      // Validar tipo
      const fileExtension = file.name.split('.').pop()?.toLowerCase()
      if (!FILE_CONFIG.ALLOWED_TYPES.includes(fileExtension)) {
        errors.push(`${file.name} tiene un tipo de archivo no permitido`)
      }
    }

    return { isValid: errors.length === 0, errors }
  }, [])

  // Función para crear submission con archivos
  const createSubmission = useCallback(async (assignmentId, content, files = []) => {
    setUploading(true)
    setProgress(0)
    setError(null)
    setSuccess(false)

    try {
      // Validar archivos si se proporcionan
      if (files.length > 0) {
        const validation = validateFiles(files)
        if (!validation.isValid) {
          setError(validation.errors.join(', '))
          return { success: false, message: validation.errors.join(', ') }
        }
      }

      const result = await submissionService.createSubmission(assignmentId, content, files)

      if (result.success) {
        setProgress(100)
        setSuccess(true)
        toast.success('Entrega enviada exitosamente')
        return result
      } else {
        setError(result.message)
        toast.error(result.message)
        return result
      }
    } catch (err) {
      console.error('Error uploading submission:', err)
      const errorMessage = err.response?.data?.message || 'Error inesperado al subir archivos'
      setError(errorMessage)
      toast.error(errorMessage)
      return { success: false, message: errorMessage }
    } finally {
      setUploading(false)
    }
  }, [validateFiles])

  // Función para actualizar submission
  const updateSubmission = useCallback(async (submissionId, content, files = []) => {
    setUploading(true)
    setProgress(0)
    setError(null)
    setSuccess(false)

    try {
      // Validar archivos si se proporcionan
      if (files.length > 0) {
        const validation = validateFiles(files)
        if (!validation.isValid) {
          setError(validation.errors.join(', '))
          return { success: false, message: validation.errors.join(', ') }
        }
      }

      const result = await submissionService.updateSubmission(submissionId, content, files)

      if (result.success) {
        setProgress(100)
        setSuccess(true)
        toast.success('Entrega actualizada exitosamente')
        return result
      } else {
        setError(result.message)
        toast.error(result.message)
        return result
      }
    } catch (err) {
      console.error('Error updating submission:', err)
      const errorMessage = err.response?.data?.message || 'Error inesperado al actualizar entrega'
      setError(errorMessage)
      toast.error(errorMessage)
      return { success: false, message: errorMessage }
    } finally {
      setUploading(false)
    }
  }, [validateFiles])

  // Resetear estado
  const reset = useCallback(() => {
    setUploading(false)
    setProgress(0)
    setError(null)
    setSuccess(false)
  }, [])

  return {
    uploading,
    progress,
    error,
    success,
    validateFiles,
    createSubmission,
    updateSubmission,
    reset
  }
}

/**
 * Hook para manejar una submission específica
 */
export const useSubmission = (submissionId) => {
  const [submission, setSubmission] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchSubmission = useCallback(async () => {
    if (!submissionId) return
    
    setLoading(true)
    setError(null)
    
    try {
      const result = await submissionService.getSubmissionById(submissionId)
      
      if (result.success) {
        setSubmission(result.submission)
      } else {
        setError(result.message || 'Error al obtener entrega')
        toast.error(result.message || 'Error al cargar entrega')
      }
    } catch (err) {
      console.error('Error fetching submission:', err)
      const errorMessage = err.response?.data?.message || 'Error al obtener entrega'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [submissionId])

  useEffect(() => {
    fetchSubmission()
  }, [fetchSubmission])

  return {
    submission,
    loading,
    error,
    refresh: fetchSubmission
  }
}

/**
 * Hook para descargar archivos de submissions
 */
export const useFileDownload = () => {
  const [downloading, setDownloading] = useState(false)
  const [error, setError] = useState(null)

  const downloadFile = useCallback(async (submissionId, filename, originalName) => {
    setDownloading(true)
    setError(null)

    try {
      const result = await submissionService.downloadFile(submissionId, filename, originalName)
      
      if (result.success) {
        toast.success('Archivo descargado exitosamente')
      } else {
        setError(result.message)
        toast.error(result.message)
      }
    } catch (err) {
      console.error('Error downloading file:', err)
      const errorMessage = 'Error al descargar archivo'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setDownloading(false)
    }
  }, [])

  return {
    downloading,
    error,
    downloadFile
  }
}

export default useSubmissions