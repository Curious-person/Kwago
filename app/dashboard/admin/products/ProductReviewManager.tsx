"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Search, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { DataTable, ColumnDef } from "@/components/ui/data-table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { createClient } from "@/lib/supabase/client";
import { adminReviewProduct } from "@/lib/services/productService";
import { Product } from "@/types/product";

export function ProductReviewManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [actionToConfirm, setActionToConfirm] = useState<{
    id: string;
    action: "approve" | "reject";
    name: string;
  } | null>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const fetchProducts = async () => {
    setIsLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*, product_categories(category_id, categories(name))")
      .eq("status", "ai-approved")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setProducts(data as unknown as Product[]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleReviewAction = (
    id: string,
    action: "approve" | "reject",
    name: string,
  ) => {
    setActionToConfirm({ id, action, name });
    setIsConfirmModalOpen(true);
  };

  const confirmReviewAction = async () => {
    if (!actionToConfirm) return;
    setIsActionLoading(true);
    const result = await adminReviewProduct(
      actionToConfirm.id,
      actionToConfirm.action,
    );
    if (result.success) {
      await fetchProducts(); // Refresh list after action
      setIsConfirmModalOpen(false);
    } else {
      console.error("Failed to review product:", result.error);
    }
    setIsActionLoading(false);
  };

  const columns = React.useMemo<ColumnDef<Product>[]>(
    () => [
      {
        header: "Photo",
        accessorKey: "image",
        headerClassName: "w-[100px]",
        cell: (row) => (
          <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200">
            <Image
              src={row.image}
              alt={row.name}
              fill
              className="object-cover"
            />
          </div>
        ),
      },
      {
        header: "Product Details",
        filterable: true,
        filterValue: (row) => `${row.name}`,
        cell: (row) => (
          <div className="flex flex-col gap-0.5">
            <span className="font-bold text-zinc-900 line-clamp-1">
              {row.name}
            </span>
            <span className="text-xs text-zinc-400">
              ${row.price.toFixed(2)} • {row.condition}
            </span>
          </div>
        ),
      },
      {
        header: "Status",
        accessorKey: "status",
        filterable: true,
        cell: (row) => (
          <div className="flex items-center gap-1.5">
            {row.status === "ai-approved" && (
              <Badge
                variant="outline"
                className="font-medium text-xs rounded-full px-3 text-blue-600 border-blue-200 bg-blue-50"
              >
                Pending Admin
              </Badge>
            )}
          </div>
        ),
      },
      {
        header: "Actions",
        className: "text-right",
        headerClassName: "text-right",
        cell: (row) => (
          <div className="flex justify-end gap-2">
            {row.status === "ai-approved" && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full px-4 text-[10px] font-bold uppercase tracking-widest text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-200 h-8 gap-2"
                  onClick={() => handleReviewAction(row.id, "reject", row.name)}
                >
                  <XCircle size={12} />
                  Reject
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  className="rounded-full px-4 text-[10px] font-bold uppercase tracking-widest bg-[#0066FF] text-white hover:bg-blue-600 h-8 gap-2"
                  onClick={() =>
                    handleReviewAction(row.id, "approve", row.name)
                  }
                >
                  <CheckCircle2 size={12} />
                  Approve
                </Button>
              </>
            )}
          </div>
        ),
      },
    ],
    [],
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-full max-w-sm">
          <Input placeholder="Search products..." icon={<Search size={16} />} />
        </div>
      </div>

      {isLoading ? (
        <div className="py-12 text-center text-zinc-500 text-sm">
          Loading queue...
        </div>
      ) : (
        <DataTable columns={columns} data={products} itemsPerPage={10} />
      )}

      <Dialog open={isConfirmModalOpen} onOpenChange={setIsConfirmModalOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl p-8 border-zinc-100 shadow-none">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-zinc-900">
              {actionToConfirm?.action === "approve"
                ? "Approve Product"
                : "Reject Product"}
            </DialogTitle>
            <DialogDescription className="text-sm text-zinc-500 mt-2 leading-relaxed">
              Are you sure you want to {actionToConfirm?.action}{" "}
              <span className="font-semibold text-zinc-900">
                "{actionToConfirm?.name}"
              </span>
              ?
              {actionToConfirm?.action === "approve"
                ? " This will publish the product to the marketplace."
                : " This will send it back to the author."}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-8 flex gap-4 w-full bg-transparent border-t-0 p-0 rounded-none sm:justify-start">
            <Button
              className="w-full py-3 px-6 rounded-full bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50 shadow-none"
              onClick={() => setIsConfirmModalOpen(false)}
              disabled={isActionLoading}
            >
              Cancel
            </Button>
            <Button
              className={`w-full py-3 px-6 rounded-full text-white font-medium shadow-none disabled:opacity-50 flex items-center justify-center ${actionToConfirm?.action === "approve" ? "bg-[#0066FF] hover:bg-blue-600" : "bg-red-500 hover:bg-red-600"}`}
              onClick={confirmReviewAction}
              disabled={isActionLoading}
            >
              {isActionLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin mr-2" />
                  {actionToConfirm?.action === "approve"
                    ? "Approving..."
                    : "Rejecting..."}
                </>
              ) : actionToConfirm?.action === "approve" ? (
                "Approve"
              ) : (
                "Reject"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
