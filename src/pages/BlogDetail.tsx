import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useLanguage } from '../contexts/LanguageContext'
import { ArrowLeft, Calendar, User, Eye, Info, Loader2 } from 'lucide-react'

interface BlogPost {
  id: string
  title: string
  content: string
  excerpt: string
  slug: string
  published: boolean
  author_id: string
  created_at: string
  updated_at: string
  profiles?: {
    full_name: string | null
    email: string
  }
}

export const BlogDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { t } = useLanguage()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (slug) {
      fetchPost(slug)
    }
  }, [slug])

  const fetchPost = async (postSlug: string) => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          *,
          profiles (
            full_name,
            email
          )
        `)
        .eq('slug', postSlug)
        .eq('published', true)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          setError('Post not found')
        } else {
          throw error
        }
        return
      }

      setPost(data)
    } catch (error) {
      console.error('Error fetching post:', error)
      setError('Failed to load post')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatContent = (content: string) => {
    // Simple formatting: convert line breaks to paragraphs
    return content.split('\n\n').map((paragraph, index) => (
      <p key={index} className="mb-4 text-gray-300 leading-relaxed">
        {paragraph.trim()}
      </p>
    ))
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 sm:w-12 sm:h-12 text-purple-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-sm sm:text-base">{t('blog.loadingInformation')}</p>
        </div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="mb-4 opacity-80 hover:opacity-100 transition-opacity duration-200">
            <img 
              src="/kgr logo copy copy copy copy.png" 
              alt="KGR GameStore Logo" 
              className="w-12 h-12 sm:w-16 sm:h-16 object-contain mx-auto opacity-70"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = '<div class="w-12 h-12 sm:w-16 sm:h-16 mx-auto"><svg class="w-full h-full text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div>';
                }
              }}
            />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-400 mb-2">
            {error === 'Post not found' ? 'Informasi Tidak Ditemukan' : 'Terjadi Kesalahan'}
          </h2>
          <p className="text-gray-500 mb-6 text-sm sm:text-base">
            {error === 'Post not found' 
              ? 'Informasi yang Anda cari tidak ditemukan atau sudah tidak tersedia.'
              : 'Gagal memuat informasi. Silakan coba lagi nanti.'
            }
          </p>
          <Link
            to="/blog"
            className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium text-white transition-colors duration-200 text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Informasi
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8">
      {/* Back Button */}
      <div className="mb-4 sm:mb-6">
        <Link
          to="/blog"
          className="inline-flex items-center px-3 sm:px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg font-medium text-gray-300 hover:text-white transition-all duration-200 border border-gray-700/50 text-sm sm:text-base"
        >
          <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
          Kembali ke Informasi
        </Link>
      </div>

      {/* Article */}
      <article className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 sm:p-8 border border-gray-700/50">
        {/* Header */}
        <header className="mb-6 sm:mb-8">
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-400 mb-3 sm:mb-4">
            <div className="flex items-center">
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              {formatDate(post.created_at)}
            </div>
            <div className="flex items-center">
              <User className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              {post.profiles?.full_name || 'Admin'}
            </div>
            {post.updated_at !== post.created_at && (
              <div className="flex items-center">
                <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                Diperbarui: {formatDate(post.updated_at)}
              </div>
            )}
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold text-white mb-3 sm:mb-4 leading-tight">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-lg sm:text-xl text-gray-300 leading-relaxed border-l-4 border-purple-500 pl-4 sm:pl-6 italic">
              {post.excerpt}
            </p>
          )}
        </header>

        {/* Content */}
        <div className="prose prose-invert max-w-none">
          <div className="text-sm sm:text-base leading-relaxed">
            {formatContent(post.content)}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-700/50">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="text-xs sm:text-sm text-gray-400">
              <p>Dipublikasikan oleh <span className="text-purple-300">{post.profiles?.full_name || 'Admin'}</span></p>
              <p>Terakhir diperbarui: {formatDate(post.updated_at)}</p>
            </div>
            
            <Link
              to="/blog"
              className="inline-flex items-center px-4 py-2 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 rounded-lg transition-colors duration-200 border border-purple-500/30 text-sm"
            >
              <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Lihat Informasi Lainnya
            </Link>
          </div>
        </footer>
      </article>

      {/* Related or Back to Blog */}
      <div className="mt-6 sm:mt-8 text-center">
        <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-gray-700/50">
          <div className="flex items-center justify-center mb-3">
            <img 
              src="/kgr logo copy copy copy copy.png" 
              alt="KGR GameStore Logo" 
              className="w-8 h-8 sm:w-10 sm:h-10 object-contain mr-2 opacity-70 hover:opacity-90 transition-opacity duration-200"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
            <h3 className="text-lg sm:text-xl font-semibold text-white">
              Butuh Informasi Lainnya?
            </h3>
          </div>
          <p className="text-gray-300 text-sm sm:text-base mb-4">
            Kembali ke halaman informasi untuk melihat artikel dan berita terbaru lainnya.
          </p>
          <Link
            to="/blog"
            className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/25 text-sm sm:text-base"
          >
            <Info className="w-4 h-4 mr-2" />
            Lihat Semua Informasi
          </Link>
        </div>
      </div>
    </div>
  )
}