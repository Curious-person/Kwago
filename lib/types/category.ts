/**
 * Category Management Types
 * Defines TypeScript interfaces for categories, notifications, and modal states
 * Used throughout the category management feature
 */

/**
 * Category data structure
 * Represents a product category created and managed by an author
 */
export interface Category {
  id: string; // UUID
  name: string; // 1-100 characters
  description?: string; // Optional, 0-500 characters
  author_id: string; // UUID of category owner
  product_count: number; // Computed from products table
  product_images: string[]; // Up to 3 product image URLs
  created_at: string; // ISO 8601 timestamp
  updated_at: string; // ISO 8601 timestamp
}

/**
 * Category form data for create/update operations
 * Excludes computed fields and timestamps
 */
export interface CategoryFormData {
  name: string;
  description?: string;
}

/**
 * Notification for user feedback
 * Supports success and error notification types
 */
export interface Notification {
  type: "success" | "error";
  message: string;
  duration?: number; // milliseconds, default 3000 for success
  id?: string; // Unique identifier for notification
}

/**
 * Modal state for category management
 * Tracks which modals are open and what data they contain
 */
export interface ModalState {
  isCreateModalOpen: boolean;
  isEditModalOpen: boolean;
  isDeleteModalOpen: boolean;
  editingCategory: Category | null;
  categoryToDelete: Category | null;
}

/**
 * Category Manager page state
 * Combines all state needed for the category management interface
 */
export interface CategoryManagerState {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  modals: ModalState;
  notification: Notification | null;
}

/**
 * API response for category operations
 * Standard response format for all category API endpoints
 */
export interface CategoryApiResponse {
  success: boolean;
  data?: Category | Category[];
  error?: string;
  message?: string;
}

/**
 * Validation error for form fields
 * Used for displaying field-level validation errors
 */
export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Form validation result
 * Contains validation status and any errors
 */
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}
