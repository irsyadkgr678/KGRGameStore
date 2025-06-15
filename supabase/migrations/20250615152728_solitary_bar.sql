/*
  # Create games table

  1. New Tables
    - `games`
      - `id` (uuid, primary key, auto-generated)
      - `title` (text, not null)
      - `description` (text, not null)
      - `price` (numeric, not null, default 0)
      - `discount_percentage` (numeric, nullable) - percentage discount (0-100)
      - `discount_amount` (numeric, nullable) - fixed amount discount
      - `is_free` (boolean, default false)
      - `genre` (text, not null)
      - `image_url` (text, nullable)
      - `created_at` (timestamp with timezone, default now())
      - `updated_at` (timestamp with timezone, default now())

  2. Security
    - Enable RLS on `games` table
    - Add policy for anyone to read games (public access)
    - Add policy for admins to insert/update/delete games

  3. Constraints
    - Ensure price is non-negative
    - Ensure discount_percentage is between 0 and 100 if not null
    - Ensure discount_amount is non-negative if not null
*/

CREATE TABLE IF NOT EXISTS games (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  price numeric NOT NULL DEFAULT 0,
  discount_percentage numeric CHECK (discount_percentage IS NULL OR (discount_percentage >= 0 AND discount_percentage <= 100)),
  discount_amount numeric CHECK (discount_amount IS NULL OR discount_amount >= 0),
  is_free boolean DEFAULT false,
  genre text NOT NULL,
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT price_non_negative CHECK (price >= 0)
);

ALTER TABLE games ENABLE ROW LEVEL SECURITY;

-- Anyone can read games (public access)
CREATE POLICY "Anyone can read games"
  ON games
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Only admins can insert games
CREATE POLICY "Admins can insert games"
  ON games
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Only admins can update games
CREATE POLICY "Admins can update games"
  ON games
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Only admins can delete games
CREATE POLICY "Admins can delete games"
  ON games
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Trigger for games updated_at
CREATE TRIGGER games_updated_at
  BEFORE UPDATE ON games
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();