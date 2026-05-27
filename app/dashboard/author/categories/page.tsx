'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Category, Notification, ModalState } from '@/lib/types/category';
import { fetchCategories, createCategory, updateCategory, deleteCategory } from './actions';
import { CategoryHeader } from '@/components/dashboard/CategoryHeader';
import { CategoryGrid } from '@/components/dashboard/CategoryGrid';
import { CreateCategoryModal } from '@/components/dashboard/CreateCategoryModal';
import { EditCategoryModal } from '@/components/dashboard/EditCategoryModal';
import { DeleteConfirmationModal } from '@/components/dashboard/DeleteConfirmationModal';
import { Notification as NotificationComponent } from '@/components/dashboard/Notification';
import { LoadingState } from '@/components/dashboard/LoadingState';
import { ErrorState } from '@/components/dashboard/ErrorState';

/**
 * CategoryManager Page Component
 *
 * Main page for managing product categories.
 * Handles CRUD operations, modal states, and notifications.
 * Authentication and role-based access control handled by dashboard layout.
 *
 * Requirements: 1.2, 1.3, 7.1, 7.2, 7.3, 7.4, 7.5, 11.1, 11.6
 */
export default function CategoryManagerPage() {
    const router = useRouter();

    // State management
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isRetrying, setIsRetrying] = useState(false);
    const [notification, setNotification] = useState<Notification | null>(null);

    // Modal states
    const [modals, setModals] = useState<ModalState>({
        isCreateModalOpen: false,
        isEditModalOpen: false,
        isDeleteModalOpen: false,
        editingCategory: null,
        categoryToDelete: null,
    });

    // Load categories on mount
    useEffect(() => {
        loadCategories();
    }, []);

    /**
     * Fetch categories from Supabase
     */
    const loadCategories = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            setIsRetrying(false);

            const response = await fetchCategories();

            if (response.success && response.data) {
                setCategories(response.data as Category[]);
            } else {
                throw new Error(response.error || 'Failed to fetch categories');
            }
        } catch (err: any) {
            setError(err.message || 'Failed to load categories. Please try again.');
            console.error('Error loading categories:', err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Create category via Server Action
     */
    const handleCreateCategory = useCallback(
        async (name: string, description: string | undefined) => {
            try {
                const response = await createCategory(name, description);
                
                if (!response.success || !response.data) {
                    throw new Error(response.error || 'Failed to create category');
                }

                // Update state
                setCategories(prev => [response.data as Category, ...prev]);

                setModals(prev => ({ ...prev, isCreateModalOpen: false }));
                setNotification({
                    type: 'success',
                    message: 'Category created successfully',
                    duration: 3000,
                });
            } catch (err: any) {
                setNotification({
                    type: 'error',
                    message: err.message || 'Failed to create category. Please try again.',
                });
                console.error('Error creating category:', err);
            }
        },
        []
    );

    /**
     * Update category via Server Action
     */
    const handleUpdateCategory = useCallback(
        async (id: string, name: string, description: string | undefined) => {
            try {
                const response = await updateCategory(id, name, description);
                
                if (!response.success || !response.data) {
                    throw new Error(response.error || 'Failed to update category');
                }

                // Update state
                setCategories(prev => 
                    prev.map(cat => (cat.id === id ? (response.data as Category) : cat))
                );

                setModals(prev => ({ ...prev, isEditModalOpen: false, editingCategory: null }));
                setNotification({
                    type: 'success',
                    message: 'Category updated successfully',
                    duration: 3000,
                });
            } catch (err: any) {
                setNotification({
                    type: 'error',
                    message: err.message || 'Failed to update category. Please try again.',
                });
                console.error('Error updating category:', err);
            }
        },
        []
    );

    /**
     * Delete category via Server Action
     */
    const handleDeleteCategory = useCallback(
        async (id: string) => {
            try {
                const response = await deleteCategory(id);
                
                if (!response.success) {
                    throw new Error(response.error || 'Failed to delete category');
                }

                // Update state
                setCategories(prev => prev.filter(cat => cat.id !== id));

                setModals(prev => ({ ...prev, isDeleteModalOpen: false, categoryToDelete: null }));
                setNotification({
                    type: 'success',
                    message: 'Category deleted successfully',
                    duration: 3000,
                });
            } catch (err: any) {
                setNotification({
                    type: 'error',
                    message: err.message || 'Failed to delete category. Please try again.',
                });
                console.error('Error deleting category:', err);
            }
        },
        []
    );

    /**
     * API_INTEGRATION_POINT_5: Fetch products by category
     * Replace with: const response = await fetch(`/api/products?category=${categoryId}`);
     * Expected response: { products: Product[] }
     */
    const handleViewProducts = useCallback((categoryId: string) => {
        const category = categories.find(cat => cat.id === categoryId);
        if (category) {
            router.push(`/dashboard/author/products?category=${encodeURIComponent(category.name)}`);
        }
    }, [categories, router]);

    // Modal handlers
    const openCreateModal = useCallback(() => {
        setModals(prev => ({ ...prev, isCreateModalOpen: true }));
    }, []);

    const closeCreateModal = useCallback(() => {
        setModals(prev => ({ ...prev, isCreateModalOpen: false }));
    }, []);

    const openEditModal = useCallback((category: Category) => {
        setModals(prev => ({
            ...prev,
            isEditModalOpen: true,
            editingCategory: category,
        }));
    }, []);

    const closeEditModal = useCallback(() => {
        setModals(prev => ({
            ...prev,
            isEditModalOpen: false,
            editingCategory: null,
        }));
    }, []);

    const openDeleteModal = useCallback((category: Category) => {
        setModals(prev => ({
            ...prev,
            isDeleteModalOpen: true,
            categoryToDelete: category,
        }));
    }, []);

    const closeDeleteModal = useCallback(() => {
        setModals(prev => ({
            ...prev,
            isDeleteModalOpen: false,
            categoryToDelete: null,
        }));
    }, []);

    // Dismiss notification
    const dismissNotification = useCallback(() => {
        setNotification(null);
    }, []);

    // Retry loading
    const handleRetry = useCallback(async () => {
        setIsRetrying(true);
        await loadCategories();
        setIsRetrying(false);
    }, [loadCategories]);

    // Show loading state
    if (isLoading) {
        return <LoadingState count={3} />;
    }

    // Show error state
    if (error) {
        return <ErrorState error={error} onRetry={handleRetry} isRetrying={isRetrying} />;
    }

    return (
        <div className="flex-1">
            {/* Header */}
            <CategoryHeader onCreateClick={openCreateModal} />

            {/* Grid */}
            <CategoryGrid
                categories={categories}
                onEdit={openEditModal}
                onDelete={openDeleteModal}
                onViewProducts={handleViewProducts}
            />

            {/* Modals */}
            <CreateCategoryModal
                isOpen={modals.isCreateModalOpen}
                onClose={closeCreateModal}
                onSubmit={handleCreateCategory}
            />

            <EditCategoryModal
                isOpen={modals.isEditModalOpen}
                category={modals.editingCategory}
                onClose={closeEditModal}
                onSubmit={handleUpdateCategory}
            />

            <DeleteConfirmationModal
                isOpen={modals.isDeleteModalOpen}
                category={modals.categoryToDelete}
                onClose={closeDeleteModal}
                onConfirm={handleDeleteCategory}
            />

            {/* Notification with aria-live region */}
            {notification && (
                <div aria-live="polite" aria-atomic="true" role="status">
                    <NotificationComponent
                        type={notification.type}
                        message={notification.message}
                        onDismiss={dismissNotification}
                        duration={notification.duration}
                    />
                </div>
            )}
        </div>
    );
}
