import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ErrorState } from './ErrorState';

/**
 * Unit Tests for ErrorState Component
 *
 * Tests that the error state displays error messages correctly
 * and provides retry functionality for failed operations.
 *
 * Requirements: 7.5, 13.1, 13.2, 13.3, 13.4, 13.5
 */
describe('ErrorState Component', () => {
    const mockOnRetry = vi.fn();

    beforeEach(() => {
        mockOnRetry.mockClear();
    });

    it('should render error message', () => {
        const errorMessage = 'Failed to load categories. Please try again.';
        render(<ErrorState error={errorMessage} onRetry={mockOnRetry} />);

        expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    it('should display error banner with alert icon', () => {
        render(
            <ErrorState
                error="Network error. Please check your connection and try again."
                onRetry={mockOnRetry}
            />
        );

        // Check for error banner
        const errorBanner = screen.getByText(/Failed to load categories/i).closest('.bg-red-50');
        expect(errorBanner).toBeInTheDocument();
    });

    it('should display retry button', () => {
        render(<ErrorState error="Test error" onRetry={mockOnRetry} />);

        const retryButton = screen.getByRole('button', { name: /retry/i });
        expect(retryButton).toBeInTheDocument();
    });

    it('should call onRetry when retry button is clicked', () => {
        render(<ErrorState error="Test error" onRetry={mockOnRetry} />);

        const retryButton = screen.getByRole('button', { name: /retry/i });
        fireEvent.click(retryButton);

        expect(mockOnRetry).toHaveBeenCalledTimes(1);
    });

    it('should display "Retrying..." text when isRetrying is true', () => {
        render(<ErrorState error="Test error" onRetry={mockOnRetry} isRetrying={true} />);

        expect(screen.getByText('Retrying...')).toBeInTheDocument();
    });

    it('should disable retry button when isRetrying is true', () => {
        render(<ErrorState error="Test error" onRetry={mockOnRetry} isRetrying={true} />);

        const retryButton = screen.getByRole('button');
        expect(retryButton).toBeDisabled();
    });

    it('should display "Retry" text when isRetrying is false', () => {
        render(<ErrorState error="Test error" onRetry={mockOnRetry} isRetrying={false} />);

        expect(screen.getByText('Retry')).toBeInTheDocument();
    });

    it('should enable retry button when isRetrying is false', () => {
        render(<ErrorState error="Test error" onRetry={mockOnRetry} isRetrying={false} />);

        const retryButton = screen.getByRole('button', { name: /retry/i });
        expect(retryButton).not.toBeDisabled();
    });

    it('should display error banner at top of page', () => {
        const { container } = render(<ErrorState error="Test error" onRetry={mockOnRetry} />);

        // Check for error banner positioning
        const errorBanner = container.querySelector('.bg-red-50');
        expect(errorBanner).toHaveClass('rounded-lg', 'border', 'border-red-200');
    });

    it('should display different error messages', () => {
        const { rerender } = render(
            <ErrorState error="Network error" onRetry={mockOnRetry} />
        );
        expect(screen.getByText('Network error')).toBeInTheDocument();

        rerender(<ErrorState error="Server error" onRetry={mockOnRetry} />);
        expect(screen.getByText('Server error')).toBeInTheDocument();
    });

    it('should have proper styling for error state', () => {
        const { container } = render(<ErrorState error="Test error" onRetry={mockOnRetry} />);

        // Check for error styling
        const errorBanner = container.querySelector('.bg-red-50');
        expect(errorBanner).toHaveClass('bg-red-50', 'border-red-200');

        // Check for alert icon styling
        const alertIcon = container.querySelector('.text-red-600');
        expect(alertIcon).toBeInTheDocument();
    });

    it('should display retry button with proper styling', () => {
        const { container } = render(<ErrorState error="Test error" onRetry={mockOnRetry} />);

        const retryButton = screen.getByRole('button', { name: /retry/i });
        expect(retryButton).toHaveClass('bg-red-600', 'text-white', 'rounded-full');
    });

    it('should display helper text about checking connection', () => {
        render(<ErrorState error="Test error" onRetry={mockOnRetry} />);

        expect(
            screen.getByText('Please check your connection and try again.')
        ).toBeInTheDocument();
    });

    it('should have aria-label on retry button for accessibility', () => {
        render(<ErrorState error="Test error" onRetry={mockOnRetry} />);

        const retryButton = screen.getByRole('button', { name: /retry loading categories/i });
        expect(retryButton).toBeInTheDocument();
    });
});
