-- Verification Queries for Products Table
-- Run these queries one by one to verify the products table is set up correctly

-- Query 1: Check if table exists
SELECT
  tablename,
  schemaname,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE tablename = 'products';
-- Expected: 1 row with rls_enabled = true

-- Query 2: Check all columns
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'products'
ORDER BY ordinal_position;
-- Expected: 10 columns (id, name, price, condition, image, category, description, author_id, created_at, updated_at)

-- Query 3: Check RLS policies
SELECT
  policyname,
  cmd as operation,
  qual as using_expression,
  with_check as with_check_expression
FROM pg_policies
WHERE tablename = 'products';
-- Expected: 4 policies (SELECT, INSERT, UPDATE, DELETE)

-- Query 4: Check indexes
SELECT
  indexname,
  indexdef
FROM pg_indexes
WHERE tablename = 'products';
-- Expected: 5 indexes (primary key + 4 performance indexes)

-- Query 5: Check triggers
SELECT
  trigger_name,
  event_manipulation,
  action_statement
FROM information_schema.triggers
WHERE event_object_table = 'products';
-- Expected: 1 trigger (update_products_updated_at)

-- Query 6: Test read (should return empty result, no error)
SELECT * FROM public.products LIMIT 1;
-- Expected: No error (empty result is OK)

-- Query 7: Check if you can insert (will fail if not logged in)
-- DO NOT RUN THIS - just for reference
-- INSERT INTO public.products (name, price, condition, image, category, author_id)
-- VALUES ('Test', 9.99, 'New', 'https://via.placeholder.com/400', 'Test', auth.uid());
