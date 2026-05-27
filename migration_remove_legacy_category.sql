-- Final Migration: Remove legacy de-normalized category string
-- Objective: Standardize on Many-to-Many relational category system

-- 1. Data Migration (Best Effort)
-- Link any products that still rely on the legacy string field to their corresponding category records
-- if a category with that name exists in the categories table.
INSERT INTO public.product_categories (product_id, category_id)
SELECT p.id, c.id
FROM public.products p
JOIN public.categories c ON TRIM(LOWER(p.category)) = TRIM(LOWER(c.name))
ON CONFLICT (product_id, category_id) DO NOTHING;

-- 2. Clean Up Legacy Column
-- Drop the de-normalized string column from the products table
ALTER TABLE public.products DROP COLUMN IF EXISTS category;
