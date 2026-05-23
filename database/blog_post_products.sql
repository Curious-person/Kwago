-- ============================================================
-- blog_post_products Junction Table Migration
-- Links blog posts to products in a many-to-many relationship
-- ============================================================

-- Step 1: Create junction table
CREATE TABLE IF NOT EXISTS public.blog_post_products (
  blog_post_id UUID NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  position INT NOT NULL DEFAULT 0,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (blog_post_id, product_id)
);

-- Step 2: Create indexes for query performance
CREATE INDEX IF NOT EXISTS idx_blog_post_products_blog_id
  ON public.blog_post_products(blog_post_id);

CREATE INDEX IF NOT EXISTS idx_blog_post_products_product_id
  ON public.blog_post_products(product_id);

CREATE INDEX IF NOT EXISTS idx_blog_post_products_featured
  ON public.blog_post_products(is_featured)
  WHERE is_featured = true;

-- Step 3: Enable Row Level Security
ALTER TABLE public.blog_post_products ENABLE ROW LEVEL SECURITY;

-- Step 4: Drop existing policies if they exist (for idempotency)
DROP POLICY IF EXISTS "Authors can manage product links for own posts" ON public.blog_post_products;
DROP POLICY IF EXISTS "Anyone can view featured products in published posts" ON public.blog_post_products;

-- Step 5: RLS Policy - Authors can manage links for their own blog posts
CREATE POLICY "Authors can manage product links for own posts"
  ON public.blog_post_products FOR ALL
  USING (
    blog_post_id IN (
      SELECT id FROM blog_posts WHERE author_id = auth.uid()
    )
  );

-- Step 6: RLS Policy - Public can view featured products in published posts
CREATE POLICY "Anyone can view featured products in published posts"
  ON public.blog_post_products FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM blog_posts
      WHERE id = blog_post_id AND status = 'Published'
    )
  );

-- Step 7: Verification
SELECT
  'blog_post_products table created successfully!' as status,
  COUNT(*) as column_count
FROM information_schema.columns
WHERE table_name = 'blog_post_products';
