import { useState, useEffect, useContext } from 'react'
import { motion } from 'framer-motion'
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock,
  ExternalLink,
  UserPlus,
  UserCheck,
  Filter,
  RefreshCw
} from 'lucide-react'
import { eventService } from '../services/api'
import { AuthContext } from '../context/AuthContext'
import LoadingSpinner from '../components/LoadingSpinner'
import { formatDate, formatDateTime, EVENT_TYPES } from '../utils/mongodb'
import toast from 'react-hot-toast'

const Events = () => {
  const { user } = useContext(AuthContext)
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    type: '',
    upcoming: true
  })

  useEffect(() => {
    fetchEvents()
  }, [filters])

  const fetchEvents = async () => {
    try {
      setLoading(true)
      const params = {
        ...(filters.type && { type: filters.type }),
        ...(filters.upcoming && { upcoming: true }),
        limit: 50
      }

      const response = await eventService.getEvents(params)
      setEvents(response.events || [])
    } catch (error) {
      console.error('Error fetching events:', error)
      toast.error('Error al cargar los eventos')
    } finally {
      setLoading(false)
    }
  }

  const handleRegisterToEvent = async (eventId) => {
    if (!user) {
      toast.error('Debes iniciar sesión para registrarte')
      return
    }

    try {
      await eventService.registerToEvent(eventId)
      toast.success('Registro exitoso al evento')
      fetchEvents() // Refresh events
    } catch (error) {
      console.error('Error registering to event:', error)
      toast.error(error.response?.data?.message || 'Error al registrarse al evento')
    }
  }

  const handleUnregisterFromEvent = async (eventId) => {
    if (!user) return

    try {
      await eventService.unregisterFromEvent(eventId)
      toast.success('Registro cancelado')
      fetchEvents() // Refresh events
    } catch (error) {
      console.error('Error unregistering from event:', error)
      toast.error(error.response?.data?.message || 'Error al cancelar registro')
    }
  }

  const getEventTypeText = (type) => {
    const typeTexts = {
      [EVENT_TYPES.SEMINAR]: 'Seminario',
      [EVENT_TYPES.WORKSHOP]: 'Taller',
      [EVENT_TYPES.CONFERENCE]: 'Conferencia',
      [EVENT_TYPES.MEETING]: 'Reunión',
      [EVENT_TYPES.PRESENTATION]: 'Presentación'
    }
    return typeTexts[type] || type
  }

  const getEventTypeColor = (type) => {
    const colors = {
      [EVENT_TYPES.SEMINAR]: 'bg-blue-100 text-blue-800',
      [EVENT_TYPES.WORKSHOP]: 'bg-green-100 text-green-800',
      [EVENT_TYPES.CONFERENCE]: 'bg-purple-100 text-purple-800',
      [EVENT_TYPES.MEETING]: 'bg-yellow-100 text-yellow-800',
      [EVENT_TYPES.PRESENTATION]: 'bg-red-100 text-red-800'
    }
    return colors[type] || 'bg-gray-100 text-gray-800'
  }

  const isUserRegistered = (event) => {
    if (!user || !event.attendees) return false
    return event.attendees.some(attendee => 
      (typeof attendee === 'string' ? attendee : attendee._id) === user._id
    )
  }

  const canRegister = (event) => {
    if (!user) return false
    if (isUserRegistered(event)) return false
    if (event.maxAttendees && event.attendees?.length >= event.maxAttendees) return false
    if (new Date(event.startDate) < new Date()) return false
    return true
  }

  return (
    <div className="pt-16 min-h-screen bg-gradient-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-gradient mb-6">
              Eventos del Semillero
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Descubre y participa en nuestros eventos, talleres, charlas y actividades 
              relacionadas con inteligencia artificial.
            </p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de evento
                  </label>
                  <select
                    value={filters.type}
                    onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Todos los tipos</option>
                    <option value={EVENT_TYPES.SEMINAR}>Seminarios</option>
                    <option value={EVENT_TYPES.WORKSHOP}>Talleres</option>
                    <option value={EVENT_TYPES.CONFERENCE}>Conferencias</option>
                    <option value={EVENT_TYPES.MEETING}>Reuniones</option>
                    <option value={EVENT_TYPES.PRESENTATION}>Presentaciones</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tiempo
                  </label>
                  <select
                    value={filters.upcoming ? 'upcoming' : 'all'}
                    onChange={(e) => setFilters(prev => ({ ...prev, upcoming: e.target.value === 'upcoming' }))}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="upcoming">Próximos eventos</option>
                    <option value="all">Todos los eventos</option>
                  </select>
                </div>
              </div>

              <button
                onClick={fetchEvents}
                className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors duration-200"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Actualizar
              </button>
            </div>
          </div>

          {/* Events Grid */}
          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="xl" />
            </div>
          ) : events.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <div className="bg-white rounded-lg shadow-sm p-8">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  No hay eventos disponibles
                </h3>
                <p className="text-gray-600">
                  {filters.upcoming 
                    ? 'No hay eventos programados próximamente' 
                    : 'No se encontraron eventos con los filtros seleccionados'}
                </p>
              </div>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <motion.div
                  key={event._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden"
                >
                  {/* Event Header */}
                  <div className="p-6 pb-4">
                    <div className="flex items-start justify-between mb-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEventTypeColor(event.type)}`}>
                        {getEventTypeText(event.type)}
                      </span>
                      {isUserRegistered(event) && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Registrado
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-heading font-semibold text-gray-800 mb-2 line-clamp-2">
                      {event.title}
                    </h3>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {event.description}
                    </p>

                    {/* Event Info */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>{formatDateTime(event.startDate)}</span>
                      </div>

                      {event.endDate && new Date(event.endDate).getTime() !== new Date(event.startDate).getTime() && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="w-4 h-4 mr-2" />
                          <span>Hasta: {formatDateTime(event.endDate)}</span>
                        </div>
                      )}

                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span>{event.isVirtual ? 'Virtual' : event.location || 'Ubicación por confirmar'}</span>
                      </div>

                      {event.maxAttendees && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Users className="w-4 h-4 mr-2" />
                          <span>
                            {event.attendees?.length || 0}/{event.maxAttendees} asistentes
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Virtual link */}
                    {event.isVirtual && event.meetingLink && isUserRegistered(event) && (
                      <div className="mb-4">
                        <a
                          href={event.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-sm text-blue-600 hover:text-blue-700"
                        >
                          <ExternalLink className="w-4 h-4 mr-1" />
                          Unirse al evento virtual
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="px-6 pb-6">
                    {isUserRegistered(event) ? (
                      <button
                        onClick={() => handleUnregisterFromEvent(event._id)}
                        className="w-full flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200"
                      >
                        <UserCheck className="w-4 h-4 mr-2" />
                        Cancelar Registro
                      </button>
                    ) : canRegister(event) ? (
                      <button
                        onClick={() => handleRegisterToEvent(event._id)}
                        className="w-full flex items-center justify-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors duration-200"
                      >
                        <UserPlus className="w-4 h-4 mr-2" />
                        Registrarse
                      </button>
                    ) : (
                      <div className="w-full text-center text-sm text-gray-500 py-2">
                        {!user 
                          ? 'Inicia sesión para registrarte'
                          : event.maxAttendees && event.attendees?.length >= event.maxAttendees
                          ? 'Evento lleno'
                          : new Date(event.startDate) < new Date()
                          ? 'Evento finalizado'
                          : 'No disponible'
                        }
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default Events