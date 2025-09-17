import axios from 'axios'

// Debug: Mostrar configuración actual
console.log('🔧 VITE_API_URL:', import.meta.env.VITE_API_URL)
console.log('🔧 Final API URL:', (import.meta.env.VITE_API_URL || 'http://localhost:3001') + '/api')

const api = axios.create({
  baseURL: (import.meta.env.VITE_API_URL || 'http://localhost:3001') + '/api',
  timeout: 30000, // Aumentar timeout a 30 segundos
})

// Interceptor para manejar errores globalmente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('token')
      delete api.defaults.headers.common['Authorization']
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api