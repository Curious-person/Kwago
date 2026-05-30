/**
 * ProductService Module
 *
 * Provides type definitions and business logic for product management CRUD operations.
 * This module serves as the foundation for all product-related database operations,
 * including fetching, creating, updating, and deleting product data from Supabase.
 *
 * Type Definitions:
 * - ProductErrorCode: Enumeration of all possible error codes
 * - ProductErrorResponse: Structure for error responses
 * - ProductSuccessResponse<T>: Structure for successful responses
 * - ProductServiceResponse<T>: Union type for all possible responses
 *
 * Service Functions:
 * - fetchProducts(): Fetch all products for authenticated author
 * - fetchProductById(): Fetch single product by ID
 * - createProduct(): Create new product
 * - updateProduct(): Update existing product
 * - deleteProduct(): Delete product
 * - validateProduct(): Validate product data
 * - productRowToProduct(): Transform database row to Product interface
 * - classifySupabaseError(): Classify Supabase errors into error codes
 */

import { createClient } from "@/lib/supabase/client";
import type {
  Product,
  ProductRow,
  ProductRowWithCategories,
  CreateProductInput,
  UpdateProductInput,
} from "@/types/product";

/**
 * ProductErrorCode type
 *
 * Represents all possible error codes that can be returned by the ProductService.
 * Each code corresponds to a specific error condition and guides error handling
 * and user-facing error messages.
 *
 * - NETWORK_ERROR: Connection failures, timeouts, DNS resolution failures
 * - AUTH_ERROR: Session expired, invalid credentials, token revoked
 * - PERMISSION_ERROR: User lacks permission, trying to access another author's product
 * - VALIDATION_ERROR: Invalid input data, schema mismatch, constraint violation
 * - CONSTRAINT_ERROR: Database constraint violation (price >= 0, condition enum)
 * - NOT_FOUND_ERROR: Product ID doesn't exist, resource deleted
 * - UNKNOWN_ERROR: Unexpected server error
 */
export type ProductErrorCode =
  | "NETWORK_ERROR"
  | "AUTH_ERROR"
  | "PERMISSION_ERROR"
  | "VALIDATION_ERROR"
  | "CONSTRAINT_ERROR"
  | "NOT_FOUND_ERROR"
  | "UNKNOWN_ERROR";

/**
 * ProductErrorResponse interface
 *
 * Represents the structure of an error response from the ProductService.
 * All error responses follow this consistent structure to enable uniform
 * error handling across the application.
 *
 * @property success - Always false for error responses
 * @property error - Error details object
 * @property error.code - Machine-readable error code for programmatic handling
 * @property error.message - User-friendly error message for display
 * @property error.details - Optional debugging information (not shown to users)
 */
export interface ProductErrorResponse {
  success: false;
  error: {
    code: ProductErrorCode;
    message: string;
    details?: Record<string, unknown>;
  };
}

/**
 * ProductSuccessResponse<T> interface
 *
 * Represents the structure of a successful response from the ProductService.
 * Generic type T allows for type-safe responses containing different data types.
 *
 * @template T - The type of data being returned
 * @property success - Always true for success responses
 * @property data - The actual response data of type T
 */
export interface ProductSuccessResponse<T> {
  success: true;
  data: T;
}

/**
 * ProductServiceResponse<T> type
 *
 * Union type representing all possible responses from ProductService functions.
 * This discriminated union enables type-safe error handling using TypeScript's
 * type narrowing based on the 'success' property.
 *
 * @template T - The type of data being returned on success
 *
 * Usage:
 * ```typescript
 * const response = await fetchProducts();
 * if (!response.success) {
 *   // TypeScript knows response.error exists
 *   console.error(response.error.message);
 *   return;
 * }
 * // TypeScript knows response.data exists
 * setProducts(response.data);
 * ```
 */
export type ProductServiceResponse<T> =
  | ProductSuccessResponse<T>
  | ProductErrorResponse;

/**
 * validateProduct function
 *
 * Validates that unknown data conforms to the Product schema.
 * Performs comprehensive validation of all required fields and their types.
 *
 * Validation Rules:
 * - data must be an object (not null, not array)
 * - id: required, must be non-empty string (UUID format)
 * - name: required, must be non-empty string, max 255 characters
 * - price: required, must be positive number, max 2 decimal places
 * - condition: required, must be exactly 'New' or 'Used'
 * - image: required, must be non-empty string, valid URL format
 * - description: optional, max 2000 characters if provided
 *
 * @param data - Unknown data to validate against Product schema
 * @returns ProductServiceResponse<Product> - Success response with validated Product, or error response with details
 */
export function validateProduct(
  data: unknown,
): ProductServiceResponse<Product> {
  // Check if data is an object
  if (data === null || typeof data !== "object" || Array.isArray(data)) {
    return {
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Product data must be an object",
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
        message: 'Product validation failed: missing required field "id"',
        details: { field: "id", reason: "field is required" },
      },
    };
  }

  if (typeof obj.id !== "string" || obj.id.trim() === "") {
    return {
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: 'Product validation failed: "id" must be a non-empty string',
        details: { field: "id", reason: "must be a non-empty string" },
      },
    };
  }

  // Validate UUID format
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(obj.id)) {
    return {
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: 'Product validation failed: "id" must be a valid UUID',
        details: { field: "id", reason: "must be a valid UUID format" },
      },
    };
  }

  // Validate name field
  if (!("name" in obj)) {
    return {
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: 'Product validation failed: missing required field "name"',
        details: { field: "name", reason: "field is required" },
      },
    };
  }

  if (typeof obj.name !== "string" || obj.name.trim() === "") {
    return {
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: 'Product validation failed: "name" must be a non-empty string',
        details: { field: "name", reason: "must be a non-empty string" },
      },
    };
  }

  if (obj.name.length > 255) {
    return {
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message:
          'Product validation failed: "name" must not exceed 255 characters',
        details: {
          field: "name",
          reason: "must not exceed 255 characters",
          length: obj.name.length,
        },
      },
    };
  }

  // Validate price field
  if (!("price" in obj)) {
    return {
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: 'Product validation failed: missing required field "price"',
        details: { field: "price", reason: "field is required" },
      },
    };
  }

  if (typeof obj.price !== "number" || isNaN(obj.price)) {
    return {
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: 'Product validation failed: "price" must be a valid number',
        details: {
          field: "price",
          reason: "must be a valid number",
          value: obj.price,
        },
      },
    };
  }

  if (obj.price < 0) {
    return {
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message:
          'Product validation failed: "price" must be greater than or equal to 0',
        details: { field: "price", reason: "must be >= 0", value: obj.price },
      },
    };
  }

  // Check decimal places (max 2)
  const decimalPlaces = (obj.price.toString().split(".")[1] || "").length;
  if (decimalPlaces > 2) {
    return {
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message:
          'Product validation failed: "price" must have at most 2 decimal places',
        details: {
          field: "price",
          reason: "must have at most 2 decimal places",
          value: obj.price,
        },
      },
    };
  }

  // Validate condition field
  if (!("condition" in obj)) {
    return {
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message:
          'Product validation failed: missing required field "condition"',
        details: { field: "condition", reason: "field is required" },
      },
    };
  }

  const validConditions = ["New", "Used"];
  if (
    typeof obj.condition !== "string" ||
    !validConditions.includes(obj.condition)
  ) {
    return {
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: `Product validation failed: "condition" must be one of: ${validConditions.join(", ")}`,
        details: {
          field: "condition",
          reason: `must be one of: ${validConditions.join(", ")}`,
          value: obj.condition,
        },
      },
    };
  }

  // Validate image field
  if (!("image" in obj)) {
    return {
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: 'Product validation failed: missing required field "image"',
        details: { field: "image", reason: "field is required" },
      },
    };
  }

  if (typeof obj.image !== "string" || obj.image.trim() === "") {
    return {
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message:
          'Product validation failed: "image" must be a non-empty string',
        details: { field: "image", reason: "must be a non-empty string" },
      },
    };
  }

  // Validate URL format (basic check)
  try {
    new URL(obj.image);
  } catch {
    return {
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: 'Product validation failed: "image" must be a valid URL',
        details: {
          field: "image",
          reason: "must be a valid URL format",
          value: obj.image,
        },
      },
    };
  }

  // Validate description field (optional)
  if ("description" in obj && obj.description !== undefined) {
    if (obj.description !== null && typeof obj.description !== "string") {
      return {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message:
            'Product validation failed: "description" must be a string or undefined',
          details: {
            field: "description",
            reason: "must be a string or undefined",
          },
        },
      };
    }

    if (typeof obj.description === "string" && obj.description.length > 2000) {
      return {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message:
            'Product validation failed: "description" must not exceed 2000 characters',
          details: {
            field: "description",
            reason: "must not exceed 2000 characters",
            length: obj.description.length,
          },
        },
      };
    }
  }

  // All validations passed - return validated product
  return {
    success: true,
    data: {
      id: obj.id,
      name: obj.name,
      price: obj.price,
      condition: obj.condition as "New" | "Used",
      image: obj.image,
      category_ids: Array.isArray(obj.category_ids)
        ? (obj.category_ids as string[])
        : [],
      category_names: Array.isArray(obj.category_names)
        ? (obj.category_names as string[])
        : [],
      description: obj.description as string | undefined,
      status:
        typeof obj.status === "string"
          ? (obj.status as import("@/types/product").ProductStatus)
          : undefined,
    },
  };
}

/**
 * productRowToProduct function
 *
 * Transforms a ProductRow (database schema) to a Product (frontend interface).
 * Handles type conversions and null-to-undefined transformations.
 *
 * Transformations:
 * - price: NUMERIC to number conversion
 * - description: null → undefined conversion
 * - Strips database-only fields (author_id, created_at, updated_at)
 *
 * @param row - ProductRow from Supabase database
 * @returns ProductServiceResponse<Product> - Success response with transformed Product, or error response
 */
export function productRowToProduct(
  row: ProductRowWithCategories,
): ProductServiceResponse<Product> {
  try {
    // Convert NUMERIC to number
    const price =
      typeof row.price === "string" ? parseFloat(row.price) : Number(row.price);

    if (isNaN(price)) {
      return {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Failed to convert price to number",
          details: { field: "price", value: row.price },
        },
      };
    }

    // Extract category IDs and names from junction table join if present
    const category_ids: string[] = [];
    const category_names: string[] = [];

    if (row.product_categories) {
      row.product_categories.forEach((pc: any) => {
        if (pc.category_id) category_ids.push(pc.category_id);

        // Handle both object and array response from Supabase for the joined category
        const cat = pc.categories || pc.category;
        const catObj = Array.isArray(cat) ? cat[0] : cat;

        if (catObj?.name) {
          category_names.push(catObj.name);
        }
      });
    }

    // Extract blog post count from junction table join if present
    const featured_in_blogs_count = row.blog_post_products?.length ?? 0;

    // Transform database row to Product interface
    const product: Product = {
      id: row.id,
      name: row.name,
      price: price,
      condition: row.condition,
      image: row.image,
      category_ids: category_ids,
      category_names: category_names,
      description: row.description ?? undefined, // null → undefined
      featured_in_blogs_count: featured_in_blogs_count,
      status: row.status,
    };

    // Validate the transformed product
    return validateProduct(product);
  } catch (error) {
    return {
      success: false,
      error: {
        code: "UNKNOWN_ERROR",
        message: "Failed to transform product row",
        details: {
          error: error instanceof Error ? error.message : String(error),
        },
      },
    };
  }
}

/**
 * classifySupabaseError function
 *
 * Classifies Supabase errors into ProductErrorCode categories.
 * Provides user-friendly error messages based on error type.
 *
 * Error Classification:
 * - Network errors (fetch failed, timeout) → NETWORK_ERROR
 * - Auth errors (session expired, invalid token) → AUTH_ERROR
 * - Permission errors (RLS policy violation) → PERMISSION_ERROR
 * - Constraint errors (check constraint, foreign key) → CONSTRAINT_ERROR
 * - Not found errors (no rows returned) → NOT_FOUND_ERROR
 * - All other errors → UNKNOWN_ERROR
 *
 * @param error - Unknown error from Supabase operation
 * @returns Object with code, message, and optional details
 */
export function classifySupabaseError(error: unknown): {
  code: ProductErrorCode;
  message: string;
  details?: Record<string, unknown>;
} {
  // Handle null/undefined errors
  if (!error) {
    return {
      code: "UNKNOWN_ERROR",
      message: "An unexpected error occurred. Please try again later.",
      details: { error: "error is null or undefined" },
    };
  }

  // Convert error to string for pattern matching
  const errorString = error instanceof Error ? error.message : String(error);
  const errorLower = errorString.toLowerCase();

  // Network errors
  if (
    errorLower.includes("fetch") ||
    errorLower.includes("network") ||
    errorLower.includes("timeout") ||
    errorLower.includes("connection") ||
    errorLower.includes("dns")
  ) {
    return {
      code: "NETWORK_ERROR",
      message:
        "Unable to connect to the server. Please check your internet connection and try again.",
      details: { originalError: errorString },
    };
  }

  // Auth errors
  if (
    errorLower.includes("jwt") ||
    errorLower.includes("token") ||
    errorLower.includes("session") ||
    errorLower.includes("unauthorized") ||
    errorLower.includes("authentication")
  ) {
    return {
      code: "AUTH_ERROR",
      message: "Your session has expired. Please log in again.",
      details: { originalError: errorString },
    };
  }

  // Permission errors (RLS policy violations)
  if (
    errorLower.includes("permission") ||
    errorLower.includes("policy") ||
    errorLower.includes("forbidden") ||
    errorLower.includes("access denied")
  ) {
    return {
      code: "PERMISSION_ERROR",
      message: "You don't have permission to perform this action.",
      details: { originalError: errorString },
    };
  }

  // Constraint errors
  if (
    errorLower.includes("constraint") ||
    errorLower.includes("violates") ||
    errorLower.includes("check") ||
    errorLower.includes("foreign key") ||
    errorLower.includes("unique")
  ) {
    return {
      code: "CONSTRAINT_ERROR",
      message:
        "This action violates a database constraint. Please check your input and try again.",
      details: { originalError: errorString },
    };
  }

  // Not found errors
  if (
    errorLower.includes("not found") ||
    errorLower.includes("does not exist") ||
    errorLower.includes("no rows")
  ) {
    return {
      code: "NOT_FOUND_ERROR",
      message: "The requested product was not found.",
      details: { originalError: errorString },
    };
  }

  // Default to unknown error
  return {
    code: "UNKNOWN_ERROR",
    message: "An unexpected error occurred. Please try again later.",
    details: { originalError: errorString },
  };
}

/**
 * fetchProducts function
 *
 * Fetches all products for the authenticated author from the Supabase products table.
 * Products are automatically filtered by author_id through RLS policies.
 *
 * Query: supabase.from('products').select('*').order('created_at', { ascending: false })
 *
 * @returns Promise<ProductServiceResponse<Product[]>> - Array of products or error
 *
 * @example
 * const result = await fetchProducts();
 * if (result.success) {
 *   console.log('Products:', result.data);
 * } else {
 *   console.error('Error:', result.error.message);
 * }
 */
export async function fetchProducts(): Promise<
  ProductServiceResponse<Product[]>
> {
  try {
    console.log("[fetchProducts] Fetching products for authenticated author");

    const supabase = createClient();

    // Fetch products with their categories and blog post links (RLS automatically filters by author_id)
    const { data, error } = await supabase
      .from("products")
      .select(
        "*, product_categories(category_id, categories(name)), blog_post_products(blog_post_id)",
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[fetchProducts] Supabase error:", error);
      const classified = classifySupabaseError(error);
      return {
        success: false,
        error: classified,
      };
    }

    // Handle empty results
    if (!data || data.length === 0) {
      console.log("[fetchProducts] No products found");
      return {
        success: true,
        data: [],
      };
    }

    console.log(`[fetchProducts] Found ${data.length} products`);

    // Transform and validate each product
    const products: Product[] = [];
    for (const row of data) {
      const transformResult = productRowToProduct(
        row as ProductRowWithCategories,
      );
      if (!transformResult.success) {
        console.error(
          "[fetchProducts] Failed to transform product:",
          transformResult.error,
        );
        return transformResult;
      }
      products.push(transformResult.data);
    }

    return {
      success: true,
      data: products,
    };
  } catch (error) {
    console.error("[fetchProducts] Unexpected error:", error);
    const classified = classifySupabaseError(error);
    return {
      success: false,
      error: classified,
    };
  }
}

/**
 * fetchProductById function
 *
 * Fetches a single product by ID for the authenticated author.
 * RLS policies ensure the product belongs to the authenticated author.
 *
 * Query: supabase.from('products').select('*').eq('id', id).single()
 *
 * @param id - Product UUID to fetch
 * @returns Promise<ProductServiceResponse<Product>> - Product or error
 *
 * @example
 * const result = await fetchProductById('550e8400-e29b-41d4-a716-446655440000');
 * if (result.success) {
 *   console.log('Product:', result.data);
 * } else {
 *   console.error('Error:', result.error.message);
 * }
 */
export async function fetchProductById(
  id: string,
): Promise<ProductServiceResponse<Product>> {
  try {
    console.log("[fetchProductById] Fetching product:", id);

    // Validate UUID format
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid product ID format",
          details: { field: "id", reason: "must be a valid UUID" },
        },
      };
    }

    const supabase = createClient();

    // Fetch single product with categories (RLS automatically filters by author_id)
    const { data, error } = await supabase
      .from("products")
      .select("*, product_categories(category_id, categories(name))")
      .eq("id", id)
      .single();

    if (error) {
      console.error("[fetchProductById] Supabase error:", error);
      const classified = classifySupabaseError(error);
      return {
        success: false,
        error: classified,
      };
    }

    if (!data) {
      console.log("[fetchProductById] Product not found");
      return {
        success: false,
        error: {
          code: "NOT_FOUND_ERROR",
          message: "The requested product was not found.",
          details: { id },
        },
      };
    }

    console.log("[fetchProductById] Product found");

    // Transform and validate product
    return productRowToProduct(data as ProductRowWithCategories);
  } catch (error) {
    console.error("[fetchProductById] Unexpected error:", error);
    const classified = classifySupabaseError(error);
    return {
      success: false,
      error: classified,
    };
  }
}

/**
 * createProduct function
 *
 * Creates a new product in the Supabase products table.
 * The author_id is automatically set from the authenticated user.
 *
 * Validation:
 * - All required fields must be present (name, price, condition, image)
 * - Price must be >= 0
 * - Condition must be 'New' or 'Used'
 * - Image must be a valid URL
 *
 * Query: supabase.from('products').insert({ ...input, author_id }).select().single()
 *
 * @param input - CreateProductInput with product data
 * @returns Promise<ProductServiceResponse<Product>> - Created product or error
 *
 * @example
 * const result = await createProduct({
 *   name: 'Iron Man Figure',
 *   price: 24.99,
 *   condition: 'New',
 *   image: 'https://example.com/image.jpg',
 *   description: 'Highly detailed action figure'
 * });
 */
export async function createProduct(
  input: CreateProductInput,
): Promise<ProductServiceResponse<Product>> {
  try {
    console.log("[createProduct] Creating product:", input.name);

    // Validate required fields
    if (!input.name || input.name.trim() === "") {
      return {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Product name is required",
          details: { field: "name", reason: "must be a non-empty string" },
        },
      };
    }

    if (typeof input.price !== "number" || input.price < 0) {
      return {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Product price must be a positive number",
          details: {
            field: "price",
            reason: "must be >= 0",
            value: input.price,
          },
        },
      };
    }

    if (!["New", "Used"].includes(input.condition)) {
      return {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: 'Product condition must be "New" or "Used"',
          details: {
            field: "condition",
            reason: 'must be "New" or "Used"',
            value: input.condition,
          },
        },
      };
    }

    if (!input.image || input.image.trim() === "") {
      return {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Product image URL is required",
          details: { field: "image", reason: "must be a non-empty string" },
        },
      };
    }

    // Validate URL format
    try {
      new URL(input.image);
    } catch {
      return {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Product image must be a valid URL",
          details: {
            field: "image",
            reason: "must be a valid URL format",
            value: input.image,
          },
        },
      };
    }

    const supabase = createClient();

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error("[createProduct] Auth error:", authError);
      return {
        success: false,
        error: {
          code: "AUTH_ERROR",
          message: "Your session has expired. Please log in again.",
          details: { originalError: authError?.message },
        },
      };
    }

    // Prepare insert data
    const insertData = {
      name: input.name.trim(),
      price: input.price,
      condition: input.condition,
      image: input.image.trim(),
      description: input.description?.trim() || null,
      author_id: user.id,
      status: "pending_ai",
    };

    console.log("[createProduct] Inserting product into database");

    // Insert product
    const { data, error } = await supabase
      .from("products")
      .insert(insertData)
      .select("*, product_categories(category_id, categories(name))")
      .single();

    if (error) {
      console.error("[createProduct] Supabase error:", error);
      const classified = classifySupabaseError(error);
      return {
        success: false,
        error: classified,
      };
    }

    if (!data) {
      return {
        success: false,
        error: {
          code: "UNKNOWN_ERROR",
          message: "Failed to create product",
          details: { reason: "no data returned from insert" },
        },
      };
    }

    // Handle category relationships
    if (input.category_ids && input.category_ids.length > 0) {
      const categoryLinks = input.category_ids.map((categoryId) => ({
        product_id: data.id,
        category_id: categoryId,
      }));

      const { error: linkError } = await supabase
        .from("product_categories")
        .insert(categoryLinks);

      if (linkError) {
        console.error("[createProduct] Failed to link categories:", linkError);
        // We don't fail the whole request, but we should log it
      }

      // Attach them back for the frontend transformation
      (data as any).product_categories = input.category_ids.map((id) => ({
        category_id: id,
      }));
    } else {
      (data as any).product_categories = [];
    }

    console.log("[createProduct] Product created successfully:", data.id);

    // Simulate AI Approval via 60-second static timer
    setTimeout(async () => {
      console.log(
        `[AI Moderation Simulation] 60s elapsed. Approving product ${data.id}...`,
      );
      const aiClient = createClient();
      const { error: aiError } = await aiClient
        .from("products")
        .update({ status: "ai-approved" })
        .eq("id", data.id);

      if (aiError) {
        console.error(
          `[AI Moderation Simulation] Failed to approve product ${data.id}:`,
          aiError,
        );
      } else {
        console.log(
          `[AI Moderation Simulation] Product ${data.id} successfully ai-approved.`,
        );
      }
    }, 2500);

    // Transform and validate created product
    return productRowToProduct(data as ProductRowWithCategories);
  } catch (error) {
    console.error("[createProduct] Unexpected error:", error);
    const classified = classifySupabaseError(error);
    return {
      success: false,
      error: classified,
    };
  }
}

/**
 * updateProduct function
 *
 * Updates an existing product in the Supabase products table.
 * RLS policies ensure the product belongs to the authenticated author.
 *
 * Validation:
 * - At least one field must be provided
 * - If price is provided, must be >= 0
 * - If condition is provided, must be 'New' or 'Used'
 * - If image is provided, must be a valid URL
 *
 * Query: supabase.from('products').update(updateData).eq('id', id).select().single()
 *
 * @param id - Product UUID to update
 * @param input - UpdateProductInput with fields to update
 * @returns Promise<ProductServiceResponse<Product>> - Updated product or error
 *
 * @example
 * const result = await updateProduct('550e8400-e29b-41d4-a716-446655440000', {
 *   price: 29.99,
 *   condition: 'Used'
 * });
 */
export async function updateProduct(
  id: string,
  input: UpdateProductInput,
): Promise<ProductServiceResponse<Product>> {
  try {
    console.log("[updateProduct] Updating product:", id);

    // Validate UUID format
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid product ID format",
          details: { field: "id", reason: "must be a valid UUID" },
        },
      };
    }

    // Validate at least one field is provided
    const hasUpdates = Object.keys(input).length > 0;
    if (!hasUpdates) {
      return {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "At least one field must be provided for update",
          details: { reason: "no fields to update" },
        },
      };
    }

    // Validate individual fields if provided
    if (input.name !== undefined && input.name.trim() === "") {
      return {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Product name cannot be empty",
          details: { field: "name", reason: "must be a non-empty string" },
        },
      };
    }

    if (
      input.price !== undefined &&
      (typeof input.price !== "number" || input.price < 0)
    ) {
      return {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Product price must be a positive number",
          details: {
            field: "price",
            reason: "must be >= 0",
            value: input.price,
          },
        },
      };
    }

    if (
      input.condition !== undefined &&
      !["New", "Used"].includes(input.condition)
    ) {
      return {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: 'Product condition must be "New" or "Used"',
          details: {
            field: "condition",
            reason: 'must be "New" or "Used"',
            value: input.condition,
          },
        },
      };
    }

    if (input.image !== undefined) {
      if (input.image.trim() === "") {
        return {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Product image URL cannot be empty",
            details: { field: "image", reason: "must be a non-empty string" },
          },
        };
      }

      // Validate URL format
      try {
        new URL(input.image);
      } catch {
        return {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Product image must be a valid URL",
            details: {
              field: "image",
              reason: "must be a valid URL format",
              value: input.image,
            },
          },
        };
      }
    }

    const supabase = createClient();

    // Prepare update data
    const updateData: Record<string, unknown> = {};
    if (input.name !== undefined) updateData.name = input.name.trim();
    if (input.price !== undefined) updateData.price = input.price;
    if (input.condition !== undefined) updateData.condition = input.condition;
    if (input.image !== undefined) updateData.image = input.image.trim();
    if (input.description !== undefined) {
      updateData.description = input.description
        ? input.description.trim()
        : null;
    }

    console.log("[updateProduct] Updating product in database");

    // Update product (RLS automatically filters by author_id)
    const { data, error } = await supabase
      .from("products")
      .update(updateData)
      .eq("id", id)
      .select("*, product_categories(category_id, categories(name))")
      .single();

    if (error) {
      console.error("[updateProduct] Supabase error:", error);
      const classified = classifySupabaseError(error);
      return {
        success: false,
        error: classified,
      };
    }

    if (!data) {
      return {
        success: false,
        error: {
          code: "NOT_FOUND_ERROR",
          message: "The requested product was not found.",
          details: { id },
        },
      };
    }

    // Handle category relationship updates
    if (input.category_ids !== undefined) {
      // 1. Delete existing links
      await supabase.from("product_categories").delete().eq("product_id", id);

      // 2. Insert new links
      if (input.category_ids.length > 0) {
        const categoryLinks = input.category_ids.map((categoryId) => ({
          product_id: id,
          category_id: categoryId,
        }));

        await supabase.from("product_categories").insert(categoryLinks);

        (data as any).product_categories = input.category_ids.map((cid) => ({
          category_id: cid,
        }));
      } else {
        (data as any).product_categories = [];
      }
    } else {
      // If category_ids wasn't updated, we should fetch the existing ones to return a complete product
      const { data: existingLinks } = await supabase
        .from("product_categories")
        .select("category_id")
        .eq("product_id", id);

      (data as any).product_categories = existingLinks || [];
    }

    console.log("[updateProduct] Product updated successfully");

    // Transform and validate updated product
    return productRowToProduct(data as ProductRowWithCategories);
  } catch (error) {
    console.error("[updateProduct] Unexpected error:", error);
    const classified = classifySupabaseError(error);
    return {
      success: false,
      error: classified,
    };
  }
}

/**
 * deleteProduct function
 *
 * Deletes a product from the Supabase products table.
 * RLS policies ensure the product belongs to the authenticated author.
 *
 * Query: supabase.from('products').delete().eq('id', id)
 *
 * @param id - Product UUID to delete
 * @returns Promise<ProductServiceResponse<void>> - Success or error
 *
 * @example
 * const result = await deleteProduct('550e8400-e29b-41d4-a716-446655440000');
 * if (result.success) {
 *   console.log('Product deleted successfully');
 * } else {
 *   console.error('Error:', result.error.message);
 * }
 */
export async function deleteProduct(
  id: string,
): Promise<ProductServiceResponse<void>> {
  try {
    console.log("[deleteProduct] Deleting product:", id);

    // Validate UUID format
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid product ID format",
          details: { field: "id", reason: "must be a valid UUID" },
        },
      };
    }

    const supabase = createClient();

    // Delete product (RLS automatically filters by author_id)
    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) {
      console.error("[deleteProduct] Supabase error:", error);
      const classified = classifySupabaseError(error);
      return {
        success: false,
        error: classified,
      };
    }

    console.log("[deleteProduct] Product deleted successfully");

    return {
      success: true,
      data: undefined,
    };
  } catch (error) {
    console.error("[deleteProduct] Unexpected error:", error);
    const classified = classifySupabaseError(error);
    return {
      success: false,
      error: classified,
    };
  }
}

/**
 * adminReviewProduct function
 *
 * Allows an admin to review an ai-approved product.
 * Updates the status to 'for-posting' or 'reject'.
 *
 * @param id - Product UUID to review
 * @param action - 'approve' to set for-posting, 'reject' to set reject
 * @returns Promise<ProductServiceResponse<Product>> - Updated product or error
 */
export async function adminReviewProduct(
  id: string,
  action: "approve" | "reject",
): Promise<ProductServiceResponse<Product>> {
  try {
    console.log(
      `[adminReviewProduct] Admin reviewing product ${id} with action: ${action}`,
    );

    const newStatus = action === "approve" ? "for-posting" : "reject";
    const supabase = createClient();

    // Admin must have role admin to update (enforced by RLS)
    const { data, error } = await supabase
      .from("products")
      .update({ status: newStatus })
      .eq("id", id)
      .select("*, product_categories(category_id, categories(name))")
      .single();

    if (error) {
      console.error("[adminReviewProduct] Supabase error:", error);
      const classified = classifySupabaseError(error);
      return {
        success: false,
        error: classified,
      };
    }

    if (!data) {
      return {
        success: false,
        error: {
          code: "UNKNOWN_ERROR",
          message:
            "Failed to update product status or insufficient permissions",
        },
      };
    }

    console.log("[adminReviewProduct] Product review successful");
    return productRowToProduct(data as ProductRowWithCategories);
  } catch (error) {
    console.error("[adminReviewProduct] Unexpected error:", error);
    const classified = classifySupabaseError(error);
    return {
      success: false,
      error: classified,
    };
  }
}

/**
 * checkProductNameExists function
 *
 * Checks if a product with the same name already exists for the authenticated author.
 *
 * @param name - Product name to check
 * @param excludeId - Optional product ID to exclude from the check (for updates)
 * @returns Promise<ProductServiceResponse<boolean>> - True if exists, False otherwise
 */
export async function checkProductNameExists(
  name: string,
  excludeId?: string,
): Promise<ProductServiceResponse<boolean>> {
  try {
    const supabase = createClient();

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        error: {
          code: "AUTH_ERROR",
          message: "Your session has expired. Please log in again.",
        },
      };
    }

    let query = supabase
      .from("products")
      .select("id", { count: "exact", head: true })
      .ilike("name", name.trim())
      .eq("author_id", user.id);

    if (excludeId) {
      query = query.neq("id", excludeId);
    }

    const { count, error } = await query;

    if (error) {
      return {
        success: false,
        error: classifySupabaseError(error),
      };
    }

    return {
      success: true,
      data: count && count > 0 ? true : false,
    };
  } catch (error) {
    return {
      success: false,
      error: classifySupabaseError(error),
    };
  }
}
