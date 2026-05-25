/**
 * postService.ts — Browser-safe Client Component mutations.
 *
 * Only uses `createClient` (browser Supabase client).
 * Safe to import from Client Components.
 *
 * For server-side reads (fetchAuthorPosts, fetchPostById) use:
 *   import { ... } from '@/lib/services/postService.server';
 */

import { createClient } from '@/lib/supabase/client';
import type { Post, ContentBlock } from '@/types/post';
import {
  type PostServiceResponse,
  type BlogPostRow,
  postRowToPost,
  classifyPostError,
} from './postService.shared';

// Re-export everything consumers need from one place.
export type { PostErrorCode, PostServiceResponse, BlogPostRow } from './postService.shared';
export { postRowToPost, classifyPostError } from './postService.shared';

/**
 * Creates a new blog post. Must be called from a Client Component or browser context.
 */
export async function createPost(
  input: Omit<Post, 'id' | 'date' | 'author' | 'authorImage'>,
  userId: string
): Promise<PostServiceResponse<Post>> {
  try {
    const supabase = createClient();
    const slug = input.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const { data, error } = await supabase
      .from('blog_posts')
      .insert({
        title: input.title,
        slug,
        category: input.category,
        image: input.image,
        read_time: input.readTime,
        status: input.status,
        blocks: input.blocks,
        author_id: userId,
      })
      .select('*, profiles:author_id(display_name, avatar_url)')
      .single();

    if (error) throw error;

    return { success: true, data: postRowToPost(data as BlogPostRow) };
  } catch (err) {
    return { success: false, error: classifyPostError(err) };
  }
}

/**
 * Updates an existing blog post. Must be called from a Client Component or browser context.
 */
export async function updatePost(
  id: string,
  input: Partial<Omit<Post, 'id' | 'date' | 'author' | 'authorImage'>>
): Promise<PostServiceResponse<Post>> {
  try {
    const supabase = createClient();

    const updatePayload: {
      title?: string;
      slug?: string;
      category?: string;
      image?: string;
      read_time?: string;
      status?: string;
      blocks?: ContentBlock[];
    } = {};

    if (input.title) {
      updatePayload.title = input.title;
      updatePayload.slug = input.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }
    if (input.category) updatePayload.category = input.category;
    if (input.image) updatePayload.image = input.image;
    if (input.readTime) updatePayload.read_time = input.readTime;
    if (input.status) updatePayload.status = input.status;
    if (input.blocks) updatePayload.blocks = input.blocks;

    const { data, error } = await supabase
      .from('blog_posts')
      .update(updatePayload)
      .eq('id', id)
      .select('*, profiles:author_id(display_name, avatar_url)')
      .single();

    if (error) throw error;

    return { success: true, data: postRowToPost(data as BlogPostRow) };
  } catch (err) {
    return { success: false, error: classifyPostError(err) };
  }
}

/**
 * Deletes a blog post. Must be called from a Client Component or browser context.
 */
export async function deletePost(id: string): Promise<PostServiceResponse<void>> {
  try {
    const supabase = createClient();
    const { error } = await supabase.from('blog_posts').delete().eq('id', id);

    if (error) throw error;

    return { success: true };
  } catch (err) {
    return { success: false, error: classifyPostError(err) };
  }
}

/**
 * Allows an admin to review a community blog post.
 * Updates the status to 'Published' (approve) or 'Draft' (reject).
 *
 * @param id - Post UUID to review
 * @param action - 'approve' to publish the post, 'reject' to keep as draft
 * @returns Promise<PostServiceResponse<Post>> - Updated post or error
 */
export async function adminReviewPost(
  id: string,
  action: 'approve' | 'reject'
): Promise<PostServiceResponse<Post>> {
  try {
    console.log(`[adminReviewPost] Admin reviewing post ${id} with action: ${action}`);

    const newStatus = action === 'approve' ? 'Published' : 'Draft';
    const supabase = createClient();

    const { data, error } = await supabase
      .from('blog_posts')
      .update({ status: newStatus })
      .eq('id', id)
      .select('*, profiles:author_id(display_name, avatar_url)')
      .single();

    if (error) {
      console.error('[adminReviewPost] Supabase error:', error);
      return {
        success: false,
        error: classifyPostError(error),
      };
    }

    if (!data) {
      return {
        success: false,
        error: {
          code: 'UNKNOWN_ERROR',
          message: 'Failed to update post status or insufficient permissions',
        },
      };
    }

    console.log('[adminReviewPost] Post review successful');
    return { success: true, data: postRowToPost(data as BlogPostRow) };
  } catch (err) {
    console.error('[adminReviewPost] Unexpected error:', err);
    return {
      success: false,
      error: classifyPostError(err),
    };
  }
}

