import { Routes, Route, Navigate } from 'react-router-dom'
import { useState, useCallback } from 'react'
import Layout from './components/Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Mountains from './pages/Mountains'
import MountainForm from './pages/MountainForm'
import Trails from './pages/Trails'
import TrailForm from './pages/TrailForm'
import WeatherMeta from './pages/WeatherMeta'
import Users from './pages/Users'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Initialize from localStorage synchronously
    return !!localStorage.getItem('adminToken')
  })
  const [authMode, setAuthMode] = useState('login') // 'login' or 'register'

  const handleLogin = useCallback((token) => {
    localStorage.setItem('adminToken', token)
    setIsAuthenticated(true)
  }, [])

  const handleRegister = useCallback((token, apiKey) => {
    localStorage.setItem('adminToken', token)
    if (apiKey) {
      localStorage.setItem('userApiKey', apiKey)
    }
    setIsAuthenticated(true)
  }, [])

  const handleLogout = useCallback(() => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('userApiKey')
    setIsAuthenticated(false)
    setAuthMode('login')
  }, [])

  if (!isAuthenticated) {
    if (authMode === 'register') {
      return (
        <Register
          onRegister={handleRegister}
          onSwitchToLogin={() => setAuthMode('login')}
        />
      )
    }
    return (
      <Login
        onLogin={handleLogin}
        onSwitchToRegister={() => setAuthMode('register')}
      />
    )
  }

  return (
    <Layout onLogout={handleLogout}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/mountains" element={<Mountains />} />
        <Route path="/mountains/new" element={<MountainForm />} />
        <Route path="/mountains/:id/edit" element={<MountainForm />} />
        <Route path="/trails" element={<Trails />} />
        <Route path="/trails/new" element={<TrailForm />} />
        <Route path="/trails/:id/edit" element={<TrailForm />} />
        {/* Weather Meta Context Editor */}
        <Route path="/weather-meta" element={<WeatherMeta />} />
        {/* Users & API Keys Management */}
        <Route path="/users" element={<Users />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}

export default App
