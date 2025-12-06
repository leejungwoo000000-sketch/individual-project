import { Link, useNavigate, useLocation } from 'react-router-dom'
import { authService } from '../services/auth'

interface UserLayoutProps {
  children: React.ReactNode
}

export default function UserLayout({ children }: UserLayoutProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const user = authService.getCurrentUser()
  const isAuthenticated = authService.isAuthenticated()

  const handleLogout = () => {
    authService.logout()
    navigate('/')
  }

  const menuItems = [
    { path: '/', label: '홈' },
    { path: '/blog', label: '블로그' },
    { path: '/inventory', label: '재고' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link to="/" className="text-xl font-bold text-gray-800">
                  프리랜서 포트폴리오
                </Link>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {menuItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      location.pathname === item.path
                        ? 'border-indigo-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex items-center">
              {isAuthenticated ? (
                <>
                  <span className="text-sm text-gray-700 mr-4">{user?.name}</span>
                  <button
                    onClick={handleLogout}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                  >
                    로그아웃
                  </button>
                </>
              ) : (
                <Link
                  to="/auth"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  로그인
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  )
}
