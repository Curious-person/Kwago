-- ============================================
-- STEP 3: Enable RLS and create policies
-- Only run this AFTER Step 2 succeeds
-- ============================================

-- Enable Row Level Security
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Authors can view own products" ON public.products;
DROP POLICY IF EXISTS "Authors can create own products" ON public.products;
DROP POLICY IF EXISTS "Authors can update own products" ON public.products;
DROP POLICY IF EXISTS "Authors can delete own products" ON public.products;

-- Create RLS Policies
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
