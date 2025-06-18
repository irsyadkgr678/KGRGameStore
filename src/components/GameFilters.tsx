import React from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { Search, Filter, SortAsc, DollarSign } from 'lucide-react'

interface GameFiltersProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
  selectedGenre: string
  setSelectedGenre: (genre: string) => void
  sortOrder: 'asc' | 'desc'
  setSortOrder: (order: 'asc' | 'desc') => void
  priceRange: [number, number]
  setPriceRange: (range: [number, number]) => void
  genres: string[]
  maxPrice: number
}

export const GameFilters: React.FC<GameFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  selectedGenre,
  setSelectedGenre,
  sortOrder,
  setSortOrder,
  priceRange,
  setPriceRange,
  genres,
  maxPrice
}) => {
  const { t } = useLanguage()

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <Search className="w-4 h-4 inline mr-2" />
            {t('filters.searchGames')}
          </label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('filters.searchPlaceholder')}
            className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
          />
        </div>

        {/* Genre Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <Filter className="w-4 h-4 inline mr-2" />
            {t('filters.genre')}
          </label>
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
          >
            <option value="">{t('filters.allGenres')}</option>
            {genres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Order */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <SortAsc className="w-4 h-4 inline mr-2" />
            {t('filters.sortByName')}
          </label>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
            className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
          >
            <option value="asc">{t('filters.aToZ')}</option>
            <option value="desc">{t('filters.zToA')}</option>
          </select>
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <DollarSign className="w-4 h-4 inline mr-2" />
            {t('filters.priceRange')}
          </label>
          <div className="space-y-2">
            <input
              type="range"
              min="0"
              max={maxPrice}
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
              className="w-full h-2 bg-gray-600 rounded-lg appearance-none slider cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>Rp 0</span>
              <span>Rp {priceRange[1].toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Active filters display */}
      <div className="mt-6 flex flex-wrap gap-2">
        {searchTerm && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-600/20 text-purple-300 border border-purple-500/30">
            {t('filters.search')}: {searchTerm}
            <button
              onClick={() => setSearchTerm('')}
              className="ml-2 text-purple-400 hover:text-purple-200"
            >
              ×
            </button>
          </span>
        )}
        {selectedGenre && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-600/20 text-purple-300 border border-purple-500/30">
            {t('filters.genre')}: {selectedGenre}
            <button
              onClick={() => setSelectedGenre('')}
              className="ml-2 text-purple-400 hover:text-purple-200"
            >
              ×
            </button>
          </span>
        )}
        {priceRange[1] < maxPrice && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-600/20 text-purple-300 border border-purple-500/30">
            {t('filters.maxPrice')}: Rp {priceRange[1].toLocaleString('id-ID')}
            <button
              onClick={() => setPriceRange([0, maxPrice])}
              className="ml-2 text-purple-400 hover:text-purple-200"
            >
              ×
            </button>
          </span>
        )}
      </div>
    </div>
  )
}