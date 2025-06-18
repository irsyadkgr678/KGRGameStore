/*
  # Add Xbox platforms to existing games

  1. Updates
    - Add Xbox One and Xbox Series S/X to some existing games
    - Diversify platform availability across the game library
    - Ensure realistic platform combinations

  2. Changes
    - Update selected games to include Xbox platforms
    - Maintain existing PC and PlayStation platforms
    - Create varied platform availability
*/

-- Update some games to include Xbox platforms
UPDATE games SET platforms = ARRAY['PC', 'PS5', 'Xbox Series S/X'] WHERE title = 'Cyber Nexus 2077';
UPDATE games SET platforms = ARRAY['PC', 'PS4', 'PS5', 'Xbox One', 'Xbox Series S/X'] WHERE title = 'Mystic Realms Online';
UPDATE games SET platforms = ARRAY['PC', 'PS5', 'Xbox Series S/X'] WHERE title = 'Speed Legends Championship';
UPDATE games SET platforms = ARRAY['PC', 'PS4', 'PS5', 'Xbox One', 'Xbox Series S/X'] WHERE title = 'Battle Royale Legends';
UPDATE games SET platforms = ARRAY['PC', 'Xbox One', 'Xbox Series S/X'] WHERE title = 'Galactic Empire Builder';
UPDATE games SET platforms = ARRAY['PC', 'PS4', 'PS5', 'Xbox One', 'Xbox Series S/X'] WHERE title = 'Retro Fighter Arena';
UPDATE games SET platforms = ARRAY['PC', 'PS5', 'Xbox Series S/X'] WHERE title = 'Horror Mansion: Nightmare';
UPDATE games SET platforms = ARRAY['PC', 'PS5', 'Xbox Series S/X'] WHERE title = 'Space Shooter Elite';
UPDATE games SET platforms = ARRAY['PC', 'PS4', 'PS5', 'Xbox One', 'Xbox Series S/X'] WHERE title = 'Football Manager 2024';
UPDATE games SET platforms = ARRAY['PC', 'PS4', 'Xbox One'] WHERE title = 'Medieval Conquest Wars';