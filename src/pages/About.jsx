import { motion } from 'framer-motion'
import { Target, Heart, Lightbulb, Users, BookOpen, Microscope, Brain, Globe } from 'lucide-react'

const About = () => {
  const objectives = [
    {
      icon: BookOpen,
      title: 'Aprender haciendo',
      description: 'Practicamos con ejemplos, retos y mini-proyectos que afiancen nuestros conocimientos.'
    },
    {
      icon: Users,
      title: 'Compartir y crecer',
      description: 'Diseñamos talleres, charlas y sesiones de mentoría donde unos enseñen a otros.'
    },
    {
      icon: Microscope,
      title: 'Explorar nuevas fronteras',
      description: 'Investigamos temas como visión por computador, procesamiento de texto y análisis de datos.'
    },
    {
      icon: Heart,
      title: 'Incluir talentos diversos',
      description: 'Abrimos puertas a quienes se inician, ofreciéndoles recursos y acompañamiento para sumarse con confianza.'
    },
    {
      icon: Globe,
      title: 'Pensar en el impacto',
      description: 'Reflexionamos siempre sobre el efecto de nuestras ideas y tecnologías en la sociedad, buscando un uso ético y justo.'
    }
  ]

  const timeline = [
    {
      year: '2023',
      title: 'Fundación del Semillero',
      description: 'Nace del entusiasmo de estudiantes por la inteligencia artificial'
    },
    {
      year: '2024',
      title: 'Primeros Proyectos',
      description: 'Desarrollo de proyectos en machine learning y procesamiento de lenguaje natural'
    },
    {
      year: '2024',
      title: 'Crecimiento',
      description: 'Expansión del equipo e integración de nuevos miembros'
    },
    {
      year: 'Futuro',
      title: 'Visión 2025',
      description: 'Consolidarnos como referencia en investigación de IA en la Universidad del Valle'
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
              Quiénes Somos
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Conoce más sobre nuestra historia, misión, visión y los objetivos que nos guían 
              en nuestra pasión por la inteligencia artificial.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Historia */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="section-title">Nuestra Historia</h2>
              <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
                <p>
                  El <strong className="text-gradient">Semillero de Investigación en Inteligencia Artificial</strong> llamado 
                  <strong className="text-gradient"> Semillero GUIA</strong> es un espacio académico estudiantil dedicado al 
                  aprendizaje colaborativo, que nace del entusiasmo por conseguir una formación sólida en fundamentos de la 
                  inteligencia artificial y la exploración de sus múltiples aplicaciones.
                </p>
                <p>
                  Surge como una iniciativa de estudiantes interesados en las tecnologías emergentes y comprometidos con 
                  construir desde las bases un conocimiento profundo y riguroso en áreas como machine learning, modelos de 
                  lenguaje (LLMs), ciencia de datos y sistemas inteligentes.
                </p>
                <p>
                  Actualmente, el semillero se enfoca en compartir conocimientos, debatir ideas y experimentar con herramientas 
                  fundamentadas en la IA, pero proyecta su crecimiento hacia el diseño y desarrollo de proyectos propios, 
                  innovadores, con impacto académico, social o productivo.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="bg-gradient-primary rounded-2xl p-8 text-white">
                <Brain className="w-16 h-16 mb-6 mx-auto" />
                <h3 className="text-2xl font-heading font-bold text-center mb-4">
                  Integrando talentos diversos
                </h3>
                <p className="text-center opacity-90 text-lg">
                  Buscamos integrar a nuevos miembros con conocimientos básicos o intermedios, 
                  brindándoles orientación para que puedan aportar activamente en propuestas 
                  tecnológicas completas y colaborativas.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Misión y Visión */}
      <section className="py-20 bg-gradient-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="section-title">Misión y Visión</h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Misión */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="card"
            >
              <div className="text-center mb-6">
                <div className="bg-gradient-primary p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-heading font-bold text-gray-800">Misión</h3>
              </div>
              <p className="text-gray-600 leading-relaxed text-lg">
                Crear un espacio amigable y colaborativo donde cada miembro crezca tanto en habilidades 
                técnicas como en pensamiento crítico. Nos apasiona aprender juntos, apoyarnos mutuamente 
                y aplicar lo que sabemos para proponer soluciones creativas y responsables a retos concretos 
                relacionados con problemáticas reales.
              </p>
            </motion.div>

            {/* Visión */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="card"
            >
              <div className="text-center mb-6">
                <div className="bg-gradient-primary p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Lightbulb className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-heading font-bold text-gray-800">Visión</h3>
              </div>
              <p className="text-gray-600 leading-relaxed text-lg">
                Consolidarnos, a largo plazo, como un semillero de referencia dentro y fuera de la 
                Universidad del Valle: un lugar donde florezcan proyectos innovadores y donde antiguos 
                y nuevos integrantes trabajen codo a codo, aportando distintas miradas y habilidades, 
                comprometido con lograr la calidad de su proceso formativo.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Objetivos */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="section-title">Nuestros Objetivos</h2>
            <p className="section-subtitle mx-auto">
              Los pilares que guían nuestro trabajo y crecimiento como semillero
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {objectives.map((objective, index) => (
              <motion.div
                key={objective.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card text-center group hover:shadow-xl"
              >
                <motion.div
                  className="bg-gradient-primary p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center"
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.3 }}
                >
                  <objective.icon className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-xl font-heading font-semibold mb-4 text-gray-800">
                  {objective.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {objective.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-gradient-dark text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-heading font-bold mb-6">Nuestro Camino</h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Un viaje de aprendizaje, crecimiento y construcción de conocimiento
            </p>
          </motion.div>

          <div className="relative">
            {/* Línea central */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-white/30"></div>

            {timeline.map((item, index) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className={`relative flex items-center mb-12 ${
                  index % 2 === 0 ? 'justify-start' : 'justify-end'
                }`}
              >
                {/* Punto en la línea */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white rounded-full border-4 border-primary-600"></div>

                {/* Contenido */}
                <div className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                    <div className="text-2xl font-bold font-tech text-primary-300 mb-2">
                      {item.year}
                    </div>
                    <h3 className="text-xl font-heading font-semibold mb-3">
                      {item.title}
                    </h3>
                    <p className="opacity-90">
                      {item.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default About