import { useState, useEffect, useCallback } from 'react'
import { submissionService } from '../services/api'
import { toast } from 'react-hot-toast'

/**
 * Hook para que los profesores manejen entregas de estudiantes
 * Incluye funcionalidades de calificación y feedback
 */
export const useStudentSubmissions = (assignmentId, initialFilters = {}) => {
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
    pendientes: 0,
    revisadas: 0,
    aprobadas: 0,
    rechazadas: 0
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    ...initialFilters
  })

  // Función para obtener entregas de estudiantes para un assignment específico
  const fetchSubmissions = useCallback(async (newFilters = {}) => {
    if (!assignmentId) return
    
    setLoading(true)
    setError(null)
    
    try {
      const queryFilters = { ...filters, ...newFilters }
      const result = await submissionService.getSubmissionsForAssignment(assignmentId, queryFilters)
      
      if (result.success) {
        setSubmissions(result.submissions || [])
        setPagination(result.pagination || {
          page: 1,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false
        })
        
        // Calcular estadísticas de entregas
        const submissionsList = result.submissions || []
        const statsCalculated = {
          total: submissionsList.length,
          pendientes: submissionsList.filter(s => s.status === 'enviado').length,
          revisadas: submissionsList.filter(s => s.status === 'revisado').length,
          aprobadas: submissionsList.filter(s => s.status === 'aprobado').length,
          rechazadas: submissionsList.filter(s => s.status === 'rechazado').length
        }
        setStats(statsCalculated)
        
        console.log('Student submissions loaded:', submissionsList.length)
      } else {
        setError(result.message || 'Error al obtener entregas')
        setSubmissions([])
        toast.error(result.message || 'Error al cargar entregas')
      }
    } catch (err) {
      console.error('Error in useStudentSubmissions:', err)
      const errorMessage = err.response?.data?.message || 'Error inesperado al obtener entregas'
      setError(errorMessage)
      setSubmissions([])
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [assignmentId, filters])

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

  // Efecto para cargar datos cuando cambian los filtros o assignmentId
  useEffect(() => {
    if (assignmentId) {
      fetchSubmissions()
    }
  }, [assignmentId, fetchSubmissions])

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
 * Hook para manejar la calificación de entregas
 */
export const useGrading = () => {
  const [grading, setGrading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  // Función para calificar una entrega
  const gradeSubmission = useCallback(async (submissionId, gradeData) => {
    setGrading(true)
    setError(null)
    setSuccess(false)

    try {
      const result = await submissionService.gradeSubmission(submissionId, gradeData)

      if (result.success) {
        setSuccess(true)
        toast.success('Entrega calificada exitosamente')
        return result
      } else {
        setError(result.message)
        toast.error(result.message)
        return result
      }
    } catch (err) {
      console.error('Error grading submission:', err)
      const errorMessage = err.response?.data?.message || 'Error inesperado al calificar'
      setError(errorMessage)
      toast.error(errorMessage)
      return { success: false, message: errorMessage }
    } finally {
      setGrading(false)
    }
  }, [])

  // Función para dar feedback sin calificar
  const provideFeedback = useCallback(async (submissionId, feedback) => {
    setGrading(true)
    setError(null)
    setSuccess(false)

    try {
      const result = await submissionService.provideFeedback(submissionId, feedback)

      if (result.success) {
        setSuccess(true)
        toast.success('Feedback enviado exitosamente')
        return result
      } else {
        setError(result.message)
        toast.error(result.message)
        return result
      }
    } catch (err) {
      console.error('Error providing feedback:', err)
      const errorMessage = err.response?.data?.message || 'Error inesperado al enviar feedback'
      setError(errorMessage)
      toast.error(errorMessage)
      return { success: false, message: errorMessage }
    } finally {
      setGrading(false)
    }
  }, [])

  // Función para cambiar solo el estado de una entrega
  const updateStatus = useCallback(async (submissionId, status) => {
    setGrading(true)
    setError(null)
    setSuccess(false)

    try {
      const result = await submissionService.updateSubmissionStatus(submissionId, status)

      if (result.success) {
        setSuccess(true)
        toast.success('Estado actualizado exitosamente')
        return result
      } else {
        setError(result.message)
        toast.error(result.message)
        return result
      }
    } catch (err) {
      console.error('Error updating status:', err)
      const errorMessage = err.response?.data?.message || 'Error inesperado al actualizar estado'
      setError(errorMessage)
      toast.error(errorMessage)
      return { success: false, message: errorMessage }
    } finally {
      setGrading(false)
    }
  }, [])

  // Resetear estado
  const reset = useCallback(() => {
    setGrading(false)
    setError(null)
    setSuccess(false)
  }, [])

  return {
    grading,
    error,
    success,
    gradeSubmission,
    provideFeedback,
    updateStatus,
    reset
  }
}

/**
 * Hook para obtener estadísticas avanzadas de un assignment
 */
export const useAssignmentStats = (assignmentId) => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    submissionsCount: 0,
    submissionRate: 0,
    averageGrade: 0,
    gradeDistribution: {
      excellent: 0, // 90-100
      good: 0,      // 80-89
      average: 0,   // 70-79
      poor: 0,      // 60-69
      fail: 0       // <60
    },
    statusDistribution: {
      enviado: 0,
      revisado: 0,
      aprobado: 0,
      rechazado: 0
    },
    lateSubmissions: 0,
    onTimeSubmissions: 0
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchStats = useCallback(async () => {
    if (!assignmentId) return
    
    setLoading(true)
    setError(null)
    
    try {
      const result = await submissionService.getAssignmentStats(assignmentId)
      
      if (result.success) {
        setStats(result.stats)
      } else {
        setError(result.message || 'Error al obtener estadísticas')
        toast.error(result.message || 'Error al cargar estadísticas')
      }
    } catch (err) {
      console.error('Error fetching assignment stats:', err)
      const errorMessage = err.response?.data?.message || 'Error al obtener estadísticas'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [assignmentId])

  useEffect(() => {
    if (assignmentId) {
      fetchStats()
    }
  }, [assignmentId, fetchStats])

  return {
    stats,
    loading,
    error,
    refresh: fetchStats
  }
}

/**
 * Hook para manejo masivo de entregas (para profesores)
 */
export const useBulkGrading = () => {
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState(null)
  const [results, setResults] = useState(null)

  // Función para calificar múltiples entregas
  const bulkGrade = useCallback(async (submissionIds, gradeData) => {
    setProcessing(true)
    setProgress(0)
    setError(null)
    setResults(null)

    try {
      const totalSubmissions = submissionIds.length
      let processedCount = 0
      const results = []

      for (const submissionId of submissionIds) {
        try {
          const result = await submissionService.gradeSubmission(submissionId, gradeData)
          results.push({ submissionId, success: result.success, message: result.message })
          
          processedCount++
          setProgress((processedCount / totalSubmissions) * 100)
        } catch (err) {
          results.push({ 
            submissionId, 
            success: false, 
            message: err.response?.data?.message || 'Error inesperado' 
          })
          processedCount++
          setProgress((processedCount / totalSubmissions) * 100)
        }
      }

      const successCount = results.filter(r => r.success).length
      const failCount = results.filter(r => !r.success).length

      setResults({
        total: totalSubmissions,
        success: successCount,
        failed: failCount,
        details: results
      })

      if (failCount === 0) {
        toast.success(`${successCount} entregas calificadas exitosamente`)
      } else {
        toast.error(`${successCount} exitosas, ${failCount} fallidas`)
      }

      return { success: true, results }
    } catch (err) {
      console.error('Error in bulk grading:', err)
      const errorMessage = 'Error inesperado en calificación masiva'
      setError(errorMessage)
      toast.error(errorMessage)
      return { success: false, message: errorMessage }
    } finally {
      setProcessing(false)
    }
  }, [])

  // Función para cambiar estado masivo
  const bulkUpdateStatus = useCallback(async (submissionIds, status) => {
    setProcessing(true)
    setProgress(0)
    setError(null)
    setResults(null)

    try {
      const totalSubmissions = submissionIds.length
      let processedCount = 0
      const results = []

      for (const submissionId of submissionIds) {
        try {
          const result = await submissionService.updateSubmissionStatus(submissionId, status)
          results.push({ submissionId, success: result.success, message: result.message })
          
          processedCount++
          setProgress((processedCount / totalSubmissions) * 100)
        } catch (err) {
          results.push({ 
            submissionId, 
            success: false, 
            message: err.response?.data?.message || 'Error inesperado' 
          })
          processedCount++
          setProgress((processedCount / totalSubmissions) * 100)
        }
      }

      const successCount = results.filter(r => r.success).length
      const failCount = results.filter(r => !r.success).length

      setResults({
        total: totalSubmissions,
        success: successCount,
        failed: failCount,
        details: results
      })

      if (failCount === 0) {
        toast.success(`${successCount} entregas actualizadas exitosamente`)
      } else {
        toast.error(`${successCount} exitosas, ${failCount} fallidas`)
      }

      return { success: true, results }
    } catch (err) {
      console.error('Error in bulk status update:', err)
      const errorMessage = 'Error inesperado en actualización masiva'
      setError(errorMessage)
      toast.error(errorMessage)
      return { success: false, message: errorMessage }
    } finally {
      setProcessing(false)
    }
  }, [])

  // Resetear estado
  const reset = useCallback(() => {
    setProcessing(false)
    setProgress(0)
    setError(null)
    setResults(null)
  }, [])

  return {
    processing,
    progress,
    error,
    results,
    bulkGrade,
    bulkUpdateStatus,
    reset
  }
}

export default useStudentSubmissions