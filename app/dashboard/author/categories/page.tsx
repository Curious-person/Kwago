'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Category, Notification, ModalState } from '@/lib/types/category';
import { MOCK_CATEGORIES } from '@/lib/data/mockCategories';
import { CategoryHeader } from '@/components/dashboard/CategoryHeader';
import { CategoryGrid } from '@/components/dashboard/CategoryGrid';
import { CreateCategoryModal } from '@/components/dashboard/CreateCategoryModal';
import { EditCategoryModal } from '@/components/dashboard/EditCategoryModal';
import { DeleteConfirmationModal } from '@/components/dashboard/DeleteConfirmationModal';
import { Notification as NotificationComponent } from '@/components/dashboard/Notification';

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
     * API_INTEGRATION_POINT_1: Fetch categories
     * Replace with: const response = await fetch('/api/categories');
     * Expected response: { categories: Category[] }
     */
    const loadCategories = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            // Mock data - replace with API call
            const mockCategories = MOCK_CATEGORIES;

            setCategories(mockCategories);
        } catch (err) {
            setError('Failed to load categories. Please try again.');
            console.error('Error loading categories:', err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * API_INTEGRATION_POINT_2: Create category
     * Replace with: const response = await fetch('/api/categories', { method: 'POST', ... });
     * Expected response: { id, name, description, author_id, product_count, product_images, created_at, updated_at }
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

                setCategories([...categories, newCategory]);
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
     */
    const handleUpdateCategory = useCallback(
        async (id: string, name: string, description: string | undefined) => {
            try {
                setCategories(
                    categories.map(cat =>
                        cat.id === id
                            ? { ...cat, name, description, updated_at: new Date().toISOString() }
                            : cat
                    )
                );
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
     */
    const handleDeleteCategory = useCallback(
        async (id: string) => {
            try {
                setCategories(categories.filter(cat => cat.id !== id));
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
    const handleRetry = useCallback(() => {
        loadCategories();
    }, [loadCategories]);

    // Show loading state
    if (isLoading) {
        return (
            <div className="flex-1 p-8">
                <div className="animate-pulse space-y-8">
                    <div className="h-12 bg-zinc-200 rounded-full w-48"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-64 bg-zinc-200 rounded-3xl"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // Show error state
    if (error) {
        return (
            <div className="flex-1 p-8">
                <div className="text-center py-12">
                    <h2 className="text-2xl font-bold text-zinc-900 mb-4">Failed to load categories</h2>
                    <p className="text-zinc-600 mb-8">{error}</p>
                    <button
                        onClick={handleRetry}
                        className="px-6 py-2.5 bg-[#0066FF] text-white rounded-full shadow-[0_4px_0_0_#0047B3] hover:bg-[#0052CC] active:translate-y-[2px] active:shadow-[0_2px_0_0_#0047B3] transition-all"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
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

            {/* Notification */}
            {notification && (
                <NotificationComponent
                    type={notification.type}
                    message={notification.message}
                    onDismiss={dismissNotification}
                    duration={notification.duration}
                />
            )}
        </div>
    );
}
