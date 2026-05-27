'use client';

import React, { useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { X } from 'lucide-react';

/**
 * DeleteConfirmationModal Component
 *
 * Modal for confirming category deletion.
 * Displays the category name and requires explicit confirmation before deletion.
 *
 * Requirements: 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8, 5.9, 9.5, 9.6, 9.7, 11.4, 11.6
 */
interface Category {
    id: string;
    name: string;
    description?: string;
    author_id: string;
    product_count: number;
    product_images: string[];
    created_at: string;
    updated_at: string;
}

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
            // API_INTEGRATION_POINT_4: Delete category
            // Replace with: const response = await fetch(`/api/categories/${category.id}`, { method: 'DELETE' });
            // Expected response: { success: true } or error
            await onConfirm(category.id);
            onClose();
        } catch (err) {
            console.error('Error deleting category:', err);
        } finally {
            setIsDeleting(false);
        }
    }, [category, onConfirm, onClose]);

    // Handle modal close
    const handleClose = useCallback(() => {
        onClose();
    }, [onClose]);

    // Handle Escape key to close modal
    React.useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                handleClose();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, handleClose]);

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
                <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-md sm:max-w-md max-h-[90vh] overflow-y-auto shadow-lg" role="dialog" aria-modal="true" aria-labelledby="deleteCategoryTitle">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <h2 id="deleteCategoryTitle" className="text-xl sm:text-2xl font-bold text-zinc-900">Delete Category</h2>
                        <button
                            onClick={handleClose}
                            className="text-zinc-400 hover:text-zinc-600 transition-colors flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:ring-offset-2 rounded p-1"
                            aria-label="Close modal"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="space-y-6">
                        {/* Confirmation Message */}
                        <div>
                            <p className="text-zinc-700 mb-2">
                                Are you sure you want to delete this category?
                            </p>
                            <p className="text-lg font-semibold text-zinc-900">
                                "{category.name}"
                            </p>
                        </div>

                        {/* Error Message */}
                        {externalError && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-sm text-red-600">{externalError}</p>
                            </div>
                        )}

                        {/* Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                size="md"
                                onClick={handleClose}
                                disabled={isDeleting || isLoading}
                                className="flex-1 rounded-full focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:ring-offset-2"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="button"
                                variant="primary"
                                size="md"
                                onClick={handleConfirm}
                                disabled={isDeleting || isLoading}
                                className="flex-1 rounded-full bg-red-600 shadow-[0_4px_0_0_#991B1B] hover:bg-red-700 hover:shadow-[0_4px_0_0_#991B1B] active:translate-y-[2px] active:shadow-[0_2px_0_0_#991B1B] focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:ring-offset-2"
                            >
                                {isDeleting || isLoading ? 'Deleting...' : 'Delete'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
