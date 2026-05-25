-- ============================================================
-- SQL Migration: Add Admin RLS Policies to blog_posts Table
-- Allows users with role 'admin' to view and update draft posts.
-- ============================================================

-- 1. Check if SELECT policy for admins already exists, drop it to be safe
DROP POLICY IF EXISTS "Admins can view all posts" ON public.blog_posts;

-- 2. Create SELECT policy for admins
CREATE POLICY "Admins can view all posts"
  ON public.blog_posts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 3. Check if UPDATE policy for admins already exists, drop it to be safe
DROP POLICY IF EXISTS "Admins can update all posts" ON public.blog_posts;

-- 4. Create UPDATE policy for admins
CREATE POLICY "Admins can update all posts"
  ON public.blog_posts FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
