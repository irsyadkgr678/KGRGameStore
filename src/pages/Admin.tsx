import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Save, 
  X, 
  DollarSign, 
  Tag, 
  Image,
  Percent,
  Gift,
  Info,
  Users,
  Settings,
  Video,
  Camera,
  Monitor,
  Gamepad2,
  Calendar,
  User,
  Building
} from 'lucide-react'

interface Game {
  id: string
  title: string
  description: string
  price: number
  discount_percentage: number | null
  discount_amount: number | null
  is_free: boolean
  genre: string
  image_url: string | null
  screenshots: string[] | null
  trailer_url: string | null
  platforms: string[] | null
  about_game: string | null
  minimum_specs: any | null
  developer: string | null
  publisher: string | null
  release_date: string | null
}

interface BlogPost {
  id: string
  title: string
  content: string
  excerpt: string
  slug: string
  published: boolean
  author_id: string
}

const AVAILABLE_PLATFORMS = ['PC', 'PS4', 'PS5', 'Xbox One', 'Xbox Series S/X']
const AVAILABLE_GENRES = [
  'Action',
  'Adventure', 
  'RPG',
  'Strategy',
  'Simulation',
  'Sports',
  'Racing',
  'Puzzle',
  'Horror',
  'Platformer',
  'Fighting',
  'Shooter',
  'Battle Royale',
  'MMORPG',
  'Indie',
  'Arcade',
  'Casual'
]

export const Admin: React.FC = () => {
  const { isAdmin, user } = useAuth()
  const [activeTab, setActiveTab] = useState<'games' | 'blog'>('games')
  const [games, setGames] = useState<Game[]>([])
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [showGameForm, setShowGameForm] = useState(false)
  const [showPostForm, setShowPostForm] = useState(false)
  const [editingGame, setEditingGame] = useState<Game | null>(null)
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)

  // Game form state
  const [gameForm, setGameForm] = useState({
    title: '',
    description: '',
    price: 0,
    discount_percentage: null as number | null,
    discount_amount: null as number | null,
    is_free: false,
    genre: '',
    image_url: '',
    screenshots: [] as string[],
    trailer_url: '',
    platforms: ['PC'] as string[],
    about_game: '',
    minimum_specs: {
      os: '',
      processor: '',
      memory: '',
      graphics: '',
      directx: '',
      storage: '',
      sound: ''
    },
    developer: '',
    publisher: '',
    release_date: ''
  })

  // Blog post form state
  const [postForm, setPostForm] = useState({
    title: '',
    content: '',
    excerpt: '',
    slug: '',
    published: false
  })

  useEffect(() => {
    if (isAdmin) {
      fetchGames()
      fetchPosts()
    }
  }, [isAdmin])

  const fetchGames = async () => {
    try {
      const { data, error } = await supabase
        .from('games')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setGames(data || [])
    } catch (error) {
      console.error('Error fetching games:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setPosts(data || [])
    } catch (error) {
      console.error('Error fetching posts:', error)
    }
  }

  const handleGameSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const gameData = {
        ...gameForm,
        screenshots: gameForm.screenshots.length > 0 ? gameForm.screenshots : null,
        trailer_url: gameForm.trailer_url || null,
        platforms: gameForm.platforms.length > 0 ? gameForm.platforms : ['PC'],
        about_game: gameForm.about_game || null,
        minimum_specs: gameForm.platforms.includes('PC') && Object.values(gameForm.minimum_specs).some(v => v) 
          ? gameForm.minimum_specs 
          : null,
        developer: gameForm.developer || null,
        publisher: gameForm.publisher || null,
        release_date: gameForm.release_date || null
      }

      if (editingGame) {
        const { error } = await supabase
          .from('games')
          .update({
            ...gameData,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingGame.id)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('games')
          .insert([gameData])

        if (error) throw error
      }

      resetGameForm()
      fetchGames()
    } catch (error) {
      console.error('Error saving game:', error)
      alert('Error saving game. Please try again.')
    }
  }

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const postData = {
        ...postForm,
        author_id: user!.id,
        slug: postForm.slug || postForm.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      }

      if (editingPost) {
        const { error } = await supabase
          .from('blog_posts')
          .update({
            ...postData,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingPost.id)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('blog_posts')
          .insert([postData])

        if (error) throw error
      }

      resetPostForm()
      fetchPosts()
    } catch (error) {
      console.error('Error saving post:', error)
      alert('Error saving post. Please try again.')
    }
  }

  const deleteGame = async (id: string) => {
    if (!confirm('Are you sure you want to delete this game?')) return

    try {
      const { error } = await supabase
        .from('games')
        .delete()
        .eq('id', id)

      if (error) throw error
      fetchGames()
    } catch (error) {
      console.error('Error deleting game:', error)
      alert('Error deleting game. Please try again.')
    }
  }

  const deletePost = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return

    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id)

      if (error) throw error
      fetchPosts()
    } catch (error) {
      console.error('Error deleting post:', error)
      alert('Error deleting post. Please try again.')
    }
  }

  const resetGameForm = () => {
    setGameForm({
      title: '',
      description: '',
      price: 0,
      discount_percentage: null,
      discount_amount: null,
      is_free: false,
      genre: '',
      image_url: '',
      screenshots: [],
      trailer_url: '',
      platforms: ['PC'],
      about_game: '',
      minimum_specs: {
        os: '',
        processor: '',
        memory: '',
        graphics: '',
        directx: '',
        storage: '',
        sound: ''
      },
      developer: '',
      publisher: '',
      release_date: ''
    })
    setEditingGame(null)
    setShowGameForm(false)
  }

  const resetPostForm = () => {
    setPostForm({
      title: '',
      content: '',
      excerpt: '',
      slug: '',
      published: false
    })
    setEditingPost(null)
    setShowPostForm(false)
  }

  const editGame = (game: Game) => {
    setGameForm({
      title: game.title,
      description: game.description,
      price: game.price,
      discount_percentage: game.discount_percentage,
      discount_amount: game.discount_amount,
      is_free: game.is_free,
      genre: game.genre,
      image_url: game.image_url || '',
      screenshots: game.screenshots || [],
      trailer_url: game.trailer_url || '',
      platforms: game.platforms || ['PC'],
      about_game: game.about_game || '',
      minimum_specs: game.minimum_specs || {
        os: '',
        processor: '',
        memory: '',
        graphics: '',
        directx: '',
        storage: '',
        sound: ''
      },
      developer: game.developer || '',
      publisher: game.publisher || '',
      release_date: game.release_date || ''
    })
    setEditingGame(game)
    setShowGameForm(true)
  }

  const editPost = (post: BlogPost) => {
    setPostForm({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      slug: post.slug,
      published: post.published
    })
    setEditingPost(post)
    setShowPostForm(true)
  }

  const handleScreenshotsChange = (value: string) => {
    const urls = value.split('\n').map(url => url.trim()).filter(url => url.length > 0)
    setGameForm({...gameForm, screenshots: urls})
  }

  const handlePlatformToggle = (platform: string) => {
    const newPlatforms = gameForm.platforms.includes(platform)
      ? gameForm.platforms.filter(p => p !== platform)
      : [...gameForm.platforms, platform]
    
    setGameForm({...gameForm, platforms: newPlatforms})
  }

  const handleMinSpecChange = (field: string, value: string) => {
    setGameForm({
      ...gameForm,
      minimum_specs: {
        ...gameForm.minimum_specs,
        [field]: value
      }
    })
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Settings className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-400 mb-2">Access Denied</h2>
          <p className="text-gray-500">You don't have permission to access this page.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
          KGR GameStore Admin Dashboard
        </h1>
        
        {/* Tabs */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab('games')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'games'
                ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Games Management</span>
          </button>
          <button
            onClick={() => setActiveTab('blog')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'blog'
                ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
            }`}
          >
            <Info className="w-4 h-4" />
            <span>Information Management</span>
          </button>
        </div>
      </div>

      {/* Games Management */}
      {activeTab === 'games' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-white">Games ({games.length})</h2>
            <button
              onClick={() => setShowGameForm(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg font-medium text-white transition-all duration-200"
            >
              <Plus className="w-4 h-4" />
              <span>Add Game</span>
            </button>
          </div>

          {/* Game Form Modal */}
          {showGameForm && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <div className="bg-gray-800 rounded-xl p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-white">
                    {editingGame ? 'Edit Game' : 'Add New Game'}
                  </h3>
                  <button
                    onClick={resetGameForm}
                    className="p-2 text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleGameSubmit} className="space-y-6">
                  {/* Basic Info */}
                  <div className="bg-gray-700/30 rounded-lg p-4">
                    <h4 className="text-lg font-medium text-white mb-4">Basic Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                        <input
                          type="text"
                          required
                          value={gameForm.title}
                          onChange={(e) => setGameForm({...gameForm, title: e.target.value})}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Genre</label>
                        <select
                          required
                          value={gameForm.genre}
                          onChange={(e) => setGameForm({...gameForm, genre: e.target.value})}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="">Select Genre</option>
                          {AVAILABLE_GENRES.map((genre) => (
                            <option key={genre} value={genre}>{genre}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          <User className="w-4 h-4 inline mr-1" />
                          Developer
                        </label>
                        <input
                          type="text"
                          value={gameForm.developer}
                          onChange={(e) => setGameForm({...gameForm, developer: e.target.value})}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          <Building className="w-4 h-4 inline mr-1" />
                          Publisher
                        </label>
                        <input
                          type="text"
                          value={gameForm.publisher}
                          onChange={(e) => setGameForm({...gameForm, publisher: e.target.value})}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          <Calendar className="w-4 h-4 inline mr-1" />
                          Release Date
                        </label>
                        <input
                          type="date"
                          value={gameForm.release_date}
                          onChange={(e) => setGameForm({...gameForm, release_date: e.target.value})}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Platforms */}
                  <div className="bg-gray-700/30 rounded-lg p-4">
                    <h4 className="text-lg font-medium text-white mb-4">
                      <Monitor className="w-5 h-5 inline mr-2" />
                      Platforms
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                      {AVAILABLE_PLATFORMS.map((platform) => (
                        <label key={platform} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={gameForm.platforms.includes(platform)}
                            onChange={() => handlePlatformToggle(platform)}
                            className="rounded border-gray-600 text-purple-600 focus:ring-purple-500"
                          />
                          <span className="text-gray-300 font-medium text-sm">{platform}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Descriptions */}
                  <div className="bg-gray-700/30 rounded-lg p-4">
                    <h4 className="text-lg font-medium text-white mb-4">Descriptions</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Short Description</label>
                        <textarea
                          required
                          rows={3}
                          value={gameForm.description}
                          onChange={(e) => setGameForm({...gameForm, description: e.target.value})}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="Brief description for game cards..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">About This Game</label>
                        <textarea
                          rows={5}
                          value={gameForm.about_game}
                          onChange={(e) => setGameForm({...gameForm, about_game: e.target.value})}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="Detailed description about the game, features, gameplay, etc..."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Media */}
                  <div className="bg-gray-700/30 rounded-lg p-4">
                    <h4 className="text-lg font-medium text-white mb-4">Media</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          <Image className="w-4 h-4 inline mr-1" />
                          Main Image URL
                        </label>
                        <input
                          type="url"
                          value={gameForm.image_url}
                          onChange={(e) => setGameForm({...gameForm, image_url: e.target.value})}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="https://example.com/image.jpg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          <Video className="w-4 h-4 inline mr-1" />
                          Trailer URL (YouTube)
                        </label>
                        <input
                          type="url"
                          value={gameForm.trailer_url}
                          onChange={(e) => setGameForm({...gameForm, trailer_url: e.target.value})}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="https://youtube.com/watch?v=..."
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <Camera className="w-4 h-4 inline mr-1" />
                        Screenshots (one URL per line)
                      </label>
                      <textarea
                        rows={4}
                        value={gameForm.screenshots.join('\n')}
                        onChange={(e) => handleScreenshotsChange(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="https://example.com/screenshot1.jpg&#10;https://example.com/screenshot2.jpg&#10;https://example.com/screenshot3.jpg"
                      />
                      <p className="text-xs text-gray-400 mt-1">Enter each screenshot URL on a new line</p>
                    </div>
                  </div>

                  {/* PC Minimum Specs */}
                  {gameForm.platforms.includes('PC') && (
                    <div className="bg-gray-700/30 rounded-lg p-4">
                      <h4 className="text-lg font-medium text-white mb-4">
                        <Monitor className="w-5 h-5 inline mr-2" />
                        PC Minimum System Requirements
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Operating System</label>
                          <input
                            type="text"
                            value={gameForm.minimum_specs.os}
                            onChange={(e) => handleMinSpecChange('os', e.target.value)}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Windows 10 64-bit"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Processor</label>
                          <input
                            type="text"
                            value={gameForm.minimum_specs.processor}
                            onChange={(e) => handleMinSpecChange('processor', e.target.value)}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Intel Core i5-8400 / AMD Ryzen 5 2600"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Memory</label>
                          <input
                            type="text"
                            value={gameForm.minimum_specs.memory}
                            onChange={(e) => handleMinSpecChange('memory', e.target.value)}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="8 GB RAM"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Graphics</label>
                          <input
                            type="text"
                            value={gameForm.minimum_specs.graphics}
                            onChange={(e) => handleMinSpecChange('graphics', e.target.value)}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="NVIDIA GTX 1060 6GB / AMD RX 580 8GB"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">DirectX</label>
                          <input
                            type="text"
                            value={gameForm.minimum_specs.directx}
                            onChange={(e) => handleMinSpecChange('directx', e.target.value)}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Version 12"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Storage</label>
                          <input
                            type="text"
                            value={gameForm.minimum_specs.storage}
                            onChange={(e) => handleMinSpecChange('storage', e.target.value)}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="50 GB available space"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Pricing */}
                  <div className="bg-gray-700/30 rounded-lg p-4">
                    <h4 className="text-lg font-medium text-white mb-4">Pricing</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Price (IDR)</label>
                        <input
                          type="number"
                          min="0"
                          value={gameForm.price}
                          onChange={(e) => setGameForm({...gameForm, price: parseInt(e.target.value) || 0})}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                          disabled={gameForm.is_free}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Discount %</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={gameForm.discount_percentage || ''}
                          onChange={(e) => setGameForm({
                            ...gameForm, 
                            discount_percentage: e.target.value ? parseInt(e.target.value) : null,
                            discount_amount: null
                          })}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                          disabled={gameForm.is_free || !!gameForm.discount_amount}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Discount Amount</label>
                        <input
                          type="number"
                          min="0"
                          value={gameForm.discount_amount || ''}
                          onChange={(e) => setGameForm({
                            ...gameForm, 
                            discount_amount: e.target.value ? parseInt(e.target.value) : null,
                            discount_percentage: null
                          })}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                          disabled={gameForm.is_free || !!gameForm.discount_percentage}
                        />
                      </div>
                    </div>

                    <div className="flex items-center mt-4">
                      <input
                        type="checkbox"
                        id="is_free"
                        checked={gameForm.is_free}
                        onChange={(e) => setGameForm({
                          ...gameForm, 
                          is_free: e.target.checked,
                          discount_percentage: e.target.checked ? null : gameForm.discount_percentage,
                          discount_amount: e.target.checked ? null : gameForm.discount_amount
                        })}
                        className="mr-2 rounded border-gray-600 text-purple-600 focus:ring-purple-500"
                      />
                      <label htmlFor="is_free" className="text-sm font-medium text-gray-300">
                        Mark as Free Game
                      </label>
                    </div>
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button
                      type="submit"
                      className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium text-white transition-colors duration-200"
                    >
                      <Save className="w-4 h-4" />
                      <span>{editingGame ? 'Update' : 'Create'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={resetGameForm}
                      className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg font-medium text-white transition-colors duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Games List */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700/50">
            {games.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-700/50">
                    <tr>
                      <th className="text-left py-3 px-4 font-medium text-gray-300">Game</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-300">Platforms</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-300">Price</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-300">Media</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-300">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {games.map((game) => (
                      <tr key={game.id} className="border-t border-gray-700/50 hover:bg-gray-700/25 transition-colors duration-200">
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-lg flex items-center justify-center">
                              {game.image_url ? (
                                <img src={game.image_url} alt={game.title} className="w-full h-full object-cover rounded-lg" />
                              ) : (
                                <span className="text-2xl">🎮</span>
                              )}
                            </div>
                            <div>
                              <div className="font-medium text-white">{game.title}</div>
                              <div className="text-sm text-gray-400">{game.genre}</div>
                              {game.developer && (
                                <div className="text-xs text-gray-500">{game.developer}</div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex flex-wrap gap-1">
                            {(game.platforms || ['PC']).map((platform) => (
                              <span key={platform} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-600/20 text-blue-300">
                                <Gamepad2 className="w-3 h-3 mr-1" />
                                {platform}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          {game.is_free ? (
                            <span className="text-green-400 font-medium">FREE</span>
                          ) : (
                            <div>
                              <div className="font-medium text-white">
                                Rp {game.price.toLocaleString('id-ID')}
                              </div>
                              {(game.discount_percentage || game.discount_amount) && (
                                <div className="text-xs text-red-400">
                                  {game.discount_percentage ? `${game.discount_percentage}% OFF` : `Rp ${game.discount_amount?.toLocaleString('id-ID')} OFF`}
                                </div>
                              )}
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-1">
                            {game.trailer_url && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-600/20 text-red-300">
                                <Video className="w-3 h-3 mr-1" />
                                Trailer
                              </span>
                            )}
                            {game.screenshots && game.screenshots.length > 0 && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-600/20 text-blue-300">
                                <Camera className="w-3 h-3 mr-1" />
                                {game.screenshots.length}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex flex-col space-y-1">
                            {game.is_free && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-600/20 text-green-300">
                                <Gift className="w-3 h-3 mr-1" />
                                Free
                              </span>
                            )}
                            {(game.discount_percentage || game.discount_amount) && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-600/20 text-red-300">
                                <Percent className="w-3 h-3 mr-1" />
                                Sale
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => editGame(game)}
                              className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-600/20 rounded-lg transition-all duration-200"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteGame(game.id)}
                              className="p-2 text-red-400 hover:text-red-300 hover:bg-red-600/20 rounded-lg transition-all duration-200"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <Tag className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">No games yet</h3>
                <p className="text-gray-500 mb-4">Add your first game to get started.</p>
                <button
                  onClick={() => setShowGameForm(true)}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium text-white transition-colors duration-200"
                >
                  Add Game
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Blog Management */}
      {activeTab === 'blog' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-white">Information Posts ({posts.length})</h2>
            <button
              onClick={() => setShowPostForm(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg font-medium text-white transition-all duration-200"
            >
              <Plus className="w-4 h-4" />
              <span>Add Post</span>
            </button>
          </div>

          {/* Post Form Modal */}
          {showPostForm && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <div className="bg-gray-800 rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-white">
                    {editingPost ? 'Edit Post' : 'Add New Post'}
                  </h3>
                  <button
                    onClick={resetPostForm}
                    className="p-2 text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handlePostSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                      <input
                        type="text"
                        required
                        value={postForm.title}
                        onChange={(e) => setPostForm({...postForm, title: e.target.value})}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Slug (URL)</label>
                      <input
                        type="text"
                        value={postForm.slug}
                        onChange={(e) => setPostForm({...postForm, slug: e.target.value})}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="auto-generated-from-title"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Excerpt</label>
                    <textarea
                      required
                      rows={2}
                      value={postForm.excerpt}
                      onChange={(e) => setPostForm({...postForm, excerpt: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Brief description of the post..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Content</label>
                    <textarea
                      required
                      rows={10}
                      value={postForm.content}
                      onChange={(e) => setPostForm({...postForm, content: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Write your information post content here..."
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="published"
                      checked={postForm.published}
                      onChange={(e) => setPostForm({...postForm, published: e.target.checked})}
                      className="mr-2 rounded border-gray-600 text-purple-600 focus:ring-purple-500"
                    />
                    <label htmlFor="published" className="text-sm font-medium text-gray-300">
                      Publish immediately
                    </label>
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button
                      type="submit"
                      className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium text-white transition-colors duration-200"
                    >
                      <Save className="w-4 h-4" />
                      <span>{editingPost ? 'Update' : 'Create'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={resetPostForm}
                      className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg font-medium text-white transition-colors duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Posts List */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700/50">
            {posts.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-700/50">
                    <tr>
                      <th className="text-left py-3 px-4 font-medium text-gray-300">Title</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-300">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-300">Created</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {posts.map((post) => (
                      <tr key={post.id} className="border-t border-gray-700/50 hover:bg-gray-700/25 transition-colors duration-200">
                        <td className="py-3 px-4">
                          <div>
                            <div className="font-medium text-white">{post.title}</div>
                            <div className="text-sm text-gray-400 line-clamp-1">{post.excerpt}</div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            post.published 
                              ? 'bg-green-600/20 text-green-300' 
                              : 'bg-yellow-600/20 text-yellow-300'
                          }`}>
                            {post.published ? 'Published' : 'Draft'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-400 text-sm">
                          {new Date(post.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => editPost(post)}
                              className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-600/20 rounded-lg transition-all duration-200"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deletePost(post.id)}
                              className="p-2 text-red-400 hover:text-red-300 hover:bg-red-600/20 rounded-lg transition-all duration-200"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <Info className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">No information posts yet</h3>
                <p className="text-gray-500 mb-4">Create your first information post to get started.</p>
                <button
                  onClick={() => setShowPostForm(true)}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium text-white transition-colors duration-200"
                >
                  Add Post
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}