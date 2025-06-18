import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { GameReviews } from '../components/GameReviews'
import { 
  ArrowLeft, 
  ShoppingCart, 
  Tag, 
  Calendar, 
  DollarSign, 
  MessageCircle,
  Play,
  Image as ImageIcon,
  Loader2,
  Gift,
  Percent,
  Monitor,
  Gamepad2,
  User,
  Building,
  HardDrive,
  Cpu,
  MemoryStick,
  Settings
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
  created_at: string
  updated_at: string
}

export const GameDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [game, setGame] = useState<Game | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [showTrailer, setShowTrailer] = useState(false)

  useEffect(() => {
    if (id) {
      fetchGame(id)
    }
  }, [id])

  const fetchGame = async (gameId: string) => {
    try {
      const { data, error } = await supabase
        .from('games')
        .select('*')
        .eq('id', gameId)
        .single()

      if (error) throw error
      setGame(data)
      setSelectedImage(data.image_url)
    } catch (error) {
      console.error('Error fetching game:', error)
      navigate('/')
    } finally {
      setLoading(false)
    }
  }

  const calculateFinalPrice = () => {
    if (!game || game.is_free) return 0
    
    let finalPrice = game.price
    
    if (game.discount_percentage) {
      finalPrice = game.price * (1 - game.discount_percentage / 100)
    } else if (game.discount_amount) {
      finalPrice = Math.max(0, game.price - game.discount_amount)
    }
    
    return finalPrice
  }

  const handlePurchase = () => {
    if (!game) return
    
    const finalPrice = calculateFinalPrice()
    const message = `Hi! I'm interested in purchasing "${game.title}" for ${game.is_free ? 'FREE' : `Rp ${finalPrice.toLocaleString('id-ID')}`}. Can you help me with the purchase process?`
    
    // WhatsApp link
    const whatsappUrl = `https://wa.me/6208972190700?text=${encodeURIComponent(message)}`
    
    // Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank')
    
    // Also open Instagram in another tab
    setTimeout(() => {
      window.open('https://www.instagram.com/irsyad.kgr/', '_blank')
    }, 1000)
  }

  const extractYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return (match && match[2].length === 11) ? match[2] : null
  }

  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = extractYouTubeId(url)
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 sm:w-12 sm:h-12 text-purple-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-sm sm:text-base">Loading game details...</p>
        </div>
      </div>
    )
  }

  if (!game) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-400 mb-2">Game Not Found</h2>
          <p className="text-gray-500 mb-4 text-sm sm:text-base">The game you're looking for doesn't exist.</p>
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium text-white transition-colors duration-200 text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Games
          </Link>
        </div>
      </div>
    )
  }

  const finalPrice = calculateFinalPrice()
  const hasDiscount = game.discount_percentage || game.discount_amount
  const discountPercentage = game.discount_percentage || 
    (game.discount_amount ? Math.round((game.discount_amount / game.price) * 100) : 0)

  const allImages = [
    ...(game.image_url ? [game.image_url] : []),
    ...(game.screenshots || [])
  ]

  const platforms = game.platforms || ['PC']
  const hasPCPlatform = platforms.includes('PC')

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8">
      {/* Back Button */}
      <div className="mb-4 sm:mb-6">
        <Link
          to="/"
          className="inline-flex items-center px-3 sm:px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg font-medium text-gray-300 hover:text-white transition-all duration-200 border border-gray-700/50 text-sm sm:text-base"
        >
          <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
          Back to Games
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8 mb-6 sm:mb-8">
        {/* Media Section */}
        <div className="space-y-3 sm:space-y-4">
          {/* Main Image/Video */}
          <div className="relative bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700/50 aspect-video">
            {showTrailer && game.trailer_url ? (
              <iframe
                src={getYouTubeEmbedUrl(game.trailer_url)}
                title={`${game.title} Trailer`}
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : selectedImage ? (
              <img
                src={selectedImage}
                alt={game.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-4xl sm:text-6xl text-gray-600">🎮</div>
              </div>
            )}

            {/* Play Trailer Button */}
            {game.trailer_url && !showTrailer && (
              <button
                onClick={() => setShowTrailer(true)}
                className="absolute inset-0 flex items-center justify-center bg-black/50 hover:bg-black/70 transition-colors duration-200 group"
              >
                <div className="bg-purple-600 hover:bg-purple-700 rounded-full p-3 sm:p-4 group-hover:scale-110 transition-transform duration-200">
                  <Play className="w-6 h-6 sm:w-8 sm:h-8 text-white ml-1" />
                </div>
              </button>
            )}

            {/* Show Images Button */}
            {showTrailer && (
              <button
                onClick={() => setShowTrailer(false)}
                className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-gray-800/80 hover:bg-gray-700/80 rounded-lg p-1.5 sm:p-2 text-white transition-colors duration-200"
              >
                <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            )}
          </div>

          {/* Thumbnail Gallery */}
          {allImages.length > 0 && (
            <div className="grid grid-cols-4 gap-1 sm:gap-2">
              {game.trailer_url && (
                <button
                  onClick={() => setShowTrailer(true)}
                  className={`relative aspect-video bg-gray-800/50 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                    showTrailer ? 'border-purple-500' : 'border-gray-700/50 hover:border-purple-500/50'
                  }`}
                >
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-600/20 to-pink-600/20">
                    <Play className="w-4 h-4 sm:w-6 sm:h-6 text-purple-400" />
                  </div>
                </button>
              )}
              {allImages.slice(0, game.trailer_url ? 3 : 4).map((image, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedImage(image)
                    setShowTrailer(false)
                  }}
                  className={`aspect-video bg-gray-800/50 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                    selectedImage === image && !showTrailer ? 'border-purple-500' : 'border-gray-700/50 hover:border-purple-500/50'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${game.title} screenshot ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Game Info */}
        <div className="space-y-4 sm:space-y-6">
          {/* Title and Badges */}
          <div>
            <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-2 sm:mb-3">
              <span className="inline-flex items-center px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium bg-purple-600/20 text-purple-300 border border-purple-500/30">
                <Tag className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                {game.genre}
              </span>
              {game.is_free && (
                <span className="inline-flex items-center px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-bold bg-green-500 text-white">
                  <Gift className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  FREE
                </span>
              )}
              {hasDiscount && !game.is_free && (
                <span className="inline-flex items-center px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-bold bg-red-500 text-white">
                  <Percent className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  -{discountPercentage}% OFF
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold text-white mb-2">{game.title}</h1>
            {game.developer && (
              <p className="text-gray-400 text-sm sm:text-base">
                by <span className="text-purple-300">{game.developer}</span>
                {game.publisher && game.publisher !== game.developer && (
                  <> • Published by <span className="text-purple-300">{game.publisher}</span></>
                )}
              </p>
            )}
          </div>

          {/* Platforms */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-gray-700/50">
            <h3 className="text-base sm:text-lg font-semibold text-white mb-2 sm:mb-3 flex items-center">
              <Monitor className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Available Platforms
            </h3>
            <div className="flex flex-wrap gap-1 sm:gap-2">
              {platforms.map((platform) => (
                <span key={platform} className="inline-flex items-center px-2 sm:px-3 py-1 sm:py-2 rounded-lg text-xs sm:text-sm font-medium bg-blue-600/20 text-blue-300 border border-blue-500/30">
                  <Gamepad2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  {platform}
                </span>
              ))}
            </div>
          </div>

          {/* Price and Buy Button */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-gray-700/50">
            <div className="mb-4 sm:mb-6">
              {game.is_free ? (
                <div className="text-2xl sm:text-3xl font-bold text-green-400">FREE</div>
              ) : (
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-white">
                    Rp {finalPrice.toLocaleString('id-ID')}
                  </div>
                  {hasDiscount && (
                    <div className="text-base sm:text-lg text-gray-500 line-through">
                      Rp {game.price.toLocaleString('id-ID')}
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <button
              onClick={handlePurchase}
              className="w-full flex items-center justify-center space-x-2 px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/25 text-base sm:text-lg"
            >
              <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Buy</span>
            </button>
          </div>
        </div>
      </div>

      {/* Game Details Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* About This Game */}
        <div className="lg:col-span-2 space-y-6 sm:space-y-8">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-gray-700/50">
            <h3 className="text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4">About This Game</h3>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 leading-relaxed text-sm sm:text-lg">
                {game.about_game || game.description}
              </p>
            </div>
          </div>

          {/* PC System Requirements */}
          {hasPCPlatform && game.minimum_specs && (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-gray-700/50">
              <h3 className="text-xl sm:text-2xl font-semibold text-white mb-4 sm:mb-6 flex items-center">
                <Monitor className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                PC System Requirements
              </h3>
              <div className="bg-gray-700/30 rounded-lg p-3 sm:p-4">
                <h4 className="text-base sm:text-lg font-medium text-purple-300 mb-3 sm:mb-4">Minimum Requirements</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {game.minimum_specs.os && (
                    <div className="flex items-start space-x-2 sm:space-x-3">
                      <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-xs sm:text-sm font-medium text-gray-300">Operating System</div>
                        <div className="text-white text-sm sm:text-base">{game.minimum_specs.os}</div>
                      </div>
                    </div>
                  )}
                  {game.minimum_specs.processor && (
                    <div className="flex items-start space-x-2 sm:space-x-3">
                      <Cpu className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-xs sm:text-sm font-medium text-gray-300">Processor</div>
                        <div className="text-white text-sm sm:text-base">{game.minimum_specs.processor}</div>
                      </div>
                    </div>
                  )}
                  {game.minimum_specs.memory && (
                    <div className="flex items-start space-x-2 sm:space-x-3">
                      <MemoryStick className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-xs sm:text-sm font-medium text-gray-300">Memory</div>
                        <div className="text-white text-sm sm:text-base">{game.minimum_specs.memory}</div>
                      </div>
                    </div>
                  )}
                  {game.minimum_specs.graphics && (
                    <div className="flex items-start space-x-2 sm:space-x-3">
                      <Monitor className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-xs sm:text-sm font-medium text-gray-300">Graphics</div>
                        <div className="text-white text-sm sm:text-base">{game.minimum_specs.graphics}</div>
                      </div>
                    </div>
                  )}
                  {game.minimum_specs.directx && (
                    <div className="flex items-start space-x-2 sm:space-x-3">
                      <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-xs sm:text-sm font-medium text-gray-300">DirectX</div>
                        <div className="text-white text-sm sm:text-base">{game.minimum_specs.directx}</div>
                      </div>
                    </div>
                  )}
                  {game.minimum_specs.storage && (
                    <div className="flex items-start space-x-2 sm:space-x-3">
                      <HardDrive className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-xs sm:text-sm font-medium text-gray-300">Storage</div>
                        <div className="text-white text-sm sm:text-base">{game.minimum_specs.storage}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Reviews Section */}
          <GameReviews gameId={game.id} gameTitle={game.title} />
        </div>

        {/* Sidebar */}
        <div className="space-y-4 sm:space-y-6">
          {/* Game Details */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-gray-700/50">
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">Game Details</h3>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm sm:text-base">Genre</span>
                <span className="text-white font-medium text-sm sm:text-base">{game.genre}</span>
              </div>
              {game.developer && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm sm:text-base">Developer</span>
                  <span className="text-white font-medium text-sm sm:text-base truncate ml-2">{game.developer}</span>
                </div>
              )}
              {game.publisher && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm sm:text-base">Publisher</span>
                  <span className="text-white font-medium text-sm sm:text-base truncate ml-2">{game.publisher}</span>
                </div>
              )}
              {game.release_date && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm sm:text-base">Release Date</span>
                  <span className="text-white font-medium text-sm sm:text-base">
                    {new Date(game.release_date).toLocaleDateString('id-ID')}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm sm:text-base">Price</span>
                <span className="text-white font-medium text-sm sm:text-base">
                  {game.is_free ? 'Free' : `Rp ${game.price.toLocaleString('id-ID')}`}
                </span>
              </div>
              {hasDiscount && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm sm:text-base">Discount</span>
                  <span className="text-red-400 font-medium text-sm sm:text-base">
                    {game.discount_percentage ? `${game.discount_percentage}%` : `Rp ${game.discount_amount?.toLocaleString('id-ID')}`} OFF
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm sm:text-base">Added</span>
                <span className="text-white font-medium text-sm sm:text-base">
                  {new Date(game.created_at).toLocaleDateString('id-ID')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}