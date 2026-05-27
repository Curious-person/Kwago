# Database Setup Guide - Products Table

## The Issue You Encountered

You got this error: `ERROR: 42703: column "author_id" does not exist`

This happened because the SQL function delimiter was incorrect (using `$` instead of `$$`), which caused the script to fail partway through execution.

## Solution: Use the Fixed Schema

I've created two versions of the schema file:

1. **`database/products_schema.sql`** - Fixed version (RECOMMENDED)
2. **`database/products_schema_fixed.sql`** - Alternative clean install version

## Step-by-Step Instructions

### Option 1: Use the Fixed Schema (Recommended)

1. **Open Supabase Dashboard**
   - Go to your Supabase project dashboard
   - Navigate to **SQL Editor** (left sidebar)

2. **Create a New Query**
   - Click **"New Query"** button

3. **Copy the Fixed Schema**
   - Open `database/products_schema.sql` (the file has been fixed)
   - Copy ALL the contents

4. **Paste and Run**
   - Paste into the SQL Editor
   - Click **"Run"** or press `Ctrl+Enter`

5. **Verify Success**
   - You should see: "Success. No rows returned"
   - Go to **Table Editor** (left sidebar)
   - You should see the `products` table listed

### Option 2: Clean Install (If Option 1 Fails)

If the table was partially created and you're getting errors, use the clean install version:

1. **Open Supabase Dashboard → SQL Editor**

2. **Run the Clean Install Schema**
   - Open `database/products_schema_fixed.sql`
   - Copy ALL contents
   - Paste into SQL Editor
   - Click **"Run"**

This version will:
- Drop any existing products table
- Drop any existing functions/triggers
- Create everything fresh

### Verification Steps

After running the schema, verify it worked:

#### 1. Check Table Exists
Run this query in SQL Editor:
```sql
SELECT * FROM public.products LIMIT 1;
```
Expected: Empty result (no error)

#### 2. Check RLS is Enabled
```sql
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public' AND tablename = 'products';
```
Expected: `rowsecurity = true`

#### 3. Check Policies Exist
```sql
SELECT policyname, cmd
FROM pg_policies
WHERE tablename = 'products';
```
Expected: 4 policies (SELECT, INSERT, UPDATE, DELETE)

#### 4. Check Columns
```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'products'
ORDER BY ordinal_position;
```
Expected: All columns listed (id, name, price, condition, image, category, description, author_id, created_at, updated_at)

### Test Product Creation

After the schema is installed, try creating a product again:

1. Go to `/dashboard/author/products`
2. Click **"Add Product"**
3. Fill in the form:
   - Name: Test Product
   - Price: 19.99
   - Condition: New
   - Category: Test
   - Image: https://via.placeholder.com/400
4. Click **"Save Product"**

It should now work! ✅

### Still Having Issues?

If you still get errors:

1. **Check the browser console** for detailed error logs (we added enhanced logging)
2. **Use the diagnostic page**: Navigate to `/dashboard/author/products/debug` and click "Run Diagnostics"
3. **Check Supabase logs**: Dashboard → Logs → look for recent errors

### What Changed in the Fixed Schema

The issue was in the function definition:

**Before (BROKEN):**
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$ LANGUAGE plpgsql;
```

**After (FIXED):**
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

The delimiter must be `$$` (double dollar signs), not `$` (single).

## Quick Reference

| File | Purpose | When to Use |
|------|---------|-------------|
| `database/products_schema.sql` | Fixed schema with IF NOT EXISTS | First install or safe re-run |
| `database/products_schema_fixed.sql` | Clean install with DROP statements | When you need to completely reset |
| `/dashboard/author/products/debug` | Diagnostic page | To test if setup is working |

## Next Steps After Setup

Once the table is created successfully:

1. ✅ Create products should work
2. ✅ Edit products should work
3. ✅ Delete products should work
4. ✅ List products should work

All CRUD operations will be functional!
