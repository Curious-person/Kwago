-- ============================================
-- DIAGNOSTIC QUERIES
-- Run these to understand what's happening
-- ============================================

-- Query 1: Check if products table already exists (even partially)
SELECT EXISTS (
  SELECT FROM information_schema.tables
  WHERE table_schema = 'public'
  AND table_name = 'products'
) as products_table_exists;
-- If this returns TRUE, the table exists (maybe broken)
-- If FALSE, the table doesn't exist yet

-- Query 2: If table exists, check what columns it has
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'products'
ORDER BY ordinal_position;
-- This will show what columns exist (if any)

-- Query 3: Check if auth.users table exists (should be true in Supabase)
SELECT EXISTS (
  SELECT FROM information_schema.tables
  WHERE table_schema = 'auth'
  AND table_name = 'users'
) as auth_users_exists;
-- Should return TRUE

-- Query 4: Check for any existing policies on products table
SELECT policyname, cmd
FROM pg_policies
WHERE tablename = 'products';
-- Shows any existing policies

-- Query 5: Check if there are any foreign key constraints
SELECT
  tc.constraint_name,
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.table_name = 'products' AND tc.constraint_type = 'FOREIGN KEY';
-- Shows foreign key constraints
