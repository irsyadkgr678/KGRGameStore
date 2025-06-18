import React, { useState, useEffect } from 'react'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import { Loader2, Eye, EyeOff, User, Mail, Lock, Gamepad2, CheckCircle, AlertCircle } from 'lucide-react'

interface AuthPageProps {
  mode: 'login' | 'register'
}

export const AuthPage: React.FC<AuthPageProps> = ({ mode }) => {
  const { t } = useLanguage()
  const [searchParams] = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [resetLoading, setResetLoading] = useState(false)
  const [resetSuccess, setResetSuccess] = useState('')

  const { signIn, signUp, resetPassword } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // Check if user just confirmed their email
    if (searchParams.get('confirmed') === 'true') {
      setSuccess(t('auth.emailConfirmed'))
    }
  }, [searchParams, t])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      if (mode === 'register') {
        const { error } = await signUp(email, password, fullName)
        if (error) throw error
        setSuccess(t('auth.checkEmailConfirmation'))
      } else {
        const { error } = await signIn(email, password)
        if (error) {
          if (error.message.includes('Email not confirmed')) {
            throw new Error(t('auth.emailNotConfirmed'))
          }
          throw error
        }
        navigate('/')
      }
    } catch (error: any) {
      setError(error.message || t('common.error'))
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setResetLoading(true)
    setError('')
    setResetSuccess('')

    try {
      const { error } = await resetPassword(resetEmail)
      if (error) throw error
      setResetSuccess(t('auth.resetPasswordEmailSent'))
      setResetEmail('')
    } catch (error: any) {
      setError(error.message || t('common.error'))
    } finally {
      setResetLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-3 sm:px-4 lg:px-8">
      <div className="max-w-md w-full space-y-6 sm:space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4 sm:mb-6">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 sm:p-3 rounded-full">
              <Gamepad2 className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            {showForgotPassword 
              ? t('auth.resetPassword')
              : mode === 'login' 
                ? t('auth.welcomeBack') 
                : t('auth.joinKGR')
            }
          </h2>
          <p className="mt-2 text-gray-400 text-sm sm:text-base">
            {showForgotPassword
              ? t('auth.resetPasswordDescription')
              : mode === 'login' 
                ? t('auth.signInToContinue')
                : t('auth.joinCommunity')
            }
          </p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 sm:p-8 border border-gray-700/50">
          {showForgotPassword ? (
            // Forgot Password Form
            <form onSubmit={handleForgotPassword} className="space-y-4 sm:space-y-6">
              <div>
                <label htmlFor="resetEmail" className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                  <Mail className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1 sm:mr-2" />
                  {t('auth.emailAddress')}
                </label>
                <input
                  id="resetEmail"
                  type="email"
                  required
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                  placeholder={t('auth.enterEmailForReset')}
                />
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                  <p className="text-red-400 text-xs sm:text-sm flex items-center">
                    <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                    {error}
                  </p>
                </div>
              )}

              {resetSuccess && (
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                  <p className="text-green-400 text-xs sm:text-sm flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                    {resetSuccess}
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={resetLoading}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold py-2.5 sm:py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 text-sm sm:text-base"
              >
                {resetLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{t('auth.pleaseWait')}</span>
                  </>
                ) : (
                  <span>{t('auth.sendResetEmail')}</span>
                )}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(false)
                    setError('')
                    setResetSuccess('')
                  }}
                  className="text-purple-400 hover:text-purple-300 font-medium transition-colors duration-200 text-sm"
                >
                  {t('auth.backToLogin')}
                </button>
              </div>
            </form>
          ) : (
            // Login/Register Form
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {mode === 'register' && (
                <div>
                  <label htmlFor="fullName" className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                    <User className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1 sm:mr-2" />
                    {t('auth.fullName')}
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                    placeholder={t('auth.enterFullName')}
                  />
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                  <Mail className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1 sm:mr-2" />
                  {t('auth.emailAddress')}
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                  placeholder={t('auth.enterEmail')}
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-gray-300">
                    <Lock className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1 sm:mr-2" />
                    {t('auth.password')}
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-xs text-purple-400 hover:text-purple-300 transition-colors duration-200"
                    >
                      {t('auth.forgotPassword')}
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 pr-10 sm:pr-12 text-sm sm:text-base"
                    placeholder={t('auth.enterPassword')}
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors duration-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                  <p className="text-red-400 text-xs sm:text-sm flex items-center">
                    <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                    {error}
                  </p>
                </div>
              )}

              {success && (
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                  <p className="text-green-400 text-xs sm:text-sm flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                    {success}
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold py-2.5 sm:py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 text-sm sm:text-base"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{t('auth.pleaseWait')}</span>
                  </>
                ) : (
                  <span>{mode === 'login' ? t('auth.signIn') : t('auth.createAccount')}</span>
                )}
              </button>
            </form>
          )}

          {!showForgotPassword && (
            <div className="mt-4 sm:mt-6 text-center">
              <p className="text-gray-400 text-xs sm:text-sm">
                {mode === 'login' ? t('auth.dontHaveAccount') : t('auth.alreadyHaveAccount')}{' '}
                <Link
                  to={mode === 'login' ? '/register' : '/login'}
                  className="text-purple-400 hover:text-purple-300 font-medium transition-colors duration-200"
                >
                  {mode === 'login' ? t('auth.signUp') : t('auth.signIn')}
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}