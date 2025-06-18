import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useLanguage } from '../contexts/LanguageContext'
import { GameCard } from '../components/GameCard'
import { GameFilters } from '../components/GameFilters'
import { Loader2, Gamepad2, Sparkles, Filter, ChevronDown, ChevronUp, MessageCircle, ExternalLink } from 'lucide-react'

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
  platforms: string[] | null
  created_at: string
  updated_at: string
}

export const Home: React.FC = () => {
  const { t } = useLanguage()
  const [games, setGames] = useState<Game[]>([])
  const [filteredGames, setFilteredGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('')
  const [selectedPlatform, setSelectedPlatform] = useState('')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000])

  const genres = [...new Set(games.map(game => game.genre))].sort()
  const platforms = [...new Set(games.flatMap(game => game.platforms || ['PC']))].sort()
  const maxPrice = Math.max(...games.map(game => game.price), 1000000)

  useEffect(() => {
    fetchGames()
  }, [])

  useEffect(() => {
    filterAndSortGames()
  }, [games, searchTerm, selectedGenre, selectedPlatform, sortOrder, priceRange])

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

  const filterAndSortGames = () => {
    let filtered = [...games]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(game =>
        game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        game.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Genre filter
    if (selectedGenre) {
      filtered = filtered.filter(game => game.genre === selectedGenre)
    }

    // Platform filter
    if (selectedPlatform) {
      filtered = filtered.filter(game => 
        game.platforms && game.platforms.includes(selectedPlatform)
      )
    }

    // Price filter
    filtered = filtered.filter(game => {
      if (game.is_free) return true
      
      let finalPrice = game.price
      if (game.discount_percentage) {
        finalPrice = game.price * (1 - game.discount_percentage / 100)
      } else if (game.discount_amount) {
        finalPrice = Math.max(0, game.price - game.discount_amount)
      }
      
      return finalPrice <= priceRange[1]
    })

    // Sort
    filtered.sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.title.localeCompare(b.title)
      } else {
        return b.title.localeCompare(a.title)
      }
    })

    setFilteredGames(filtered)
  }

  const handleComplaint = () => {
    const message = encodeURIComponent(
      `Halo KGR GameStore! Saya ingin menyampaikan keluhan/masalah terkait layanan atau pesanan saya. Mohon bantuan untuk menyelesaikan masalah ini. Terima kasih.`
    )
    
    // Open WhatsApp
    window.open(`https://wa.me/6208972190700?text=${message}`, '_blank')
    
    // Also open Instagram after a short delay
    setTimeout(() => {
      window.open('https://www.instagram.com/irsyad.kgr/', '_blank')
    }, 1000)
  }

  const hasActiveFilters = searchTerm || selectedGenre || selectedPlatform || priceRange[1] < maxPrice

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 sm:w-12 sm:h-12 text-purple-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-sm sm:text-base">{t('common.loading')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8">
      {/* Hero Section */}
      <div className="text-center mb-8 sm:mb-12">
        <div className="flex items-center justify-center mb-3 sm:mb-4">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 sm:p-3 rounded-full mr-2 sm:mr-4">
            <Gamepad2 className="w-5 h-5 sm:w-8 sm:h-8 text-white" />
          </div>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            {t('home.title')}
          </h1>
        </div>
        <p className="text-sm sm:text-xl text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto px-2">
          {t('home.subtitle')}
        </p>

        {/* Complaint/Report Button */}
        <div className="mb-6 sm:mb-8">
          <button
            onClick={handleComplaint}
            className="group relative inline-flex items-center space-x-2 sm:space-x-3 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 rounded-lg font-semibold text-white transition-all duration-200 hover:shadow-lg hover:shadow-red-500/25 text-sm sm:text-base"
          >
            <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>{t('home.complaint')}</span>
            <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 opacity-70 group-hover:opacity-100 transition-opacity duration-200" />
          </button>
          <p className="text-xs sm:text-sm text-gray-400 mt-2 sm:mt-3 max-w-md mx-auto px-2">
            {t('home.complaintDescription')}
          </p>
        </div>
      </div>

      {/* Filter Toggle Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-0">
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
          <h2 className="text-xl sm:text-2xl font-semibold text-white">
            {t('home.browseGames')} {filteredGames.length !== games.length && `(${filteredGames.length})`}
          </h2>
          {hasActiveFilters && (
            <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-purple-600/20 text-purple-300 border border-purple-500/30">
              {t('home.filtersActive')}
            </span>
          )}
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg font-medium text-gray-300 hover:text-white transition-all duration-200 border border-gray-700/50 hover:border-purple-500/50 text-sm"
        >
          <Filter className="w-3 h-3 sm:w-4 sm:h-4" />
          <span>{showFilters ? t('home.hideFilters') : t('home.showFilters')}</span>
          {showFilters ? <ChevronUp className="w-3 h-3 sm:w-4 sm:h-4" /> : <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />}
        </button>
      </div>

      {/* Collapsible Filters */}
      {showFilters && (
        <div className="mb-6 sm:mb-8 animate-in slide-in-from-top-2 duration-300">
          <GameFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedGenre={selectedGenre}
            setSelectedGenre={setSelectedGenre}
            selectedPlatform={selectedPlatform}
            setSelectedPlatform={setSelectedPlatform}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            genres={genres}
            platforms={platforms}
            maxPrice={maxPrice}
          />
        </div>
      )}

      {/* Games Grid */}
      {filteredGames.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredGames.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 sm:py-16">
          <div className="mb-4">
            <Sparkles className="w-12 h-12 sm:w-16 sm:h-16 text-gray-600 mx-auto" />
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-400 mb-2">{t('home.noGamesFound')}</h3>
          <p className="text-gray-500 mb-4 text-sm sm:text-base px-4">
            {games.length === 0 
              ? t('home.noGamesAvailable')
              : t('home.adjustFilters')
            }
          </p>
          {hasActiveFilters && (
            <button
              onClick={() => {
                setSearchTerm('')
                setSelectedGenre('')
                setSelectedPlatform('')
                setPriceRange([0, maxPrice])
              }}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium text-white transition-colors duration-200 text-sm sm:text-base"
            >
              {t('home.clearAllFilters')}
            </button>
          )}
        </div>
      )}
    </div>
  )
}