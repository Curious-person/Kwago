'use client';

import React, { useEffect, useCallback } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

/**
 * Notification Component
 *
 * Displays success/error notifications with auto-dismiss for success.
 * Positioned at top-right corner with smooth animations.
 *
 * Requirements: 3.10, 4.6, 4.7, 5.8, 5.9, 13.1, 13.2, 13.3, 13.4, 13.5, 13.6, 13.7
 */
interface NotificationProps {
    type: 'success' | 'error';
    message: string;
    onDismiss: () => void;
    duration?: number; // milliseconds, default 3000 for success
}

export const Notification: React.FC<NotificationProps> = ({
    type,
    message,
    onDismiss,
    duration = 3000,
}) => {
    // Auto-dismiss success notifications
    useEffect(() => {
        if (type === 'success') {
            const timer = setTimeout(onDismiss, duration);
            return () => clearTimeout(timer);
        }
    }, [type, duration, onDismiss]);

    const isSuccess = type === 'success';
    const bgColor = isSuccess ? 'bg-green-50' : 'bg-red-50';
    const borderColor = isSuccess ? 'border-green-200' : 'border-red-200';
    const textColor = isSuccess ? 'text-green-800' : 'text-red-800';
    const Icon = isSuccess ? CheckCircle : AlertCircle;
    const iconColor = isSuccess ? 'text-green-600' : 'text-red-600';

    return (
        <div
            className={`fixed top-6 right-6 z-50 flex items-start gap-4 p-4 rounded-lg border ${bgColor} ${borderColor} max-w-sm animate-in fade-in slide-in-from-top-2 duration-200`}
            role="alert"
            aria-live="polite"
        >
            <Icon size={20} className={`flex-shrink-0 mt-0.5 ${iconColor}`} />
            <p className={`text-sm font-medium ${textColor} flex-1`}>{message}</p>
            {type === 'error' && (
                <button
                    onClick={onDismiss}
                    className={`flex-shrink-0 ${textColor} hover:opacity-70 transition-opacity`}
                    aria-label="Dismiss notification"
                >
                    <X size={18} />
                </button>
            )}
        </div>
    );
};
