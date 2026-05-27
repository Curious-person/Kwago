'use client';

import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { X } from 'lucide-react';

/**
 * CreateCategoryModal Component
 *
 * Modal for creating a new category.
 * Includes form validation for category name (required, max 100 chars).
 *
 * Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9, 3.10, 9.5, 9.6, 9.7, 11.2, 11.6
 */
interface CreateCategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (name: string, description: string | undefined) => Promise<void>;
    isLoading?: boolean;
    error?: string | null;
}

export const CreateCategoryModal: React.FC<CreateCategoryModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    isLoading = false,
    error: externalError = null,
}) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [nameError, setNameError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Validate category name
    const validateName = useCallback((value: string) => {
        if (!value.trim()) {
            setNameError('Category name is required');
            return false;
        }
        if (value.length > 100) {
            setNameError('Category name must be 100 characters or less');
            return false;
        }
        setNameError(null);
        return true;
    }, []);

    // Handle name change
    const handleNameChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value;
            setName(value);
            if (nameError) {
                validateName(value);
            }
        },
        [nameError, validateName]
    );

    // Handle form submission
    const handleSubmit = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault();

            if (!validateName(name)) {
                return;
            }

            try {
                setIsSubmitting(true);
                await onSubmit(name, description || undefined);
                setName('');
                setDescription('');
                setNameError(null);
            } catch (err) {
                console.error('Error submitting form:', err);
            } finally {
                setIsSubmitting(false);
            }
        },
        [name, description, validateName, onSubmit]
    );

    // Handle modal close
    const handleClose = useCallback(() => {
        setName('');
        setDescription('');
        setNameError(null);
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

    // Handle Enter key to submit form
    const handleFormKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLFormElement>) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                handleSubmit(e as any);
            }
        },
        [handleSubmit]
    );

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 z-40 transition-opacity"
                onClick={handleClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-md sm:max-w-md max-h-[90vh] overflow-y-auto shadow-lg" role="dialog" aria-modal="true" aria-labelledby="createCategoryTitle">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <h2 id="createCategoryTitle" className="text-xl sm:text-2xl font-bold text-zinc-900">Create Category</h2>
                        <button
                            onClick={handleClose}
                            className="text-zinc-400 hover:text-zinc-600 transition-colors flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:ring-offset-2 rounded p-1"
                            aria-label="Close modal"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} onKeyDown={handleFormKeyDown} className="space-y-6">
                        {/* Category Name Field */}
                        <div>
                            <label htmlFor="categoryName" className="block text-sm font-medium text-zinc-900 mb-2">
                                Category Name *
                            </label>
                            <Input
                                id="categoryName"
                                type="text"
                                placeholder="Enter category name"
                                value={name}
                                onChange={handleNameChange}
                                onBlur={() => validateName(name)}
                                disabled={isSubmitting || isLoading}
                                className={nameError ? 'border-red-500' : ''}
                            />
                            {nameError && (
                                <p className="mt-2 text-sm text-red-600">{nameError}</p>
                            )}
                        </div>

                        {/* Description Field */}
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-zinc-900 mb-2">
                                Description
                            </label>
                            <textarea
                                id="description"
                                placeholder="Add a description (optional)"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                disabled={isSubmitting || isLoading}
                                maxLength={500}
                                rows={4}
                                className="w-full rounded-full border-none bg-zinc-100 px-6 py-3 text-base sm:text-sm placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0066FF] disabled:opacity-50 transition-all resize-none"
                            />
                            <p className="mt-1 text-xs text-zinc-500">
                                {description.length}/500 characters
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
                                disabled={isSubmitting || isLoading}
                                className="flex-1 rounded-full focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:ring-offset-2"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                size="md"
                                disabled={isSubmitting || isLoading}
                                className="flex-1 rounded-full shadow-[0_4px_0_0_#0047B3] hover:shadow-[0_4px_0_0_#0047B3] active:translate-y-[2px] active:shadow-[0_2px_0_0_#0047B3] focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:ring-offset-2"
                            >
                                {isSubmitting || isLoading ? 'Creating...' : 'Create'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};
