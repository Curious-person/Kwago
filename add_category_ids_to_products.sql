-- Migration: Add category_ids to products table
-- To support multiple category selection for products

ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS category_ids UUID[] DEFAULT '{}';

-- Optional: Create a GIN index for faster array searches
CREATE INDEX IF NOT EXISTS idx_products_category_ids ON public.products USING GIN (category_ids);

-- Update RLS if needed (usually not needed for just adding a column)
-- The existing RLS on products should cover this new column.
