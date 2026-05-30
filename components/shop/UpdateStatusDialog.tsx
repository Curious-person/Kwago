"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";
import { ProductSalesStatus, ProductSalesData } from "@/types/sales";

interface UpdateStatusDialogProps {
  item: ProductSalesData | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (item: ProductSalesData, newStatus: ProductSalesStatus) => void;
}

const STATUS_OPTIONS: ProductSalesStatus[] = [
  "Active",
  "Paused",
  "Out of Stock",
];

export const UpdateStatusDialog = ({
  item,
  isOpen,
  onOpenChange,
  onUpdate,
}: UpdateStatusDialogProps) => {
  const [selectedStatus, setSelectedStatus] =
    useState<ProductSalesStatus>("Active");

  useEffect(() => {
    if (item) {
      setSelectedStatus(item.status);
    }
  }, [item, isOpen]);

  const handleUpdate = () => {
    if (item) {
      onUpdate(item, selectedStatus);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-3xl p-8 border-zinc-100 shadow-none">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-zinc-900">
            Update Status
          </DialogTitle>
          <DialogDescription className="text-sm text-zinc-500 mt-2 leading-relaxed">
            Change the product status for{" "}
            <span className="font-semibold text-zinc-900">
              {item?.product.name}
            </span>
            .
          </DialogDescription>
        </DialogHeader>

        <div className="py-6 space-y-3">
          {STATUS_OPTIONS.map((status) => (
            <div
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`p-4 rounded-full border cursor-pointer transition-colors flex items-center justify-between ${
                selectedStatus === status
                  ? "border-[#0066FF] bg-blue-50"
                  : "border-zinc-200 hover:bg-zinc-50 bg-white"
              }`}
            >
              <span
                className={`text-sm font-medium ${selectedStatus === status ? "text-[#0066FF]" : "text-zinc-700"}`}
              >
                {status}
              </span>
              {selectedStatus === status && (
                <div className="w-3 h-3 rounded-full bg-[#0066FF]" />
              )}
            </div>
          ))}
        </div>

        <DialogFooter className="flex gap-4 w-full bg-transparent border-t-0 p-0 rounded-none sm:justify-start">
          <Button
            className="w-full py-3 px-6 rounded-full bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50 shadow-none"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            className="w-full py-3 px-6 rounded-full bg-[#0066FF] text-white font-medium hover:bg-blue-600 shadow-none"
            onClick={handleUpdate}
          >
            Update Status
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
