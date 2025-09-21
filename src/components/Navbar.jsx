import { useState, useContext } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Brain, User, LogOut } from 'lucide-react'
import { AuthContext } from '../context/AuthContext'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const location = useLocation()
  const { user, logout } = useContext(AuthContext)

  const menuItems = [
    { name: 'Inicio', path: '/' },
    { name: 'Quiénes Somos', path: '/quienes-somos' },
    { name: 'Equipo', path: '/equipo' },
    { name: 'Nuestro Trabajo', path: '/nuestro-trabajo' },
    { name: 'Recursos', path: '/recursos' },
    { name: 'Eventos', path: '/eventos' },
    { name: 'Contacto', path: '/contacto' },
  ]

  const userMenuItems = user ? [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Proyectos', path: '/projects' },
    { name: 'Mis Tareas', path: '/assignments' },
    { name: 'Foro', path: '/foro' },
  ] : []

  const handleLogout = () => {
    logout()
    setIsUserMenuOpen(false)
  }

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-institutional-white/95 backdrop-blur-sm shadow-md fixed w-full top-0 z-50 border-b-2 border-institutional-red"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="bg-institutional-red p-2 rounded-lg"
            >
              <Brain className="w-8 h-8 text-institutional-white" />
            </motion.div>
            <span className="font-institutional text-xl font-bold text-institutional-red">
              Semillero GUIA
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`navbar-item ${
                  location.pathname === item.path ? 'navbar-item-active' : ''
                }`}
              >
                {item.name}
              </Link>
            ))}
            
            {/* User Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors duration-200"
                >
                  <User className="w-5 h-5" />
                  <span className="font-medium">{user.name}</span>
                </button>
                
                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2"
                    >
                      {userMenuItems.map((item) => (
                        <Link
                          key={item.name}
                          to={item.path}
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          {item.name}
                        </Link>
                      ))}
                      <hr className="my-2" />
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Cerrar Sesión</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="btn-secondary text-sm py-2 px-4">
                  Iniciar Sesión
                </Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-4">
                  Únete
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-primary-600 transition-colors duration-200"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-gray-200"
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                {menuItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`block px-3 py-2 text-base font-medium transition-colors duration-200 ${
                      location.pathname === item.path
                        ? 'text-primary-600 bg-primary-50'
                        : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                
                {user ? (
                  <div className="border-t border-gray-200 pt-2">
                    <div className="px-3 py-2 text-sm text-gray-500">
                      Hola, {user.name}
                    </div>
                    {userMenuItems.map((item) => (
                      <Link
                        key={item.name}
                        to={item.path}
                        className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                        onClick={() => setIsOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                    <hr className="my-2" />
                    <button
                      onClick={() => {
                        handleLogout()
                        setIsOpen(false)
                      }}
                      className="w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                    >
                      Cerrar Sesión
                    </button>
                  </div>
                ) : (
                  <div className="border-t border-gray-200 pt-2 space-y-2">
                    <Link
                      to="/login"
                      className="block w-full text-center btn-secondary text-sm py-2"
                      onClick={() => setIsOpen(false)}
                    >
                      Iniciar Sesión
                    </Link>
                    <Link
                      to="/register"
                      className="block w-full text-center btn-primary text-sm py-2"
                      onClick={() => setIsOpen(false)}
                    >
                      Únete
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}

export default Navbar