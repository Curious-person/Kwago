'use client';

import React, { useCallback } from 'react';
import { Category } from '@/lib/types/category';
import { Button } from '@/components/ui/Button';
import { X } from 'lucide-react';

/**
 * DeleteConfirmationModal Component
 *
 * Modal for confirming category deletion.
 * Displays category name and asks for confirmation before deletion.
 *
 * Requirements: 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8, 5.9, 9.5, 9.6, 9.7, 11.4, 11.6
 */
interface DeleteConfirmationModalProps {
    isOpen: boolean;
    category: Category | null;
    onClose: () => void;
    onConfirm: (id: string) => Promise<void>;
    isLoading?: boolean;
    error?: string | null;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
    isOpen,
    category,
    onClose,
    onConfirm,
    isLoading = false,
    error: externalError = null,
}) => {
    const [isDeleting, setIsDeleting] = React.useState(false);

    // Handle delete confirmation
    const handleConfirm = useCallback(async () => {
        if (!category) return;

        try {
            setIsDeleting(true);
            await onConfirm(category.id);
        } catch (err) {
            console.error('Error deleting category:', err);
        } finally {
            setIsDeleting(false);
        }
    }, [category, onConfirm]);

    // Handle modal close
    const handleClose = useCallback(() => {
        onClose();
    }, [onClose]);

    if (!isOpen || !category) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 z-40 transition-opacity"
                onClick={handleClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-lg">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-zinc-900">Delete Category</h2>
                        <button
                            onClick={handleClose}
                            className="text-zinc-400 hover:text-zinc-600 transition-colors"
                            aria-label="Close modal"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="mb-6">
                        <p className="text-zinc-600 mb-4">
                            Are you sure you want to delete this category?
                        </p>
                        <p className="text-lg font-bold text-zinc-900 p-4 bg-zinc-50 rounded-xl">
                            {category.name}
                        </p>
                    </div>

                    {/* Error Message */}
                    {externalError && (
                        <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-600">{externalError}</p>
                        </div>
                    )}

                    {/* Buttons */}
                    <div className="flex gap-4">
                        <Button
                            type="button"
                            variant="outline"
                            size="md"
                            onClick={handleClose}
                            disabled={isDeleting || isLoading}
                            className="flex-1 rounded-full"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            variant="primary"
                            size="md"
                            onClick={handleConfirm}
                            disabled={isDeleting || isLoading}
                            className="flex-1 rounded-full shadow-[0_4px_0_0_#0047B3] hover:shadow-[0_4px_0_0_#0047B3] active:translate-y-[2px] active:shadow-[0_2px_0_0_#0047B3]"
                        >
                            {isDeleting || isLoading ? 'Deleting...' : 'Delete'}
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
};
