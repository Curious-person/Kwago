/**
 * Mock Categories Data
 * Sample data for testing and development
 * Replace with API calls when backend is ready
 */

import { Category } from "@/lib/types/category";

/**
 * Mock categories for development and testing
 * These categories include sample product images and counts
 * Used as placeholder data until API integration is complete
 */
export const MOCK_CATEGORIES: Category[] = [
  {
    id: "1",
    name: "Marvel Legends",
    description: "Marvel action figures and collectibles",
    author_id: "user-123",
    product_count: 5,
    product_images: [
      "https://images.unsplash.com/photo-1531279554141-7dfdb443c375?q=80&w=400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=400&auto=format&fit=crop",
    ],
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    name: "DC Comics",
    description: "DC Comics collectibles and memorabilia",
    author_id: "user-123",
    product_count: 3,
    product_images: [
      "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=400&auto=format&fit=crop",
    ],
    created_at: "2024-01-16T10:00:00Z",
    updated_at: "2024-01-16T10:00:00Z",
  },
  {
    id: "3",
    name: "Weta Workshop",
    description: "Premium collectible statues and sculptures",
    author_id: "user-123",
    product_count: 2,
    product_images: [
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=400&auto=format&fit=crop",
    ],
    created_at: "2024-01-17T10:00:00Z",
    updated_at: "2024-01-17T10:00:00Z",
  },
  {
    id: "4",
    name: "Vintage Collectibles",
    description: "Rare and vintage collectible items",
    author_id: "user-123",
    product_count: 0,
    product_images: [],
    created_at: "2024-01-18T10:00:00Z",
    updated_at: "2024-01-18T10:00:00Z",
  },
  {
    id: "5",
    name: "Limited Editions",
    description: "Limited edition releases and exclusive items",
    author_id: "user-123",
    product_count: 8,
    product_images: [
      "https://images.unsplash.com/photo-1531279554141-7dfdb443c375?q=80&w=400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=400&auto=format&fit=crop",
    ],
    created_at: "2024-01-19T10:00:00Z",
    updated_at: "2024-01-19T10:00:00Z",
  },
];

/**
 * Get mock categories for a specific author
 * @param authorId - The author's user ID
 * @returns Array of categories belonging to the author
 */
export function getMockCategoriesByAuthor(authorId: string): Category[] {
  return MOCK_CATEGORIES.filter((category) => category.author_id === authorId);
}

/**
 * Get a single mock category by ID
 * @param categoryId - The category ID
 * @returns The category or undefined if not found
 */
export function getMockCategoryById(categoryId: string): Category | undefined {
  return MOCK_CATEGORIES.find((category) => category.id === categoryId);
}

/**
 * Create a new mock category
 * Used for testing create operations
 * @param name - Category name
 * @param description - Category description
 * @param authorId - Author's user ID
 * @returns New category object
 */
export function createMockCategory(
  name: string,
  description: string | undefined,
  authorId: string,
): Category {
  const now = new Date().toISOString();
  return {
    id: `cat-${Date.now()}`,
    name,
    description,
    author_id: authorId,
    product_count: 0,
    product_images: [],
    created_at: now,
    updated_at: now,
  };
}
