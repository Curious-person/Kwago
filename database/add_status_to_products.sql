-- Migration: Add status column to products table
ALTER TABLE public.products ADD COLUMN status text DEFAULT 'Draft';
