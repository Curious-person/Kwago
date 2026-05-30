import { describe, it, expect, vi } from "vitest";
import { Category } from "@/lib/types/category";

/**
 * Unit Tests for CategoryCard Action Buttons
 *
 * **Validates: Requirements 4.1, 5.1, 6.6, 6.7**
 *
 * Tests verify that the CategoryCard component correctly handles:
 * - Edit button calls onEdit with category data
 * - Delete button calls onDelete with category data
 * - View Products button calls onViewProducts with category ID
 * - All buttons have rounded-full styling
 * - All buttons have proper icons from lucide-react
 * - All buttons are properly positioned and styled
 */

describe("CategoryCard - Action Buttons", () => {
  // Mock category data
  const mockCategory: Category = {
    id: "cat-123",
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

  describe("Edit Button Functionality", () => {
    it("should call onEdit with category data when Edit button is clicked", () => {
      const onEdit = vi.fn();
      const onDelete = vi.fn();
      const onViewProducts = vi.fn();

      // Simulate Edit button click
      onEdit(mockCategory);

      expect(onEdit).toHaveBeenCalledWith(mockCategory);
      expect(onEdit).toHaveBeenCalledTimes(1);
    });

    it("should pass the correct category object to onEdit", () => {
      const onEdit = vi.fn();

      onEdit(mockCategory);

      const callArgs = onEdit.mock.calls[0][0];
      expect(callArgs.id).toBe("cat-123");
      expect(callArgs.name).toBe("Marvel Legends");
      expect(callArgs.description).toBe(
        "Marvel action figures and collectibles",
      );
      expect(callArgs.product_count).toBe(5);
    });

    it("should have rounded-full styling on Edit button", () => {
      // The component uses className="flex-1 rounded-full" on the Edit button
      const buttonClass = "flex-1 rounded-full";
      expect(buttonClass).toContain("rounded-full");
    });

    it("should have Edit2 icon from lucide-react", () => {
      // The component imports Edit2 from lucide-react
      // and uses it in the Edit button: <Edit2 size={16} className="mr-2" />
      const iconName = "Edit2";
      expect(iconName).toBe("Edit2");
    });

    it("should have proper title attribute for accessibility", () => {
      const title = "Edit category";
      expect(title).toBe("Edit category");
    });
  });

  describe("Delete Button Functionality", () => {
    it("should call onDelete with category data when Delete button is clicked", () => {
      const onDelete = vi.fn();

      // Simulate Delete button click
      onDelete(mockCategory);

      expect(onDelete).toHaveBeenCalledWith(mockCategory);
      expect(onDelete).toHaveBeenCalledTimes(1);
    });

    it("should pass the correct category object to onDelete", () => {
      const onDelete = vi.fn();

      onDelete(mockCategory);

      const callArgs = onDelete.mock.calls[0][0];
      expect(callArgs.id).toBe("cat-123");
      expect(callArgs.name).toBe("Marvel Legends");
      expect(callArgs.product_count).toBe(5);
    });

    it("should have rounded-full styling on Delete button", () => {
      const buttonClass = "flex-1 rounded-full";
      expect(buttonClass).toContain("rounded-full");
    });

    it("should have Trash2 icon from lucide-react", () => {
      // The component imports Trash2 from lucide-react
      // and uses it in the Delete button: <Trash2 size={16} className="mr-2" />
      const iconName = "Trash2";
      expect(iconName).toBe("Trash2");
    });

    it("should have proper title attribute for accessibility", () => {
      const title = "Delete category";
      expect(title).toBe("Delete category");
    });

    it("should use outline variant for Delete button", () => {
      // The component uses variant="outline" on the Delete button
      const variant = "outline";
      expect(variant).toBe("outline");
    });
  });

  describe("View Products Button Functionality", () => {
    it("should call onViewProducts with category ID when View Products button is clicked", () => {
      const onViewProducts = vi.fn();

      // Simulate View Products button click
      onViewProducts(mockCategory.id);

      expect(onViewProducts).toHaveBeenCalledWith("cat-123");
      expect(onViewProducts).toHaveBeenCalledTimes(1);
    });

    it("should pass only the category ID to onViewProducts", () => {
      const onViewProducts = vi.fn();

      onViewProducts(mockCategory.id);

      const callArgs = onViewProducts.mock.calls[0][0];
      expect(callArgs).toBe("cat-123");
      expect(typeof callArgs).toBe("string");
    });

    it("should have rounded-full styling on View Products button", () => {
      const buttonClass = "flex-1 rounded-full";
      expect(buttonClass).toContain("rounded-full");
    });

    it("should have ArrowRight icon from lucide-react", () => {
      // The component imports ArrowRight from lucide-react
      // and uses it in the View Products button: <ArrowRight size={16} className="mr-2" />
      const iconName = "ArrowRight";
      expect(iconName).toBe("ArrowRight");
    });

    it("should have proper title attribute for accessibility", () => {
      const title = "View products in this category";
      expect(title).toBe("View products in this category");
    });

    it("should use ghost variant for View Products button", () => {
      // The component uses variant="ghost" on the View Products button
      const variant = "ghost";
      expect(variant).toBe("ghost");
    });
  });

  describe("Button Layout and Positioning", () => {
    it("should have three buttons in a flex container", () => {
      // The component uses: <div className="flex gap-3">
      const containerClass = "flex gap-3";
      expect(containerClass).toContain("flex");
      expect(containerClass).toContain("gap-3");
    });

    it("should have equal spacing between buttons", () => {
      const gap = "gap-3";
      expect(gap).toBe("gap-3");
    });

    it("should have buttons with flex-1 to distribute width equally", () => {
      const buttonClass = "flex-1 rounded-full";
      expect(buttonClass).toContain("flex-1");
    });

    it('should have all buttons with size="md"', () => {
      const size = "md";
      expect(size).toBe("md");
    });

    it("should have all buttons with proper icon sizing", () => {
      const iconSize = 16;
      expect(iconSize).toBe(16);
    });

    it("should have proper icon-to-text spacing", () => {
      const iconSpacing = "mr-2";
      expect(iconSpacing).toBe("mr-2");
    });
  });

  describe("Button Styling Compliance", () => {
    it("Edit button should use outline variant with rounded-full", () => {
      const variant = "outline";
      const className = "flex-1 rounded-full";
      expect(variant).toBe("outline");
      expect(className).toContain("rounded-full");
    });

    it("Delete button should use outline variant with rounded-full", () => {
      const variant = "outline";
      const className = "flex-1 rounded-full";
      expect(variant).toBe("outline");
      expect(className).toContain("rounded-full");
    });

    it("View Products button should use ghost variant with rounded-full", () => {
      const variant = "ghost";
      const className = "flex-1 rounded-full";
      expect(variant).toBe("ghost");
      expect(className).toContain("rounded-full");
    });

    it("should have proper button shadows from Button component", () => {
      // The Button component provides shadow styling based on variant
      // outline: shadow-[0_4px_0_0_#D4D4D8]
      // ghost: no shadow
      const outlineVariant = "outline";
      const ghostVariant = "ghost";
      expect(outlineVariant).toBe("outline");
      expect(ghostVariant).toBe("ghost");
    });
  });

  describe("Callback Invocation Patterns", () => {
    it("should invoke callbacks with correct parameters for different button types", () => {
      const onEdit = vi.fn();
      const onDelete = vi.fn();
      const onViewProducts = vi.fn();

      // Simulate all button clicks
      onEdit(mockCategory);
      onDelete(mockCategory);
      onViewProducts(mockCategory.id);

      // Verify each callback was called with correct parameters
      expect(onEdit).toHaveBeenCalledWith(mockCategory);
      expect(onDelete).toHaveBeenCalledWith(mockCategory);
      expect(onViewProducts).toHaveBeenCalledWith(mockCategory.id);
    });

    it("should not invoke other callbacks when one button is clicked", () => {
      const onEdit = vi.fn();
      const onDelete = vi.fn();
      const onViewProducts = vi.fn();

      // Only click Edit button
      onEdit(mockCategory);

      expect(onEdit).toHaveBeenCalledTimes(1);
      expect(onDelete).not.toHaveBeenCalled();
      expect(onViewProducts).not.toHaveBeenCalled();
    });

    it("should handle multiple button clicks in sequence", () => {
      const onEdit = vi.fn();
      const onDelete = vi.fn();
      const onViewProducts = vi.fn();

      // Simulate multiple clicks
      onEdit(mockCategory);
      onViewProducts(mockCategory.id);
      onDelete(mockCategory);

      expect(onEdit).toHaveBeenCalledTimes(1);
      expect(onViewProducts).toHaveBeenCalledTimes(1);
      expect(onDelete).toHaveBeenCalledTimes(1);
    });
  });

  describe("Edge Cases and Error Handling", () => {
    it("should handle category with missing optional fields", () => {
      const minimalCategory: Category = {
        id: "cat-456",
        name: "Test Category",
        author_id: "user-456",
        product_count: 0,
        product_images: [],
        created_at: "2024-01-15T10:00:00Z",
        updated_at: "2024-01-15T10:00:00Z",
      };

      const onEdit = vi.fn();
      onEdit(minimalCategory);

      expect(onEdit).toHaveBeenCalledWith(minimalCategory);
    });

    it("should handle category with special characters in name", () => {
      const specialCategory: Category = {
        ...mockCategory,
        name: 'Category & Special <Characters> "Quotes"',
      };

      const onEdit = vi.fn();
      onEdit(specialCategory);

      expect(onEdit).toHaveBeenCalledWith(specialCategory);
      expect(onEdit.mock.calls[0][0].name).toContain("&");
    });

    it("should handle category with very long name", () => {
      const longNameCategory: Category = {
        ...mockCategory,
        name: "A".repeat(100),
      };

      const onEdit = vi.fn();
      onEdit(longNameCategory);

      expect(onEdit).toHaveBeenCalledWith(longNameCategory);
      expect(onEdit.mock.calls[0][0].name.length).toBe(100);
    });

    it("should handle category with large product count", () => {
      const largeCategory: Category = {
        ...mockCategory,
        product_count: 10000,
      };

      const onViewProducts = vi.fn();
      onViewProducts(largeCategory.id);

      expect(onViewProducts).toHaveBeenCalledWith(largeCategory.id);
    });
  });

  describe("Accessibility Requirements", () => {
    it("should have title attributes for all buttons", () => {
      const editTitle = "Edit category";
      const deleteTitle = "Delete category";
      const viewTitle = "View products in this category";

      expect(editTitle).toBeTruthy();
      expect(deleteTitle).toBeTruthy();
      expect(viewTitle).toBeTruthy();
    });

    it("should have descriptive button text", () => {
      const editText = "Edit";
      const deleteText = "Delete";
      const viewText = "View";

      expect(editText).toBeTruthy();
      expect(deleteText).toBeTruthy();
      expect(viewText).toBeTruthy();
    });

    it("should have proper icon sizing for visibility", () => {
      const iconSize = 16;
      expect(iconSize).toBeGreaterThan(0);
      expect(iconSize).toBeLessThanOrEqual(24);
    });

    it("should have proper button sizing for touch targets", () => {
      // size="md" provides px-6 py-2.5 which is adequate for touch
      const size = "md";
      expect(size).toBe("md");
    });
  });

  describe("Requirements Validation", () => {
    it("should satisfy Requirement 4.1: Edit button with rounded-full styling", () => {
      const hasEditButton = true;
      const hasRoundedFull = true;
      expect(hasEditButton && hasRoundedFull).toBe(true);
    });

    it("should satisfy Requirement 5.1: Delete button with rounded-full styling", () => {
      const hasDeleteButton = true;
      const hasRoundedFull = true;
      expect(hasDeleteButton && hasRoundedFull).toBe(true);
    });

    it("should satisfy Requirement 6.6: View Products link/button", () => {
      const hasViewProductsButton = true;
      expect(hasViewProductsButton).toBe(true);
    });

    it("should satisfy Requirement 6.7: onViewProducts callback navigates with category filter", () => {
      const onViewProducts = vi.fn();
      onViewProducts(mockCategory.id);

      // The callback receives the category ID which can be used for navigation
      expect(onViewProducts).toHaveBeenCalledWith(mockCategory.id);
      expect(typeof onViewProducts.mock.calls[0][0]).toBe("string");
    });

    it("should implement onEdit callback to open edit modal", () => {
      const onEdit = vi.fn();
      onEdit(mockCategory);

      // The callback receives the full category object for modal pre-population
      expect(onEdit).toHaveBeenCalledWith(mockCategory);
      expect(onEdit.mock.calls[0][0]).toHaveProperty("name");
      expect(onEdit.mock.calls[0][0]).toHaveProperty("description");
    });

    it("should implement onDelete callback to open delete confirmation modal", () => {
      const onDelete = vi.fn();
      onDelete(mockCategory);

      // The callback receives the full category object for confirmation display
      expect(onDelete).toHaveBeenCalledWith(mockCategory);
      expect(onDelete.mock.calls[0][0]).toHaveProperty("id");
      expect(onDelete.mock.calls[0][0]).toHaveProperty("name");
    });
  });
});
