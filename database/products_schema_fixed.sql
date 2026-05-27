-- Products Table Schema (Fixed Version)
-- This schema supports the product management system with Supabase integration
-- Author: Product Supabase Integration Spec
-- Date: 2026-05-14

-- Step 1: Drop existing objects if they exist (for clean reinstall)
DROP TRIGGER IF EXISTS update_products_updated_at ON public.products;
DROP FUNCTION IF EXISTS update_updated_at_column();
DROP TABLE IF EXISTS public.products CASCADE;

-- Step 2: Create products table
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

-- Step 3: Create indexes for performance
CREATE INDEX idx_products_author_id ON public.products(author_id);
CREATE INDEX idx_products_category ON public.products(category);
CREATE INDEX idx_products_condition ON public.products(condition);
CREATE INDEX idx_products_created_at_desc ON public.products(created_at DESC);

-- Step 4: Enable Row Level Security
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Step 5: Create RLS Policies
-- Policy: Authors can read their own products
CREATE POLICY "Authors can view own products"
  ON public.products FOR SELECT
  USING (auth.uid() = author_id);

-- Policy: Authors can insert their own products
CREATE POLICY "Authors can create own products"
  ON public.products FOR INSERT
  WITH CHECK (auth.uid() = author_id);

-- Policy: Authors can update their own products
CREATE POLICY "Authors can update own products"
  ON public.products FOR UPDATE
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

-- Policy: Authors can delete their own products
CREATE POLICY "Authors can delete own products"
  ON public.products FOR DELETE
  USING (auth.uid() = author_id);

-- Step 6: Create function for automatic updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 7: Create trigger to automatically update updated_at on row updates
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Verification query (optional - run separately to verify)
-- SELECT
--   tablename,
--   schemaname,
--   rowsecurity as rls_enabled
-- FROM pg_tables
-- WHERE tablename = 'products';

-- Check policies (optional - run separately to verify)
-- SELECT
--   policyname,
--   cmd,
--   qual,
--   with_check
-- FROM pg_policies
-- WHERE tablename = 'products';
