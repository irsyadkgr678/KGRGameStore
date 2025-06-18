/*
  # Disable Email Confirmation and Reset Password

  1. Changes
    - Remove email confirmation requirement
    - Simplify user registration process
    - Update triggers to create profiles immediately
    - Remove reset password functionality

  2. Security
    - Users can register and login immediately without email confirmation
    - Profiles are created automatically upon registration
*/

-- Drop existing triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_confirmed ON auth.users;

-- Update the handle_new_user function to create profiles immediately
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Create profile immediately for all new users
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
    updated_at = now();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Remove the email confirmation handler (no longer needed)
DROP FUNCTION IF EXISTS handle_email_confirmation();

-- Create trigger for new user signup (immediate profile creation)
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Note: Email confirmation is now disabled in Supabase settings
-- Users can register and login immediately without email verification