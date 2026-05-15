'use client';

import React from 'react';
import { AlertCircle } from 'lucide-react';

/**
 * ErrorState Component
 *
 * Displays error message with retry button when category loading fails.
 * Supports different error types with appropriate messages.
 *
 * Requirements: 7.5, 13.1, 13.2, 13.3, 13.4, 13.5
 */
interface ErrorStateProps {
    error: string;
    onRetry: () => void;
    isRetrying?: boolean;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
    error,
    onRetry,
    isRetrying = false,
}) => {
    return (
        <div className="flex-1 p-8">
            {/* Error banner at top of page */}
            <div className="mb-8 rounded-lg border border-red-200 bg-red-50 p-6">
                <div className="flex items-start gap-4">
                    <AlertCircle size={24} className="flex-shrink-0 text-red-600 mt-0.5" />
                    <div className="flex-1">
                        <h2 className="text-lg font-bold text-red-900 mb-2">Failed to load categories</h2>
                        <p className="text-red-800 mb-4">{error}</p>
                        <button
                            onClick={onRetry}
                            disabled={isRetrying}
                            className="px-6 py-2.5 bg-red-600 text-white rounded-full shadow-[0_4px_0_0_#991B1B] hover:bg-red-700 active:translate-y-[2px] active:shadow-[0_2px_0_0_#991B1B] transition-all disabled:opacity-50 disabled:pointer-events-none"
                            aria-label="Retry loading categories"
                        >
                            {isRetrying ? 'Retrying...' : 'Retry'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Empty state placeholder */}
            <div className="text-center py-12">
                <p className="text-zinc-600">
                    Please check your connection and try again.
                </p>
            </div>
        </div>
    );
};
