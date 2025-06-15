/*
  # Add media fields to games table

  1. New Columns
    - `screenshots` (text array) - Array of screenshot URLs
    - `trailer_url` (text) - YouTube or video URL for game trailer
  
  2. Changes
    - Add screenshots column to store multiple image URLs
    - Add trailer_url column for video content
    - Both fields are optional (nullable)
*/

DO $$
BEGIN
  -- Add screenshots column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'games' AND column_name = 'screenshots'
  ) THEN
    ALTER TABLE games ADD COLUMN screenshots text[];
  END IF;
  
  -- Add trailer_url column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'games' AND column_name = 'trailer_url'
  ) THEN
    ALTER TABLE games ADD COLUMN trailer_url text;
  END IF;
END $$;