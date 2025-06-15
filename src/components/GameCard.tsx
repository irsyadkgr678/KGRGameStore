import React from 'react'
import { Link } from 'react-router-dom'
import { Tag, Star } from 'lucide-react'

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
}

interface GameCardProps {
  game: Game
}

export const GameCard: React.FC<GameCardProps> = ({ game }) => {
  const calculateFinalPrice = () => {
    if (game.is_free) return 0
    
    let finalPrice = game.price
    
    if (game.discount_percentage) {
      finalPrice = game.price * (1 - game.discount_percentage / 100)
    } else if (game.discount_amount) {
      finalPrice = Math.max(0, game.price - game.discount_amount)
    }
    
    return finalPrice
  }

  const finalPrice = calculateFinalPrice()
  const hasDiscount = game.discount_percentage || game.discount_amount
  const discountPercentage = game.discount_percentage || 
    (game.discount_amount ? Math.round((game.discount_amount / game.price) * 100) : 0)

  return (
    <Link to={`/games/${game.id}`} className="block">
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 group hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/10">
        {/* Image */}
        <div className="relative overflow-hidden bg-gradient-to-br from-purple-600/20 to-pink-600/20 h-48">
          {game.image_url ? (
            <img
              src={game.image_url}
              alt={game.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-6xl text-gray-600">🎮</div>
            </div>
          )}
          
          {/* Genre badge */}
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-600/80 text-white backdrop-blur-sm">
              <Tag className="w-3 h-3 mr-1" />
              {game.genre}
            </span>
          </div>

          {/* Discount badge */}
          {hasDiscount && !game.is_free && (
            <div className="absolute top-3 right-3">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-red-500 text-white">
                -{discountPercentage}%
              </span>
            </div>
          )}

          {/* Free badge */}
          {game.is_free && (
            <div className="absolute top-3 right-3">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-green-500 text-white">
                FREE
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors duration-200">
            {game.title}
          </h3>
          
          <p className="text-gray-400 text-sm mb-4 line-clamp-2">
            {game.description}
          </p>

          {/* Price section */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              {game.is_free ? (
                <span className="text-2xl font-bold text-green-400">FREE</span>
              ) : (
                <>
                  <span className="text-2xl font-bold text-white">
                    Rp {finalPrice.toLocaleString('id-ID')}
                  </span>
                  {hasDiscount && (
                    <span className="text-sm text-gray-500 line-through">
                      Rp {game.price.toLocaleString('id-ID')}
                    </span>
                  )}
                </>
              )}
            </div>
            
            {/* View Details indicator */}
            <div className="text-purple-400 group-hover:text-purple-300 transition-colors duration-200">
              <Star className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}