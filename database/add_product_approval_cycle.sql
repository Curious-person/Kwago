-- ============================================================
-- Add Product Approval Cycle Status and RLS Policies
-- ============================================================

-- 1. Modify the status column to enforce the approval cycle states
ALTER TABLE public.products DROP CONSTRAINT IF EXISTS products_status_check;

-- Provide a default if the column exists but is empty, or add the column if missing
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'status') THEN
        ALTER TABLE public.products ADD COLUMN status text DEFAULT 'pending_ai';
    END IF;
END $$;

-- Update any existing non-compliant rows (e.g., 'Draft' from previous phase) to 'pending_ai'
UPDATE public.products 
SET status = 'pending_ai' 
WHERE status NOT IN ('pending_ai', 'ai-approved', 'ai-declined', 'for-posting', 'reject');

-- Add the check constraint for the approval cycle states
ALTER TABLE public.products ADD CONSTRAINT products_status_check 
    CHECK (status IN ('pending_ai', 'ai-approved', 'ai-declined', 'for-posting', 'reject'));

-- Set default to pending_ai
ALTER TABLE public.products ALTER COLUMN status SET DEFAULT 'pending_ai';


-- 2. Drop existing RLS policies on the products table
DROP POLICY IF EXISTS "Authors can view own products" ON public.products;
DROP POLICY IF EXISTS "Authors can create own products" ON public.products;
DROP POLICY IF EXISTS "Authors can update own products" ON public.products;
DROP POLICY IF EXISTS "Authors can delete own products" ON public.products;
DROP POLICY IF EXISTS "Admins can view ai-approved products" ON public.products;
DROP POLICY IF EXISTS "Admins can update ai-approved products" ON public.products;
DROP POLICY IF EXISTS "Anyone can view for-posting products" ON public.products;

-- 3. Create NEW RLS Policies

-- A. SELECT (Read) Policies
-- Author can always read their own products
CREATE POLICY "Authors can view own products"
  ON public.products FOR SELECT
  USING (auth.uid() = author_id);

-- Admins can view products that are pending admin approval (ai-approved)
CREATE POLICY "Admins can view ai-approved products"
  ON public.products FOR SELECT
  USING (
    status = 'ai-approved' AND 
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Public can view products that have been approved by admin
CREATE POLICY "Anyone can view for-posting products"
  ON public.products FOR SELECT
  USING (status = 'for-posting');

-- B. INSERT Policy
CREATE POLICY "Authors can create own products"
  ON public.products FOR INSERT
  WITH CHECK (auth.uid() = author_id);

-- C. UPDATE Policies
-- Authors can update their own products
CREATE POLICY "Authors can update own products"
  ON public.products FOR UPDATE
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

-- Admins can update products that are ai-approved (to approve or reject them)
CREATE POLICY "Admins can update ai-approved products"
  ON public.products FOR UPDATE
  USING (
    status = 'ai-approved' AND 
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- D. DELETE Policy
CREATE POLICY "Authors can delete own products"
  ON public.products FOR DELETE
  USING (auth.uid() = author_id);
