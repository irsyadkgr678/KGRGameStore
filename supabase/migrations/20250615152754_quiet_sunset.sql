/*
  # Insert sample data

  1. Sample Games
    - Various genres and price points
    - Some free games and discounted games
    - Realistic game data for testing

  2. Notes
    - Uses placeholder images from a reliable source
    - Covers different game categories
    - Includes both free and paid games with various discount scenarios
*/

-- Insert sample games
INSERT INTO games (title, description, price, discount_percentage, discount_amount, is_free, genre, image_url) VALUES
  (
    'Cyber Nexus',
    'A futuristic cyberpunk adventure where you navigate through neon-lit cities and uncover corporate conspiracies. Features stunning visuals and immersive gameplay.',
    59.99,
    25,
    NULL,
    false,
    'Action',
    'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg'
  ),
  (
    'Mystic Realms',
    'Embark on an epic fantasy journey through magical kingdoms. Cast spells, battle mythical creatures, and forge your destiny in this open-world RPG.',
    49.99,
    NULL,
    NULL,
    false,
    'RPG',
    'https://images.pexels.com/photos/1174732/pexels-photo-1174732.jpeg'
  ),
  (
    'Speed Legends',
    'High-octane racing game featuring exotic cars and challenging tracks around the world. Customize your vehicles and compete in championship races.',
    39.99,
    NULL,
    10.00,
    false,
    'Racing',
    'https://images.pexels.com/photos/544966/pexels-photo-544966.jpeg'
  ),
  (
    'Puzzle Master',
    'Challenge your mind with hundreds of brain-teasing puzzles. Perfect for casual gaming sessions with progressively difficult levels.',
    0,
    NULL,
    NULL,
    true,
    'Puzzle',
    'https://images.pexels.com/photos/1040157/pexels-photo-1040157.jpeg'
  ),
  (
    'Space Odyssey',
    'Explore the vast cosmos in this space simulation game. Build your fleet, discover new planets, and engage in epic space battles.',
    69.99,
    15,
    NULL,
    false,
    'Simulation',
    'https://images.pexels.com/photos/586063/pexels-photo-586063.jpeg'
  ),
  (
    'Retro Arcade Collection',
    'A nostalgic collection of classic arcade games reimagined for modern platforms. Includes 50+ games with updated graphics and sound.',
    0,
    NULL,
    NULL,
    true,
    'Arcade',
    'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg'
  ),
  (
    'Tactical Strike',
    'Strategic military simulation where every decision matters. Command your troops, manage resources, and outmaneuver your enemies.',
    44.99,
    30,
    NULL,
    false,
    'Strategy',
    'https://images.pexels.com/photos/1174732/pexels-photo-1174732.jpeg'
  ),
  (
    'Horror Mansion',
    'Survive the night in this spine-chilling horror adventure. Solve puzzles, avoid terrifying creatures, and uncover the mansion''s dark secrets.',
    29.99,
    NULL,
    5.00,
    false,
    'Horror',
    'https://images.pexels.com/photos/544966/pexels-photo-544966.jpeg'
  ),
  (
    'Indie Platformer',
    'A charming 2D platformer with hand-drawn art and memorable characters. Jump, run, and explore beautifully crafted levels.',
    0,
    NULL,
    NULL,
    true,
    'Platformer',
    'https://images.pexels.com/photos/1040157/pexels-photo-1040157.jpeg'
  ),
  (
    'Battle Royale Arena',
    'Drop into intense multiplayer battles with up to 100 players. Scavenge for weapons, build fortifications, and be the last one standing.',
    0,
    NULL,
    NULL,
    true,
    'Battle Royale',
    'https://images.pexels.com/photos/586063/pexels-photo-586063.jpeg'
  ),
  (
    'City Builder Pro',
    'Design and manage your dream city. Balance resources, keep citizens happy, and create a thriving metropolis in this detailed simulation.',
    54.99,
    20,
    NULL,
    false,
    'Simulation',
    'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg'
  ),
  (
    'Medieval Conquest',
    'Lead your kingdom to glory in this medieval strategy game. Build castles, train armies, and conquer neighboring lands.',
    34.99,
    NULL,
    NULL,
    false,
    'Strategy',
    'https://images.pexels.com/photos/1174732/pexels-photo-1174732.jpeg'
  );