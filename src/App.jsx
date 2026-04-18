import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import ProjectDetail from './pages/ProjectDetail'
import Projects from './pages/Projects'
import Settings from './pages/Settings'
import PrivateRoute from './components/PrivateRoute'
import Layout from './components/Layout'

const App = () => (
  <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route 
        path="/dashboard" 
        element={
          <PrivateRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </PrivateRoute>
        } 
      />
      <Route 
        path="/projects" 
        element={
          <PrivateRoute>
            <Layout>
              <Projects />
            </Layout>
          </PrivateRoute>
        } 
      />
      <Route 
        path="/projects/:id" 
        element={
          <PrivateRoute>
            <Layout>
              <ProjectDetail />
            </Layout>
          </PrivateRoute>
        } 
      />
      <Route 
        path="/settings" 
        element={
          <PrivateRoute>
            <Layout>
              <Settings />
            </Layout>
          </PrivateRoute>
        } 
      />
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  </BrowserRouter>
)

export default App
