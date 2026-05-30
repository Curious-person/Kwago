-- ============================================================
-- Migration: Add blog post admin review cycle
-- Adds new status values and rejection_remarks column
-- ============================================================

-- Step 1: Drop the existing CHECK constraint on status
ALTER TABLE public.blog_posts
  DROP CONSTRAINT IF EXISTS blog_posts_status_check;

-- Step 2: Re-add the CHECK constraint with new status values
--   Draft          → initial state after author submits
--   admin_pending  → submitted, waiting for admin review (no AI step)
--   ai_approved    → passed AI moderation, waiting for admin sign-off
--   Published      → admin approved → visible on homepage
--   Rejected       → admin rejected with remarks
ALTER TABLE public.blog_posts
  ADD CONSTRAINT blog_posts_status_check
  CHECK (status IN ('Draft', 'admin_pending', 'ai_approved', 'Published', 'Rejected'));

-- Step 3: Add rejection_remarks column to store admin feedback
ALTER TABLE public.blog_posts
  ADD COLUMN IF NOT EXISTS rejection_remarks TEXT;

-- Step 4: Add an RLS policy so admins can read ALL posts regardless of status
--   (The existing policy only exposes 'Published' posts to the public)
--   Admin role check via get_my_role() helper (already used elsewhere in this DB)
DROP POLICY IF EXISTS "Admins can view all posts" ON public.blog_posts;
CREATE POLICY "Admins can view all posts"
  ON public.blog_posts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Step 5: Admins can update any post (needed for approve/reject)
DROP POLICY IF EXISTS "Admins can update any post" ON public.blog_posts;
CREATE POLICY "Admins can update any post"
  ON public.blog_posts FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Step 6: Verify
SELECT
  c.column_name,
  c.data_type,
  c.column_default,
  c.is_nullable
FROM information_schema.columns c
WHERE c.table_schema = 'public'
  AND c.table_name   = 'blog_posts'
ORDER BY c.ordinal_position;
