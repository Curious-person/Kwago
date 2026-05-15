'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Category, Notification, ModalState } from '@/lib/types/category';
import { MOCK_CATEGORIES } from '@/lib/data/mockCategories';
import { CategoryHeader } from '@/components/dashboard/CategoryHeader';
import { CategoryGrid } from '@/components/dashboard/CategoryGrid';
import { CreateCategoryModal } from '@/components/dashboard/CreateCategoryModal';
import { EditCategoryModal } from '@/components/dashboard/EditCategoryModal';
import { DeleteConfirmationModal } from '@/components/dashboard/DeleteConfirmationModal';
import { Notification as NotificationComponent } from '@/components/dashboard/Notification';
import { LoadingState } from '@/components/dashboard/LoadingState';
import { ErrorState } from '@/components/dashboard/ErrorState';
import {
    getCachedCategories,
    saveCategoriesToCache,
    updateCategoryInCache,
    addCategoryToCache,
    removeCategoryFromCache,
    isCacheStale,
    getCacheAge,
} from '@/lib/services/categoryCache';

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

    // Load categories on mount with caching
    useEffect(() => {
        loadCategories();

        // Set up background refresh if cache is stale
        const checkAndRefreshCache = () => {
            if (isCacheStale()) {
                console.log('Cache is stale, refreshing in background...');
                loadCategories(true); // Force refresh in background
            }
        };

        // Check cache staleness every minute
        const refreshInterval = setInterval(checkAndRefreshCache, 60 * 1000);

        return () => clearInterval(refreshInterval);
    }, []);

    /**
     * API_INTEGRATION_POINT_1: Fetch categories
     * Replace with: const response = await fetch('/api/categories');
     * Expected response: { categories: Category[] }
     *
     * Performance optimization: Uses local caching to reduce API calls
     * Requirements: 14.4, 14.5
     */
    const loadCategories = useCallback(async (backgroundRefresh = false) => {
        try {
            if (!backgroundRefresh) {
                setIsLoading(true);
            }
            setError(null);
            setIsRetrying(false);

            // Check cache first (unless forcing refresh)
            if (!backgroundRefresh) {
                const cachedCategories = getCachedCategories();
                if (cachedCategories) {
                    console.log('Using cached categories for initial display');
                    setCategories(cachedCategories);

                    // Show cache age in console for debugging
                    const cacheAge = getCacheAge();
                    if (cacheAge !== null) {
                        console.log(`Cache age: ${cacheAge} seconds`);
                    }

                    // Still fetch fresh data in background if cache is stale
                    if (isCacheStale()) {
                        console.log('Cache is stale, fetching fresh data in background...');
                        setTimeout(() => loadCategories(true), 100); // Small delay to prioritize UI
                    }

                    if (!backgroundRefresh) {
                        setIsLoading(false);
                    }
                    return;
                }
            }

            // Mock data - replace with API call
            // Simulate network delay (shorter for background refresh)
            const delay = backgroundRefresh ? 100 : 500;
            await new Promise(resolve => setTimeout(resolve, delay));

            const mockCategories = MOCK_CATEGORIES;

            // Update state
            setCategories(mockCategories);

            // Save to cache
            saveCategoriesToCache(mockCategories);

            // Show success notification for background refresh
            if (backgroundRefresh) {
                console.log('Background refresh completed, cache updated');
            }
        } catch (err) {
            // Handle different error types
            let errorMessage = 'Failed to load categories. Please try again.';

            if (err instanceof TypeError && err.message.includes('fetch')) {
                errorMessage = 'Network error. Please check your connection and try again.';
            } else if (err instanceof Error) {
                if (err.message.includes('401') || err.message.includes('Unauthorized')) {
                    errorMessage = 'You are not authorized to view categories.';
                } else if (err.message.includes('404') || err.message.includes('Not Found')) {
                    errorMessage = 'Categories not found.';
                } else if (err.message.includes('500') || err.message.includes('Server')) {
                    errorMessage = 'Server error. Please try again later.';
                }
            }

            // Only show error if not a background refresh
            if (!backgroundRefresh) {
                setError(errorMessage);
            }
            console.error('Error loading categories:', err);
        } finally {
            if (!backgroundRefresh) {
                setIsLoading(false);
            }
        }
    }, []);

    /**
     * API_INTEGRATION_POINT_2: Create category
     * Replace with: const response = await fetch('/api/categories', { method: 'POST', ... });
     * Expected response: { id, name, description, author_id, product_count, product_images, created_at, updated_at }
     *
     * Performance optimization: Updates local cache after creation
     * Requirements: 14.2, 14.4
     */
    const handleCreateCategory = useCallback(
        async (name: string, description: string | undefined) => {
            try {
                const newCategory: Category = {
                    id: `cat-${Date.now()}`,
                    name,
                    description,
                    author_id: 'user-123',
                    product_count: 0,
                    product_images: [],
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                };

                // Update state
                setCategories([...categories, newCategory]);

                // Update cache
                addCategoryToCache(newCategory);

                setModals(prev => ({ ...prev, isCreateModalOpen: false }));
                setNotification({
                    type: 'success',
                    message: 'Category created successfully',
                    duration: 3000,
                });
            } catch (err) {
                setNotification({
                    type: 'error',
                    message: 'Failed to create category. Please try again.',
                });
                console.error('Error creating category:', err);
            }
        },
        [categories]
    );

    /**
     * API_INTEGRATION_POINT_3: Update category
     * Replace with: const response = await fetch(`/api/categories/${id}`, { method: 'PUT', ... });
     * Expected response: { id, name, description, author_id, product_count, product_images, created_at, updated_at }
     *
     * Performance optimization: Updates local cache after update
     * Requirements: 14.2, 14.4
     */
    const handleUpdateCategory = useCallback(
        async (id: string, name: string, description: string | undefined) => {
            try {
                const updatedCategory: Category = {
                    id,
                    name,
                    description,
                    author_id: 'user-123',
                    product_count: categories.find(cat => cat.id === id)?.product_count || 0,
                    product_images: categories.find(cat => cat.id === id)?.product_images || [],
                    created_at: categories.find(cat => cat.id === id)?.created_at || new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                };

                // Update state
                setCategories(
                    categories.map(cat =>
                        cat.id === id ? updatedCategory : cat
                    )
                );

                // Update cache
                updateCategoryInCache(updatedCategory);

                setModals(prev => ({ ...prev, isEditModalOpen: false, editingCategory: null }));
                setNotification({
                    type: 'success',
                    message: 'Category updated successfully',
                    duration: 3000,
                });
            } catch (err) {
                setNotification({
                    type: 'error',
                    message: 'Failed to update category. Please try again.',
                });
                console.error('Error updating category:', err);
            }
        },
        [categories]
    );

    /**
     * API_INTEGRATION_POINT_4: Delete category
     * Replace with: const response = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
     * Expected response: { success: true }
     *
     * Performance optimization: Updates local cache after deletion
     * Requirements: 14.2, 14.4
     */
    const handleDeleteCategory = useCallback(
        async (id: string) => {
            try {
                // Update state
                setCategories(categories.filter(cat => cat.id !== id));

                // Update cache
                removeCategoryFromCache(id);

                setModals(prev => ({ ...prev, isDeleteModalOpen: false, categoryToDelete: null }));
                setNotification({
                    type: 'success',
                    message: 'Category deleted successfully',
                    duration: 3000,
                });
            } catch (err) {
                setNotification({
                    type: 'error',
                    message: 'Failed to delete category. Please try again.',
                });
                console.error('Error deleting category:', err);
            }
        },
        [categories]
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
