import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Send } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import toast from 'react-hot-toast'

const Contact = () => {
  const [loading, setLoading] = useState(false)
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm()

  const onSubmit = async (data) => {
    setLoading(true)
    // Simular envío de email
    setTimeout(() => {
      toast.success('Mensaje enviado correctamente. Te contactaremos pronto.')
      reset()
      setLoading(false)
    }, 2000)
  }

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      details: 'semillero.guia@correounivalle.edu.co',
      link: 'mailto:semillero.guia@correounivalle.edu.co'
    },
    {
      icon: MapPin,
      title: 'Ubicación',
      details: 'Universidad del Valle, Cali, Colombia',
      link: 'https://maps.google.com/maps?q=Universidad+del+Valle,+Cali'
    },
    {
      icon: Phone,
      title: 'Reuniones',
      details: 'Miércoles 2:00 PM - 4:00 PM',
      link: null
    }
  ]

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-gradient mb-6">
              Contáctanos
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              ¿Tienes preguntas sobre el semillero? ¿Quieres participar en nuestros proyectos? 
              ¡Nos encantaría escucharte!
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-gradient-soft rounded-2xl p-8"
            >
              <h2 className="text-3xl font-heading font-bold text-gray-800 mb-6">
                Envíanos un mensaje
              </h2>
              <p className="text-gray-600 mb-8">
                Completa el formulario y nos pondremos en contacto contigo lo antes posible.
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Nombre */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      {...register('name', { required: 'El nombre es requerido' })}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Tu nombre"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      {...register('email', {
                        required: 'El email es requerido',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Email inválido'
                        }
                      })}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="tu.email@ejemplo.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                {/* Asunto */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Asunto *
                  </label>
                  <select
                    {...register('subject', { required: 'El asunto es requerido' })}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 ${
                      errors.subject ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Selecciona un asunto</option>
                    <option value="unirse">Quiero unirme al semillero</option>
                    <option value="colaboracion">Propuesta de colaboración</option>
                    <option value="informacion">Solicitar información</option>
                    <option value="otro">Otro</option>
                  </select>
                  {errors.subject && (
                    <p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>
                  )}
                </div>

                {/* Mensaje */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mensaje *
                  </label>
                  <textarea
                    {...register('message', { required: 'El mensaje es requerido' })}
                    rows={6}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 resize-none ${
                      errors.message ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Escribe tu mensaje aquí..."
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
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
                      <span>Enviando...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <Send className="w-5 h-5" />
                      <span>Enviar Mensaje</span>
                    </div>
                  )}
                </motion.button>
              </form>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-3xl font-heading font-bold text-gray-800 mb-6">
                  Información de contacto
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed mb-8">
                  Estamos aquí para ayudarte y responder todas tus preguntas sobre 
                  inteligencia artificial y nuestro semillero de investigación.
                </p>
              </div>

              {/* Contact Cards */}
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={info.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="card group"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="bg-gradient-primary p-3 rounded-full group-hover:scale-110 transition-transform duration-300">
                        <info.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-heading font-semibold text-gray-800 mb-1">
                          {info.title}
                        </h3>
                        {info.link ? (
                          <a
                            href={info.link}
                            target={info.link.startsWith('mailto:') ? '_self' : '_blank'}
                            rel="noopener noreferrer"
                            className="text-primary-600 hover:text-primary-700 transition-colors duration-200"
                          >
                            {info.details}
                          </a>
                        ) : (
                          <p className="text-gray-600">{info.details}</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Additional Info */}
              <div className="bg-gradient-primary rounded-xl p-6 text-white">
                <h3 className="text-xl font-heading font-bold mb-4">
                  ¿Quieres visitarnos?
                </h3>
                <p className="opacity-90 mb-4">
                  Nos reunimos todos los miércoles en la Universidad del Valle. 
                  ¡Eres bienvenido a participar en nuestras sesiones!
                </p>
                <p className="text-sm opacity-80">
                  * Es recomendable confirmar asistencia por email
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Section (Placeholder) */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="section-title">Nuestra Ubicación</h2>
            <p className="section-subtitle mx-auto">
              Encuéntranos en la Universidad del Valle, Cali, Colombia
            </p>
          </motion.div>

          {/* Map Placeholder */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="bg-white rounded-xl shadow-lg p-8 text-center"
          >
            <MapPin className="w-16 h-16 text-primary-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Universidad del Valle
            </h3>
            <p className="text-gray-600 mb-4">
              Cali, Valle del Cauca, Colombia
            </p>
            <a
              href="https://maps.google.com/maps?q=Universidad+del+Valle,+Cali"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center space-x-2"
            >
              <MapPin className="w-5 h-5" />
              <span>Ver en Google Maps</span>
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Contact