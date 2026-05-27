-- ============================================
-- STEP 1: Create the products table
-- Run this first, then verify it worked before continuing
-- ============================================

CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  condition TEXT NOT NULL CHECK (condition IN ('New', 'Used')),
  image TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- After running this, verify the table exists by going to Table Editor
-- You should see "products" table listed
-- If you get an error here, STOP and share the error message
