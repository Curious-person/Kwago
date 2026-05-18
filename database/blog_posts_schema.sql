-- ============================================================
-- blog_posts table migration
-- Drops any stale version and recreates with correct FK target
-- ============================================================

-- Step 1: Drop legacy table if it exists
DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON public.blog_posts;
DROP TABLE IF EXISTS public.blog_posts CASCADE;

-- Step 2: Create blog_posts referencing public.profiles (NOT auth.users)
--
-- WHY public.profiles and not auth.users?
--   PostgREST resolves FK joins only within the public schema.
--   auth.users is an internal Supabase table invisible to the schema cache.
--   public.profiles is a mirror of auth.users maintained by the handle_new_user
--   trigger, and is the correct join target for PostgREST relational queries.
--
CREATE TABLE public.blog_posts (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT        NOT NULL CHECK (char_length(title) BETWEEN 1 AND 255),
  slug        TEXT        NOT NULL UNIQUE CHECK (char_length(slug) BETWEEN 1 AND 255),
  category    TEXT        NOT NULL,
  image       TEXT        NOT NULL,
  read_time   TEXT        NOT NULL DEFAULT '5 min read',
  status      TEXT        NOT NULL DEFAULT 'Draft' CHECK (status IN ('Draft', 'Published')),
  blocks      JSONB       NOT NULL DEFAULT '[]'::jsonb,
  author_id   UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Step 3: Indexes
CREATE INDEX idx_blog_posts_author_id      ON public.blog_posts(author_id);
CREATE INDEX idx_blog_posts_status         ON public.blog_posts(status);
CREATE INDEX idx_blog_posts_created_at     ON public.blog_posts(created_at DESC);

-- Step 4: Enable RLS
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Step 5: RLS Policies
-- Anyone can read published posts (for the public blog page)
CREATE POLICY "Anyone can view published posts"
  ON public.blog_posts FOR SELECT
  USING (status = 'Published');

-- Authors can read their own posts in any status
CREATE POLICY "Authors can view own posts"
  ON public.blog_posts FOR SELECT
  USING (auth.uid() = author_id);

-- Authors can create posts only with their own ID
CREATE POLICY "Authors can create own posts"
  ON public.blog_posts FOR INSERT
  WITH CHECK (auth.uid() = author_id);

-- Authors can update only their own posts
CREATE POLICY "Authors can update own posts"
  ON public.blog_posts FOR UPDATE
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

-- Authors can delete only their own posts
CREATE POLICY "Authors can delete own posts"
  ON public.blog_posts FOR DELETE
  USING (auth.uid() = author_id);

-- Step 6: updated_at auto-refresh trigger
--   update_updated_at_column() already exists from CLEAN_INSTALL.sql
CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Step 7: Verify
SELECT
  c.column_name,
  c.data_type,
  c.is_nullable,
  c.column_default
FROM information_schema.columns c
WHERE c.table_schema = 'public'
  AND c.table_name   = 'blog_posts'
ORDER BY c.ordinal_position;
