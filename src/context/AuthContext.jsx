import { createContext, useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import toast from 'react-hot-toast'
import { authService } from '../services/api'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const token = Cookies.get('token')
    if (token) {
      checkAuth()
    } else {
      setLoading(false)
    }
  }, [])

  const checkAuth = async () => {
    try {
      const response = await authService.getProfile()
      setUser(response.user)
    } catch (error) {
      console.error('Error checking auth:', error)
      logout()
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password)
      const { token, user } = response
      
      Cookies.set('token', token, { expires: 7 })
      setUser(user)
      
      toast.success(`¡Bienvenido, ${user.name}!`)
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Error al iniciar sesión'
      toast.error(message)
      return { success: false, message }
    }
  }

  const register = async (userData) => {
    try {
      const response = await authService.register(userData)
      const { token, user } = response
      
      Cookies.set('token', token, { expires: 7 })
      setUser(user)
      
      toast.success(`¡Bienvenido al Semillero GUIA, ${user.name}!`)
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Error al registrarse'
      toast.error(message)
      return { success: false, message }
    }
  }

  const updateProfile = async (profileData) => {
    try {
      const response = await authService.updateProfile(profileData)
      setUser(response.user)
      toast.success('Perfil actualizado correctamente')
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Error al actualizar perfil'
      toast.error(message)
      return { success: false, message }
    }
  }

  const logout = () => {
    Cookies.remove('token')
    setUser(null)
    toast.success('Sesión cerrada correctamente')
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