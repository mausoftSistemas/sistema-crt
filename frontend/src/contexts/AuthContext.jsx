import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      fetchUser()
    } else {
      setLoading(false)
    }
  }, [])

  const fetchUser = async () => {
    try {
      const response = await api.get('/auth/me')
      setUser(response.data.user)
    } catch (error) {
      console.error('Error obteniendo usuario:', error)
      logout()
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      console.log('🔐 Intentando login con URL:', api.defaults.baseURL)
      const response = await api.post('/auth/login', { email, password })
      const { user, token } = response.data
      
      localStorage.setItem('token', token)
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      setUser(user)
      
      return { success: true }
    } catch (error) {
      console.error('❌ Error completo:', error)
      console.error('❌ Error message:', error.message)
      console.error('❌ Error response:', error.response?.data)
      return { 
        success: false, 
        error: error.response?.data?.error || error.message || 'Error al iniciar sesión' 
      }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    delete api.defaults.headers.common['Authorization']
    setUser(null)
  }

  const hasRole = (roles) => {
    if (!user) return false
    return Array.isArray(roles) ? roles.includes(user.role) : user.role === roles
  }

  const canAccessEmpresa = (empresaId) => {
    if (!user) return false
    if (user.role === 'ADMIN') return true
    if (user.role === 'LECTOR') return user.empresaId === empresaId
    return true // TECNICO y TECNICO_ADMIN pueden acceder a todas
  }

  const value = {
    user,
    login,
    logout,
    hasRole,
    canAccessEmpresa,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}