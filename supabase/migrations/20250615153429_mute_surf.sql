/*
  # Fix infinite recursion in profiles RLS policy

  1. Problem
    - The "Admins can read all profiles" policy causes infinite recursion
    - It queries the profiles table within a policy that's already evaluating the profiles table
    - This prevents users from fetching their profile data

  2. Solution
    - Drop the problematic admin policy that causes recursion
    - Keep the simple "Users can read own profile" policy
    - Admin functionality can be handled at the application level after the user's profile is loaded
    - This ensures users can always fetch their own profile data without recursion

  3. Security
    - Users can still only read their own profile data
    - Admin checks can be performed in the application after profile data is loaded
    - RLS remains enabled for data protection
*/

-- Drop the problematic admin policy that causes infinite recursion
DROP POLICY IF EXISTS "Admins can read all profiles" ON profiles;

-- The "Users can read own profile" policy remains and works correctly
-- CREATE POLICY "Users can read own profile" ON profiles
--   FOR SELECT TO authenticated
--   USING (auth.uid() = id);

-- Note: Admin functionality should be handled at the application level
-- after the user's profile is successfully loaded