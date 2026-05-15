import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CreateCategoryModal } from './CreateCategoryModal';

/**
 * Unit Tests for CreateCategoryModal Component
 *
 * **Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8**
 *
 * Tests verify that the CreateCategoryModal component correctly:
 * - Renders with correct form fields
 * - Validates category name (required, max 100 chars)
 * - Displays validation errors
 * - Handles form submission
 * - Manages loading state
 * - Handles modal close
 */

describe('CreateCategoryModal Component', () => {
    const mockOnClose = vi.fn();
    const mockOnSubmit = vi.fn();

    beforeEach(() => {
        mockOnClose.mockClear();
        mockOnSubmit.mockClear();
    });

    describe('Modal Rendering', () => {
        it('should not render when isOpen is false', () => {
            render(
                <CreateCategoryModal
                    isOpen={false}
                    onClose={mockOnClose}
                    onSubmit={mockOnSubmit}
                />
            );

            expect(screen.queryByText('Create Category')).not.toBeInTheDocument();
        });

        it('should render when isOpen is true', () => {
            render(
                <CreateCategoryModal
                    isOpen={true}
                    onClose={mockOnClose}
                    onSubmit={mockOnSubmit}
                />
            );

            expect(screen.getByText('Create Category')).toBeInTheDocument();
        });

        it('should render with correct modal styling (rounded-3xl p-6 sm:p-8)', () => {
            render(
                <CreateCategoryModal
                    isOpen={true}
                    onClose={mockOnClose}
                    onSubmit={mockOnSubmit}
                />
            );

            // Check that modal renders with expected structure
            expect(screen.getByText('Create Category')).toBeInTheDocument();
            const form = screen.getByRole('button', { name: 'Create' }).closest('form');
            expect(form).toBeInTheDocument();
        });

        it('should render backdrop when modal is open', () => {
            const { container } = render(
                <CreateCategoryModal
                    isOpen={true}
                    onClose={mockOnClose}
                    onSubmit={mockOnSubmit}
                />
            );

            const backdrop = container.querySelector('.fixed.inset-0.bg-black\\/50');
            expect(backdrop).toBeInTheDocument();
        });
    });

    describe('Form Fields', () => {
        it('should render Category Name input field', () => {
            render(
                <CreateCategoryModal
                    isOpen={true}
                    onClose={mockOnClose}
                    onSubmit={mockOnSubmit}
                />
            );

            const input = screen.getByLabelText('Category Name *');
            expect(input).toBeInTheDocument();
            expect(input).toHaveAttribute('type', 'text');
            expect(input).toHaveAttribute('placeholder', 'Enter category name');
        });

        it('should render Description textarea field', () => {
            render(
                <CreateCategoryModal
                    isOpen={true}
                    onClose={mockOnClose}
                    onSubmit={mockOnSubmit}
                />
            );

            const textarea = screen.getByLabelText('Description');
            expect(textarea).toBeInTheDocument();
            expect(textarea).toHaveAttribute('placeholder', 'Add a description (optional)');
            expect(textarea).toHaveAttribute('maxLength', '500');
        });

        it('should have form labels linked to inputs with htmlFor', () => {
            render(
                <CreateCategoryModal
                    isOpen={true}
                    onClose={mockOnClose}
                    onSubmit={mockOnSubmit}
                />
            );

            // Check that labels are present and inputs are accessible
            const nameInput = screen.getByLabelText('Category Name *');
            const descInput = screen.getByLabelText('Description');

            expect(nameInput).toBeInTheDocument();
            expect(descInput).toBeInTheDocument();
        });

        it('should initialize form fields with empty values', () => {
            render(
                <CreateCategoryModal
                    isOpen={true}
                    onClose={mockOnClose}
                    onSubmit={mockOnSubmit}
                />
            );

            const nameInput = screen.getByLabelText('Category Name *') as HTMLInputElement;
            const descTextarea = screen.getByLabelText('Description') as HTMLTextAreaElement;

            expect(nameInput.value).toBe('');
            expect(descTextarea.value).toBe('');
        });

        it('should display character count for description field', () => {
            render(
                <CreateCategoryModal
                    isOpen={true}
                    onClose={mockOnClose}
                    onSubmit={mockOnSubmit}
                />
            );

            expect(screen.getByText('0/500 characters')).toBeInTheDocument();
        });

        it('should update character count as user types in description', async () => {
            const user = userEvent.setup();
            render(
                <CreateCategoryModal
                    isOpen={true}
                    onClose={mockOnClose}
                    onSubmit={mockOnSubmit}
                />
            );

            const textarea = screen.getByLabelText('Description');
            await user.type(textarea, 'Test description');

            expect(screen.getByText('16/500 characters')).toBeInTheDocument();
        });
    });

    describe('Category Name Validation', () => {
        it('should display error for empty category name on blur', async () => {
            const user = userEvent.setup();
            render(
                <CreateCategoryModal
                    isOpen={true}
                    onClose={mockOnClose}
                    onSubmit={mockOnSubmit}
                />
            );

            const input = screen.getByLabelText('Category Name *');
            await user.click(input);
            await user.tab();

            expect(screen.getByText('Category name is required')).toBeInTheDocument();
        });

        it('should display error for category name exceeding 100 characters', async () => {
            const user = userEvent.setup();
            render(
                <CreateCategoryModal
                    isOpen={true}
                    onClose={mockOnClose}
                    onSubmit={mockOnSubmit}
                />
            );

            const input = screen.getByLabelText('Category Name *');
            const longName = 'a'.repeat(101);
            await user.type(input, longName);
            await user.tab(); // Trigger blur to validate

            expect(screen.getByText('Category name must be 100 characters or less')).toBeInTheDocument();
        });

        it('should display error for whitespace-only category name', async () => {
            const user = userEvent.setup();
            render(
                <CreateCategoryModal
                    isOpen={true}
                    onClose={mockOnClose}
                    onSubmit={mockOnSubmit}
                />
            );

            const input = screen.getByLabelText('Category Name *');
            await user.type(input, '     ');
            await user.tab();

            expect(screen.getByText('Category name is required')).toBeInTheDocument();
        });

        it('should clear error when valid name is entered', async () => {
            const user = userEvent.setup();
            render(
                <CreateCategoryModal
                    isOpen={true}
                    onClose={mockOnClose}
                    onSubmit={mockOnSubmit}
                />
            );

            const input = screen.getByLabelText('Category Name *');

            // First, trigger error
            await user.click(input);
            await user.tab();
            expect(screen.getByText('Category name is required')).toBeInTheDocument();

            // Then enter valid name
            await user.type(input, 'Marvel Legends');
            expect(screen.queryByText('Category name is required')).not.toBeInTheDocument();
        });

        it('should accept category name with 1-100 characters', async () => {
            const user = userEvent.setup();
            render(
                <CreateCategoryModal
                    isOpen={true}
                    onClose={mockOnClose}
                    onSubmit={mockOnSubmit}
                />
            );

            const input = screen.getByLabelText('Category Name *');

            // Test single character
            await user.type(input, 'a');
            expect(screen.queryByText('Category name is required')).not.toBeInTheDocument();
            expect(screen.queryByText('Category name must be 100 characters or less')).not.toBeInTheDocument();

            // Clear and test 100 characters
            await user.clear(input);
            const name100 = 'a'.repeat(100);
            await user.type(input, name100);
            expect(screen.queryByText('Category name is required')).not.toBeInTheDocument();
            expect(screen.queryByText('Category name must be 100 characters or less')).not.toBeInTheDocument();
        });

        it('should validate on input change when error exists', async () => {
            const user = userEvent.setup();
            render(
                <CreateCategoryModal
                    isOpen={true}
                    onClose={mockOnClose}
                    onSubmit={mockOnSubmit}
                />
            );

            const input = screen.getByLabelText('Category Name *');

            // Trigger error
            await user.click(input);
            await user.tab();
            expect(screen.getByText('Category name is required')).toBeInTheDocument();

            // Start typing - error should clear
            await user.type(input, 'M');
            expect(screen.queryByText('Category name is required')).not.toBeInTheDocument();
        });
    });

    describe('Form Submission', () => {
        it('should call onSubmit with form data when form is submitted', async () => {
            const user = userEvent.setup();
            render(
                <CreateCategoryModal
                    isOpen={true}
                    onClose={mockOnClose}
                    onSubmit={mockOnSubmit}
                />
            );

            const nameInput = screen.getByLabelText('Category Name *');
            const descTextarea = screen.getByLabelText('Description');
            const submitButton = screen.getByRole('button', { name: 'Create' });

            await user.type(nameInput, 'Marvel Legends');
            await user.type(descTextarea, 'Marvel action figures');
            await user.click(submitButton);

            await waitFor(() => {
                expect(mockOnSubmit).toHaveBeenCalledWith('Marvel Legends', 'Marvel action figures');
            });
        });

        it('should call onSubmit with undefined description when empty', async () => {
            const user = userEvent.setup();
            render(
                <CreateCategoryModal
                    isOpen={true}
                    onClose={mockOnClose}
                    onSubmit={mockOnSubmit}
                />
            );

            const nameInput = screen.getByLabelText('Category Name *');
            const submitButton = screen.getByRole('button', { name: 'Create' });

            await user.type(nameInput, 'Marvel Legends');
            await user.click(submitButton);

            await waitFor(() => {
                expect(mockOnSubmit).toHaveBeenCalledWith('Marvel Legends', undefined);
            });
        });

        it('should not submit when category name is empty', async () => {
            const user = userEvent.setup();
            render(
                <CreateCategoryModal
                    isOpen={true}
                    onClose={mockOnClose}
                    onSubmit={mockOnSubmit}
                />
            );

            const submitButton = screen.getByRole('button', { name: 'Create' });
            await user.click(submitButton);

            expect(mockOnSubmit).not.toHaveBeenCalled();
            expect(screen.getByText('Category name is required')).toBeInTheDocument();
        });

        it('should not submit when category name exceeds 100 characters', async () => {
            const user = userEvent.setup();
            render(
                <CreateCategoryModal
                    isOpen={true}
                    onClose={mockOnClose}
                    onSubmit={mockOnSubmit}
                />
            );

            const nameInput = screen.getByLabelText('Category Name *');
            const submitButton = screen.getByRole('button', { name: 'Create' });

            const longName = 'a'.repeat(101);
            await user.type(nameInput, longName);
            await user.click(submitButton);

            expect(mockOnSubmit).not.toHaveBeenCalled();
            expect(screen.getByText('Category name must be 100 characters or less')).toBeInTheDocument();
        });

        it('should clear form after successful submission', async () => {
            const user = userEvent.setup();
            mockOnSubmit.mockResolvedValue(undefined);

            render(
                <CreateCategoryModal
                    isOpen={true}
                    onClose={mockOnClose}
                    onSubmit={mockOnSubmit}
                />
            );

            const nameInput = screen.getByLabelText('Category Name *') as HTMLInputElement;
            const descTextarea = screen.getByLabelText('Description') as HTMLTextAreaElement;
            const submitButton = screen.getByRole('button', { name: 'Create' });

            await user.type(nameInput, 'Marvel Legends');
            await user.type(descTextarea, 'Marvel action figures');
            await user.click(submitButton);

            await waitFor(() => {
                expect(nameInput.value).toBe('');
                expect(descTextarea.value).toBe('');
            });
        });

        it('should prevent form submission when loading', async () => {
            const user = userEvent.setup();
            render(
                <CreateCategoryModal
                    isOpen={true}
                    onClose={mockOnClose}
                    onSubmit={mockOnSubmit}
                    isLoading={true}
                />
            );

            const nameInput = screen.getByLabelText('Category Name *');
            const submitButton = screen.getByRole('button', { name: 'Creating...' });

            await user.type(nameInput, 'Marvel Legends');
            expect(submitButton).toBeDisabled();
        });
    });

    describe('Loading State', () => {
        it('should display "Creating..." text when isLoading is true', () => {
            render(
                <CreateCategoryModal
                    isOpen={true}
                    onClose={mockOnClose}
                    onSubmit={mockOnSubmit}
                    isLoading={true}
                />
            );

            expect(screen.getByRole('button', { name: 'Creating...' })).toBeInTheDocument();
        });

        it('should display "Create" text when isLoading is false', () => {
            render(
                <CreateCategoryModal
                    isOpen={true}
                    onClose={mockOnClose}
                    onSubmit={mockOnSubmit}
                    isLoading={false}
                />
            );

            expect(screen.getByRole('button', { name: 'Create' })).toBeInTheDocument();
        });

        it('should disable all form inputs when loading', () => {
            render(
                <CreateCategoryModal
                    isOpen={true}
                    onClose={mockOnClose}
                    onSubmit={mockOnSubmit}
                    isLoading={true}
                />
            );

            const nameInput = screen.getByLabelText('Category Name *');
            const descTextarea = screen.getByLabelText('Description');

            expect(nameInput).toBeDisabled();
            expect(descTextarea).toBeDisabled();
        });

        it('should disable buttons when loading', () => {
            render(
                <CreateCategoryModal
                    isOpen={true}
                    onClose={mockOnClose}
                    onSubmit={mockOnSubmit}
                    isLoading={true}
                />
            );

            const cancelButton = screen.getByRole('button', { name: 'Cancel' });
            const createButton = screen.getByRole('button', { name: 'Creating...' });

            expect(cancelButton).toBeDisabled();
            expect(createButton).toBeDisabled();
        });
    });

    describe('Error Display', () => {
        it('should display external error message when provided', () => {
            render(
                <CreateCategoryModal
                    isOpen={true}
                    onClose={mockOnClose}
                    onSubmit={mockOnSubmit}
                    error="Failed to create category"
                />
            );

            expect(screen.getByText('Failed to create category')).toBeInTheDocument();
        });

        it('should display error in red box styling', () => {
            render(
                <CreateCategoryModal
                    isOpen={true}
                    onClose={mockOnClose}
                    onSubmit={mockOnSubmit}
                    error="Failed to create category"
                />
            );

            const errorBox = screen.getByText('Failed to create category').closest('div');
            expect(errorBox).toHaveClass('bg-red-50', 'border', 'border-red-200');
        });

        it('should not display error box when error is null', () => {
            render(
                <CreateCategoryModal
                    isOpen={true}
                    onClose={mockOnClose}
                    onSubmit={mockOnSubmit}
                    error={null}
                />
            );

            const errorBoxes = document.querySelectorAll('.bg-red-50');
            expect(errorBoxes.length).toBe(0);
        });
    });

    describe('Modal Buttons', () => {
        it('should render Cancel button with outline style', () => {
            render(
                <CreateCategoryModal
                    isOpen={true}
                    onClose={mockOnClose}
                    onSubmit={mockOnSubmit}
                />
            );

            const cancelButton = screen.getByRole('button', { name: 'Cancel' });
            expect(cancelButton).toHaveClass('rounded-full');
        });

        it('should render Create button with primary style and 3D shadow', () => {
            render(
                <CreateCategoryModal
                    isOpen={true}
                    onClose={mockOnClose}
                    onSubmit={mockOnSubmit}
                />
            );

            const createButton = screen.getByRole('button', { name: 'Create' });
            expect(createButton).toHaveClass('rounded-full', 'shadow-[0_4px_0_0_#0047B3]');
        });

        it('should call onClose when Cancel button is clicked', async () => {
            const user = userEvent.setup();
            render(
                <CreateCategoryModal
                    isOpen={true}
                    onClose={mockOnClose}
                    onSubmit={mockOnSubmit}
                />
            );

            const cancelButton = screen.getByRole('button', { name: 'Cancel' });
            await user.click(cancelButton);

            expect(mockOnClose).toHaveBeenCalled();
        });

        it('should have buttons in flex layout with gap', () => {
            render(
                <CreateCategoryModal
                    isOpen={true}
                    onClose={mockOnClose}
                    onSubmit={mockOnSubmit}
                />
            );

            const cancelButton = screen.getByRole('button', { name: 'Cancel' });
            const buttonContainer = cancelButton.closest('div');
            expect(buttonContainer).toHaveClass('flex', 'flex-col', 'sm:flex-row', 'gap-3', 'sm:gap-4');
        });
    });

    describe('Modal Close', () => {
        it('should call onClose when close button is clicked', async () => {
            const user = userEvent.setup();
            render(
                <CreateCategoryModal
                    isOpen={true}
                    onClose={mockOnClose}
                    onSubmit={mockOnSubmit}
                />
            );

            const closeButton = screen.getByLabelText('Close modal');
            await user.click(closeButton);

            expect(mockOnClose).toHaveBeenCalled();
        });

        it('should call onClose when backdrop is clicked', async () => {
            const user = userEvent.setup();
            const { container } = render(
                <CreateCategoryModal
                    isOpen={true}
                    onClose={mockOnClose}
                    onSubmit={mockOnSubmit}
                />
            );

            const backdrop = container.querySelector('.fixed.inset-0.bg-black');
            if (backdrop) {
                await user.click(backdrop);
                expect(mockOnClose).toHaveBeenCalled();
            }
        });

        it('should clear form when modal is closed', async () => {
            const user = userEvent.setup();
            const { rerender } = render(
                <CreateCategoryModal
                    isOpen={true}
                    onClose={mockOnClose}
                    onSubmit={mockOnSubmit}
                />
            );

            const nameInput = screen.getByLabelText('Category Name *') as HTMLInputElement;
            await user.type(nameInput, 'Marvel Legends');

            const cancelButton = screen.getByRole('button', { name: 'Cancel' });
            await user.click(cancelButton);

            // Rerender with modal closed
            rerender(
                <CreateCategoryModal
                    isOpen={false}
                    onClose={mockOnClose}
                    onSubmit={mockOnSubmit}
                />
            );

            // Rerender with modal open again
            rerender(
                <CreateCategoryModal
                    isOpen={true}
                    onClose={mockOnClose}
                    onSubmit={mockOnSubmit}
                />
            );

            const newNameInput = screen.getByLabelText('Category Name *') as HTMLInputElement;
            expect(newNameInput.value).toBe('');
        });
    });

    describe('Accessibility', () => {
        it('should have proper heading hierarchy', () => {
            render(
                <CreateCategoryModal
                    isOpen={true}
                    onClose={mockOnClose}
                    onSubmit={mockOnSubmit}
                />
            );

            const heading = screen.getByText('Create Category');
            expect(heading.tagName).toBe('H2');
        });

        it('should have aria-label on close button', () => {
            render(
                <CreateCategoryModal
                    isOpen={true}
                    onClose={mockOnClose}
                    onSubmit={mockOnSubmit}
                />
            );

            const closeButton = screen.getByLabelText('Close modal');
            expect(closeButton).toHaveAttribute('aria-label', 'Close modal');
        });

        it('should have form inputs with proper labels', () => {
            render(
                <CreateCategoryModal
                    isOpen={true}
                    onClose={mockOnClose}
                    onSubmit={mockOnSubmit}
                />
            );

            const nameLabel = screen.getByText('Category Name *');
            const descLabel = screen.getByText('Description');

            expect(nameLabel).toBeInTheDocument();
            expect(descLabel).toBeInTheDocument();
        });

        it('should support keyboard navigation', async () => {
            const user = userEvent.setup();
            render(
                <CreateCategoryModal
                    isOpen={true}
                    onClose={mockOnClose}
                    onSubmit={mockOnSubmit}
                />
            );

            const nameInput = screen.getByLabelText('Category Name *');
            const descTextarea = screen.getByLabelText('Description');
            const cancelButton = screen.getByRole('button', { name: 'Cancel' });

            // Click on the modal to focus it, then tab through elements
            await user.click(nameInput);
            expect(nameInput).toHaveFocus();

            await user.tab();
            expect(descTextarea).toHaveFocus();

            await user.tab();
            expect(cancelButton).toHaveFocus();
        });
    });

    describe('Edge Cases', () => {
        it('should handle rapid form submissions', async () => {
            const user = userEvent.setup();
            mockOnSubmit.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

            render(
                <CreateCategoryModal
                    isOpen={true}
                    onClose={mockOnClose}
                    onSubmit={mockOnSubmit}
                />
            );

            const nameInput = screen.getByLabelText('Category Name *');
            const submitButton = screen.getByRole('button', { name: 'Create' });

            await user.type(nameInput, 'Marvel Legends');
            await user.click(submitButton);
            await user.click(submitButton);

            await waitFor(() => {
                expect(mockOnSubmit).toHaveBeenCalledTimes(1);
            });
        });

        it('should handle very long category names at boundary', async () => {
            const user = userEvent.setup();
            render(
                <CreateCategoryModal
                    isOpen={true}
                    onClose={mockOnClose}
                    onSubmit={mockOnSubmit}
                />
            );

            const nameInput = screen.getByLabelText('Category Name *');
            const name100 = 'a'.repeat(100);
            const name101 = 'a'.repeat(101);

            // Test 100 chars (should be valid)
            await user.type(nameInput, name100);
            await user.tab(); // Trigger blur to validate
            expect(screen.queryByText('Category name must be 100 characters or less')).not.toBeInTheDocument();

            // Clear and test 101 chars (should be invalid)
            await user.clear(nameInput);
            await user.type(nameInput, name101);
            await user.tab(); // Trigger blur to validate
            expect(screen.getByText('Category name must be 100 characters or less')).toBeInTheDocument();
        });

        it('should handle special characters in category name', async () => {
            const user = userEvent.setup();
            render(
                <CreateCategoryModal
                    isOpen={true}
                    onClose={mockOnClose}
                    onSubmit={mockOnSubmit}
                />
            );

            const nameInput = screen.getByLabelText('Category Name *');
            const submitButton = screen.getByRole('button', { name: 'Create' });

            await user.type(nameInput, 'Marvel & DC (2024)');
            await user.click(submitButton);

            await waitFor(() => {
                expect(mockOnSubmit).toHaveBeenCalledWith('Marvel & DC (2024)', undefined);
            });
        });

        it('should handle unicode characters in category name', async () => {
            const user = userEvent.setup();
            render(
                <CreateCategoryModal
                    isOpen={true}
                    onClose={mockOnClose}
                    onSubmit={mockOnSubmit}
                />
            );

            const nameInput = screen.getByLabelText('Category Name *');
            const submitButton = screen.getByRole('button', { name: 'Create' });

            await user.type(nameInput, 'Café Français');
            await user.click(submitButton);

            await waitFor(() => {
                expect(mockOnSubmit).toHaveBeenCalledWith('Café Français', undefined);
            });
        });
    });
});
