import { Sun, Moon, User, LogOut } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'

const Header = () => {
  const { user, logout } = useAuth()
  const { isDark, toggleTheme } = useTheme()

  const getRoleLabel = (role) => {
    const roles = {
      ADMIN: 'Administrador',
      LECTOR: 'Lector',
      TECNICO: 'Técnico',
      TECNICO_ADMIN: 'Técnico Admin'
    }
    return roles[role] || role
  }

  return (
    <header className="bg-white dark:bg-dark-800 shadow-sm border-b border-gray-200 dark:border-dark-700">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Sistema CRT
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          {/* Toggle tema */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
          >
            {isDark ? (
              <Sun className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            ) : (
              <Moon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            )}
          </button>

          {/* Info del usuario */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <div className="text-sm">
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {user?.name}
                </p>
                <p className="text-gray-500 dark:text-gray-400">
                  {getRoleLabel(user?.role)}
                </p>
              </div>
            </div>

            {/* Botón logout */}
            <button
              onClick={logout}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
              title="Cerrar sesión"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header