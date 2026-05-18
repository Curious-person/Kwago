// types/post.ts
// Single source of truth for all Post-related types.
// Import from here in every component that touches post data.

export type BlockType = 'headline' | 'subtitle' | 'quote' | 'body';

export interface ContentBlock {
  id: string;
  type: BlockType;
  content: string;
}

export interface Post {
  id: string;
  title: string;
  category: string;
  date: string;
  image: string;
  author: string;
  authorImage: string;
  readTime: string;
  status: string;
  blocks: ContentBlock[];
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
