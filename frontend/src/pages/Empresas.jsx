import { useState, useEffect } from 'react'
import { Plus, Building2, MapPin, Phone, Mail } from 'lucide-react'
import api from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

const Empresas = () => {
  const { hasRole } = useAuth()
  const [empresas, setEmpresas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEmpresas()
  }, [])

  const fetchEmpresas = async () => {
    try {
      const response = await api.get('/empresas')
      setEmpresas(response.data)
    } catch (error) {
      console.error('Error obteniendo empresas:', error)
      toast.error('Error al cargar empresas')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Empresas
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gestiona las empresas del sistema
          </p>
        </div>
        {hasRole(['ADMIN', 'TECNICO_ADMIN']) && (
          <button className="btn-primary flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Nueva Empresa
          </button>
        )}
      </div>

      {/* Lista de empresas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {empresas.map((empresa) => (
          <div key={empresa.id} className="card p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary-100 dark:bg-primary-900/20 rounded-lg">
                  <Building2 className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {empresa.nombre}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    CUIT: {empresa.cuit}
                  </p>
                </div>
              </div>
              {empresa.esRecurrente && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                  Recurrente
                </span>
              )}
            </div>

            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              {empresa.direccion && (
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  {empresa.direccion}
                </div>
              )}
              {empresa.telefono && (
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  {empresa.telefono}
                </div>
              )}
              {empresa.email && (
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  {empresa.email}
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-dark-700">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">
                  Establecimientos: {empresa._count?.establecimientos || 0}
                </span>
                <span className="text-gray-500 dark:text-gray-400">
                  Documentos: {empresa._count?.documentos || 0}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {empresas.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
            No hay empresas
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Comienza creando una nueva empresa.
          </p>
        </div>
      )}
    </div>
  )
}

export default Empresas