/*
  # Add Platform and Game Details

  1. New Columns
    - `platforms` (text array) - Available platforms (PS4, PS5, PC)
    - `about_game` (text) - Detailed description about the game
    - `minimum_specs` (jsonb) - PC minimum specifications
    - `developer` (text) - Game developer
    - `publisher` (text) - Game publisher
    - `release_date` (date) - Game release date

  2. Updates
    - Add new columns to games table
    - Update existing games with sample data
*/

DO $$
BEGIN
  -- Add platforms column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'games' AND column_name = 'platforms'
  ) THEN
    ALTER TABLE games ADD COLUMN platforms text[] DEFAULT ARRAY['PC'];
  END IF;
  
  -- Add about_game column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'games' AND column_name = 'about_game'
  ) THEN
    ALTER TABLE games ADD COLUMN about_game text;
  END IF;
  
  -- Add minimum_specs column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'games' AND column_name = 'minimum_specs'
  ) THEN
    ALTER TABLE games ADD COLUMN minimum_specs jsonb;
  END IF;
  
  -- Add developer column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'games' AND column_name = 'developer'
  ) THEN
    ALTER TABLE games ADD COLUMN developer text;
  END IF;
  
  -- Add publisher column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'games' AND column_name = 'publisher'
  ) THEN
    ALTER TABLE games ADD COLUMN publisher text;
  END IF;
  
  -- Add release_date column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'games' AND column_name = 'release_date'
  ) THEN
    ALTER TABLE games ADD COLUMN release_date date;
  END IF;
END $$;

-- Update existing games with sample data
UPDATE games SET 
  platforms = ARRAY['PC', 'PS5'],
  about_game = 'Experience the ultimate gaming adventure with cutting-edge graphics, immersive gameplay, and an engaging storyline that will keep you hooked for hours. This game features advanced AI, realistic physics, and stunning visual effects that push the boundaries of modern gaming.',
  developer = 'KGR Studios',
  publisher = 'KGR Games',
  release_date = '2024-01-15',
  minimum_specs = '{
    "os": "Windows 10 64-bit",
    "processor": "Intel Core i5-8400 / AMD Ryzen 5 2600",
    "memory": "8 GB RAM",
    "graphics": "NVIDIA GTX 1060 6GB / AMD RX 580 8GB",
    "directx": "Version 12",
    "storage": "50 GB available space",
    "sound": "DirectX compatible"
  }'::jsonb
WHERE title = 'Cyber Nexus';

UPDATE games SET 
  platforms = ARRAY['PC', 'PS4', 'PS5'],
  about_game = 'Embark on an epic fantasy journey through magical kingdoms filled with ancient mysteries and powerful magic. Create your own character, choose your path, and shape the destiny of the realm through your choices and actions.',
  developer = 'Fantasy Works',
  publisher = 'KGR Games',
  release_date = '2023-11-20',
  minimum_specs = '{
    "os": "Windows 10 64-bit",
    "processor": "Intel Core i3-8100 / AMD Ryzen 3 2200G",
    "memory": "6 GB RAM",
    "graphics": "NVIDIA GTX 1050 Ti / AMD RX 570",
    "directx": "Version 11",
    "storage": "35 GB available space",
    "sound": "DirectX compatible"
  }'::jsonb
WHERE title = 'Mystic Realms';

UPDATE games SET 
  platforms = ARRAY['PC', 'PS5'],
  about_game = 'Feel the adrenaline rush of high-speed racing with the most realistic driving physics ever created. Race through iconic locations around the world, customize your dream cars, and compete against the best drivers in championship mode.',
  developer = 'Speed Dynamics',
  publisher = 'Racing Pro',
  release_date = '2024-03-10',
  minimum_specs = '{
    "os": "Windows 11 64-bit",
    "processor": "Intel Core i5-10400 / AMD Ryzen 5 3600",
    "memory": "12 GB RAM",
    "graphics": "NVIDIA RTX 3060 / AMD RX 6600 XT",
    "directx": "Version 12",
    "storage": "75 GB available space",
    "sound": "DirectX compatible"
  }'::jsonb
WHERE title = 'Speed Legends';

-- Update other games with basic platform info
UPDATE games SET 
  platforms = ARRAY['PC'],
  about_game = description,
  developer = 'Indie Developer',
  publisher = 'KGR Games',
  release_date = '2024-01-01'
WHERE platforms IS NULL;