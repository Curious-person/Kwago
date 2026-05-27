/**
 * postService.server.ts — Server Component read operations ONLY.
 *
 * ⚠️  Do NOT import this file from Client Components.
 *      It depends on `next/headers` via `lib/supabase/server.ts`.
 *      Use postService.ts for client-side mutations instead.
 */

import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { Post } from '@/types/post';
import type { Product, ProductRowWithCategories } from '@/types/product';
import { productRowToProduct } from '@/lib/services/productService';
import {
  type PostServiceResponse,
  type BlogPostRow,
  postRowToPost,
  classifyPostError,
} from './postService.shared';

// Re-export shared types so callers only need one import path when they only
// ever touch the server side.
export type { PostErrorCode, PostServiceResponse, BlogPostRow } from './postService.shared';

/**
 * Fetches all blog posts authored by the currently authenticated user.
 * Must be called from a Server Component or Server Action.
 */
export async function fetchAuthorPosts(): Promise<PostServiceResponse<Post[]>> {
  try {
    const supabase = await createServerSupabaseClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        error: { code: 'AUTH_ERROR', message: 'You must be authenticated to view posts.' },
      };
    }

    const { data, error } = await supabase
      .from('blog_posts')
      .select('*, profiles:author_id(display_name, avatar_url)')
      .eq('author_id', user.id)
      .order('updated_at', { ascending: false });

    if (error) throw error;

    return { success: true, data: (data as BlogPostRow[]).map(postRowToPost) };
  } catch (err) {
    return { success: false, error: classifyPostError(err) };
  }
}

/**
 * Fetches a single blog post by its ID.
 * Must be called from a Server Component or Server Action.
 */
export async function fetchPostById(id: string): Promise<PostServiceResponse<Post>> {
  try {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from('blog_posts')
      .select('*, profiles:author_id(display_name, avatar_url)')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) {
      return { success: false, error: { code: 'NOT_FOUND_ERROR', message: 'Post not found.' } };
    }

    return { success: true, data: postRowToPost(data as BlogPostRow) };
  } catch (err) {
    return { success: false, error: classifyPostError(err) };
  }
}

/**
 * Fetches a single blog post by its slug.
 * Must be called from a Server Component or Server Action.
 */
export async function fetchPostBySlug(slug: string): Promise<PostServiceResponse<Post>> {
  try {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from('blog_posts')
      .select('*, profiles:author_id(display_name, avatar_url)')
      .eq('slug', slug)
      .single();

    if (error) throw error;
    if (!data) {
      return { success: false, error: { code: 'NOT_FOUND_ERROR', message: 'Post not found.' } };
    }

    return { success: true, data: postRowToPost(data as BlogPostRow) };
  } catch (err) {
    return { success: false, error: classifyPostError(err) };
  }
}

/**
 * Fetches published blog posts.
 * Must be called from a Server Component or Server Action.
 */
export async function fetchPublishedPosts(limit: number = 6): Promise<PostServiceResponse<Post[]>> {
  try {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from('blog_posts')
      .select('*, profiles:author_id(display_name, avatar_url)')
      .eq('status', 'Published')
      .order('updated_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return { success: true, data: (data as BlogPostRow[]).map(postRowToPost) };
  } catch (err) {
    return { success: false, error: classifyPostError(err) };
  }
}

/**
 * Fetches products linked to a blog post via the blog_post_products junction table.
 * Uses a two-step query because PostgREST cannot filter a junction table by a
 * grandparent column (blog_posts.slug) in a single hop.
 *
 * Returns an empty array when:
 *  - The post slug is not found
 *  - The post has no linked products
 *  - Any Supabase error occurs
 *
 * Must be called from a Server Component or Server Action.
 */
export async function fetchRelatedProductsBySlug(slug: string): Promise<Product[]> {
  try {
    const supabase = await createServerSupabaseClient();

    // Step 1: resolve the post id from its slug
    const { data: postData, error: postError } = await supabase
      .from('blog_posts')
      .select('id')
      .eq('slug', slug)
      .single();

    if (postError || !postData) return [];

    // Step 2: fetch linked products ordered by their editorial position
    const { data, error } = await supabase
      .from('blog_post_products')
      .select(
        `position,
         products (
           id, name, price, condition, image, description, status,
           product_categories ( category_id, categories ( name ) )
         )`
      )
      .eq('blog_post_id', postData.id)
      .order('position', { ascending: true });

    if (error || !data) return [];

    // Transform each joined products sub-object into the Product interface
    const products: Product[] = [];
    for (const row of data) {
      const productRow = row.products as unknown as ProductRowWithCategories;
      if (!productRow) continue;
      const result = productRowToProduct(productRow);
      if (result.success) {
        products.push(result.data);
      }
    }

    return products;
  } catch {
    // Silently return empty — the section is simply hidden when this fails
    return [];
  }
}

