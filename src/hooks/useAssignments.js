import { useState, useEffect, useCallback } from 'react'
import { assignmentService } from '../services/api'
import { toast } from 'react-hot-toast'

/**
 * Hook personalizado para manejar asignaciones
 * Compatible con la API MongoDB del backend
 */
export const useAssignments = (initialFilters = {}) => {
  const [assignments, setAssignments] = useState([])
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    ...initialFilters
  })

  // Función para obtener asignaciones del usuario
  const fetchAssignments = useCallback(async (newFilters = {}) => {
    setLoading(true)
    setError(null)
    
    try {
      const queryFilters = { ...filters, ...newFilters }
      const result = await assignmentService.getMyAssignments(queryFilters)
      
      if (result.success) {
        setAssignments(result.assignments || [])
        setPagination(result.pagination || {
          page: 1,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false
        })
        
        console.log('Assignments loaded:', result.assignments?.length || 0)
      } else {
        setError(result.message || 'Error al obtener asignaciones')
        setAssignments([])
        toast.error(result.message || 'Error al cargar asignaciones')
      }
    } catch (err) {
      console.error('Error in useAssignments:', err)
      const errorMessage = err.response?.data?.message || 'Error inesperado al obtener asignaciones'
      setError(errorMessage)
      setAssignments([])
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

  // Limpiar filtros
  const clearFilters = useCallback(() => {
    setFilters({
      page: 1,
      limit: 10
    })
  }, [])

  // Refrescar datos
  const refresh = useCallback(() => {
    fetchAssignments()
  }, [fetchAssignments])

  // Efecto para cargar datos cuando cambian los filtros
  useEffect(() => {
    fetchAssignments()
  }, [filters])

  return {
    assignments,
    pagination,
    loading,
    error,
    filters,
    updateFilters,
    changePage,
    clearFilters,
    refresh,
    refetch: refresh // Alias para compatibilidad
  }
}

/**
 * Hook para obtener estadísticas de asignaciones
 */
export const useAssignmentStats = () => {
  const [stats, setStats] = useState({
    total: 0,
    pendiente: 0,
    en_progreso: 0,
    completado: 0,
    vencido: 0
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchStats = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await assignmentService.getAssignmentStats()
      
      if (result.success) {
        setStats(result.stats || {
          total: 0,
          pendiente: 0,
          en_progreso: 0,
          completado: 0,
          vencido: 0
        })
      } else {
        setError(result.message || 'Error al obtener estadísticas')
        console.warn('Assignment stats error:', result.message)
      }
    } catch (err) {
      console.error('Error fetching assignment stats:', err)
      const errorMessage = err.response?.data?.message || 'Error al obtener estadísticas'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  return {
    stats,
    loading,
    error,
    refresh: fetchStats
  }
}

/**
 * Hook para manejar una asignación específica
 */
export const useAssignment = (assignmentId) => {
  const [assignment, setAssignment] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchAssignment = useCallback(async () => {
    if (!assignmentId) return
    
    setLoading(true)
    setError(null)
    
    try {
      const result = await assignmentService.getAssignmentById(assignmentId)
      
      if (result.success) {
        setAssignment(result.assignment)
      } else {
        setError(result.message || 'Error al obtener asignación')
        toast.error(result.message || 'Error al cargar asignación')
      }
    } catch (err) {
      console.error('Error fetching assignment:', err)
      const errorMessage = err.response?.data?.message || 'Error al obtener asignación'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [assignmentId])

  useEffect(() => {
    fetchAssignment()
  }, [fetchAssignment])

  return {
    assignment,
    loading,
    error,
    refresh: fetchAssignment
  }
}

export default useAssignments