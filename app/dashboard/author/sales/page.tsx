import React from 'react';
import { MySalesList } from './MySalesList';
import { ProductSalesData } from '@/types/sales';

// Mock data based on the Product type and typical sales scenario
const MOCK_SALES: ProductSalesData[] = [
  {
    productId: '1',
    product: {
      id: '1',
      name: 'Marvel Legends Series Iron Man Mark LXXXV',
      price: 24.99,
      condition: 'New',
      category: 'Marvel Legends',
      image: 'https://images.unsplash.com/photo-1531279554141-7dfdb443c375?q=80&w=800&auto=format&fit=crop'
    },
    totalUnitsSold: 42,
    totalRevenue: 1049.58,
    status: 'Active',
    lastSaleDate: '2026-05-06T10:00:00Z',
    stockRemaining: 15,
  },
  {
    productId: '2',
    product: {
      id: '2',
      name: 'The Lord of the Rings: Witch-King of Angmar Statue',
      price: 499.00,
      condition: 'New',
      category: 'Weta Workshop',
      image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=800&auto=format&fit=crop'
    },
    totalUnitsSold: 5,
    totalRevenue: 2495.00,
    status: 'Active',
    lastSaleDate: '2026-05-04T14:30:00Z',
    stockRemaining: 3,
  },
  {
    productId: '3',
    product: {
      id: '3',
      name: 'Spider-Man: Across the Spider-Verse Gwen Stacy',
      price: 19.99,
      condition: 'Used',
      category: 'Marvel Legends',
      image: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?q=80&w=800&auto=format&fit=crop'
    },
    totalUnitsSold: 12,
    totalRevenue: 239.88,
    status: 'Out of Stock',
    lastSaleDate: '2026-05-01T09:15:00Z',
    stockRemaining: 0,
  }
];

export const metadata = {
  title: 'My Sales | Kwago Dashboard',
  description: 'Manage your product sales, restock inventory, and update statuses.',
};

export default function AuthorSalesPage() {
  return <MySalesList initialSales={MOCK_SALES} />;
}
