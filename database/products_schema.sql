-- Products Table Schema
-- This schema supports the product management system with Supabase integration
-- Author: Product Supabase Integration Spec
-- Date: 2026-05-14

-- Create products table
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

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_author_id ON public.products(author_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_condition ON public.products(condition);
CREATE INDEX IF NOT EXISTS idx_products_created_at_desc ON public.products(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for idempotency)
DROP POLICY IF EXISTS "Authors can view own products" ON public.products;
DROP POLICY IF EXISTS "Authors can create own products" ON public.products;
DROP POLICY IF EXISTS "Authors can update own products" ON public.products;
DROP POLICY IF EXISTS "Authors can delete own products" ON public.products;

-- RLS Policy: Authors can read their own products
CREATE POLICY "Authors can view own products"
  ON public.products FOR SELECT
  USING (auth.uid() = author_id);

-- RLS Policy: Authors can insert their own products
CREATE POLICY "Authors can create own products"
  ON public.products FOR INSERT
  WITH CHECK (auth.uid() = author_id);

-- RLS Policy: Authors can update their own products
CREATE POLICY "Authors can update own products"
  ON public.products FOR UPDATE
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

-- RLS Policy: Authors can delete their own products
CREATE POLICY "Authors can delete own products"
  ON public.products FOR DELETE
  USING (auth.uid() = author_id);

-- Function for automatic updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists (for idempotency)
DROP TRIGGER IF EXISTS update_products_updated_at ON public.products;

-- Trigger to automatically update updated_at on row updates
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Sample data for testing (optional - comment out for production)
-- INSERT INTO public.products (name, price, condition, image, category, description, author_id)
-- VALUES
--   ('Marvel Legends Series Iron Man Mark LXXXV', 24.99, 'New', 'https://images.unsplash.com/photo-1531279554141-7dfdb443c375?q=80&w=800&auto=format&fit=crop', 'Marvel Legends', 'Highly detailed action figure', auth.uid()),
--   ('The Lord of the Rings: Witch-King of Angmar Statue', 499.00, 'New', 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=800&auto=format&fit=crop', 'Weta Workshop', 'Premium collectible statue', auth.uid());
