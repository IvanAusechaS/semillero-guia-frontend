import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Team from './pages/Team'
import Projects from './pages/Projects'
import ProjectDetail from './pages/ProjectDetail'
import ProjectForm from './pages/ProjectForm'
import Resources from './pages/Resources'
import Events from './pages/Events'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Register from './pages/Register'
import Forum from './pages/Forum'
import Dashboard from './pages/Dashboard'
import AssignmentList from './pages/AssignmentList'
import AssignmentDetail from './pages/AssignmentDetail'
import { AuthProvider } from './context/AuthContext'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gradient-soft">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/quienes-somos" element={<About />} />
              <Route path="/equipo" element={<Team />} />
              
              {/* Project routes */}
              <Route path="/nuestro-trabajo" element={<Projects />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:id" element={<ProjectDetail />} />
              <Route path="/projects/:id/edit" element={<ProjectForm />} />
              <Route path="/projects/create" element={<ProjectForm />} />
              
              {/* Assignment routes */}
              <Route path="/assignments" element={<AssignmentList />} />
              <Route path="/assignments/:id" element={<AssignmentDetail />} />
              
              {/* Other routes */}
              <Route path="/recursos" element={<Resources />} />
              <Route path="/eventos" element={<Events />} />
              <Route path="/contacto" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/foro" element={<Forum />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </main>
          <Footer />
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                theme: {
                  primary: '#4aed88',
                },
              },
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App