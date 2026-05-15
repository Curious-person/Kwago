-- Migration: Replace category_ids array with a proper product_categories junction table

-- 1. Create the junction table
CREATE TABLE IF NOT EXISTS public.product_categories (
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    
    -- Composite primary key ensures a product can't have the exact same category twice
    PRIMARY KEY (product_id, category_id) 
);

-- 2. Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_pc_product_id ON public.product_categories(product_id);
CREATE INDEX IF NOT EXISTS idx_pc_category_id ON public.product_categories(category_id);

-- 3. Enable RLS on the new table
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies for product_categories
-- Allow public read access to category links
CREATE POLICY "Product categories are viewable by everyone" 
    ON public.product_categories FOR SELECT 
    USING (true);

-- Allow authors to manage categories for their own products
-- This requires a join to the products table to check ownership
CREATE POLICY "Authors can insert product categories for their products" 
    ON public.product_categories FOR INSERT 
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.products p 
            WHERE p.id = product_id AND p.author_id = auth.uid()
        )
    );

CREATE POLICY "Authors can delete product categories for their products" 
    ON public.product_categories FOR DELETE 
    USING (
        EXISTS (
            SELECT 1 FROM public.products p 
            WHERE p.id = product_id AND p.author_id = auth.uid()
        )
    );

-- 5. Remove the temporary array column we added earlier
ALTER TABLE public.products 
DROP COLUMN IF EXISTS category_ids;

-- 6. Add a trigger to update 'updated_at' on products when categories change (Optional but good practice)
-- (Omitted for simplicity, but could be added later)
