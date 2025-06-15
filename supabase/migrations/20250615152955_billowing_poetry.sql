/*
  # Create Admin Account Setup

  1. Admin Account Creation
    - Creates a function to promote users to admin
    - Provides instructions for manual admin setup
  
  2. Security
    - Only existing admins can promote other users
    - First admin must be created manually via SQL
*/

-- Function to promote a user to admin (can only be called by existing admins)
CREATE OR REPLACE FUNCTION promote_to_admin(user_email text)
RETURNS void AS $$
BEGIN
  -- Check if the current user is an admin
  IF NOT EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND is_admin = true
  ) THEN
    RAISE EXCEPTION 'Only admins can promote users to admin';
  END IF;
  
  -- Promote the user
  UPDATE profiles 
  SET is_admin = true, updated_at = now()
  WHERE email = user_email;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User with email % not found', user_email;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to demote an admin (can only be called by existing admins)
CREATE OR REPLACE FUNCTION demote_from_admin(user_email text)
RETURNS void AS $$
BEGIN
  -- Check if the current user is an admin
  IF NOT EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND is_admin = true
  ) THEN
    RAISE EXCEPTION 'Only admins can demote users from admin';
  END IF;
  
  -- Prevent self-demotion
  IF EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND email = user_email
  ) THEN
    RAISE EXCEPTION 'You cannot demote yourself from admin';
  END IF;
  
  -- Demote the user
  UPDATE profiles 
  SET is_admin = false, updated_at = now()
  WHERE email = user_email;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User with email % not found', user_email;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to automatically create profile when user signs up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

/*
  MANUAL SETUP INSTRUCTIONS:
  
  1. First, register a regular account through your website
  2. Then run this SQL command to make yourself admin:
  
  UPDATE profiles 
  SET is_admin = true 
  WHERE email = 'your-email@example.com';
  
  3. After that, you can use the admin panel to manage games and promote other users
*/