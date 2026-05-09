import { Product } from './product';

export type ProductSalesStatus = 'Active' | 'Paused' | 'Out of Stock';

export interface ProductSalesData {
  productId: string;
  product: Product;
  totalUnitsSold: number;
  totalRevenue: number;
  status: ProductSalesStatus;
  lastSaleDate: string;
  stockRemaining: number;
}
