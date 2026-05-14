-- Database Indexes for User Management System
-- Optimizes queries on the profiles table for filtering, sorting, and searching

-- Index on role column for role-based filtering
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- Index on status column for status-based filtering
CREATE INDEX IF NOT EXISTS idx_profiles_status ON public.profiles(status);

-- Index on created_at DESC for sorting by join date (descending is most common)
CREATE INDEX IF NOT EXISTS idx_profiles_created_at_desc ON public.profiles(created_at DESC);

-- Index on email for email-based search and lookups
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- Index on display_name for name-based search (using gin for ILIKE queries)
CREATE INDEX IF NOT EXISTS idx_profiles_display_name_gin ON public.profiles USING gin(display_name gin_trgm_ops);

-- Composite index on (role, status) for combined filtering
CREATE INDEX IF NOT EXISTS idx_profiles_role_status ON public.profiles(role, status);

-- Composite index on (role, created_at DESC) for role filtering + sorting
CREATE INDEX IF NOT EXISTS idx_profiles_role_created_at ON public.profiles(role, created_at DESC);

-- Note: The gin_trgm_ops requires the pg_trgm extension to be enabled
-- Run this if not already enabled:
-- CREATE EXTENSION IF NOT EXISTS pg_trgm;
