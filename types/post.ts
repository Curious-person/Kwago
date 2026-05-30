// types/post.ts
// Single source of truth for all Post-related types.
// Import from here in every component that touches post data.

export type BlockType = "headline" | "subtitle" | "quote" | "body";

export interface ContentBlock {
  id: string;
  type: BlockType;
  content: string;
}

/**
 * All possible values for a blog post's lifecycle status.
 *  - Draft         : Initial state after author submits.
 *  - admin_pending : Submitted by user, awaiting admin review (no AI step).
 *  - ai_approved   : Passed AI moderation, awaiting admin sign-off.
 *  - Published     : Admin approved — visible on the public homepage.
 *  - Rejected      : Admin rejected with optional remarks.
 */
export type PostStatus =
  | "Draft"
  | "admin_pending"
  | "ai_approved"
  | "Published"
  | "Rejected";

export interface Post {
  id: string;
  title: string;
  category: string;
  date: string;
  image: string;
  author: string;
  authorImage: string;
  readTime: string;
  status: PostStatus;
  blocks: ContentBlock[];
  /** Admin remarks written when rejecting a post. */
  rejectionRemarks?: string;
}

/** Subset used when creating — no id / date / status yet */
export interface PostFormData {
  title: string;
  category: string;
  readTime: string;
  author: string;
  authorImage: string;
  image: string;
}
