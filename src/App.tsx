import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { LanguageProvider } from './contexts/LanguageContext'
import { Layout } from './components/Layout'
import { Home } from './pages/Home'
import { AuthPage } from './pages/Auth'
import { Blog } from './pages/Blog'
import { Admin } from './pages/Admin'
import { GameDetail } from './pages/GameDetail'

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/games/:id" element={<GameDetail />} />
              <Route path="/login" element={<AuthPage mode="login" />} />
              <Route path="/register" element={<AuthPage mode="register" />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </Layout>
        </Router>
      </AuthProvider>
    </LanguageProvider>
  )
}

export default App