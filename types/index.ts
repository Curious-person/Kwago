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
  created_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string; // MDX
  featured_image: string;
  category: string;
  status: 'Draft' | 'Published';
  created_at: string;
}
