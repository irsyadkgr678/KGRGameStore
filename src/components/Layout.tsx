import React from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import { LanguageSelector } from './LanguageSelector'
import { 
  Info, 
  User, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  ShoppingCart,
  Gamepad2
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
    setMobileMenuOpen(false)
  }

  const navigation = [
    { name: t('nav.games'), href: '/' },
    { name: t('nav.information'), href: '/blog' },
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
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center space-x-2 sm:space-x-8">
              <Link to="/" className="flex items-center space-x-1 sm:space-x-2 group">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg overflow-hidden group-hover:scale-105 transition-transform duration-200 bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center p-1">
                  <img 
                    src="/kgr logo copy copy.png" 
                    alt="KGR GameStore Logo" 
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      // Fallback to icon if image fails to load
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = '<svg class="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>';
                      }
                    }}
                  />
                </div>
                <span className="text-sm sm:text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  KGR GameStore
                </span>
              </Link>

              <nav className="hidden md:flex items-center space-x-6">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
                      isActive(item.href)
                        ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
                        : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                    }`}
                  >
                    <span>{item.name}</span>
                  </Link>
                ))}
              </nav>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Language Selector - Hidden on very small screens */}
              <div className="hidden xs:block">
                <LanguageSelector />
              </div>

              {user ? (
                <div className="flex items-center space-x-1 sm:space-x-3">
                  <span className="text-gray-300 text-xs sm:text-sm hidden sm:block max-w-24 sm:max-w-none truncate">
                    {profile?.full_name || user.email}
                  </span>
                  
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="flex items-center space-x-1 px-2 sm:px-3 py-1.5 sm:py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium text-white transition-colors duration-200 text-xs sm:text-sm"
                    >
                      <Settings className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="hidden sm:block">{t('nav.admin')}</span>
                    </Link>
                  )}

                  <button
                    onClick={handleSignOut}
                    className="flex items-center space-x-1 px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium text-gray-200 transition-colors duration-200 text-xs sm:text-sm"
                  >
                    <LogOut className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:block">{t('nav.signOut')}</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <Link
                    to="/login"
                    className="px-2 sm:px-4 py-1.5 sm:py-2 text-gray-300 hover:text-white font-medium transition-colors duration-200 text-xs sm:text-sm"
                  >
                    {t('nav.login')}
                  </Link>
                  <Link
                    to="/register"
                    className="px-2 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg font-medium text-white transition-all duration-200 text-xs sm:text-sm"
                  >
                    {t('nav.register')}
                  </Link>
                </div>
              )}

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-1.5 sm:p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50 transition-colors duration-200"
              >
                {mobileMenuOpen ? <X className="w-4 h-4 sm:w-5 sm:h-5" /> : <Menu className="w-4 h-4 sm:w-5 sm:h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-gray-800/95 backdrop-blur-md border-t border-purple-500/20">
            <div className="px-3 sm:px-4 py-3 sm:py-4 space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-2 px-3 py-2.5 rounded-lg font-medium transition-colors duration-200 ${
                    isActive(item.href)
                      ? 'bg-purple-600/20 text-purple-300'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                  }`}
                >
                  <span>{item.name}</span>
                </Link>
              ))}
              
              {/* Language Selector in Mobile Menu */}
              <div className="pt-2 border-t border-gray-700/50">
                <div className="px-3 py-2">
                  <LanguageSelector />
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900/50 backdrop-blur-md border-t border-purple-500/20 mt-8 sm:mt-16">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-6 sm:py-8">
          <div className="text-center text-gray-400">
            <div className="flex items-center justify-center mb-4">
              <img 
                src="/kgr logo copy copy.png" 
                alt="KGR GameStore Logo" 
                className="w-8 h-8 sm:w-10 sm:h-10 object-contain mr-2"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
              <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                KGR GameStore
              </span>
            </div>
            <p className="mb-2 text-sm sm:text-base">© 2025 KGR GameStore. {t('footer.allRightsReserved')}</p>
            <p className="text-xs sm:text-sm">{t('footer.contactWhatsApp')} | {t('footer.instagram')}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}