import { useState, useContext } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff, Mail, Lock, User, GraduationCap, Users } from 'lucide-react'
import { AuthContext } from '../context/AuthContext'
import toast from 'react-hot-toast'

const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const result = await login(data.email, data.password)
      if (result.success) {
        navigate('/')
      }
    } catch (error) {
      console.error('Error en login:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="pt-16 min-h-screen bg-gradient-soft flex items-center justify-center py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Left side - Information */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center lg:text-left"
        >
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-gradient mb-6">
            Bienvenido de vuelta
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Accede a tu cuenta para continuar siendo parte de nuestra comunidad 
            de investigación en inteligencia artificial.
          </p>
          
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-primary p-3 rounded-full">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-heading font-semibold text-gray-800">Acceso al Foro</h3>
                <p className="text-gray-600">Participa en discusiones y comparte tus avances</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-primary p-3 rounded-full">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-heading font-semibold text-gray-800">Recursos Exclusivos</h3>
                <p className="text-gray-600">Accede a materiales y herramientas del semillero</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-primary p-3 rounded-full">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-heading font-semibold text-gray-800">Perfil Personalizado</h3>
                <p className="text-gray-600">Gestiona tu información y habilidades</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right side - Login Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-heading font-bold text-gray-800 mb-2">
              Iniciar Sesión
            </h2>
            <p className="text-gray-600">
              Ingresa tus credenciales para acceder
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  {...register('email', {
                    required: 'El email es requerido',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Email inválido'
                    }
                  })}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="tu.email@correounivalle.edu.co"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', {
                    required: 'La contraseña es requerida',
                    minLength: {
                      value: 6,
                      message: 'La contraseña debe tener al menos 6 caracteres'
                    }
                  })}
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Iniciando...</span>
                </div>
              ) : (
                'Iniciar Sesión'
              )}
            </motion.button>
          </form>

          {/* Links */}
          <div className="mt-8 text-center space-y-4">
            <p className="text-gray-600">
              ¿No tienes una cuenta?{' '}
              <Link
                to="/register"
                className="text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200"
              >
                Regístrate aquí
              </Link>
            </p>
            
            <div className="text-sm text-gray-500">
              <p>¿Problemas para acceder?</p>
              <a
                href="mailto:semillero.guia@correounivalle.edu.co"
                className="text-primary-600 hover:text-primary-700 transition-colors duration-200"
              >
                Contacta al administrador
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Login