import { motion } from 'framer-motion'
import { Github, Linkedin, Mail, MapPin, Award, Calendar } from 'lucide-react'

const Team = () => {
  // Datos de ejemplo del equipo - estos se deberían obtener de la API
  const teamMembers = [
    {
      id: 1,
      name: 'Ana García',
      role: 'Coordinadora',
      career: 'Ingeniería de Sistemas',
      semester: 8,
      bio: 'Apasionada por el machine learning y la visión por computador. Lidera proyectos de investigación en redes neuronales.',
      skills: ['Python', 'TensorFlow', 'Computer Vision', 'Deep Learning'],
      socialLinks: {
        github: 'https://github.com/anagarcia',
        linkedin: 'https://linkedin.com/in/anagarcia',
        email: 'ana.garcia@correounivalle.edu.co'
      },
      achievements: ['Mejor proyecto 2023', 'Ponencia en congreso de IA'],
      joinDate: '2023-01-15'
    },
    {
      id: 2,
      name: 'Carlos Rodríguez',
      role: 'Responsable de Proyectos',
      career: 'Ingeniería Electrónica',
      semester: 7,
      bio: 'Especializado en procesamiento de señales y sistemas embebidos con IA. Desarrolla soluciones IoT inteligentes.',
      skills: ['Python', 'PyTorch', 'IoT', 'Signal Processing'],
      socialLinks: {
        github: 'https://github.com/carlosrod',
        linkedin: 'https://linkedin.com/in/carlosrod',
        email: 'carlos.rodriguez@correounivalle.edu.co'
      },
      achievements: ['Proyecto destacado en feria de ciencias'],
      joinDate: '2023-02-20'
    },
    {
      id: 3,
      name: 'Prof. María López',
      role: 'Docente Asesor',
      career: 'Docente - Escuela de Ingeniería',
      bio: 'PhD en Inteligencia Artificial. Especialista en NLP y modelos de lenguaje. Guía y orienta las investigaciones del semillero.',
      skills: ['NLP', 'Transformers', 'Research', 'Machine Learning'],
      socialLinks: {
        linkedin: 'https://linkedin.com/in/marialopez',
        email: 'maria.lopez@correounivalle.edu.co'
      },
      achievements: ['15+ publicaciones en IA', 'PhD en IA - Universidad de Stanford'],
      joinDate: '2023-01-01'
    },
    {
      id: 4,
      name: 'Diego Fernández',
      role: 'Desarrollador Full Stack',
      career: 'Ingeniería de Sistemas',
      semester: 6,
      bio: 'Enfocado en el desarrollo de aplicaciones web con IA integrada. Especialista en React y Node.js.',
      skills: ['React', 'Node.js', 'MongoDB', 'API Development'],
      socialLinks: {
        github: 'https://github.com/diegofern',
        linkedin: 'https://linkedin.com/in/diegofern',
        email: 'diego.fernandez@correounivalle.edu.co'
      },
      achievements: ['Ganador hackathon universitario'],
      joinDate: '2023-03-10'
    },
    {
      id: 5,
      name: 'Laura Martínez',
      role: 'Especialista en Data Science',
      career: 'Estadística',
      semester: 9,
      bio: 'Experta en análisis de datos y visualización. Lidera proyectos de ciencia de datos aplicada a problemas reales.',
      skills: ['Python', 'R', 'Pandas', 'Data Visualization'],
      socialLinks: {
        github: 'https://github.com/lauramartinez',
        linkedin: 'https://linkedin.com/in/lauramartinez',
        email: 'laura.martinez@correounivalle.edu.co'
      },
      achievements: ['Certificación Google Data Analytics'],
      joinDate: '2023-04-05'
    },
    {
      id: 6,
      name: 'Andrés Gómez',
      role: 'Investigador Junior',
      career: 'Matemáticas',
      semester: 5,
      bio: 'Nuevo miembro con gran potencial en matemáticas aplicadas. Se enfoca en algoritmos de optimización.',
      skills: ['Python', 'Mathematics', 'Algorithms', 'Optimization'],
      socialLinks: {
        github: 'https://github.com/andresgomez',
        email: 'andres.gomez@correounivalle.edu.co'
      },
      achievements: ['Estudiante destacado en matemáticas'],
      joinDate: '2024-01-15'
    }
  ]

  const stats = [
    { label: 'Miembros Activos', value: '12+' },
    { label: 'Proyectos Completados', value: '8' },
    { label: 'Publicaciones', value: '3' },
    { label: 'Talleres Realizados', value: '15' }
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
              Nuestro Equipo
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Conoce a las personas apasionadas que hacen posible el Semillero GUIA. 
              Un grupo diverso de estudiantes y docentes unidos por la investigación en IA.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16"
          >
            {stats.map((stat, index) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gradient mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team Members */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="section-title">Miembros del Equipo</h2>
            <p className="section-subtitle mx-auto">
              Cada miembro aporta su experiencia única para enriquecer nuestra comunidad de investigación
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card group hover:shadow-2xl transition-all duration-300"
              >
                {/* Profile Image Placeholder */}
                <div className="relative mb-6">
                  <div className="w-24 h-24 bg-gradient-primary rounded-full mx-auto flex items-center justify-center text-white text-2xl font-bold">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-lg">
                    <Award className="w-4 h-4 text-primary-600" />
                  </div>
                </div>

                {/* Member Info */}
                <div className="text-center mb-4">
                  <h3 className="text-xl font-heading font-bold text-gray-800 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-primary-600 font-medium mb-2">
                    {member.role}
                  </p>
                  <div className="text-sm text-gray-600 mb-2">
                    {member.career}
                    {member.semester && ` • Semestre ${member.semester}`}
                  </div>
                  <div className="flex items-center justify-center text-xs text-gray-500 mb-4">
                    <Calendar className="w-3 h-3 mr-1" />
                    Desde {new Date(member.joinDate).toLocaleDateString('es-ES', { 
                      year: 'numeric', 
                      month: 'long' 
                    })}
                  </div>
                </div>

                {/* Bio */}
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {member.bio}
                </p>

                {/* Skills */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {member.skills.slice(0, 4).map((skill) => (
                      <span
                        key={skill}
                        className="bg-primary-50 text-primary-700 px-2 py-1 rounded-full text-xs font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                    {member.skills.length > 4 && (
                      <span className="text-xs text-gray-500 px-2 py-1">
                        +{member.skills.length - 4} más
                      </span>
                    )}
                  </div>
                </div>

                {/* Achievements */}
                {member.achievements && member.achievements.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Logros:</h4>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {member.achievements.map((achievement, i) => (
                        <li key={i} className="flex items-start">
                          <span className="w-1 h-1 bg-primary-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Social Links */}
                <div className="flex justify-center space-x-3 pt-4 border-t border-gray-100">
                  {member.socialLinks.github && (
                    <motion.a
                      href={member.socialLinks.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-primary-600 transition-colors duration-200"
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Github className="w-5 h-5" />
                    </motion.a>
                  )}
                  {member.socialLinks.linkedin && (
                    <motion.a
                      href={member.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-primary-600 transition-colors duration-200"
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Linkedin className="w-5 h-5" />
                    </motion.a>
                  )}
                  {member.socialLinks.email && (
                    <motion.a
                      href={`mailto:${member.socialLinks.email}`}
                      className="text-gray-400 hover:text-primary-600 transition-colors duration-200"
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Mail className="w-5 h-5" />
                    </motion.a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Team CTA */}
      <section className="py-20 bg-gradient-dark text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
              ¿Quieres ser parte del equipo?
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Siempre estamos buscando nuevos talentos apasionados por la inteligencia artificial. 
              ¡Únete a nosotros y contribuye al futuro de la tecnología!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="/register"
                className="btn-primary bg-white text-primary-600 hover:bg-gray-100"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Únete al Semillero
              </motion.a>
              <motion.a
                href="/contacto"
                className="btn-secondary border-white text-white hover:bg-white hover:text-primary-600"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Conoce Más
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Team