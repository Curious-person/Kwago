/**
 * Category Validation Utilities
 * Provides validation functions for category form data
 */

import {
  CategoryFormData,
  ValidationResult,
  ValidationError,
} from "@/lib/types/category";

/**
 * Validation constants
 */
export const CATEGORY_VALIDATION = {
  NAME_MIN_LENGTH: 1,
  NAME_MAX_LENGTH: 100,
  DESCRIPTION_MAX_LENGTH: 500,
};

/**
 * Validate category name
 * @param name - The category name to validate
 * @returns Validation error message or null if valid
 */
export function validateCategoryName(name: string): string | null {
  if (!name || name.trim().length === 0) {
    return "Category name is required";
  }

  if (name.length > CATEGORY_VALIDATION.NAME_MAX_LENGTH) {
    return `Category name must be ${CATEGORY_VALIDATION.NAME_MAX_LENGTH} characters or less`;
  }

  return null;
}

/**
 * Validate category description
 * @param description - The category description to validate
 * @returns Validation error message or null if valid
 */
export function validateCategoryDescription(
  description: string | undefined,
): string | null {
  if (!description) {
    return null; // Description is optional
  }

  if (description.length > CATEGORY_VALIDATION.DESCRIPTION_MAX_LENGTH) {
    return `Description must be ${CATEGORY_VALIDATION.DESCRIPTION_MAX_LENGTH} characters or less`;
  }

  return null;
}

/**
 * Validate complete category form data
 * @param formData - The form data to validate
 * @returns Validation result with status and errors
 */
export function validateCategoryForm(
  formData: CategoryFormData,
): ValidationResult {
  const errors: ValidationError[] = [];

  // Validate name
  const nameError = validateCategoryName(formData.name);
  if (nameError) {
    errors.push({
      field: "name",
      message: nameError,
    });
  }

  // Validate description
  const descriptionError = validateCategoryDescription(formData.description);
  if (descriptionError) {
    errors.push({
      field: "description",
      message: descriptionError,
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Get validation error for a specific field
 * @param field - The field name
 * @param validationResult - The validation result
 * @returns Error message for the field or null if no error
 */
export function getFieldError(
  field: string,
  validationResult: ValidationResult,
): string | null {
  const error = validationResult.errors.find((e) => e.field === field);
  return error ? error.message : null;
}

/**
 * Check if a field has a validation error
 * @param field - The field name
 * @param validationResult - The validation result
 * @returns True if field has an error
 */
export function hasFieldError(
  field: string,
  validationResult: ValidationResult,
): boolean {
  return validationResult.errors.some((e) => e.field === field);
}
