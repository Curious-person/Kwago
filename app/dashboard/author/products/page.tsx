"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  MoreHorizontal,
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useRouter } from "next/navigation";
import { Product } from "@/types/product";
import { fetchProducts, deleteProduct } from "@/lib/services/productService";

export default function AuthorProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Delete modal state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Fetch products on mount
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setIsLoading(true);
    setError(null);

    const response = await fetchProducts();

    if (!response.success) {
      setError(response.error.message);
      setIsLoading(false);
      return;
    }

    setProducts(response.data);
    setIsLoading(false);
  };

  const handleEdit = (product: Product) => {
    router.push(`/dashboard/author/products/${product.id}/edit`);
  };

  const handleAddProduct = () => {
    router.push("/dashboard/author/products/new");
  };

  const handleDelete = (product: Product) => {
    setProductToDelete(product);
    setDeleteError(null);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;

    setIsDeleting(true);
    setDeleteError(null);

    const response = await deleteProduct(productToDelete.id);

    if (!response.success) {
      setDeleteError(response.error.message);
      setIsDeleting(false);
      return;
    }

    // Remove product from local state
    setProducts((prev) => prev.filter((p) => p.id !== productToDelete.id));
    setIsDeleteDialogOpen(false);
    setProductToDelete(null);
    setIsDeleting(false);
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category_names?.some((name) =>
        name.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
            My Products
          </h1>
          <p className="text-sm text-zinc-500">
            Manage your collectible listings and inventory.
          </p>
        </div>

        <Button
          className="gap-2"
          onClick={handleAddProduct}
          disabled={isLoading}
        >
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
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <div className="flex items-start gap-4">
            <div className="rounded-full bg-red-100 p-2">
              <AlertCircle size={20} className="text-red-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-red-900 mb-1">
                Failed to load products
              </h3>
              <p className="text-sm text-red-700 mb-4">{error}</p>
              <Button
                size="sm"
                variant="outline"
                onClick={loadProducts}
                className="rounded-full border-red-300 text-red-700 hover:bg-red-100"
              >
                Try Again
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm p-32">
          <div className="flex flex-col items-center justify-center text-center">
            <Loader2 size={40} className="text-zinc-400 animate-spin mb-4" />
            <p className="text-sm text-zinc-500">Loading products...</p>
          </div>
        </div>
      )}

      {/* Products Table */}
      {!isLoading && !error && products.length > 0 && (
        <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-50 text-zinc-500 font-medium">
                <tr>
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Condition</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Featured In</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filteredProducts.map((product) => {
                  console.log("product data:", product);
                  return (
                    <tr key={product.id} className="hover:bg-zinc-50/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200 shrink-0">
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-zinc-900">
                              {product.name}
                            </span>
                            <span className="text-xs text-zinc-400">
                              ${product.price.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          variant="secondary"
                          className="font-medium text-xs rounded-full px-3"
                        >
                          {product.category_names &&
                          product.category_names.length > 0
                            ? product.category_names.join(", ")
                            : "Uncategorized"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          variant={
                            product.condition === "New" ? "default" : "outline"
                          }
                          className="font-medium text-xs rounded-full px-3"
                        >
                          {product.condition}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        {product.status === "pending_ai" && (
                          <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                            <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">
                              Analyzing...
                            </span>
                          </div>
                        )}
                        {product.status === "ai-approved" && (
                          <Badge
                            variant="outline"
                            className="font-medium text-xs rounded-full px-3 text-blue-600 border-blue-200 bg-blue-50"
                          >
                            Pending Admin
                          </Badge>
                        )}
                        {product.status === "ai-declined" && (
                          <Badge
                            variant="outline"
                            className="font-medium text-xs rounded-full px-3 text-red-600 border-red-200 bg-red-50"
                          >
                            AI Flagged
                          </Badge>
                        )}
                        {product.status === "for-posting" && (
                          <Badge
                            variant="default"
                            className="font-medium text-xs rounded-full px-3 bg-green-500 hover:bg-green-600"
                          >
                            Published
                          </Badge>
                        )}
                        {product.status === "reject" && (
                          <Badge
                            variant="secondary"
                            className="font-medium text-xs rounded-full px-3"
                          >
                            Rejected
                          </Badge>
                        )}
                        {![
                          "pending_ai",
                          "ai-approved",
                          "ai-declined",
                          "for-posting",
                          "reject",
                        ].includes(product.status || "") && (
                          <Badge
                            variant="secondary"
                            className="font-medium text-xs rounded-full px-3"
                          >
                            {product.status || "Draft"}
                          </Badge>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {product.featured_in_blogs_count &&
                        product.featured_in_blogs_count > 0 ? (
                          <Badge
                            variant="outline"
                            className="font-medium text-xs rounded-full px-3"
                          >
                            {product.featured_in_blogs_count}{" "}
                            {product.featured_in_blogs_count === 1
                              ? "blog"
                              : "blogs"}
                          </Badge>
                        ) : (
                          <span className="text-xs text-zinc-400">
                            Not featured
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            render={
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-full hover:bg-zinc-100"
                              />
                            }
                          >
                            <MoreHorizontal
                              size={16}
                              className="text-zinc-400"
                            />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="rounded-2xl w-48 p-2"
                          >
                            <DropdownMenuGroup>
                              <DropdownMenuLabel className="px-3 py-2 text-xs font-bold text-zinc-400 uppercase tracking-widest">
                                Options
                              </DropdownMenuLabel>
                              <DropdownMenuSeparator className="bg-zinc-100" />
                              <DropdownMenuItem className="gap-2 px-3 py-2 rounded-xl cursor-pointer">
                                <Eye size={14} className="text-zinc-400" />
                                <span className="font-medium">
                                  View Product
                                </span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="gap-2 px-3 py-2 rounded-xl cursor-pointer"
                                onClick={() => handleEdit(product)}
                              >
                                <Edit size={14} className="text-zinc-400" />
                                <span className="font-medium">
                                  Edit Product
                                </span>
                              </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator className="bg-zinc-100" />
                            <DropdownMenuItem
                              className="gap-2 px-3 py-2 rounded-xl cursor-pointer text-red-500 hover:text-red-600 hover:bg-red-50 focus:bg-red-50"
                              onClick={() => handleDelete(product)}
                            >
                              <Trash2 size={14} />
                              <span className="font-medium">
                                Delete Product
                              </span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading &&
        !error &&
        (products.length === 0 || filteredProducts.length === 0) && (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="h-20 w-20 rounded-full bg-zinc-50 flex items-center justify-center mb-6">
              <Search size={32} className="text-zinc-300" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 mb-2">
              {products.length === 0 ? "No products yet" : "No products found"}
            </h3>
            <p className="text-zinc-500 max-w-xs">
              {products.length === 0
                ? "Get started by adding your first product to your collection."
                : "Try adjusting your search or add a new product to your collection."}
            </p>
            {products.length === 0 && (
              <Button className="mt-6 gap-2" onClick={handleAddProduct}>
                <Plus size={16} />
                <span>Add Your First Product</span>
              </Button>
            )}
          </div>
        )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl p-8 border-zinc-100 shadow-none">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-zinc-900">
              Delete Product
            </DialogTitle>
            <DialogDescription className="text-sm text-zinc-500 mt-2 leading-relaxed">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-zinc-900">
                "{productToDelete?.name}"
              </span>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {/* Delete Error */}
          {deleteError && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4">
              <div className="flex items-start gap-3">
                <AlertCircle size={16} className="text-red-600 mt-0.5" />
                <p className="text-sm text-red-700">{deleteError}</p>
              </div>
            </div>
          )}

          <DialogFooter className="mt-8 flex gap-4 w-full bg-transparent border-t-0 p-0 rounded-none sm:justify-start">
            <Button
              className="w-full py-3 px-6 rounded-full bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50 shadow-none"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              className="w-full py-3 px-6 rounded-full bg-red-500 text-white font-medium hover:bg-red-600 shadow-none disabled:opacity-50"
              onClick={confirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 size={16} className="animate-spin mr-2" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
