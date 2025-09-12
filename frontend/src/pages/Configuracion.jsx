import { useState, useEffect } from 'react'
import { Settings, Tag, FileType, Plus } from 'lucide-react'
import api from '../services/api'
import toast from 'react-hot-toast'

const Configuracion = () => {
  const [categorias, setCategorias] = useState([])
  const [tiposDocumento, setTiposDocumento] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [categoriasRes, tiposRes] = await Promise.all([
        api.get('/categorias'),
        api.get('/tipos-documento')
      ])
      setCategorias(categoriasRes.data)
      setTiposDocumento(tiposRes.data)
    } catch (error) {
      console.error('Error obteniendo datos:', error)
      toast.error('Error al cargar configuración')
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
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Configuración
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Gestiona las categorías y tipos de documento
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Categorías */}
        <div className="card p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
              <Tag className="h-5 w-5 mr-2" />
              Categorías
            </h2>
            <button className="btn-primary flex items-center text-sm">
              <Plus className="h-4 w-4 mr-1" />
              Nueva
            </button>
          </div>
          
          <div className="space-y-3">
            {categorias.map((categoria) => (
              <div key={categoria.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: categoria.color }}
                  ></div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {categoria.nombre}
                    </p>
                    {categoria.descripcion && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {categoria.descripcion}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {categoria._count?.documentos || 0} docs
                  </span>
                  <button className="text-primary-600 hover:text-primary-900 dark:text-primary-400 text-sm">
                    Editar
                  </button>
                </div>
              </div>
            ))}
          </div>

          {categorias.length === 0 && (
            <div className="text-center py-8">
              <Tag className="mx-auto h-8 w-8 text-gray-400" />
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                No hay categorías configuradas
              </p>
            </div>
          )}
        </div>

        {/* Tipos de Documento */}
        <div className="card p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
              <FileType className="h-5 w-5 mr-2" />
              Tipos de Documento
            </h2>
            <button className="btn-primary flex items-center text-sm">
              <Plus className="h-4 w-4 mr-1" />
              Nuevo
            </button>
          </div>
          
          <div className="space-y-3">
            {tiposDocumento.map((tipo) => (
              <div key={tipo.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {tipo.nombre}
                  </p>
                  {tipo.descripcion && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {tipo.descripcion}
                    </p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {tipo._count?.documentos || 0} docs
                  </span>
                  <button className="text-primary-600 hover:text-primary-900 dark:text-primary-400 text-sm">
                    Editar
                  </button>
                </div>
              </div>
            ))}
          </div>

          {tiposDocumento.length === 0 && (
            <div className="text-center py-8">
              <FileType className="mx-auto h-8 w-8 text-gray-400" />
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                No hay tipos de documento configurados
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Configuracion