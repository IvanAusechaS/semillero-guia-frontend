import { useState, useContext } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import ProjectList from '../components/ProjectList'
import { AuthContext } from '../context/AuthContext'

const Projects = () => {
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)
  
  const handleCreateProject = () => {
    navigate('/projects/create')
  }
  
  const handleViewProject = (projectId) => {
    navigate(`/projects/${projectId}`)
  }
  
  const handleEditProject = (projectId) => {
    navigate(`/projects/${projectId}/edit`)
  }

  return (
    <div className="pt-16 min-h-screen bg-gradient-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-gradient mb-6">
              Nuestro Trabajo
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Descubre los proyectos de investigación en inteligencia artificial 
              que estamos desarrollando en el Semillero GUIA.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <ProjectList
              onCreateProject={handleCreateProject}
              onViewProject={handleViewProject}
              onEditProject={handleEditProject}
            />
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Projects