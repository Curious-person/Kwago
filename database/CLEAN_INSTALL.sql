-- ============================================
-- CLEAN INSTALL - Products Table
-- This will completely remove and recreate the products table
-- WARNING: This will delete all existing product data!
-- ============================================

-- Step 1: Drop everything related to products table
DROP TRIGGER IF EXISTS update_products_updated_at ON public.products;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;

-- Step 2: Create the products table fresh
CREATE TABLE public.products (
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

-- Step 3: Create indexes
CREATE INDEX idx_products_author_id ON public.products(author_id);
CREATE INDEX idx_products_category ON public.products(category);
CREATE INDEX idx_products_condition ON public.products(condition);
CREATE INDEX idx_products_created_at_desc ON public.products(created_at DESC);

-- Step 4: Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Step 5: Create RLS Policies
CREATE POLICY "Authors can view own products"
  ON public.products FOR SELECT
  USING (auth.uid() = author_id);

CREATE POLICY "Authors can create own products"
  ON public.products FOR INSERT
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update own products"
  ON public.products FOR UPDATE
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can delete own products"
  ON public.products FOR DELETE
  USING (auth.uid() = author_id);

-- Step 6: Create trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 7: Create trigger
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Verification: Check if table was created successfully
SELECT
  'Table created successfully!' as status,
  COUNT(*) as column_count
FROM information_schema.columns
WHERE table_name = 'products';
