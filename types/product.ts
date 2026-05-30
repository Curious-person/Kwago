export type ProductStatus =
  | "pending_ai"
  | "ai-approved"
  | "ai-declined"
  | "for-posting"
  | "reject";

export interface Product {
  id: string;
  name: string;
  price: number;
  condition: "New" | "Used";
  image: string;
  category_ids?: string[];
  category_names?: string[];
  description?: string;
  featured_in_blogs_count?: number;
  status?: ProductStatus;
}

// Database schema interface (matches Supabase products table)
export interface ProductRow {
  id: string;
  name: string;
  price: number;
  condition: "New" | "Used";
  image: string;
  description: string | null;
  author_id: string;
  created_at: string;
  updated_at: string;
  status: ProductStatus;
}

// Junction table interface for blog post - product relationships
export interface BlogPostProduct {
  blog_post_id: string;
  product_id: string;
  position: number;
  is_featured: boolean;
  created_at: string;
}

// Interface for joined product queries
export interface ProductRowWithCategories extends ProductRow {
  product_categories?: {
    category_id: string;
    categories?: {
      name: string;
    };
  }[];
  blog_post_products?: BlogPostProduct[];
}

// Input type for creating products
export interface CreateProductInput {
  name: string;
  price: number;
  condition: "New" | "Used";
  image: string;
  category_ids?: string[];
  description?: string;
  status?: string;
}

// Input type for updating products (all fields optional except at least one must be provided)
export interface UpdateProductInput {
  name?: string;
  price?: number;
  condition?: "New" | "Used";
  image?: string;
  category_ids?: string[];
  description?: string;
  status?: string;
}
