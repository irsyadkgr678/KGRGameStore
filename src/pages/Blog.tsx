import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useLanguage } from '../contexts/LanguageContext'
import { Calendar, User, Eye, Info, Search } from 'lucide-react'

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
}

export const Blog: React.FC = () => {
  const { t } = useLanguage()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([])

  useEffect(() => {
    fetchPosts()
  }, [])

  useEffect(() => {
    filterPosts()
  }, [posts, searchTerm])

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      setPosts(data || [])
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterPosts = () => {
    if (!searchTerm) {
      setFilteredPosts(posts)
      return
    }

    const filtered = posts.filter(post =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredPosts(filtered)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Info className="w-12 h-12 text-purple-500 animate-pulse mx-auto mb-4" />
          <p className="text-gray-400">{t('blog.loadingInformation')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-full mr-4">
            <Info className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            {t('blog.title')}
          </h1>
        </div>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          {t('blog.subtitle')}
        </p>
      </div>

      {/* Search */}
      <div className="mb-8">
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('blog.searchInformation')}
            className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
          />
        </div>
      </div>

      {/* Blog Posts */}
      {filteredPosts.length > 0 ? (
        <div className="space-y-8">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 group"
            >
              <div className="p-8">
                <div className="flex items-center space-x-4 text-sm text-gray-400 mb-4">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatDate(post.created_at)}
                  </div>
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    Admin
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-white mb-4 group-hover:text-purple-300 transition-colors duration-200">
                  <Link to={`/blog/${post.slug}`}>
                    {post.title}
                  </Link>
                </h2>

                <p className="text-gray-300 text-lg leading-relaxed mb-6">
                  {post.excerpt}
                </p>

                <Link
                  to={`/blog/${post.slug}`}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition-all duration-200 group-hover:shadow-lg group-hover:shadow-purple-500/25"
                >
                  <span>{t('blog.readMore')}</span>
                  <Eye className="w-4 h-4 ml-2" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Info className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">
            {posts.length === 0 ? t('blog.noInformationYet') : t('blog.noPostsFound')}
          </h3>
          <p className="text-gray-500">
            {posts.length === 0 
              ? t('blog.stayTuned')
              : t('blog.tryDifferentSearch')
            }
          </p>
        </div>
      )}
    </div>
  )
}