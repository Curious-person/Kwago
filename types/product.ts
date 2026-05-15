export interface Product {
  id: string;
  name: string;
  price: number;
  condition: 'New' | 'Used';
  image: string;
  category_ids?: string[];
  category_names?: string[];
  description?: string;
}

// Database schema interface (matches Supabase products table)
export interface ProductRow {
  id: string;
  name: string;
  price: number;
  condition: 'New' | 'Used';
  image: string;
  description: string | null;
  author_id: string;
  created_at: string;
  updated_at: string;
}

// Interface for joined product queries
export interface ProductRowWithCategories extends ProductRow {
  product_categories?: { 
    category_id: string;
    categories?: {
      name: string;
    };
  }[];
}

// Input type for creating products
export interface CreateProductInput {
  name: string;
  price: number;
  condition: 'New' | 'Used';
  image: string;
  category_ids?: string[];
  description?: string;
}

// Input type for updating products (all fields optional except at least one must be provided)
export interface UpdateProductInput {
  name?: string;
  price?: number;
  condition?: 'New' | 'Used';
  image?: string;
  category_ids?: string[];
  description?: string;
}

