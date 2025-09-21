import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Brain, Github, Linkedin, Mail, Phone, MapPin } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    'Navegación': [
      { name: 'Inicio', path: '/' },
      { name: 'Quiénes Somos', path: '/quienes-somos' },
      { name: 'Equipo', path: '/equipo' },
      { name: 'Recursos', path: '/recursos' },
    ],
    'Comunidad': [
      { name: 'Eventos', path: '/eventos' },
      { name: 'Contacto', path: '/contacto' },
      { name: 'Únete', path: '/register' },
      { name: 'Foro', path: '/foro' },
    ]
  }

  const socialLinks = [
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Mail, href: 'mailto:semillero.guia@correounivalle.edu.co', label: 'Email' },
  ]

  return (
    <footer className="bg-gradient-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo y descripción */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2"
          >
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="bg-white/20 p-2 rounded-lg"
              >
                <Brain className="w-8 h-8 text-white" />
              </motion.div>
              <span className="font-tech text-xl font-bold">
                Semillero GUIA
              </span>
            </Link>
            
            <p className="text-gray-300 mb-6 max-w-md">
              Impulsando la investigación en Inteligencia Artificial desde la universidad. 
              Creando un espacio colaborativo para el aprendizaje y la innovación.
            </p>

            <div className="space-y-2 text-sm text-gray-300">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>Universidad del Valle, Cali, Colombia</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <a 
                  href="mailto:semillero.guia@correounivalle.edu.co"
                  className="hover:text-white transition-colors duration-200"
                >
                  semillero.guia@correounivalle.edu.co
                </a>
              </div>
            </div>
          </motion.div>

          {/* Links de navegación */}
          {Object.entries(footerLinks).map(([category, links], index) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <h3 className="font-heading font-semibold text-lg mb-4">
                {category}
              </h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-gray-300 hover:text-white transition-colors duration-200 block"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Divisor */}
        <div className="border-t border-white/20 my-8"></div>

        {/* Footer bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-gray-300 text-sm mb-4 md:mb-0"
          >
            © {currentYear} Semillero GUIA. Todos los derechos reservados.
          </motion.p>

          {/* Redes sociales */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex space-x-4"
          >
            {socialLinks.map((social, index) => (
              <motion.a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors duration-200"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                aria-label={social.label}
              >
                <social.icon className="w-5 h-5" />
              </motion.a>
            ))}
          </motion.div>
        </div>
      </div>
    </footer>
  )
}

export default Footer