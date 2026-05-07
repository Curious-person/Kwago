import { requireRole } from '@/lib/auth';
import { ProductsList } from './ProductsList';
import { Product } from '@/types/product';

const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Marvel Legends Series Iron Man Mark LXXXV',
    price: 24.99,
    condition: 'New',
    category: 'Marvel Legends',
    image: 'https://images.unsplash.com/photo-1531279554141-7dfdb443c375?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: '2',
    name: 'The Lord of the Rings: Witch-King of Angmar Statue',
    price: 499.00,
    condition: 'New',
    category: 'Weta Workshop',
    image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: '3',
    name: 'Spider-Man: Across the Spider-Verse Gwen Stacy',
    price: 19.99,
    condition: 'Used',
    category: 'Marvel Legends',
    image: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: '4',
    name: 'Balrog, Flame of Udûn Statue',
    price: 899.00,
    condition: 'New',
    category: 'Weta Workshop',
    image: 'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: '5',
    name: 'Captain America Shield Prop Replica',
    price: 149.00,
    condition: 'New',
    category: 'Props',
    image: 'https://images.unsplash.com/photo-1626278664285-f7c8a8107e93?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: '6',
    name: 'Wolverine (Astonishing X-Men) Retro Figure',
    price: 34.99,
    condition: 'Used',
    category: 'Marvel Legends',
    image: 'https://images.unsplash.com/photo-1591117207239-788db8ec6c3b?q=80&w=800&auto=format&fit=crop'
  }
];

export default async function AuthorProductsPage() {
  await requireRole(['author', 'admin']);

  return <ProductsList initialProducts={MOCK_PRODUCTS} />;
}
