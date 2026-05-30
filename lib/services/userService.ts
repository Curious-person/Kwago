/**
 * UserService Module
 *
 * Provides type definitions and business logic for user management CRUD operations.
 * This module serves as the foundation for all user-related database operations,
 * including fetching, filtering, sorting, and updating user data from Supabase.
 *
 * Type Definitions:
 * - ErrorCode: Enumeration of all possible error codes
 * - ErrorResponse: Structure for error responses
 * - SuccessResponse<T>: Structure for successful responses
 * - ServiceResponse<T>: Union type for all possible responses
 * - PaginationParams: Parameters for pagination
 * - PaginatedResponse<T>: Response structure with pagination metadata
 * - UserQueryFilters: Filters for user queries
 * - User: Frontend user interface
 */

/**
 * ErrorCode type
 *
 * Represents all possible error codes that can be returned by the UserService.
 * Each code corresponds to a specific error condition and guides error handling
 * and user-facing error messages.
 *
 * - NETWORK_ERROR: Connection failures, timeouts, DNS resolution failures
 * - AUTH_ERROR: Session expired, invalid credentials, token revoked
 * - PERMISSION_ERROR: User lacks admin role, insufficient privileges
 * - VALIDATION_ERROR: Invalid input data, schema mismatch, constraint violation
 * - CONSTRAINT_ERROR: Database constraint violation (unique, foreign key, check)
 * - NOT_FOUND_ERROR: User ID doesn't exist, resource deleted
 * - UNKNOWN_ERROR: Unexpected server error
 */
export type ErrorCode =
  | "NETWORK_ERROR"
  | "AUTH_ERROR"
  | "PERMISSION_ERROR"
  | "VALIDATION_ERROR"
  | "CONSTRAINT_ERROR"
  | "NOT_FOUND_ERROR"
  | "UNKNOWN_ERROR";

/**
 * ErrorResponse interface
 *
 * Represents the structure of an error response from the UserService.
 * All error responses follow this consistent structure to enable uniform
 * error handling across the application.
 *
 * @property success - Always false for error responses
 * @property error - Error details object
 * @property error.code - Machine-readable error code for programmatic handling
 * @property error.message - User-friendly error message for display
 * @property error.details - Optional debugging information (not shown to users)
 */
export interface ErrorResponse {
  success: false;
  error: {
    code: ErrorCode;
    message: string;
    details?: Record<string, unknown>;
  };
}

/**
 * SuccessResponse<T> interface
 *
 * Represents the structure of a successful response from the UserService.
 * Generic type T allows for type-safe responses containing different data types.
 *
 * @template T - The type of data being returned
 * @property success - Always true for success responses
 * @property data - The actual response data of type T
 */
export interface SuccessResponse<T> {
  success: true;
  data: T;
}

/**
 * ServiceResponse<T> type
 *
 * Union type representing all possible responses from UserService functions.
 * This type ensures that all service functions return either a success or error
 * response, enabling exhaustive type checking in calling code.
 *
 * @template T - The type of data in the success response
 */
export type ServiceResponse<T> = SuccessResponse<T> | ErrorResponse;

/**
 * PaginationParams interface
 *
 * Represents pagination parameters for fetching paginated user lists.
 * Used to control which subset of users is returned from a query.
 *
 * @property page - 1-indexed page number (page 1 is the first page)
 * @property limit - Number of items per page (default: 10)
 */
export interface PaginationParams {
  page: number;
  limit: number;
}

/**
 * PaginatedResponse<T> interface
 *
 * Represents a paginated response containing a batch of items and metadata
 * about the pagination state. This allows clients to understand the current
 * position in the dataset and navigate between pages.
 *
 * @template T - The type of items in the data array
 * @property data - Array of items for the current page
 * @property pagination - Pagination metadata
 * @property pagination.page - Current page number (1-indexed)
 * @property pagination.limit - Items per page
 * @property pagination.total - Total number of items across all pages
 * @property pagination.totalPages - Total number of pages
 * @property pagination.hasNextPage - Whether there is a next page available
 * @property pagination.hasPreviousPage - Whether there is a previous page available
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

/**
 * UserQueryFilters interface
 *
 * Represents optional filters that can be applied to user queries.
 * All filter properties are optional, allowing for flexible query construction.
 * Multiple filters can be combined to narrow down results.
 *
 * @property role - Filter by user role (member or author)
 * @property status - Filter by account status (active or suspended)
 * @property search - Search by display_name or email (case-insensitive substring match)
 * @property sortBy - Field to sort results by
 * @property sortOrder - Direction to sort (ascending or descending)
 */
export interface UserQueryFilters {
  role?: "member" | "author";
  status?: "active" | "suspended";
  search?: string;
  sortBy?: "created_at" | "email" | "display_name";
  sortOrder?: "asc" | "desc";
}

/**
 * User interface
 *
 * Represents a user object as returned to the frontend.
 * This is the primary interface used throughout the application for displaying
 * and managing user data. It includes all required fields from the Supabase
 * profiles table, with some fields being optional for flexibility.
 *
 * @property id - UUID from Supabase Auth, unique identifier
 * @property email - User's email address, unique and immutable
 * @property display_name - User's display name for UI presentation
 * @property avatar_url - URL to user's avatar image
 * @property role - User's role (member or author)
 * @property status - User's account status (active or suspended)
 * @property created_at - ISO 8601 timestamp of account creation
 * @property updated_at - ISO 8601 timestamp of last update (optional)
 * @property posts_count - Number of posts created by user (optional, derived)
 */
export interface User {
  id: string;
  email: string;
  display_name: string | null;
  avatar_url: string | null;
  role: "member" | "author";
  status: "active" | "suspended";
  created_at: string;
  updated_at?: string;
  posts_count?: number;
}

/**
 * Profile interface
 *
 * Represents a user profile as stored in the Supabase profiles table.
 * This is the database schema that gets transformed to the frontend User interface.
 *
 * @property id - UUID from Supabase Auth, unique identifier
 * @property email - User's email address, unique and immutable
 * @property display_name - User's display name for UI presentation
 * @property avatar_url - URL to user's avatar image
 * @property role - User's role (member, author, or admin)
 * @property status - User's account status (active or suspended)
 * @property created_at - ISO 8601 timestamp of account creation
 * @property updated_at - ISO 8601 timestamp of last update
 */
export interface Profile {
  id: string;
  email: string;
  display_name: string | null;
  avatar_url: string | null;
  role: "member" | "author" | "admin";
  status: "active" | "suspended";
  created_at: string;
  updated_at: string;
}

/**
 * validateUser function
 *
 * Validates that unknown data conforms to the User schema.
 * Performs comprehensive validation of all required fields and their types.
 *
 * Validation Rules:
 * - data must be an object (not null, not array)
 * - id: required, must be non-empty string (UUID format)
 * - email: required, must be non-empty string
 * - display_name: required field, must be string or null
 * - avatar_url: optional field, must be string or null
 * - role: required, must be one of 'member', 'author', 'admin'
 * - status: required, must be one of 'active', 'suspended'
 * - created_at: required, must be valid ISO 8601 timestamp string
 *
 * @param data - Unknown data to validate against User schema
 * @returns ServiceResponse<User> - Success response with validated User, or error response with details
 *
 * @example
 * // Valid user data
 * const result = validateUser({
 *   id: '550e8400-e29b-41d4-a716-446655440000',
 *   email: 'user@example.com',
 *   display_name: 'John Doe',
 *   avatar_url: 'https://example.com/avatar.jpg',
 *   role: 'member',
 *   status: 'active',
 *   created_at: '2024-01-15T10:30:00Z'
 * });
 * // Returns: { success: true, data: { ... } }
 *
 * @example
 * // Invalid user data - missing required field
 * const result = validateUser({
 *   id: '550e8400-e29b-41d4-a716-446655440000',
 *   email: 'user@example.com',
 *   // display_name is missing
 *   role: 'member',
 *   status: 'active',
 *   created_at: '2024-01-15T10:30:00Z'
 * });
 * // Returns: { success: false, error: { code: 'VALIDATION_ERROR', message: '...', details: { field: 'display_name' } } }
 */
export function validateUser(data: unknown): ServiceResponse<User> {
  // Check if data is an object
  if (data === null || typeof data !== "object" || Array.isArray(data)) {
    return {
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "User data must be an object",
        details: { reason: "data is not an object" },
      },
    };
  }

  const obj = data as Record<string, unknown>;

  // Validate id field
  if (!("id" in obj)) {
    return {
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: 'User validation failed: missing required field "id"',
        details: { field: "id", reason: "field is required" },
      },
    };
  }

  if (typeof obj.id !== "string" || obj.id.trim() === "") {
    return {
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: 'User validation failed: "id" must be a non-empty string',
        details: { field: "id", reason: "must be a non-empty string" },
      },
    };
  }

  // Validate UUID format (basic check: 36 characters with hyphens in correct positions)
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(obj.id)) {
    return {
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: 'User validation failed: "id" must be a valid UUID',
        details: { field: "id", reason: "must be a valid UUID format" },
      },
    };
  }

  // Validate email field
  if (!("email" in obj)) {
    return {
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: 'User validation failed: missing required field "email"',
        details: { field: "email", reason: "field is required" },
      },
    };
  }

  if (typeof obj.email !== "string" || obj.email.trim() === "") {
    return {
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: 'User validation failed: "email" must be a non-empty string',
        details: { field: "email", reason: "must be a non-empty string" },
      },
    };
  }

  // Validate display_name field
  if (!("display_name" in obj)) {
    return {
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message:
          'User validation failed: missing required field "display_name"',
        details: { field: "display_name", reason: "field is required" },
      },
    };
  }

  if (obj.display_name !== null && typeof obj.display_name !== "string") {
    return {
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message:
          'User validation failed: "display_name" must be a string or null',
        details: { field: "display_name", reason: "must be a string or null" },
      },
    };
  }

  // Validate avatar_url field (optional, but if present must be string or null)
  if (
    "avatar_url" in obj &&
    obj.avatar_url !== null &&
    typeof obj.avatar_url !== "string"
  ) {
    return {
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message:
          'User validation failed: "avatar_url" must be a string or null',
        details: { field: "avatar_url", reason: "must be a string or null" },
      },
    };
  }

  // Validate role field
  if (!("role" in obj)) {
    return {
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: 'User validation failed: missing required field "role"',
        details: { field: "role", reason: "field is required" },
      },
    };
  }

  const validRoles = ["member", "author", "admin"];
  if (typeof obj.role !== "string" || !validRoles.includes(obj.role)) {
    return {
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: `User validation failed: "role" must be one of: ${validRoles.join(", ")}`,
        details: {
          field: "role",
          reason: `must be one of: ${validRoles.join(", ")}`,
          value: obj.role,
        },
      },
    };
  }

  // Validate status field
  if (!("status" in obj)) {
    return {
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: 'User validation failed: missing required field "status"',
        details: { field: "status", reason: "field is required" },
      },
    };
  }

  const validStatuses = ["active", "suspended"];
  if (typeof obj.status !== "string" || !validStatuses.includes(obj.status)) {
    return {
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: `User validation failed: "status" must be one of: ${validStatuses.join(", ")}`,
        details: {
          field: "status",
          reason: `must be one of: ${validStatuses.join(", ")}`,
          value: obj.status,
        },
      },
    };
  }

  // Validate created_at field
  if (!("created_at" in obj)) {
    return {
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: 'User validation failed: missing required field "created_at"',
        details: { field: "created_at", reason: "field is required" },
      },
    };
  }

  if (typeof obj.created_at !== "string") {
    return {
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: 'User validation failed: "created_at" must be a string',
        details: { field: "created_at", reason: "must be a string" },
      },
    };
  }

  // Validate ISO 8601 timestamp format (supports Z, +HH:MM, -HH:MM, or no timezone)
  const iso8601Regex =
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})?$/;
  if (!iso8601Regex.test(obj.created_at)) {
    return {
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message:
          'User validation failed: "created_at" must be a valid ISO 8601 timestamp',
        details: {
          field: "created_at",
          reason: "must be a valid ISO 8601 timestamp",
        },
      },
    };
  }

  // Validate that the timestamp is actually valid (not a malformed date)
  const timestamp = new Date(obj.created_at);
  if (isNaN(timestamp.getTime())) {
    return {
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: 'User validation failed: "created_at" is not a valid date',
        details: {
          field: "created_at",
          reason: "timestamp is not a valid date",
        },
      },
    };
  }

  // All validations passed - construct and return User object
  const user: User = {
    id: obj.id as string,
    email: obj.email as string,
    display_name: obj.display_name as string | null,
    avatar_url: ("avatar_url" in obj ? obj.avatar_url : null) as string | null,
    role: obj.role as "member" | "author",
    status: obj.status as "active" | "suspended",
    created_at: obj.created_at as string,
    updated_at:
      "updated_at" in obj && typeof obj.updated_at === "string"
        ? obj.updated_at
        : undefined,
    posts_count:
      "posts_count" in obj && typeof obj.posts_count === "number"
        ? obj.posts_count
        : undefined,
  };

  return {
    success: true,
    data: user,
  };
}

/**
 * profileToUser function
 *
 * Transforms a Supabase Profile object to a frontend User object.
 * This function bridges the database schema and frontend interface, ensuring
 * type safety and data consistency across the application.
 *
 * Transformation Rules:
 * - id: copied unchanged from profile
 * - email: copied unchanged from profile
 * - display_name: copied unchanged from profile (may be null)
 * - avatar_url: copied unchanged from profile (may be null), handled gracefully
 * - role: copied from profile, but filtered to exclude 'admin' role
 *   (admin users are not managed through the user management interface)
 * - status: copied unchanged from profile
 * - created_at: copied unchanged from profile
 * - updated_at: copied from profile if present (optional field)
 *
 * Validation:
 * - The transformed User object is validated using validateUser()
 * - If validation fails, an error response is returned
 * - If validation succeeds, a success response with the User is returned
 *
 * @param profile - Supabase Profile object to transform
 * @returns ServiceResponse<User> - Success response with transformed User, or error response if validation fails
 *
 * @example
 * // Transform a valid profile
 * const profile = {
 *   id: '550e8400-e29b-41d4-a716-446655440000',
 *   email: 'user@example.com',
 *   display_name: 'John Doe',
 *   avatar_url: 'https://example.com/avatar.jpg',
 *   role: 'member',
 *   status: 'active',
 *   created_at: '2024-01-15T10:30:00Z',
 *   updated_at: '2024-01-15T10:30:00Z'
 * };
 * const result = profileToUser(profile);
 * // Returns: { success: true, data: { id: '...', email: '...', ... } }
 *
 * @example
 * // Transform a profile with null avatar_url
 * const profile = {
 *   id: '550e8400-e29b-41d4-a716-446655440000',
 *   email: 'user@example.com',
 *   display_name: 'Jane Doe',
 *   avatar_url: null,
 *   role: 'author',
 *   status: 'active',
 *   created_at: '2024-01-15T10:30:00Z',
 *   updated_at: '2024-01-15T10:30:00Z'
 * };
 * const result = profileToUser(profile);
 * // Returns: { success: true, data: { ..., avatar_url: null, ... } }
 */
export function profileToUser(profile: Profile): ServiceResponse<User> {
  // Transform the profile to a user object
  const user: User = {
    id: profile.id,
    email: profile.email,
    display_name: profile.display_name,
    avatar_url: profile.avatar_url,
    role:
      profile.role === "admin"
        ? "member"
        : (profile.role as "member" | "author"),
    status: profile.status,
    created_at: profile.created_at,
    updated_at: profile.updated_at,
  };

  // Validate the transformed user object
  return validateUser(user);
}

/**
 * classifySupabaseError function
 *
 * Classifies Supabase errors by type and returns a structured error classification.
 * This function examines the error object and maps it to one of the predefined error codes.
 *
 * Error Classification Rules:
 * - Network errors: Connection refused, timeout, DNS resolution failed, ECONNREFUSED, ETIMEDOUT, ENOTFOUND
 * - Auth errors: Session expired, invalid credentials, token revoked, 401 status, "session" in message
 * - Permission errors: Insufficient privileges, 403 status, "permission" in message
 * - Constraint errors: Unique constraint, foreign key constraint, check constraint, "constraint" in message
 * - Not found errors: 404 status, resource not found, "not found" in message
 * - Unknown errors: Any other error type
 *
 * @param error - Unknown error object to classify
 * @returns Object with code, message, and optional details
 *
 * @example
 * // Classify a network error
 * const networkError = new Error('Connection refused');
 * const result = classifySupabaseError(networkError);
 * // Returns: { code: 'NETWORK_ERROR', message: 'Unable to connect to the server...', details: { ... } }
 *
 * @example
 * // Classify an auth error
 * const authError = { message: 'Session expired', status: 401 };
 * const result = classifySupabaseError(authError);
 * // Returns: { code: 'AUTH_ERROR', message: 'Your session has expired...', details: { ... } }
 */
export function classifySupabaseError(error: unknown): {
  code: ErrorCode;
  message: string;
  details?: Record<string, unknown>;
} {
  // Handle null or undefined errors
  if (error === null || error === undefined) {
    return {
      code: "UNKNOWN_ERROR",
      message: "An unexpected error occurred. Please try again later.",
      details: { reason: "error is null or undefined" },
    };
  }

  // Convert error to object for inspection
  const errorObj = error as Record<string, unknown>;
  const errorMessage = String(
    errorObj.message || errorObj.toString() || "",
  ).toLowerCase();
  const errorStatus = errorObj.status as number | undefined;
  const errorCode = String(errorObj.code || "").toLowerCase();

  // Check for network errors
  if (
    errorCode === "econnrefused" ||
    errorCode === "etimedout" ||
    errorCode === "enotfound" ||
    errorMessage.includes("connection refused") ||
    errorMessage.includes("timeout") ||
    errorMessage.includes("dns") ||
    errorMessage.includes("network") ||
    errorMessage.includes("econnrefused") ||
    errorMessage.includes("etimedout") ||
    errorMessage.includes("enotfound")
  ) {
    return {
      code: "NETWORK_ERROR",
      message:
        "Unable to connect to the server. Please check your internet connection and try again.",
      details: {
        originalMessage: errorObj.message,
        code: errorCode,
        status: errorStatus,
      },
    };
  }

  // Check for auth errors (401 status or session-related messages)
  if (
    errorStatus === 401 ||
    errorMessage.includes("session") ||
    errorMessage.includes("unauthorized") ||
    errorMessage.includes("invalid credentials") ||
    errorMessage.includes("token revoked") ||
    errorMessage.includes("token expired")
  ) {
    return {
      code: "AUTH_ERROR",
      message: "Your session has expired. Please log in again.",
      details: {
        originalMessage: errorObj.message,
        status: errorStatus,
      },
    };
  }

  // Check for permission errors (403 status or permission-related messages)
  if (
    errorStatus === 403 ||
    errorMessage.includes("permission") ||
    errorMessage.includes("forbidden") ||
    errorMessage.includes("insufficient privileges") ||
    errorMessage.includes("not authorized")
  ) {
    return {
      code: "PERMISSION_ERROR",
      message: "You don't have permission to perform this action.",
      details: {
        originalMessage: errorObj.message,
        status: errorStatus,
      },
    };
  }

  // Check for constraint errors
  if (
    errorMessage.includes("constraint") ||
    errorMessage.includes("unique") ||
    errorMessage.includes("foreign key") ||
    errorMessage.includes("check constraint") ||
    errorCode.includes("constraint")
  ) {
    return {
      code: "CONSTRAINT_ERROR",
      message: "This action violates a database constraint. Please try again.",
      details: {
        originalMessage: errorObj.message,
        code: errorCode,
      },
    };
  }

  // Check for not found errors (404 status or not found messages)
  if (
    errorStatus === 404 ||
    errorMessage.includes("not found") ||
    errorMessage.includes("does not exist") ||
    errorMessage.includes("no rows")
  ) {
    return {
      code: "NOT_FOUND_ERROR",
      message: "The requested resource was not found.",
      details: {
        originalMessage: errorObj.message,
        status: errorStatus,
      },
    };
  }

  // Default to unknown error
  return {
    code: "UNKNOWN_ERROR",
    message: "An unexpected error occurred. Please try again later.",
    details: {
      originalMessage: errorObj.message,
      code: errorCode,
      status: errorStatus,
    },
  };
}

/**
 * createErrorResponse function
 *
 * Creates a typed ErrorResponse object with the provided error code, message, and optional details.
 * This function ensures consistent error response structure across the application.
 *
 * @param code - Machine-readable error code for programmatic handling
 * @param message - User-friendly error message for display
 * @param details - Optional debugging information (not shown to users)
 * @returns ErrorResponse - Typed error response object
 *
 * @example
 * // Create a network error response
 * const response = createErrorResponse(
 *   'NETWORK_ERROR',
 *   'Unable to connect to the server. Please check your internet connection and try again.',
 *   { originalError: 'Connection refused' }
 * );
 * // Returns: { success: false, error: { code: 'NETWORK_ERROR', message: '...', details: { ... } } }
 *
 * @example
 * // Create a permission error response without details
 * const response = createErrorResponse(
 *   'PERMISSION_ERROR',
 *   "You don't have permission to perform this action."
 * );
 * // Returns: { success: false, error: { code: 'PERMISSION_ERROR', message: '...', details: undefined } }
 */
export function createErrorResponse(
  code: ErrorCode,
  message: string,
  details?: Record<string, unknown>,
): ErrorResponse {
  return {
    success: false,
    error: {
      code,
      message,
      details,
    },
  };
}

/**
 * createSuccessResponse function
 *
 * Creates a typed SuccessResponse object with the provided data.
 * This function ensures consistent success response structure across the application.
 *
 * @template T - The type of data being returned
 * @param data - The data to include in the success response
 * @returns SuccessResponse<T> - Typed success response object
 *
 * @example
 * // Create a success response with user data
 * const user = { id: '123', email: 'user@example.com', role: 'member', status: 'active', ... };
 * const response = createSuccessResponse(user);
 * // Returns: { success: true, data: { id: '123', email: '...', ... } }
 *
 * @example
 * // Create a success response with paginated data
 * const paginatedData = {
 *   data: [{ id: '1', ... }, { id: '2', ... }],
 *   pagination: { page: 1, limit: 10, total: 25, totalPages: 3, hasNextPage: true, hasPreviousPage: false }
 * };
 * const response = createSuccessResponse(paginatedData);
 * // Returns: { success: true, data: { data: [...], pagination: { ... } } }
 */
export function createSuccessResponse<T>(data: T): SuccessResponse<T> {
  return {
    success: true,
    data,
  };
}

/**
 * PaginationMetadata interface
 *
 * Represents the calculated pagination metadata for a paginated response.
 * This interface contains all the information needed to understand the current
 * position in a paginated dataset and navigate between pages.
 *
 * @property page - Current page number (1-indexed)
 * @property limit - Number of items per page
 * @property total - Total number of items across all pages
 * @property totalPages - Total number of pages (calculated as Math.ceil(total / limit))
 * @property hasNextPage - Whether there is a next page available (true if (page * limit) < total)
 * @property hasPreviousPage - Whether there is a previous page available (true if page > 1)
 * @property offset - Offset for database query (calculated as (page - 1) * limit)
 */
export interface PaginationMetadata {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  offset: number;
}

/**
 * calculatePaginationMetadata function
 *
 * Calculates pagination metadata from page, limit, and total count.
 * This function computes all necessary pagination information including
 * total pages, navigation flags, and database offset.
 *
 * Calculation Rules:
 * - totalPages = Math.ceil(total / limit)
 * - hasNextPage = (page * limit) < total
 * - hasPreviousPage = page > 1
 * - offset = (page - 1) * limit
 *
 * Validation:
 * - page must be >= 1 (1-indexed)
 * - limit must be > 0
 * - total must be >= 0
 * - If validation fails, throws an error with descriptive message
 *
 * @param page - Current page number (1-indexed, must be >= 1)
 * @param limit - Number of items per page (must be > 0)
 * @param total - Total number of items across all pages (must be >= 0)
 * @returns PaginationMetadata - Calculated pagination metadata
 * @throws Error if page < 1, limit <= 0, or total < 0
 *
 * @example
 * // Calculate metadata for page 1 with 10 items per page and 25 total items
 * const metadata = calculatePaginationMetadata(1, 10, 25);
 * // Returns: {
 * //   page: 1,
 * //   limit: 10,
 * //   total: 25,
 * //   totalPages: 3,
 * //   hasNextPage: true,
 * //   hasPreviousPage: false,
 * //   offset: 0
 * // }
 *
 * @example
 * // Calculate metadata for page 2 with 10 items per page and 25 total items
 * const metadata = calculatePaginationMetadata(2, 10, 25);
 * // Returns: {
 * //   page: 2,
 * //   limit: 10,
 * //   total: 25,
 * //   totalPages: 3,
 * //   hasNextPage: true,
 * //   hasPreviousPage: true,
 * //   offset: 10
 * // }
 *
 * @example
 * // Calculate metadata for page 3 (last page) with 10 items per page and 25 total items
 * const metadata = calculatePaginationMetadata(3, 10, 25);
 * // Returns: {
 * //   page: 3,
 * //   limit: 10,
 * //   total: 25,
 * //   totalPages: 3,
 * //   hasNextPage: false,
 * //   hasPreviousPage: true,
 * //   offset: 20
 * // }
 *
 * @example
 * // Edge case: page 0 (invalid)
 * const metadata = calculatePaginationMetadata(0, 10, 25);
 * // Throws: Error: Pagination validation failed: page must be >= 1, got 0
 *
 * @example
 * // Edge case: negative limit (invalid)
 * const metadata = calculatePaginationMetadata(1, -5, 25);
 * // Throws: Error: Pagination validation failed: limit must be > 0, got -5
 */
export function calculatePaginationMetadata(
  page: number,
  limit: number,
  total: number,
): PaginationMetadata {
  // Validate page parameter
  if (page < 1) {
    throw new Error(
      `Pagination validation failed: page must be >= 1, got ${page}`,
    );
  }

  // Validate limit parameter
  if (limit <= 0) {
    throw new Error(
      `Pagination validation failed: limit must be > 0, got ${limit}`,
    );
  }

  // Validate total parameter
  if (total < 0) {
    throw new Error(
      `Pagination validation failed: total must be >= 0, got ${total}`,
    );
  }

  // Calculate pagination metadata
  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page * limit < total;
  const hasPreviousPage = page > 1;
  const offset = (page - 1) * limit;

  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    offset,
  };
}

/**
 * validatePaginationParams function
 *
 * Validates pagination parameters and returns a typed ServiceResponse.
 * This function checks that page and limit are valid positive integers
 * and returns either a success response with validated params or an error response.
 *
 * Validation Rules:
 * - page must be a positive integer >= 1
 * - limit must be a positive integer > 0
 * - Both must be numbers (not strings, not NaN, not Infinity)
 * - Both must be integers (no decimals)
 *
 * @param page - Page number to validate (should be >= 1)
 * @param limit - Limit to validate (should be > 0)
 * @returns ServiceResponse<{ page: number; limit: number }> - Success response with validated params, or error response
 *
 * @example
 * // Valid pagination parameters
 * const result = validatePaginationParams(1, 10);
 * // Returns: { success: true, data: { page: 1, limit: 10 } }
 *
 * @example
 * // Invalid page (0)
 * const result = validatePaginationParams(0, 10);
 * // Returns: { success: false, error: { code: 'VALIDATION_ERROR', message: '...', details: { field: 'page', reason: '...' } } }
 *
 * @example
 * // Invalid limit (0)
 * const result = validatePaginationParams(1, 0);
 * // Returns: { success: false, error: { code: 'VALIDATION_ERROR', message: '...', details: { field: 'limit', reason: '...' } } }
 *
 * @example
 * // Invalid page (negative)
 * const result = validatePaginationParams(-1, 10);
 * // Returns: { success: false, error: { code: 'VALIDATION_ERROR', message: '...', details: { field: 'page', reason: '...' } } }
 *
 * @example
 * // Invalid limit (negative)
 * const result = validatePaginationParams(1, -5);
 * // Returns: { success: false, error: { code: 'VALIDATION_ERROR', message: '...', details: { field: 'limit', reason: '...' } } }
 *
 * @example
 * // Invalid page (decimal)
 * const result = validatePaginationParams(1.5, 10);
 * // Returns: { success: false, error: { code: 'VALIDATION_ERROR', message: '...', details: { field: 'page', reason: '...' } } }
 *
 * @example
 * // Invalid limit (NaN)
 * const result = validatePaginationParams(1, NaN);
 * // Returns: { success: false, error: { code: 'VALIDATION_ERROR', message: '...', details: { field: 'limit', reason: '...' } } }
 */
export function validatePaginationParams(
  page: number,
  limit: number,
): ServiceResponse<{ page: number; limit: number }> {
  // Validate page parameter
  if (typeof page !== "number" || isNaN(page) || !isFinite(page)) {
    return {
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: 'Pagination validation failed: "page" must be a valid number',
        details: {
          field: "page",
          reason: "must be a valid number",
          value: page,
        },
      },
    };
  }

  if (!Number.isInteger(page)) {
    return {
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: 'Pagination validation failed: "page" must be an integer',
        details: { field: "page", reason: "must be an integer", value: page },
      },
    };
  }

  if (page < 1) {
    return {
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: 'Pagination validation failed: "page" must be >= 1',
        details: { field: "page", reason: "must be >= 1", value: page },
      },
    };
  }

  // Validate limit parameter
  if (typeof limit !== "number" || isNaN(limit) || !isFinite(limit)) {
    return {
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: 'Pagination validation failed: "limit" must be a valid number',
        details: {
          field: "limit",
          reason: "must be a valid number",
          value: limit,
        },
      },
    };
  }

  if (!Number.isInteger(limit)) {
    return {
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: 'Pagination validation failed: "limit" must be an integer',
        details: { field: "limit", reason: "must be an integer", value: limit },
      },
    };
  }

  if (limit <= 0) {
    return {
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: 'Pagination validation failed: "limit" must be > 0',
        details: { field: "limit", reason: "must be > 0", value: limit },
      },
    };
  }

  // All validations passed
  return {
    success: true,
    data: { page, limit },
  };
}

/**
 * getUsers function
 *
 * Fetches users from the Supabase profiles table with optional filtering, sorting, and pagination.
 * This is the main function for retrieving user data from the database.
 *
 * Query Building:
 * - Starts with: supabase.from('profiles').select('*')
 * - Applies role filter if provided: .eq('role', filter.role)
 * - Applies status filter if provided: .eq('status', filter.status)
 * - Applies search filter if provided: .or('display_name.ilike.%query%,email.ilike.%query%')
 * - Applies sorting: .order('created_at', { ascending: sortOrder === 'asc' })
 * - Applies pagination: .range(offset, offset + limit - 1)
 * - Fetches total count separately using .count('exact')
 *
 * @param filters - Optional filters (role, status, search, sortBy, sortOrder)
 * @param pagination - Optional pagination parameters (page, limit)
 * @returns Promise<ServiceResponse<PaginatedResponse<User>>> - Paginated list of users or error
 *
 * @example
 * // Fetch all users with default pagination
 * const result = await getUsers();
 * // Returns: { success: true, data: { data: [...], pagination: { ... } } }
 *
 * @example
 * // Fetch members only, page 2, 10 per page
 * const result = await getUsers(
 *   { role: 'member' },
 *   { page: 2, limit: 10 }
 * );
 * // Returns: { success: true, data: { data: [...], pagination: { ... } } }
 *
 * @example
 * // Search for users by name or email
 * const result = await getUsers(
 *   { search: 'john' },
 *   { page: 1, limit: 10 }
 * );
 * // Returns: { success: true, data: { data: [...], pagination: { ... } } }
 */
export async function getUsers(
  filters?: UserQueryFilters,
  pagination?: PaginationParams,
): Promise<ServiceResponse<PaginatedResponse<User>>> {
  try {
    console.log(
      "[getUsers] Starting with filters:",
      filters,
      "pagination:",
      pagination,
    );

    const { createServerSupabaseClient } =
      await import("@/lib/supabase/server");
    const supabase = await createServerSupabaseClient();
    console.log("[getUsers] Supabase client created");

    // Set default pagination
    const page = pagination?.page ?? 1;
    const limit = pagination?.limit ?? 10;

    // Validate pagination parameters
    const paginationValidation = validatePaginationParams(page, limit);
    if (!paginationValidation.success) {
      console.log("[getUsers] Pagination validation failed");
      return paginationValidation as ServiceResponse<PaginatedResponse<User>>;
    }

    // Calculate offset
    const offset = (page - 1) * limit;

    // Build the query
    let query = supabase.from("profiles").select("*", { count: "exact" });
    console.log("[getUsers] Query initialized");

    // Exclude admin users from the results
    query = query.neq("role", "admin");
    console.log("[getUsers] Excluded admin users");

    // Apply role filter
    if (filters?.role) {
      query = query.eq("role", filters.role);
      console.log("[getUsers] Applied role filter:", filters.role);
    }

    // Apply status filter
    if (filters?.status) {
      query = query.eq("status", filters.status);
      console.log("[getUsers] Applied status filter:", filters.status);
    }

    // Apply search filter (case-insensitive substring match on display_name or email)
    if (filters?.search) {
      const searchTerm = filters.search.trim();
      if (searchTerm) {
        query = query.or(
          `display_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`,
        );
        console.log("[getUsers] Applied search filter:", searchTerm);
      }
    }

    // Apply sorting
    const sortOrder = filters?.sortOrder ?? "desc";
    const sortBy = filters?.sortBy ?? "created_at";
    query = query.order(sortBy, { ascending: sortOrder === "asc" });
    console.log("[getUsers] Applied sorting:", sortBy, sortOrder);

    // Apply pagination
    query = query.range(offset, offset + limit - 1);
    console.log(
      "[getUsers] Applied pagination range:",
      offset,
      offset + limit - 1,
    );

    // Execute the query
    console.log("[getUsers] Executing query...");
    const { data, error, count } = await query;
    console.log(
      "[getUsers] Query executed. Data:",
      data,
      "Error:",
      error,
      "Count:",
      count,
    );

    if (error) {
      console.error("[getUsers] Supabase error:", error);
      const classification = classifySupabaseError(error);
      return createErrorResponse(
        classification.code,
        classification.message,
        classification.details,
      );
    }

    // Transform profiles to users
    const users: User[] = [];
    if (data && Array.isArray(data)) {
      console.log("[getUsers] Processing", data.length, "profiles");
      for (const profile of data) {
        console.log("[getUsers] Transforming profile:", profile);
        const userResult = profileToUser(profile as Profile);
        console.log("[getUsers] Transform result:", userResult);
        if (userResult.success) {
          users.push(userResult.data);
        } else {
          console.error(
            "[getUsers] Validation failed for profile:",
            profile,
            "Error:",
            userResult.error,
          );
        }
      }
    }
    console.log("[getUsers] Final users array:", users);

    // Calculate pagination metadata
    const total = count ?? 0;
    const paginationMetadata = calculatePaginationMetadata(page, limit, total);

    // Return paginated response
    return createSuccessResponse<PaginatedResponse<User>>({
      data: users,
      pagination: {
        page: paginationMetadata.page,
        limit: paginationMetadata.limit,
        total: paginationMetadata.total,
        totalPages: paginationMetadata.totalPages,
        hasNextPage: paginationMetadata.hasNextPage,
        hasPreviousPage: paginationMetadata.hasPreviousPage,
      },
    });
  } catch (error) {
    const classification = classifySupabaseError(error);
    return createErrorResponse(
      classification.code,
      classification.message,
      classification.details,
    );
  }
}

/**
 * updateUserRole function
 *
 * Updates a user's role in the Supabase profiles table.
 * This function is used for promoting members to authors or demoting authors to members.
 *
 * @param userId - The ID of the user to update
 * @param newRole - The new role ('member' or 'author')
 * @returns Promise<ServiceResponse<User>> - Updated user object or error
 *
 * @example
 * // Promote a member to author
 * const result = await updateUserRole('user-id-123', 'author');
 * // Returns: { success: true, data: { id: '...', role: 'author', ... } }
 *
 * @example
 * // Demote an author to member
 * const result = await updateUserRole('user-id-123', 'member');
 * // Returns: { success: true, data: { id: '...', role: 'member', ... } }
 */
export async function updateUserRole(
  userId: string,
  newRole: "member" | "author",
): Promise<ServiceResponse<User>> {
  try {
    // Validate userId
    if (!userId || typeof userId !== "string" || userId.trim() === "") {
      return createErrorResponse(
        "VALIDATION_ERROR",
        "User ID must be a non-empty string",
        { field: "userId", reason: "must be a non-empty string" },
      );
    }

    // Validate newRole
    if (newRole !== "member" && newRole !== "author") {
      return createErrorResponse(
        "VALIDATION_ERROR",
        'Role must be either "member" or "author"',
        {
          field: "newRole",
          reason: 'must be "member" or "author"',
          value: newRole,
        },
      );
    }

    const { createServerSupabaseClient } =
      await import("@/lib/supabase/server");
    const supabase = await createServerSupabaseClient();

    // Update the user's role
    const { data, error } = await supabase
      .from("profiles")
      .update({
        role: newRole,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)
      .select("*")
      .single();

    if (error) {
      const classification = classifySupabaseError(error);
      return createErrorResponse(
        classification.code,
        classification.message,
        classification.details,
      );
    }

    if (!data) {
      return createErrorResponse("NOT_FOUND_ERROR", "User not found", {
        userId,
      });
    }

    // Transform and return the updated user
    return profileToUser(data as Profile);
  } catch (error) {
    const classification = classifySupabaseError(error);
    return createErrorResponse(
      classification.code,
      classification.message,
      classification.details,
    );
  }
}

/**
 * updateUserStatus function
 *
 * Updates a user's status in the Supabase profiles table.
 * This function is used for suspending or reactivating user accounts.
 *
 * @param userId - The ID of the user to update
 * @param newStatus - The new status ('active' or 'suspended')
 * @returns Promise<ServiceResponse<User>> - Updated user object or error
 *
 * @example
 * // Suspend a user
 * const result = await updateUserStatus('user-id-123', 'suspended');
 * // Returns: { success: true, data: { id: '...', status: 'suspended', ... } }
 *
 * @example
 * // Reactivate a user
 * const result = await updateUserStatus('user-id-123', 'active');
 * // Returns: { success: true, data: { id: '...', status: 'active', ... } }
 */
export async function updateUserStatus(
  userId: string,
  newStatus: "active" | "suspended",
): Promise<ServiceResponse<User>> {
  try {
    // Validate userId
    if (!userId || typeof userId !== "string" || userId.trim() === "") {
      return createErrorResponse(
        "VALIDATION_ERROR",
        "User ID must be a non-empty string",
        { field: "userId", reason: "must be a non-empty string" },
      );
    }

    // Validate newStatus
    if (newStatus !== "active" && newStatus !== "suspended") {
      return createErrorResponse(
        "VALIDATION_ERROR",
        'Status must be either "active" or "suspended"',
        {
          field: "newStatus",
          reason: 'must be "active" or "suspended"',
          value: newStatus,
        },
      );
    }

    const { createServerSupabaseClient } =
      await import("@/lib/supabase/server");
    const supabase = await createServerSupabaseClient();

    // Update the user's status
    const { data, error } = await supabase
      .from("profiles")
      .update({
        status: newStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)
      .select("*")
      .single();

    if (error) {
      const classification = classifySupabaseError(error);
      return createErrorResponse(
        classification.code,
        classification.message,
        classification.details,
      );
    }

    if (!data) {
      return createErrorResponse("NOT_FOUND_ERROR", "User not found", {
        userId,
      });
    }

    // Transform and return the updated user
    return profileToUser(data as Profile);
  } catch (error) {
    const classification = classifySupabaseError(error);
    return createErrorResponse(
      classification.code,
      classification.message,
      classification.details,
    );
  }
}
