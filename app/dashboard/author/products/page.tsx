'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { MoreHorizontal, Plus, Search, Eye, Edit, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { useRouter } from 'next/navigation';
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

export default function AuthorProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [searchQuery, setSearchQuery] = useState('');

  // Delete modal state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const handleEdit = (product: Product) => {
    router.push(`/dashboard/author/products/${product.id}/edit`);
  };

  const handleAddProduct = () => {
    router.push('/dashboard/author/products/new');
  };

  const handleDelete = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (productToDelete) {
      setProducts((prev) => prev.filter((p) => p.id !== productToDelete.id));
      setIsDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">My Products</h1>
          <p className="text-sm text-zinc-500">Manage your collectible listings and inventory.</p>
        </div>

        <Button className="gap-2" onClick={handleAddProduct}>
          <Plus size={16} />
          <span>Add Product</span>
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="w-full max-w-sm">
          <Input
            placeholder="Search products..."
            icon={<Search size={16} />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50 text-zinc-500 font-medium">
              <tr>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Condition</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-zinc-50/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200 shrink-0">
                        <Image src={product.image} alt={product.name} fill className="object-cover" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-zinc-900">{product.name}</span>
                        <span className="text-xs text-zinc-400">${product.price.toFixed(2)}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="secondary" className="font-medium text-xs rounded-full px-3">
                      {product.category}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={product.condition === 'New' ? 'default' : 'outline'} className="font-medium text-xs rounded-full px-3">
                      {product.condition}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger render={
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-zinc-100" />
                      }>
                        <MoreHorizontal size={16} className="text-zinc-400" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-2xl w-48 p-2">
                        <DropdownMenuGroup>
                          <DropdownMenuLabel className="px-3 py-2 text-xs font-bold text-zinc-400 uppercase tracking-widest">Options</DropdownMenuLabel>
                          <DropdownMenuSeparator className="bg-zinc-100" />
                          <DropdownMenuItem className="gap-2 px-3 py-2 rounded-xl cursor-pointer">
                            <Eye size={14} className="text-zinc-400" />
                            <span className="font-medium">View Product</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="gap-2 px-3 py-2 rounded-xl cursor-pointer"
                            onClick={() => handleEdit(product)}
                          >
                            <Edit size={14} className="text-zinc-400" />
                            <span className="font-medium">Edit Product</span>
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator className="bg-zinc-100" />
                        <DropdownMenuItem
                          className="gap-2 px-3 py-2 rounded-xl cursor-pointer text-red-500 hover:text-red-600 hover:bg-red-50 focus:bg-red-50"
                          onClick={() => handleDelete(product)}
                        >
                          <Trash2 size={14} />
                          <span className="font-medium">Delete Product</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <div className="h-20 w-20 rounded-full bg-zinc-50 flex items-center justify-center mb-6">
            <Search size={32} className="text-zinc-300" />
          </div>
          <h3 className="text-xl font-bold text-zinc-900 mb-2">No products found</h3>
          <p className="text-zinc-500 max-w-xs">
            Try adjusting your search or add a new product to your collection.
          </p>
        </div>
      )}

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl p-8 border-zinc-100 shadow-none">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-zinc-900">Delete Product</DialogTitle>
            <DialogDescription className="text-sm text-zinc-500 mt-2 leading-relaxed">
              Are you sure you want to delete <span className="font-semibold text-zinc-900">"{productToDelete?.name}"</span>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-8 flex gap-4 w-full bg-transparent border-t-0 p-0 rounded-none sm:justify-start">
            <Button
              className="w-full py-3 px-6 rounded-full bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50 shadow-none"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="w-full py-3 px-6 rounded-full bg-red-500 text-white font-medium hover:bg-red-600 shadow-none"
              onClick={confirmDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
