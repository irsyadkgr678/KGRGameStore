import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { 
  Star, 
  ThumbsUp, 
  ThumbsDown, 
  MessageSquare, 
  Edit3, 
  Trash2, 
  Save, 
  X,
  User,
  Calendar,
  LogIn
} from 'lucide-react'

interface GameReview {
  id: string
  game_id: string
  user_id: string
  rating: number
  is_recommended: boolean
  review_text: string | null
  created_at: string
  updated_at: string
  profiles: {
    full_name: string | null
    email: string
  }
}

interface GameReviewsProps {
  gameId: string
  gameTitle: string
}

export const GameReviews: React.FC<GameReviewsProps> = ({ gameId, gameTitle }) => {
  const { user, profile } = useAuth()
  const [reviews, setReviews] = useState<GameReview[]>([])
  const [userReview, setUserReview] = useState<GameReview | null>(null)
  const [loading, setLoading] = useState(true)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [editingReview, setEditingReview] = useState<GameReview | null>(null)
  
  // Form state
  const [rating, setRating] = useState(5)
  const [isRecommended, setIsRecommended] = useState(true)
  const [reviewText, setReviewText] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchReviews()
  }, [gameId, user])

  const fetchReviews = async () => {
    try {
      // Fetch all reviews for this game
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('game_reviews')
        .select(`
          *,
          profiles (
            full_name,
            email
          )
        `)
        .eq('game_id', gameId)
        .order('created_at', { ascending: false })

      if (reviewsError) throw reviewsError

      setReviews(reviewsData || [])

      // Find user's review if logged in
      if (user) {
        const userReviewData = reviewsData?.find(review => review.user_id === user.id)
        setUserReview(userReviewData || null)
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setSubmitting(true)
    try {
      const reviewData = {
        game_id: gameId,
        user_id: user.id,
        rating,
        is_recommended: isRecommended,
        review_text: reviewText.trim() || null
      }

      if (editingReview) {
        // Update existing review
        const { error } = await supabase
          .from('game_reviews')
          .update({
            rating,
            is_recommended: isRecommended,
            review_text: reviewText.trim() || null,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingReview.id)

        if (error) throw error
      } else {
        // Create new review
        const { error } = await supabase
          .from('game_reviews')
          .insert([reviewData])

        if (error) throw error
      }

      // Reset form
      resetForm()
      fetchReviews()
    } catch (error) {
      console.error('Error submitting review:', error)
      alert('Error submitting review. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete your review?')) return

    try {
      const { error } = await supabase
        .from('game_reviews')
        .delete()
        .eq('id', reviewId)

      if (error) throw error
      fetchReviews()
    } catch (error) {
      console.error('Error deleting review:', error)
      alert('Error deleting review. Please try again.')
    }
  }

  const resetForm = () => {
    setRating(5)
    setIsRecommended(true)
    setReviewText('')
    setShowReviewForm(false)
    setEditingReview(null)
  }

  const startEdit = (review: GameReview) => {
    setRating(review.rating)
    setIsRecommended(review.is_recommended)
    setReviewText(review.review_text || '')
    setEditingReview(review)
    setShowReviewForm(true)
  }

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0)
    return sum / reviews.length
  }

  const getRecommendationStats = () => {
    const recommended = reviews.filter(review => review.is_recommended).length
    const total = reviews.length
    return { recommended, total, percentage: total > 0 ? Math.round((recommended / total) * 100) : 0 }
  }

  const renderStars = (rating: number, interactive = false, onStarClick?: (rating: number) => void) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? 'button' : undefined}
            onClick={interactive && onStarClick ? () => onStarClick(star) : undefined}
            className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform duration-200`}
            disabled={!interactive}
          >
            <Star
              className={`w-5 h-5 ${
                star <= rating
                  ? 'text-yellow-400 fill-yellow-400'
                  : 'text-gray-600'
              }`}
            />
          </button>
        ))}
      </div>
    )
  }

  const averageRating = calculateAverageRating()
  const recommendationStats = getRecommendationStats()

  if (loading) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-700 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Reviews Summary */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
        <h3 className="text-2xl font-semibold text-white mb-6 flex items-center">
          <MessageSquare className="w-6 h-6 mr-2" />
          Reviews & Ratings
        </h3>

        {reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Average Rating */}
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">
                {averageRating.toFixed(1)}
              </div>
              <div className="flex justify-center mb-2">
                {renderStars(Math.round(averageRating))}
              </div>
              <div className="text-gray-400">
                Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}
              </div>
            </div>

            {/* Recommendation Stats */}
            <div className="text-center">
              <div className="text-4xl font-bold text-green-400 mb-2">
                {recommendationStats.percentage}%
              </div>
              <div className="flex justify-center items-center mb-2">
                <ThumbsUp className="w-5 h-5 text-green-400 mr-2" />
                <span className="text-white">Recommended</span>
              </div>
              <div className="text-gray-400">
                {recommendationStats.recommended} out of {recommendationStats.total} users
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <MessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-gray-400 mb-2">No reviews yet</h4>
            <p className="text-gray-500">Be the first to review {gameTitle}!</p>
          </div>
        )}

        {/* User Review Actions */}
        {user ? (
          <div className="border-t border-gray-700/50 pt-6">
            {userReview ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-gray-300">Your review:</span>
                  {renderStars(userReview.rating)}
                  <span className={`flex items-center space-x-1 ${userReview.is_recommended ? 'text-green-400' : 'text-red-400'}`}>
                    {userReview.is_recommended ? <ThumbsUp className="w-4 h-4" /> : <ThumbsDown className="w-4 h-4" />}
                    <span>{userReview.is_recommended ? 'Recommended' : 'Not Recommended'}</span>
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => startEdit(userReview)}
                    className="flex items-center space-x-1 px-3 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 rounded-lg transition-colors duration-200"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDeleteReview(userReview.id)}
                    className="flex items-center space-x-1 px-3 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-300 rounded-lg transition-colors duration-200"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowReviewForm(true)}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition-all duration-200"
              >
                <Star className="w-5 h-5" />
                <span>Write a Review</span>
              </button>
            )}
          </div>
        ) : (
          <div className="border-t border-gray-700/50 pt-6 text-center">
            <p className="text-gray-400 mb-4">Sign in to write a review</p>
            <Link
              to="/login"
              className="inline-flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors duration-200"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In</span>
            </Link>
          </div>
        )}
      </div>

      {/* Review Form */}
      {showReviewForm && user && (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-xl font-semibold text-white">
              {editingReview ? 'Edit Your Review' : 'Write a Review'}
            </h4>
            <button
              onClick={resetForm}
              className="p-2 text-gray-400 hover:text-white transition-colors duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmitReview} className="space-y-6">
            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Rating
              </label>
              {renderStars(rating, true, setRating)}
            </div>

            {/* Recommendation */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Do you recommend this game?
              </label>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setIsRecommended(true)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    isRecommended
                      ? 'bg-green-600/20 text-green-300 border border-green-500/30'
                      : 'bg-gray-700/50 text-gray-400 border border-gray-600 hover:bg-gray-600/50'
                  }`}
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span>Yes, I recommend</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsRecommended(false)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    !isRecommended
                      ? 'bg-red-600/20 text-red-300 border border-red-500/30'
                      : 'bg-gray-700/50 text-gray-400 border border-gray-600 hover:bg-gray-600/50'
                  }`}
                >
                  <ThumbsDown className="w-4 h-4" />
                  <span>No, I don't recommend</span>
                </button>
              </div>
            </div>

            {/* Review Text */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Review (Optional)
              </label>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                placeholder="Share your thoughts about this game..."
              />
            </div>

            {/* Submit Button */}
            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center space-x-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white font-semibold rounded-lg transition-colors duration-200"
              >
                <Save className="w-4 h-4" />
                <span>{submitting ? 'Saving...' : (editingReview ? 'Update Review' : 'Submit Review')}</span>
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-3 bg-gray-600 hover:bg-gray-500 text-white font-semibold rounded-lg transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reviews List */}
      {reviews.length > 0 && (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
          <h4 className="text-xl font-semibold text-white mb-6">User Reviews</h4>
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="border-b border-gray-700/50 last:border-b-0 pb-6 last:pb-0">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-purple-300" />
                    </div>
                    <div>
                      <div className="font-medium text-white">
                        {review.profiles.full_name || review.profiles.email.split('@')[0]}
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-400">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(review.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {renderStars(review.rating)}
                    <span className={`flex items-center space-x-1 ${review.is_recommended ? 'text-green-400' : 'text-red-400'}`}>
                      {review.is_recommended ? <ThumbsUp className="w-4 h-4" /> : <ThumbsDown className="w-4 h-4" />}
                    </span>
                  </div>
                </div>
                {review.review_text && (
                  <p className="text-gray-300 leading-relaxed ml-13">
                    {review.review_text}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}