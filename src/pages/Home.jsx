import { motion } from 'framer-motion'
import { ArrowRight, Brain, Users, Target, Code, ChevronDown } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

const Home = () => {
  const [currentProject, setCurrentProject] = useState(0)

  const projects = [
    {
      title: 'Análisis de Sentimientos',
      description: 'Procesamiento de lenguaje natural para análisis de emociones',
      image: '/api/placeholder/400/300',
      tech: ['Python', 'NLTK', 'TensorFlow']
    },
    {
      title: 'Visión por Computador',
      description: 'Detección y clasificación de objetos en tiempo real',
      image: '/api/placeholder/400/300',
      tech: ['OpenCV', 'PyTorch', 'YOLO']
    },
    {
      title: 'Chatbot Inteligente',
      description: 'Asistente virtual basado en modelos de lenguaje',
      image: '/api/placeholder/400/300',
      tech: ['Transformers', 'Hugging Face', 'FastAPI']
    }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentProject((prev) => (prev + 1) % projects.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [projects.length])

  const scrollToContent = () => {
    document.getElementById('content').scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Background Animation */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 bg-institutional-red rounded-full animate-float"></div>
          <div className="absolute top-32 right-20 w-16 h-16 bg-secondary-500 rounded-full animate-float" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-institutional-red rounded-full animate-float" style={{animationDelay: '4s'}}></div>
          <div className="absolute bottom-32 right-1/4 w-24 h-24 bg-secondary-500 rounded-full animate-float" style={{animationDelay: '1s'}}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1 
              className="hero-text mb-6"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Impulsando la investigación en
              <br />
              <span className="text-gradient">Inteligencia Artificial</span>
              <br />
              desde la universidad
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Un espacio académico estudiantil dedicado al aprendizaje colaborativo, 
              la investigación y la innovación en inteligencia artificial.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Link to="/quienes-somos" className="btn-primary group">
                Conócenos
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
              <Link to="/register" className="btn-secondary">
                Únete al Semillero
              </Link>
            </motion.div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.button
            onClick={scrollToContent}
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-gray-400 hover:text-primary-600 transition-colors duration-300"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ChevronDown className="w-8 h-8" />
          </motion.button>
        </div>
      </section>

      {/* Content Section */}
      <div id="content">
        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="section-title">¿Qué nos hace únicos?</h2>
              <p className="section-subtitle mx-auto">
                Descubre las características que nos definen como semillero de investigación
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: Brain,
                  title: 'Aprender Haciendo',
                  description: 'Practicamos con ejemplos reales, retos y mini-proyectos que fortalecen nuestros conocimientos.'
                },
                {
                  icon: Users,
                  title: 'Compartir y Crecer',
                  description: 'Diseñamos talleres y sesiones de mentoría donde aprendemos unos de otros.'
                },
                {
                  icon: Target,
                  title: 'Explorar Fronteras',
                  description: 'Investigamos temas como visión por computador, NLP y análisis de datos.'
                },
                {
                  icon: Code,
                  title: 'Impacto Social',
                  description: 'Reflexionamos sobre el efecto de nuestras tecnologías, buscando un uso ético y justo.'
                }
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="card text-center group"
                >
                  <motion.div
                    className="bg-gradient-primary p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center"
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.3 }}
                  >
                    <feature.icon className="w-8 h-8 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-heading font-semibold mb-4 text-gray-800">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Projects Carousel */}
        <section className="py-20 bg-gradient-soft">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="section-title text-institutional-black">Nuestros Proyectos</h2>
              <p className="section-subtitle mx-auto text-accent-medium">
                Explora algunos de los proyectos en los que estamos trabajando
              </p>
            </motion.div>

            <div className="relative">
              <motion.div
                key={currentProject}
                initial={{ opacity: 0, x: 300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -300 }}
                transition={{ duration: 0.5 }}
                className="card-gradient text-center text-institutional-white"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="text-3xl font-heading font-bold mb-4 text-institutional-white">
                      {projects[currentProject].title}
                    </h3>
                    <p className="text-lg mb-6 opacity-90 text-institutional-white">
                      {projects[currentProject].description}
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center mb-6">
                      {projects[currentProject].tech.map((tech) => (
                        <span
                          key={tech}
                          className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium text-institutional-white"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    <Link to="/nuestro-trabajo" className="btn-secondary bg-institutional-white text-institutional-red hover:bg-gray-100 border-institutional-white">
                      Ver Todos los Proyectos
                    </Link>
                  </div>
                  <div className="order-first lg:order-last">
                    <div className="bg-white/20 rounded-xl p-8 backdrop-blur-sm">
                      <div className="w-full h-48 bg-white/30 rounded-lg flex items-center justify-center">
                        <Code className="w-16 h-16 text-white/60" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Project indicators */}
              <div className="flex justify-center mt-8 space-x-2">
                {projects.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentProject(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentProject ? 'bg-primary-600 scale-125' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-dark text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6 text-institutional-white">
                ¿Listo para ser parte del futuro?
              </h2>
              <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto text-institutional-white">
                Únete a nuestro semillero y forma parte de una comunidad apasionada 
                por la inteligencia artificial y la innovación tecnológica.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register" className="btn-primary bg-institutional-white text-institutional-red hover:bg-gray-100">
                  Únete Ahora
                </Link>
                <Link to="/contacto" className="btn-secondary border-institutional-white text-institutional-white hover:bg-institutional-white hover:text-institutional-red">
                  Contáctanos
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Home