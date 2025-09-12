import { useState, useEffect } from 'react'
import { Plus, FileText, Download, Calendar, AlertTriangle } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import api from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

const Documentos = () => {
  const { hasRole } = useAuth()
  const [documentos, setDocumentos] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    empresaId: '',
    categoriaId: '',
    tipoDocumentoId: '',
    vencidos: false
  })

  useEffect(() => {
    fetchDocumentos()
  }, [filters])

  const fetchDocumentos = async () => {
    try {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value)
      })
      
      const response = await api.get(`/documentos?${params}`)
      setDocumentos(response.data)
    } catch (error) {
      console.error('Error obteniendo documentos:', error)
      toast.error('Error al cargar documentos')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async (documentoId, nombre) => {
    try {
      const response = await api.get(`/documentos/${documentoId}/download`, {
        responseType: 'blob'
      })
      
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', nombre)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      
      toast.success('Documento descargado')
    } catch (error) {
      console.error('Error descargando documento:', error)
      toast.error('Error al descargar documento')
    }
  }

  const isVencido = (fechaVencimiento) => {
    if (!fechaVencimiento) return false
    return new Date(fechaVencimiento) < new Date()
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
            Documentos
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gestiona los documentos del sistema
          </p>
        </div>
        {hasRole(['ADMIN', 'TECNICO', 'TECNICO_ADMIN']) && (
          <button className="btn-primary flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Subir Documento
          </button>
        )}
      </div>

      {/* Filtros */}
      <div className="card p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Filtrar por empresa
            </label>
            <select 
              className="input-field"
              value={filters.empresaId}
              onChange={(e) => setFilters({...filters, empresaId: e.target.value})}
            >
              <option value="">Todas las empresas</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Categoría
            </label>
            <select 
              className="input-field"
              value={filters.categoriaId}
              onChange={(e) => setFilters({...filters, categoriaId: e.target.value})}
            >
              <option value="">Todas las categorías</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tipo de documento
            </label>
            <select 
              className="input-field"
              value={filters.tipoDocumentoId}
              onChange={(e) => setFilters({...filters, tipoDocumentoId: e.target.value})}
            >
              <option value="">Todos los tipos</option>
            </select>
          </div>
          <div className="flex items-end">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.vencidos}
                onChange={(e) => setFilters({...filters, vencidos: e.target.checked})}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Solo vencidos
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Lista de documentos */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-dark-700">
            <thead className="bg-gray-50 dark:bg-dark-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Documento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Empresa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Categoría
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Vencimiento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-dark-800 divide-y divide-gray-200 dark:divide-dark-700">
              {documentos.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50 dark:hover:bg-dark-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {doc.nombre}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {doc.nombreArchivo}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {doc.empresa?.nombre || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span 
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: `${doc.categoria?.color}20`,
                        color: doc.categoria?.color
                      }}
                    >
                      {doc.categoria?.nombre}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {doc.fechaVencimiento ? (
                      <div className={`flex items-center ${isVencido(doc.fechaVencimiento) ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}`}>
                        {isVencido(doc.fechaVencimiento) && (
                          <AlertTriangle className="h-4 w-4 mr-1" />
                        )}
                        <Calendar className="h-4 w-4 mr-1" />
                        {format(new Date(doc.fechaVencimiento), 'dd/MM/yyyy', { locale: es })}
                      </div>
                    ) : (
                      <span className="text-gray-400">Sin vencimiento</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleDownload(doc.id, doc.nombreArchivo)}
                      className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 mr-3"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {documentos.length === 0 && (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
            No hay documentos
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Comienza subiendo un nuevo documento.
          </p>
        </div>
      )}
    </div>
  )
}

export default Documentos