import type { Post, PostStatus, ContentBlock } from '@/types/post';

// ─────────────────────────────────────────────────────────────────────────────
// Error types
// ─────────────────────────────────────────────────────────────────────────────

export type PostErrorCode =
  | 'NETWORK_ERROR'
  | 'AUTH_ERROR'
  | 'PERMISSION_ERROR'
  | 'VALIDATION_ERROR'
  | 'NOT_FOUND_ERROR'
  | 'UNKNOWN_ERROR';

export interface PostServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: PostErrorCode;
    message: string;
    details?: Record<string, unknown>;
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Row shape returned by Supabase (with optional profile join)
// ─────────────────────────────────────────────────────────────────────────────

export interface BlogPostRow {
  id: string;
  title: string;
  slug: string;
  category: string;
  image: string;
  read_time: string;
  status: PostStatus;
  blocks: unknown; // Raw JSONB — parsed below
  author_id: string;
  created_at: string;
  updated_at: string;
  /** Admin-written feedback when a post is rejected. */
  rejection_remarks?: string | null;
  profiles?:
    | { display_name: string | null; avatar_url: string | null }
    | { display_name: string | null; avatar_url: string | null }[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Transformer: DB row → UI Post
// ─────────────────────────────────────────────────────────────────────────────

export function postRowToPost(row: BlogPostRow): Post {
  const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
  const formattedDate = new Date(row.created_at).toLocaleDateString('en-US', options);

  let authorName = 'Anonymous';
  let authorAvatar =
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop';

  if (row.profiles) {
    const profile = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;
    if (profile?.display_name) authorName = profile.display_name;
    if (profile?.avatar_url) authorAvatar = profile.avatar_url;
  }

  let blocksList: ContentBlock[] = [];
  if (Array.isArray(row.blocks)) {
    blocksList = row.blocks as ContentBlock[];
  } else if (typeof row.blocks === 'string') {
    try {
      blocksList = JSON.parse(row.blocks) as ContentBlock[];
    } catch {
      blocksList = [];
    }
  }

  return {
    id: row.id,
    title: row.title,
    category: row.category,
    date: formattedDate,
    image: row.image,
    author: authorName,
    authorImage: authorAvatar,
    readTime: row.read_time,
    status: row.status,
    blocks: blocksList,
    rejectionRemarks: row.rejection_remarks ?? undefined,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Error classifier
// ─────────────────────────────────────────────────────────────────────────────

export function classifyPostError(error: unknown): { code: PostErrorCode; message: string } {
  if (!error) return { code: 'UNKNOWN_ERROR', message: 'An unknown error occurred.' };

  const msg = error instanceof Error ? error.message : String(error);
  const lower = msg.toLowerCase();

  if (lower.includes('fetch') || lower.includes('network') || lower.includes('timeout'))
    return { code: 'NETWORK_ERROR', message: 'Network connection failure. Please check your connection.' };

  if (lower.includes('permission') || lower.includes('policy') || lower.includes('rls'))
    return { code: 'PERMISSION_ERROR', message: 'You do not have permission to modify or access this post.' };

  if (lower.includes('unauthorized') || lower.includes('jwt') || lower.includes('token') || lower.includes('session'))
    return { code: 'AUTH_ERROR', message: 'Your session has expired. Please log in again.' };

  if (lower.includes('not found') || lower.includes('no rows'))
    return { code: 'NOT_FOUND_ERROR', message: 'The requested blog post was not found.' };

  if (lower.includes('validation') || lower.includes('constraint'))
    return { code: 'VALIDATION_ERROR', message: 'Validation failed. Please verify your fields.' };

  return { code: 'UNKNOWN_ERROR', message: msg };
}
