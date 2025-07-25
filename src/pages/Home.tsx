import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useLanguage } from '../contexts/LanguageContext'
import { GameCard } from '../components/GameCard'
import { GameFilters } from '../components/GameFilters'
import { Loader2, Gamepad2, Sparkles, Filter, ChevronDown, ChevronUp, MessageCircle, ExternalLink, X } from 'lucide-react'

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
  const [showComplaintModal, setShowComplaintModal] = useState(false)
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

  const handleWhatsAppComplaint = () => {
    const message = encodeURIComponent(
      `Halo KGR GameStore! Saya ingin menyampaikan keluhan/masalah terkait layanan atau pesanan saya. Mohon bantuan untuk menyelesaikan masalah ini. Terima kasih.`
    )
    window.open(`https://wa.me/6208972190700?text=${message}`, '_blank')
    setShowComplaintModal(false)
  }

  const handleInstagramComplaint = () => {
    window.open('https://www.instagram.com/irsyad.kgr/', '_blank')
    setShowComplaintModal(false)
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
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 sm:p-3 rounded-full mr-2 sm:mr-4 opacity-90 hover:opacity-100 transition-opacity duration-200">
            <img 
              src="/kgr logo copy copy copy copy.png" 
              alt="KGR GameStore Logo" 
              className="w-5 h-5 sm:w-8 sm:h-8 object-contain opacity-90 hover:opacity-100 transition-opacity duration-200"
              onError={(e) => {
                // Fallback to gamepad icon if image fails to load
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = '<svg class="w-5 h-5 sm:w-8 sm:h-8 text-white opacity-90 hover:opacity-100 transition-opacity duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M15 14h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>';
                }
              }}
            />
          </div>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            {t('home.title')}
          </h1>
        </div>
        <p className="text-sm sm:text-xl text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto px-2">
          {t('home.subtitle')}
        </p>
      </div>

      {/* Complaint Modal */}
      {showComplaintModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md border border-gray-700/50 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-white">
                {t('home.chooseContactMethod')}
              </h3>
              <button
                onClick={() => setShowComplaintModal(false)}
                className="p-2 text-gray-400 hover:text-white transition-colors duration-200 hover:bg-gray-700/50 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-gray-300 text-sm mb-6">
                {t('home.selectPreferredContact')}
              </p>

              {/* WhatsApp Option */}
              <button
                onClick={handleWhatsAppComplaint}
                className="w-full flex items-center space-x-4 p-4 bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 rounded-lg transition-all duration-200 group hover:scale-[1.02]"
              >
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <div className="text-left flex-1">
                  <div className="font-semibold text-white">WhatsApp</div>
                  <div className="text-sm text-gray-300">{t('home.whatsappDescription')}</div>
                </div>
                <ExternalLink className="w-4 h-4 text-green-400" />
              </button>

              {/* Instagram Option */}
              <button
                onClick={handleInstagramComplaint}
                className="w-full flex items-center space-x-4 p-4 bg-pink-600/20 hover:bg-pink-600/30 border border-pink-500/30 rounded-lg transition-all duration-200 group hover:scale-[1.02]"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </div>
                <div className="text-left flex-1">
                  <div className="font-semibold text-white">Instagram</div>
                  <div className="text-sm text-gray-300">{t('home.instagramDescription')}</div>
                </div>
                <ExternalLink className="w-4 h-4 text-pink-400" />
              </button>
            </div>
          </div>
        </div>
      )}

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

      {/* Complaint/Report Section - Positioned at Bottom */}
      <div className="mt-16 sm:mt-20 border-t border-gray-700/50 pt-8 sm:pt-12">
        <div className="text-center">
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-gray-700/50 max-w-2xl mx-auto">
            <div className="mb-4 sm:mb-6">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">
                {t('home.needHelp')}
              </h3>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                {t('home.complaintDescription')}
              </p>
            </div>

            <button
              onClick={() => setShowComplaintModal(true)}
              className="group relative inline-flex items-center space-x-2 sm:space-x-3 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 rounded-xl font-semibold text-white transition-all duration-200 hover:shadow-lg hover:shadow-red-500/25 text-sm sm:text-base hover:scale-105"
            >
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>{t('home.complaint')}</span>
              <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 opacity-70 group-hover:opacity-100 transition-opacity duration-200" />
            </button>

            <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
                <span>WhatsApp: 08972190700</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-pink-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <span>Instagram: @irsyad.kgr</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}