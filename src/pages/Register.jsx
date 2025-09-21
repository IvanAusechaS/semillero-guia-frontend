import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useContext } from 'react'
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  GraduationCap, 
  BookOpen,
  Check
} from 'lucide-react'
import { AuthContext } from '../context/AuthContext'

const Register = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { register: registerUser } = useContext(AuthContext)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm()

  const watchRole = watch('role')
  const watchPassword = watch('password')

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const result = await registerUser(data)
      if (result.success) {
        navigate('/')
      }
    } catch (error) {
      console.error('Error en registro:', error)
    } finally {
      setLoading(false)
    }
  }

  const benefits = [
    'Acceso completo al foro de discusión',
    'Recursos exclusivos de aprendizaje',
    'Participación en proyectos colaborativos',
    'Talleres y sesiones de mentoría',
    'Networking con expertos en IA',
    'Certificación de participación'
  ]

  const careers = [
    'Ingeniería de Sistemas',
    'Ingeniería Electrónica',
    'Ingeniería Industrial',
    'Matemáticas',
    'Estadística',
    'Física',
    'Otra'
  ]

  return (
    <div className="pt-16 min-h-screen bg-gradient-soft py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-gradient mb-6">
            Únete al Semillero GUIA
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Forma parte de nuestra comunidad de investigación en inteligencia artificial 
            y comienza tu viaje hacia el futuro de la tecnología.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Benefits Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-1"
          >
            <div className="card-gradient">
              <h3 className="text-2xl font-heading font-bold mb-6">
                ¿Por qué unirte?
              </h3>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-start space-x-3"
                  >
                    <Check className="w-5 h-5 text-white mt-1 flex-shrink-0" />
                    <span className="text-white/90">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Registration Form */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-heading font-bold text-gray-800 mb-2">
                  Crear Cuenta
                </h2>
                <p className="text-gray-600">
                  Completa la información para unirte al semillero
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Nombre */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre Completo *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        {...register('name', {
                          required: 'El nombre es requerido',
                          minLength: {
                            value: 2,
                            message: 'El nombre debe tener al menos 2 caracteres'
                          }
                        })}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 ${
                          errors.name ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Juan Pérez"
                      />
                    </div>
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Correo Electrónico *
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
                        placeholder="juan.perez@correounivalle.edu.co"
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Rol */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rol *
                    </label>
                    <select
                      {...register('role', { required: 'El rol es requerido' })}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 ${
                        errors.role ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Selecciona tu rol</option>
                      <option value="estudiante">Estudiante</option>
                      <option value="docente">Docente</option>
                    </select>
                    {errors.role && (
                      <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
                    )}
                  </div>

                  {/* Carrera */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Carrera *
                    </label>
                    <div className="relative">
                      <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <select
                        {...register('career', { required: 'La carrera es requerida' })}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 ${
                          errors.career ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Selecciona tu carrera</option>
                        {careers.map((career) => (
                          <option key={career} value={career}>{career}</option>
                        ))}
                      </select>
                    </div>
                    {errors.career && (
                      <p className="mt-1 text-sm text-red-600">{errors.career.message}</p>
                    )}
                  </div>
                </div>

                {/* Semestre - Solo para estudiantes */}
                {watchRole === 'estudiante' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Semestre *
                    </label>
                    <div className="relative">
                      <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <select
                        {...register('semester', {
                          required: watchRole === 'estudiante' ? 'El semestre es requerido' : false
                        })}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 ${
                          errors.semester ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Selecciona tu semestre</option>
                        {[...Array(12)].map((_, i) => (
                          <option key={i + 1} value={i + 1}>{i + 1}</option>
                        ))}
                      </select>
                    </div>
                    {errors.semester && (
                      <p className="mt-1 text-sm text-red-600">{errors.semester.message}</p>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contraseña *
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

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirmar Contraseña *
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        {...register('confirmPassword', {
                          required: 'Confirma tu contraseña',
                          validate: value => value === watchPassword || 'Las contraseñas no coinciden'
                        })}
                        className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 ${
                          errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                    )}
                  </div>
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
                      <span>Registrando...</span>
                    </div>
                  ) : (
                    'Crear Cuenta'
                  )}
                </motion.button>
              </form>

              {/* Links */}
              <div className="mt-8 text-center">
                <p className="text-gray-600">
                  ¿Ya tienes una cuenta?{' '}
                  <Link
                    to="/login"
                    className="text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200"
                  >
                    Inicia sesión aquí
                  </Link>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Register