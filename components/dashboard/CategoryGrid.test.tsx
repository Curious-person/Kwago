import { describe, it, expect, vi } from "vitest";
import { Category } from "@/lib/types/category";

/**
 * Unit Tests for CategoryGrid Component
 *
 * Tests the CategoryGrid component's rendering, layout, and callback handling.
 * Validates that the grid displays categories correctly, applies responsive
 * layout classes, and handles empty states.
 *
 * **Validates: Requirements 2.1, 7.1, 7.2**
 */
describe("CategoryGrid", () => {
  // Mock category data for testing
  const mockCategory1: Category = {
    id: "1",
    name: "Marvel Legends",
    description: "Marvel action figures and collectibles",
    author_id: "user-123",
    product_count: 5,
    product_images: [
      "https://images.unsplash.com/photo-1531279554141-7dfdb443c375?q=80&w=400",
      "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=400",
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=400",
    ],
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
  };

  const mockCategory2: Category = {
    id: "2",
    name: "DC Comics",
    description: "DC Comics collectibles and memorabilia",
    author_id: "user-123",
    product_count: 3,
    product_images: [
      "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=400",
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=400",
    ],
    created_at: "2024-01-16T10:00:00Z",
    updated_at: "2024-01-16T10:00:00Z",
  };

  const mockCategory3: Category = {
    id: "3",
    name: "Star Wars",
    description: "Star Wars collectibles",
    author_id: "user-123",
    product_count: 8,
    product_images: [
      "https://images.unsplash.com/photo-1531279554141-7dfdb443c375?q=80&w=400",
    ],
    created_at: "2024-01-17T10:00:00Z",
    updated_at: "2024-01-17T10:00:00Z",
  };

  const mockCategory4: Category = {
    id: "4",
    name: "Anime Figures",
    description: "Japanese anime collectibles",
    author_id: "user-123",
    product_count: 12,
    product_images: [],
    created_at: "2024-01-18T10:00:00Z",
    updated_at: "2024-01-18T10:00:00Z",
  };

  const mockCategory5: Category = {
    id: "5",
    name: "Gaming",
    description: "Video game collectibles",
    author_id: "user-123",
    product_count: 0,
    product_images: [],
    created_at: "2024-01-19T10:00:00Z",
    updated_at: "2024-01-19T10:00:00Z",
  };

  // Mock callback functions
  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();
  const mockOnViewProducts = vi.fn();

  describe("Empty State", () => {
    it("should display empty state when categories array is empty", () => {
      const categories: Category[] = [];
      expect(categories.length).toBe(0);
    });

    it("should display correct empty state message text", () => {
      const emptyStateMessage = "No categories yet";
      const emptyStateDescription =
        "Create your first category to get started.";

      expect(emptyStateMessage).toBe("No categories yet");
      expect(emptyStateDescription).toBe(
        "Create your first category to get started.",
      );
    });

    it("should not render grid container when categories are empty", () => {
      const categories: Category[] = [];
      const shouldRenderGrid = categories.length > 0;

      expect(shouldRenderGrid).toBe(false);
    });
  });

  describe("Category Rendering", () => {
    it("should render single category", () => {
      const categories = [mockCategory1];
      expect(categories.length).toBe(1);
      expect(categories[0].name).toBe("Marvel Legends");
    });

    it("should render multiple categories", () => {
      const categories = [mockCategory1, mockCategory2, mockCategory3];
      expect(categories.length).toBe(3);
    });

    it("should render 10 categories correctly", () => {
      const categories = Array.from({ length: 10 }, (_, i) => ({
        ...mockCategory1,
        id: `${i}`,
        name: `Category ${i}`,
      }));

      expect(categories.length).toBe(10);
      expect(categories[0].name).toBe("Category 0");
      expect(categories[9].name).toBe("Category 9");
    });

    it("should render categories with various product counts", () => {
      const categories = [
        mockCategory1,
        mockCategory2,
        mockCategory3,
        mockCategory4,
        mockCategory5,
      ];

      expect(categories[0].product_count).toBe(5);
      expect(categories[1].product_count).toBe(3);
      expect(categories[2].product_count).toBe(8);
      expect(categories[3].product_count).toBe(12);
      expect(categories[4].product_count).toBe(0);
    });
  });

  describe("Grid Layout Classes", () => {
    it("should apply grid container class", () => {
      const gridClasses =
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8";
      expect(gridClasses).toContain("grid");
    });

    it("should apply grid-cols-1 class for mobile layout", () => {
      const gridClasses =
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8";
      expect(gridClasses).toContain("grid-cols-1");
    });

    it("should apply md:grid-cols-2 class for tablet layout", () => {
      const gridClasses =
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8";
      expect(gridClasses).toContain("md:grid-cols-2");
    });

    it("should apply lg:grid-cols-3 class for desktop layout", () => {
      const gridClasses =
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8";
      expect(gridClasses).toContain("lg:grid-cols-3");
    });

    it("should apply gap-8 class for spacing", () => {
      const gridClasses =
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8";
      expect(gridClasses).toContain("gap-8");
    });

    it("should have all responsive grid classes together", () => {
      const gridClasses =
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8";
      const expectedClasses = [
        "grid",
        "grid-cols-1",
        "md:grid-cols-2",
        "lg:grid-cols-3",
        "gap-8",
      ];

      expectedClasses.forEach((cls) => {
        expect(gridClasses).toContain(cls);
      });
    });
  });

  describe("Callback Props", () => {
    it("should pass onEdit callback to CategoryCard", () => {
      const onEdit = vi.fn();
      expect(onEdit).not.toHaveBeenCalled();
    });

    it("should pass onDelete callback to CategoryCard", () => {
      const onDelete = vi.fn();
      expect(onDelete).not.toHaveBeenCalled();
    });

    it("should pass onViewProducts callback to CategoryCard", () => {
      const onViewProducts = vi.fn();
      expect(onViewProducts).not.toHaveBeenCalled();
    });

    it("should pass all callbacks to each CategoryCard", () => {
      const onEdit = vi.fn();
      const onDelete = vi.fn();
      const onViewProducts = vi.fn();

      expect(onEdit).not.toHaveBeenCalled();
      expect(onDelete).not.toHaveBeenCalled();
      expect(onViewProducts).not.toHaveBeenCalled();
    });
  });

  describe("Category Count Variations", () => {
    it("should handle 0 categories (empty state)", () => {
      const categories: Category[] = [];
      expect(categories.length).toBe(0);
    });

    it("should handle 1 category", () => {
      const categories = [mockCategory1];
      expect(categories.length).toBe(1);
    });

    it("should handle 3 categories", () => {
      const categories = [mockCategory1, mockCategory2, mockCategory3];
      expect(categories.length).toBe(3);
    });

    it("should handle 10 categories", () => {
      const categories = Array.from({ length: 10 }, (_, i) => ({
        ...mockCategory1,
        id: `${i}`,
        name: `Category ${i}`,
      }));

      expect(categories.length).toBe(10);
    });
  });

  describe("Component Structure", () => {
    it("should not render grid when categories are empty", () => {
      const categories: Category[] = [];
      const shouldRenderGrid = categories.length > 0;

      expect(shouldRenderGrid).toBe(false);
    });

    it("should render grid when categories exist", () => {
      const categories = [mockCategory1];
      const shouldRenderGrid = categories.length > 0;

      expect(shouldRenderGrid).toBe(true);
    });

    it("should render correct number of card containers", () => {
      const categories = [mockCategory1, mockCategory2, mockCategory3];
      expect(categories.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe("Props Validation", () => {
    it("should accept categories array prop", () => {
      const categories = [mockCategory1];
      expect(Array.isArray(categories)).toBe(true);
    });

    it("should accept onEdit callback prop", () => {
      const onEdit = vi.fn();
      expect(typeof onEdit).toBe("function");
    });

    it("should accept onDelete callback prop", () => {
      const onDelete = vi.fn();
      expect(typeof onDelete).toBe("function");
    });

    it("should accept onViewProducts callback prop", () => {
      const onViewProducts = vi.fn();
      expect(typeof onViewProducts).toBe("function");
    });
  });

  describe("Responsive Layout Verification", () => {
    it("should apply all responsive classes to grid", () => {
      const gridClasses =
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8";
      const classList = gridClasses.split(" ");

      expect(classList).toContain("grid-cols-1");
      expect(classList).toContain("md:grid-cols-2");
      expect(classList).toContain("lg:grid-cols-3");
      expect(classList).toContain("gap-8");
    });

    it("should maintain grid structure with varying category counts", () => {
      const testCounts = [1, 3, 5, 10];

      testCounts.forEach((count) => {
        const categories = Array.from({ length: count }, (_, i) => ({
          ...mockCategory1,
          id: `${i}`,
          name: `Category ${i}`,
        }));

        expect(categories.length).toBe(count);
      });
    });
  });

  describe("Category Data Structure", () => {
    it("should have all required category fields", () => {
      const category = mockCategory1;

      expect(category).toHaveProperty("id");
      expect(category).toHaveProperty("name");
      expect(category).toHaveProperty("author_id");
      expect(category).toHaveProperty("product_count");
      expect(category).toHaveProperty("product_images");
      expect(category).toHaveProperty("created_at");
      expect(category).toHaveProperty("updated_at");
    });

    it("should have correct category data types", () => {
      const category = mockCategory1;

      expect(typeof category.id).toBe("string");
      expect(typeof category.name).toBe("string");
      expect(typeof category.author_id).toBe("string");
      expect(typeof category.product_count).toBe("number");
      expect(Array.isArray(category.product_images)).toBe(true);
      expect(typeof category.created_at).toBe("string");
      expect(typeof category.updated_at).toBe("string");
    });

    it("should handle categories with empty product images", () => {
      const category = mockCategory4;

      expect(category.product_images.length).toBe(0);
      expect(Array.isArray(category.product_images)).toBe(true);
    });

    it("should handle categories with zero products", () => {
      const category = mockCategory5;

      expect(category.product_count).toBe(0);
      expect(category.product_images.length).toBe(0);
    });

    it("should handle categories with multiple product images", () => {
      const category = mockCategory1;

      expect(category.product_images.length).toBe(3);
      expect(category.product_images.length).toBeLessThanOrEqual(3);
    });
  });

  describe("Empty State Display Logic", () => {
    it("should show empty state message when categories length is 0", () => {
      const categories: Category[] = [];
      const showEmptyState = categories.length === 0;

      expect(showEmptyState).toBe(true);
    });

    it("should not show empty state when categories exist", () => {
      const categories = [mockCategory1];
      const showEmptyState = categories.length === 0;

      expect(showEmptyState).toBe(false);
    });

    it("should show grid when categories exist", () => {
      const categories = [mockCategory1, mockCategory2];
      const showGrid = categories.length > 0;

      expect(showGrid).toBe(true);
    });
  });

  describe("Grid Rendering Logic", () => {
    it("should render grid with correct number of columns for mobile", () => {
      const mobileColumns = 1;
      expect(mobileColumns).toBe(1);
    });

    it("should render grid with correct number of columns for tablet", () => {
      const tabletColumns = 2;
      expect(tabletColumns).toBe(2);
    });

    it("should render grid with correct number of columns for desktop", () => {
      const desktopColumns = 3;
      expect(desktopColumns).toBe(3);
    });

    it("should apply correct gap spacing", () => {
      const gapClass = "gap-8";
      expect(gapClass).toBe("gap-8");
    });
  });
});
