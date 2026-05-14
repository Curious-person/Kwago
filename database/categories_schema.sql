-- Categories Table Schema
-- This schema supports the category management system with Supabase integration
-- Author: Category Management Spec
-- Date: 2026-05-14

-- Create categories table
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL CHECK (length(name) > 0 AND length(name) <= 100),
  description TEXT CHECK (length(description) <= 500),
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_categories_author_id ON public.categories(author_id);
CREATE INDEX IF NOT EXISTS idx_categories_created_at_desc ON public.categories(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for idempotency)
DROP POLICY IF EXISTS "Authors can view own categories" ON public.categories;
DROP POLICY IF EXISTS "Authors can create own categories" ON public.categories;
DROP POLICY IF EXISTS "Authors can update own categories" ON public.categories;
DROP POLICY IF EXISTS "Authors can delete own categories" ON public.categories;

-- RLS Policy: Authors can read their own categories
CREATE POLICY "Authors can view own categories"
  ON public.categories FOR SELECT
  USING (auth.uid() = author_id);

-- RLS Policy: Authors can insert their own categories
CREATE POLICY "Authors can create own categories"
  ON public.categories FOR INSERT
  WITH CHECK (auth.uid() = author_id);

-- RLS Policy: Authors can update their own categories
CREATE POLICY "Authors can update own categories"
  ON public.categories FOR UPDATE
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

-- RLS Policy: Authors can delete their own categories
CREATE POLICY "Authors can delete own categories"
  ON public.categories FOR DELETE
  USING (auth.uid() = author_id);

-- Function for automatic updated_at timestamp
CREATE OR REPLACE FUNCTION update_categories_updated_at_column()
RETURNS TRIGGER AS $
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists (for idempotency)
DROP TRIGGER IF EXISTS update_categories_updated_at ON public.categories;

-- Trigger to automatically update updated_at on row updates
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW
  EXECUTE FUNCTION update_categories_updated_at_column();
