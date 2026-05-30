# Troubleshooting Product Creation 400 Error

## Issue

Getting a 400 error when trying to create a product: `Failed to load resource: the server responded with a status of 400`

## Most Common Causes

### 1. Products Table Doesn't Exist

**Symptom:** 400 error with message about table not found

**Solution:** Run the database schema in Supabase

1. Go to your Supabase Dashboard
2. Navigate to SQL Editor
3. Open and run the file: `database/products_schema.sql`
4. Verify the table was created by checking the Table Editor

### 2. RLS Policies Not Configured

**Symptom:** 400 error or permission denied

**Solution:** The schema includes RLS policies, but verify they're active:

1. Go to Supabase Dashboard → Authentication → Policies
2. Check that these policies exist for `products` table:
   - "Authors can view own products" (SELECT)
   - "Authors can create own products" (INSERT)
   - "Authors can update own products" (UPDATE)
   - "Authors can delete own products" (DELETE)

### 3. Column Mismatch

**Symptom:** 400 error with message about unknown column

**Solution:** Verify the table schema matches what the code expects:

Expected columns:

- `id` (UUID, primary key, auto-generated)
- `name` (TEXT, NOT NULL)
- `price` (NUMERIC(10,2), NOT NULL)
- `condition` (TEXT, NOT NULL, CHECK: 'New' or 'Used')
- `image` (TEXT, NOT NULL)
- `category` (TEXT, NOT NULL)
- `description` (TEXT, nullable)
- `author_id` (UUID, NOT NULL, references auth.users)
- `created_at` (TIMESTAMPTZ, NOT NULL, default now())
- `updated_at` (TIMESTAMPTZ, NOT NULL, default now())

### 4. Authentication Issue

**Symptom:** 400 error or auth error in console

**Solution:**

1. Make sure you're logged in as an author
2. Check that your user has the 'author' role
3. Verify the session is valid (not expired)

## Diagnostic Steps

### Step 1: Check Browser Console

With enhanced logging now in place, try creating a product again and check the console for:

```
[createProduct] Insert data: { ... }
```

This will show exactly what data is being sent to Supabase.

### Step 2: Check Supabase Logs

1. Go to Supabase Dashboard → Logs
2. Look for recent errors
3. Check for specific error messages about the products table

### Step 3: Verify Table Exists

Run this query in Supabase SQL Editor:

```sql
SELECT * FROM public.products LIMIT 1;
```

If you get an error, the table doesn't exist. Run `database/products_schema.sql`.

### Step 4: Test Insert Manually

Try inserting a product manually in Supabase SQL Editor:

```sql
INSERT INTO public.products (name, price, condition, image, category, description, author_id)
VALUES (
  'Test Product',
  19.99,
  'New',
  'https://via.placeholder.com/400',
  'Test Category',
  'Test description',
  auth.uid()
);
```

If this fails, check the error message for clues.

### Step 5: Check RLS Policies

Run this query to see if RLS is enabled:

```sql
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public' AND tablename = 'products';
```

Should return `rowsecurity = true`.

Check policies:

```sql
SELECT * FROM pg_policies WHERE tablename = 'products';
```

Should show 4 policies (SELECT, INSERT, UPDATE, DELETE).

## Quick Fix Checklist

- [ ] Run `database/products_schema.sql` in Supabase SQL Editor
- [ ] Verify table exists in Table Editor
- [ ] Check RLS policies are active
- [ ] Verify you're logged in as an author
- [ ] Check browser console for detailed error logs
- [ ] Check Supabase Dashboard logs

## Next Steps

After trying the above:

1. **If table doesn't exist:** Run the schema file
2. **If RLS issue:** Check policies and user role
3. **If still failing:** Share the full error from console (with the new detailed logging)

## Getting More Help

If the issue persists, provide:

1. Full error message from browser console (including the new detailed logs)
2. Screenshot of Supabase Table Editor showing the products table
3. Screenshot of RLS policies for products table
4. Your user role (admin/author/user)
