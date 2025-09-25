import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Edit, 
  Plus,
  Store,
  FileText,
  Trash2
} from 'lucide-react'
import api from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'
import EmpresaModal from '../components/EmpresaModal'
import EstablecimientoModal from '../components/EstablecimientoModal'

const EmpresaDetalle = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { hasRole } = useAuth()
  
  const [empresa, setEmpresa] = useState(null)
  const [establecimientos, setEstablecimientos] = useState([])
  const [loading, setLoading] = useState(true)
  const [showEmpresaModal, setShowEmpresaModal] = useState(false)
  const [showEstablecimientoModal, setShowEstablecimientoModal] = useState(false)
  const [selectedEstablecimiento, setSelectedEstablecimiento] = useState(null)

  useEffect(() => {
    fetchEmpresaDetalle()
  }, [id])

  const fetchEmpresaDetalle = async () => {
    try {
      const [empresaResponse, establecimientosResponse] = await Promise.all([
        api.get(`/empresas/${id}`),
        api.get(`/establecimientos/empresa/${id}`)
      ])
      
      setEmpresa(empresaResponse.data)
      setEstablecimientos(establecimientosResponse.data)
    } catch (error) {
      console.error('Error obteniendo detalles de empresa:', error)
      toast.error('Error al cargar detalles de la empresa')
      navigate('/empresas')
    } finally {
      setLoading(false)
    }
  }

  const handleEditEmpresa = () => {
    setShowEmpresaModal(true)
  }

  const handleCreateEstablecimiento = () => {
    setSelectedEstablecimiento(null)
    setShowEstablecimientoModal(true)
  }

  const handleEditEstablecimiento = (establecimiento) => {
    setSelectedEstablecimiento(establecimiento)
    setShowEstablecimientoModal(true)
  }

  const handleDeleteEstablecimiento = async (establecimiento) => {
    if (!window.confirm(`¿Estás seguro de que deseas eliminar el establecimiento "${establecimiento.nombre}"?`)) {
      return
    }

    try {
      await api.delete(`/establecimientos/${establecimiento.id}`)
      toast.success('Establecimiento eliminado correctamente')
      fetchEmpresaDetalle()
    } catch (error) {
      console.error('Error eliminando establecimiento:', error)
      toast.error('Error al eliminar establecimiento')
    }
  }

  const handleEmpresaModalClose = () => {
    setShowEmpresaModal(false)
  }

  const handleEmpresaModalSuccess = () => {
    setShowEmpresaModal(false)
    fetchEmpresaDetalle()
  }

  const handleEstablecimientoModalClose = () => {
    setShowEstablecimientoModal(false)
    setSelectedEstablecimiento(null)
  }

  const handleEstablecimientoModalSuccess = () => {
    setShowEstablecimientoModal(false)
    setSelectedEstablecimiento(null)
    fetchEmpresaDetalle()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  if (!empresa) {
    return (
      <div className="text-center py-12">
        <Building2 className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
          Empresa no encontrada
        </h3>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/empresas')}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {empresa.nombre}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              CUIT: {empresa.cuit}
            </p>
          </div>
        </div>
        {hasRole(['ADMIN', 'TECNICO_ADMIN']) && (
          <button
            onClick={handleEditEmpresa}
            className="btn-primary flex items-center"
          >
            <Edit className="h-4 w-4 mr-2" />
            Editar Empresa
          </button>
        )}
      </div>

      {/* Información de la empresa */}
      <div className="card p-6">
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-primary-100 dark:bg-primary-900/20 rounded-lg">
            <Building2 className="h-8 w-8 text-primary-600 dark:text-primary-400" />
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Información de la Empresa
              </h2>
              {empresa.esRecurrente && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                  Recurrente
                </span>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {empresa.direccion && (
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <MapPin className="h-4 w-4 mr-2" />
                  {empresa.direccion}
                </div>
              )}
              {empresa.telefono && (
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Phone className="h-4 w-4 mr-2" />
                  {empresa.telefono}
                </div>
              )}
              {empresa.email && (
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Mail className="h-4 w-4 mr-2" />
                  {empresa.email}
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-dark-700">
              <div className="flex space-x-6 text-sm">
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Store className="h-4 w-4 mr-2" />
                  {establecimientos.length} Establecimientos
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <FileText className="h-4 w-4 mr-2" />
                  {empresa._count?.documentos || 0} Documentos
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Establecimientos */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Establecimientos
          </h2>
          {hasRole(['ADMIN', 'TECNICO_ADMIN']) && (
            <button
              onClick={handleCreateEstablecimiento}
              className="btn-primary flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Establecimiento
            </button>
          )}
        </div>

        {establecimientos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {establecimientos.map((establecimiento) => (
              <div key={establecimiento.id} className="border border-gray-200 dark:border-dark-700 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                      <Store className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-gray-100">
                        {establecimiento.nombre}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Código: {establecimiento.codigo}
                      </p>
                    </div>
                  </div>
                  {hasRole(['ADMIN', 'TECNICO_ADMIN']) && (
                    <div className="flex space-x-1">
                      <button
                        onClick={() => handleEditEstablecimiento(establecimiento)}
                        className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        title="Editar establecimiento"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteEstablecimiento(establecimiento)}
                        className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                        title="Eliminar establecimiento"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  {establecimiento.direccion && (
                    <div className="flex items-center">
                      <MapPin className="h-3 w-3 mr-2" />
                      {establecimiento.direccion}
                    </div>
                  )}
                  {establecimiento.telefono && (
                    <div className="flex items-center">
                      <Phone className="h-3 w-3 mr-2" />
                      {establecimiento.telefono}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Store className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
              No hay establecimientos
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Comienza creando un nuevo establecimiento para esta empresa.
            </p>
          </div>
        )}
      </div>

      {/* Modales */}
      {showEmpresaModal && (
        <EmpresaModal
          empresa={empresa}
          onClose={handleEmpresaModalClose}
          onSuccess={handleEmpresaModalSuccess}
        />
      )}

      {showEstablecimientoModal && (
        <EstablecimientoModal
          establecimiento={selectedEstablecimiento}
          empresaId={empresa.id}
          onClose={handleEstablecimientoModalClose}
          onSuccess={handleEstablecimientoModalSuccess}
        />
      )}
    </div>
  )
}

export default EmpresaDetalle