/**
 * postService.server.ts — Server Component read operations ONLY.
 *
 * ⚠️  Do NOT import this file from Client Components.
 *      It depends on `next/headers` via `lib/supabase/server.ts`.
 *      Use postService.ts for client-side mutations instead.
 */

import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { Post } from '@/types/post';
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
