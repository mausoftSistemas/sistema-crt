import { NavLink } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Building2, 
  FileText, 
  Users, 
  Settings 
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const Sidebar = () => {
  const { user, hasRole } = useAuth()

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      roles: ['ADMIN', 'LECTOR', 'TECNICO', 'TECNICO_ADMIN']
    },
    {
      name: 'Empresas',
      href: '/empresas',
      icon: Building2,
      roles: ['ADMIN', 'LECTOR', 'TECNICO', 'TECNICO_ADMIN']
    },
    {
      name: 'Documentos',
      href: '/documentos',
      icon: FileText,
      roles: ['ADMIN', 'LECTOR', 'TECNICO', 'TECNICO_ADMIN']
    },
    {
      name: 'Usuarios',
      href: '/usuarios',
      icon: Users,
      roles: ['ADMIN']
    },
    {
      name: 'Configuración',
      href: '/configuracion',
      icon: Settings,
      roles: ['ADMIN', 'TECNICO_ADMIN']
    }
  ]

  const filteredNavigation = navigation.filter(item => 
    hasRole(item.roles)
  )

  return (
    <div className="flex flex-col w-64 bg-white dark:bg-dark-800 border-r border-gray-200 dark:border-dark-700">
      {/* Logo */}
      <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200 dark:border-dark-700">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">CRT</span>
          </div>
          <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
            Sistema CRT
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {filteredNavigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            <item.icon className="h-5 w-5 mr-3" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* User info */}
      <div className="p-4 border-t border-gray-200 dark:border-dark-700">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center">
            <span className="text-primary-600 dark:text-primary-400 font-medium text-sm">
              {user?.name?.charAt(0)?.toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
              {user?.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {user?.email}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar