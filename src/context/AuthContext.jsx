import { createContext, useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { authService } from '../services/api'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    // Verificar si hay datos de usuario en localStorage
    // Las cookies HTTPOnly se validan automáticamente en el backend
    const savedUser = authService.getCurrentUser()
    if (savedUser) {
      setUser(savedUser)
      // Verificar que el token sigue siendo válido
      checkAuth()
    } else {
      setLoading(false)
    }
  }, [])

  const checkAuth = async () => {
    try {
      const response = await authService.getProfile()
      if (response.success) {
        setUser(response.user)
      } else {
        // Token inválido o expirado
        logout()
      }
    } catch (error) {
      console.error('Error checking auth:', error)
      // Si hay error 401, el interceptor ya manejará el logout
      if (error.response?.status !== 401) {
        logout()
      }
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password)
      
      if (response.success) {
        setUser(response.user)
        toast.success(`¡Bienvenido, ${response.user.name}!`)
        return { success: true }
      } else {
        toast.error(response.message || 'Error al iniciar sesión')
        return { success: false, message: response.message }
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Error al iniciar sesión'
      toast.error(message)
      return { success: false, message }
    }
  }

  const register = async (userData) => {
    try {
      const response = await authService.register(userData)
      
      if (response.success) {
        setUser(response.user)
        toast.success(`¡Bienvenido al Semillero GUIA, ${response.user.name}!`)
        return { success: true }
      } else {
        toast.error(response.message || 'Error al registrarse')
        return { success: false, message: response.message }
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Error al registrarse'
      toast.error(message)
      return { success: false, message }
    }
  }

  const updateProfile = async (profileData) => {
    try {
      const response = await authService.updateProfile(profileData)
      
      if (response.success) {
        setUser(response.user)
        toast.success('Perfil actualizado correctamente')
        return { success: true }
      } else {
        toast.error(response.message || 'Error al actualizar perfil')
        return { success: false, message: response.message }
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Error al actualizar perfil'
      toast.error(message)
      return { success: false, message }
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
      setUser(null)
      toast.success('Sesión cerrada correctamente')
    } catch (error) {
      console.error('Error during logout:', error)
      // Forzar logout local incluso si hay error en el servidor
      setUser(null)
      localStorage.removeItem('user')
      toast.success('Sesión cerrada')
    }
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    checkAuth
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}