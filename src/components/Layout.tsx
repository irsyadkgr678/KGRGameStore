import React from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import { LanguageSelector } from './LanguageSelector'
import { 
  Gamepad2, 
  Info, 
  User, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  ShoppingCart
} from 'lucide-react'

interface LayoutProps {
  children: React.ReactNode
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, profile, signOut, isAdmin } = useAuth()
  const { t } = useLanguage()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const navigation = [
    { name: t('nav.games'), href: '/', icon: Gamepad2 },
    { name: t('nav.information'), href: '/blog', icon: Info },
  ]

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true
    if (path !== '/' && location.pathname.startsWith(path)) return true
    return false
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Navigation */}
      <header className="bg-gray-900/90 backdrop-blur-md border-b border-purple-500/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link to="/" className="flex items-center space-x-2 group">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg group-hover:from-purple-600 group-hover:to-pink-600 transition-all duration-200">
                  <Gamepad2 className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  KGR GameStore
                </span>
              </Link>

              <nav className="hidden md:flex items-center space-x-6">
                {navigation.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
                        isActive(item.href)
                          ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
                          : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </Link>
                  )
                })}
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              {/* Language Selector */}
              <LanguageSelector />

              {user ? (
                <div className="flex items-center space-x-3">
                  <span className="text-gray-300 text-sm hidden sm:block">
                    {profile?.full_name || user.email}
                  </span>
                  
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="flex items-center space-x-1 px-3 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium text-white transition-colors duration-200"
                    >
                      <Settings className="w-4 h-4" />
                      <span className="hidden sm:block">{t('nav.admin')}</span>
                    </Link>
                  )}

                  <button
                    onClick={handleSignOut}
                    className="flex items-center space-x-1 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium text-gray-200 transition-colors duration-200"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:block">{t('nav.signOut')}</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-gray-300 hover:text-white font-medium transition-colors duration-200"
                  >
                    {t('nav.login')}
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg font-medium text-white transition-all duration-200"
                  >
                    {t('nav.register')}
                  </Link>
                </div>
              )}

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50 transition-colors duration-200"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-gray-800/95 backdrop-blur-md border-t border-purple-500/20">
            <div className="px-4 py-4 space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-colors duration-200 ${
                      isActive(item.href)
                        ? 'bg-purple-600/20 text-purple-300'
                        : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900/50 backdrop-blur-md border-t border-purple-500/20 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-400">
            <p className="mb-2">© 2025 KGR GameStore. {t('footer.allRightsReserved')}</p>
            <p className="text-sm">{t('footer.contactWhatsApp')} | {t('footer.instagram')}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}