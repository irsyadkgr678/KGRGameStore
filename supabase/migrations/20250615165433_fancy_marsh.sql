/*
  # Add Game Reviews and Ratings System

  1. New Tables
    - `game_reviews`
      - `id` (uuid, primary key)
      - `game_id` (uuid, foreign key to games)
      - `user_id` (uuid, foreign key to profiles)
      - `rating` (integer, 1-5 scale)
      - `is_recommended` (boolean)
      - `review_text` (text, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `game_reviews` table
    - Add policies for authenticated users to create/read/update their own reviews
    - Add policy for anyone to read published reviews

  3. Constraints
    - Unique constraint on (game_id, user_id) to prevent duplicate reviews
    - Rating must be between 1 and 5
*/

CREATE TABLE IF NOT EXISTS game_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id uuid NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  is_recommended boolean NOT NULL DEFAULT true,
  review_text text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(game_id, user_id)
);

ALTER TABLE game_reviews ENABLE ROW LEVEL SECURITY;

-- Users can read all reviews
CREATE POLICY "Anyone can read game reviews"
  ON game_reviews
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Users can insert their own reviews
CREATE POLICY "Users can create own reviews"
  ON game_reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Users can update their own reviews
CREATE POLICY "Users can update own reviews"
  ON game_reviews
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Users can delete their own reviews
CREATE POLICY "Users can delete own reviews"
  ON game_reviews
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Add updated_at trigger
CREATE TRIGGER game_reviews_updated_at
  BEFORE UPDATE ON game_reviews
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS game_reviews_game_id_idx ON game_reviews(game_id);
CREATE INDEX IF NOT EXISTS game_reviews_user_id_idx ON game_reviews(user_id);
CREATE INDEX IF NOT EXISTS game_reviews_rating_idx ON game_reviews(rating);
CREATE INDEX IF NOT EXISTS game_reviews_created_at_idx ON game_reviews(created_at DESC);