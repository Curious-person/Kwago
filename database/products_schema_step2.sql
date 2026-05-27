-- ============================================
-- STEP 2: Create indexes
-- Only run this AFTER Step 1 succeeds
-- ============================================

CREATE INDEX IF NOT EXISTS idx_products_author_id ON public.products(author_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_condition ON public.products(condition);
CREATE INDEX IF NOT EXISTS idx_products_created_at_desc ON public.products(created_at DESC);
