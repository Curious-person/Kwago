// ----------------------------------------------------------------
// RBAC
// ----------------------------------------------------------------

export type UserRole = 'member' | 'author' | 'admin';

export type PostStatus = 'draft' | 'published' | 'archived';

export type CommentStatus = 'pending' | 'approved' | 'rejected';

export interface Profile {
  id: string;
  email: string;
  display_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  status: 'active' | 'suspended';
  created_at: string;
  updated_at: string;
}

// ----------------------------------------------------------------
// Product
// ----------------------------------------------------------------

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  condition: 'New' | 'Used';
  category: string;
  description: string;
  images: string[];
  stock_status: boolean;
  uploader_id: string | null;
  created_at: string;
}

// ----------------------------------------------------------------
// Blog Post
// ----------------------------------------------------------------

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string; // MDX
  featured_image: string;
  category: string;
  /** Lowercase values are canonical going forward ('draft' | 'published' | 'archived').
   *  Title-case variants ('Draft' | 'Published') may appear in legacy seed rows. */
  status: PostStatus | 'Draft' | 'Published' | 'Archived';
  author_id: string | null;
  created_at: string;
}

// ----------------------------------------------------------------
// Comment
// ----------------------------------------------------------------

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  body: string;
  status: CommentStatus;
  created_at: string;
  updated_at: string;
}
