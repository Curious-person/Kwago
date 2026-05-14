export interface Product {
  id: string;
  name: string;
  price: number;
  condition: 'New' | 'Used';
  image: string;
  category: string;
  description?: string;
}

// Database schema interface (matches Supabase products table)
export interface ProductRow {
  id: string;
  name: string;
  price: number;
  condition: 'New' | 'Used';
  image: string;
  category: string;
  description: string | null;
  author_id: string;
  created_at: string;
  updated_at: string;
}

// Input type for creating products
export interface CreateProductInput {
  name: string;
  price: number;
  condition: 'New' | 'Used';
  image: string;
  category: string;
  description?: string;
}

// Input type for updating products (all fields optional except at least one must be provided)
export interface UpdateProductInput {
  name?: string;
  price?: number;
  condition?: 'New' | 'Used';
  image?: string;
  category?: string;
  description?: string;
}

