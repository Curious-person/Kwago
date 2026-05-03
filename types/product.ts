export interface Product {
  id: string;
  name: string;
  price: number;
  condition: 'New' | 'Used';
  image: string;
  category: string;
  description?: string;
}
