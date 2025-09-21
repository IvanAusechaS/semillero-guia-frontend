import { motion } from 'framer-motion'

const Resources = () => {
  return (
    <div className="pt-16 min-h-screen bg-gradient-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-gradient mb-6">
            Recursos
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Página en construcción. Aquí encontrarás todos los recursos de aprendizaje 
            y materiales del semillero.
          </p>
          <div className="bg-white rounded-lg p-8 shadow-lg">
            <p className="text-gray-600">
              📚 Esta sección incluirá:
            </p>
            <ul className="mt-4 text-left max-w-md mx-auto space-y-2 text-gray-600">
              <li>• Libros recomendados</li>
              <li>• Cursos online</li>
              <li>• Tutoriales y guías</li>
              <li>• Papers de investigación</li>
              <li>• Herramientas y software</li>
              <li>• Datasets para práctica</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Resources