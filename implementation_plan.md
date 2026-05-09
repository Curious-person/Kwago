IMPORTANT: Before doing anything, note these confirmed table names from seed_data.sql:
- Blog posts table is: blog_posts (NOT posts)
- Products table is: products
- Profiles table is: profiles
- Comments table is: comments

Use blog_posts everywhere the previous prompt says posts.
This affects all SELECT queries, JOINs, revalidatePath() calls,
RLS policy references, and Server Actions.

You are working on Kwago. Read GEMINI.md, DESIGN.md, and AGENTS.md before doing anything.

The RBAC system, dashboard scaffold, AI moderation pipeline, and auth pages are
all in place. The Supabase DB has been seeded with seed_data.sql.

Your task is to replace ALL static/mock data across the dashboard with real
Supabase queries. Do not change any UI layout, styling, or design — only
replace the data layer.

The split Supabase client convention is already in place:
- lib/supabase/client.ts — browser client
- lib/supabase/server.ts — server client (use this for all Server Components)
- lib/auth.ts — getCurrentUser(), getUserProfile(), requireRole()

---

PART A — Author: Posts List
File: app/dashboard/author/posts/page.tsx

Replace static post data with a real Supabase query:
1. Call requireRole(['author', 'admin']) at the top
2. Get the current user via getCurrentUser()
3. Query the blog_posts table:
   - Select: id, title, status, ai_moderation_passed, ai_moderation_reason,
     submitted_at, created_at, updated_at
   - Filter: author_id = current user's id
   - Order: updated_at DESC
4. Pass the result directly into the existing table UI — do not change
   the UI structure, only replace the data source
5. If the query returns an empty array, show an empty state:
   - Centered text: "No posts yet."
   - A "Create your first post" button linking to /dashboard/author/posts/new
   - Styled with zinc-400 text, no shadow

---

PART B — Author: Products List
File: app/dashboard/author/products/page.tsx

Replace static product data with a real Supabase query:
1. Call requireRole(['author', 'admin']) at the top
2. Get the current user via getCurrentUser()
3. Query the products table:
   - Select: id, name, price, condition, status, created_at, updated_at
   - Filter: uploader_id = current user's id
   - Order: updated_at DESC
4. Pass the result directly into the existing table UI
5. If empty, show:
   - Centered text: "No products listed yet."
   - A "Add your first product" button linking to /dashboard/author/products/new
   - Styled with zinc-400 text, no shadow

---

PART C — Admin: Comments Queue
File: app/dashboard/admin/comments/page.tsx

Replace static comment data with a real Supabase query:
1. Call requireRole(['admin']) at the top
2. Query the comments table with a join:
   SELECT
     comments.id,
     comments.content,
     comments.status,
     comments.created_at,
     profiles.display_name as author_name,
     blog_posts.title as post_title
   FROM comments
   LEFT JOIN profiles ON comments.user_id = profiles.id
   LEFT JOIN blog_posts ON comments.post_id = blog_posts.id
   ORDER BY comments.created_at DESC
3. The existing filter tabs (All / Pending / Approved / Rejected) should filter
   this dataset client-side using Zustand or local useState — do not make
   separate queries per tab
4. Pass the count of pending comments to the "Pending" tab badge
5. Pass the result into the existing table UI — do not change the UI

---

PART D — Admin: Content Moderation Queue
File: app/dashboard/admin/content/page.tsx

Replace static post data with real Supabase queries:
1. Call requireRole(['admin']) at the top
2. Fetch ALL posts across all authors with a join:
   SELECT
     blog_posts.id,
     blog_posts.title,
     blog_posts.status,
     blog_posts.ai_moderation_passed,
     blog_posts.ai_moderation_reason,
     blog_posts.submitted_at,
     blog_posts.admin_review_note,
     profiles.display_name as author_name
   FROM blog_posts
   LEFT JOIN profiles ON blog_posts.author_id = profiles.id
   ORDER BY blog_posts.submitted_at DESC NULLS LAST
3. The existing tab sections (Pending Review / AI Flagged / All Posts) filter
   this dataset client-side — no separate queries per tab:
   - Pending Review: status = 'pending_review'
   - AI Flagged: status = 'ai_rejected'
   - All Posts: no filter
4. Pass the result into the existing table UI — do not change the UI

---

PART E — Admin: Users List
File: app/dashboard/admin/users/page.tsx

Replace static user data with a real Supabase query:
1. Call requireRole(['admin']) at the top
2. Query the profiles table:
   SELECT id, email, display_name, role, avatar_url, created_at
   FROM profiles
   ORDER BY created_at DESC
3. Render a table with columns:
   User | Email | Role | Joined | Actions
4. Actions column: a role selector (dropdown or segmented control) with
   values member / author / admin. On change, call a Server Action that
   updates the role in the profiles table.
5. Create that Server Action in lib/actions/users.ts:

   updateUserRole(userId: string, newRole: UserRole):
     Promise<{ success: boolean, error?: string }>
   - requireRole(['admin']) first
   - Prevent an admin from changing their own role
   - Update profiles set role = newRole where id = userId
   - Return { success: true } or { success: false, error: reason }

6. On successful role change, revalidate the page using revalidatePath()
   from next/cache so the table reflects the update without a manual refresh
7. If a role change fails, show an inline error beside that user row

---

PART F — Shared: revalidation after mutations

For every existing Server Action in lib/actions/posts.ts and
lib/actions/comments.ts, add revalidatePath() calls after successful
Supabase mutations so dashboard pages stay in sync:

- approvePost / rejectPost / overrideAIAndApprove:
  revalidatePath('/dashboard/admin/content')
  revalidatePath('/dashboard/author/posts')

- approveComment / rejectComment / deleteComment:
  revalidatePath('/dashboard/admin/comments')

- submitPostForReview:
  revalidatePath('/dashboard/author/posts')

---

PART G — Error handling convention

For every Supabase query added in this prompt, follow this pattern:
1. Destructure { data, error } from the Supabase call
2. If error is not null, log it to console.error and render a simple
   error state in the UI:
   - Centered text: "Failed to load data. Please refresh."
   - zinc-400 text, no shadow, no border
3. Never throw — always handle gracefully in the UI

---

Constraints:
- Use the server Supabase client for ALL queries in Server Components
- Use the browser Supabase client only if a Client Component strictly
  needs to re-fetch after a user interaction
- No static or mock data should remain anywhere in the dashboard after this
- Do not change any UI layout, component structure, or styling
- No any types — use the existing types from types/index.ts

After making all changes, show me:
1. Final content of app/dashboard/author/posts/page.tsx
2. Final content of app/dashboard/author/products/page.tsx
3. Final content of app/dashboard/admin/comments/page.tsx
4. Final content of app/dashboard/admin/content/page.tsx
5. Final content of app/dashboard/admin/users/page.tsx
6. Final content of lib/actions/users.ts
7. The list of revalidatePath() calls added to lib/actions/posts.ts
   and lib/actions/comments.ts
