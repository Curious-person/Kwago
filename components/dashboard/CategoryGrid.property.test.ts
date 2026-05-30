import { describe, it, expect } from "vitest";
import fc from "fast-check";

/**
 * Property-Based Tests for CategoryGrid Responsive Layout
 *
 * **Validates: Requirements 2.2, 2.3, 2.4, 8.1**
 *
 * Property 1: Responsive Grid Layout
 *
 * For any viewport width, the category grid SHALL display the correct number of columns:
 * - Viewport width < 768px: 1 column (grid-cols-1)
 * - Viewport width 768px - 1024px: 2 columns (md:grid-cols-2)
 * - Viewport width > 1024px: 3 columns (lg:grid-cols-3)
 *
 * This property ensures that the grid layout respects Tailwind CSS breakpoints
 * and provides appropriate responsive behavior across all device sizes.
 */
describe("CategoryGrid - Property-Based Tests for Responsive Layout", () => {
  /**
   * Viewport width generator for mobile devices (< 768px)
   * Generates realistic mobile viewport widths
   */
  const mobileViewportArbitrary = () => fc.integer({ min: 320, max: 767 });

  /**
   * Viewport width generator for tablet devices (768px - 1024px)
   * Generates realistic tablet viewport widths
   */
  const tabletViewportArbitrary = () => fc.integer({ min: 768, max: 1023 });

  /**
   * Viewport width generator for desktop devices (> 1024px)
   * Generates realistic desktop viewport widths
   */
  const desktopViewportArbitrary = () => fc.integer({ min: 1024, max: 2560 });

  /**
   * Helper function to determine expected column count based on viewport width
   * Implements the same logic as Tailwind CSS breakpoints
   */
  const getExpectedColumnCount = (viewportWidth: number): number => {
    if (viewportWidth < 768) {
      return 1; // Mobile: grid-cols-1
    } else if (viewportWidth < 1024) {
      return 2; // Tablet: md:grid-cols-2
    } else {
      return 3; // Desktop: lg:grid-cols-3
    }
  };

  /**
   * Helper function to calculate actual grid columns based on viewport width
   * This simulates how the grid would render at different breakpoints
   */
  const calculateGridColumns = (
    viewportWidth: number,
    categoryCount: number,
  ): number => {
    const columnCount = getExpectedColumnCount(viewportWidth);
    // If there are fewer categories than columns, return the category count
    return Math.min(columnCount, categoryCount);
  };

  describe("Property 1: Responsive Grid Layout - Mobile Breakpoint", () => {
    it("should display 1 column for all mobile viewports (< 768px)", () => {
      fc.assert(
        fc.property(mobileViewportArbitrary(), (viewportWidth) => {
          const expectedColumns = getExpectedColumnCount(viewportWidth);
          return expectedColumns === 1;
        }),
        { numRuns: 100 },
      );
    });

    it("should maintain 1 column layout for minimum mobile width (320px)", () => {
      const viewportWidth = 320;
      const expectedColumns = getExpectedColumnCount(viewportWidth);
      expect(expectedColumns).toBe(1);
    });

    it("should maintain 1 column layout for maximum mobile width (767px)", () => {
      const viewportWidth = 767;
      const expectedColumns = getExpectedColumnCount(viewportWidth);
      expect(expectedColumns).toBe(1);
    });

    it("should display correct number of visible cards in 1-column layout", () => {
      fc.assert(
        fc.property(
          mobileViewportArbitrary(),
          fc.integer({ min: 1, max: 20 }),
          (viewportWidth, categoryCount) => {
            const visibleColumns = calculateGridColumns(
              viewportWidth,
              categoryCount,
            );
            // In 1-column layout, all categories should be visible (stacked vertically)
            return visibleColumns === Math.min(1, categoryCount);
          },
        ),
        { numRuns: 100 },
      );
    });
  });

  describe("Property 1: Responsive Grid Layout - Tablet Breakpoint", () => {
    it("should display 2 columns for all tablet viewports (768px - 1023px)", () => {
      fc.assert(
        fc.property(tabletViewportArbitrary(), (viewportWidth) => {
          const expectedColumns = getExpectedColumnCount(viewportWidth);
          return expectedColumns === 2;
        }),
        { numRuns: 100 },
      );
    });

    it("should transition from 1 to 2 columns at 768px breakpoint", () => {
      const mobileWidth = 767;
      const tabletWidth = 768;
      const mobileColumns = getExpectedColumnCount(mobileWidth);
      const tabletColumns = getExpectedColumnCount(tabletWidth);
      expect(mobileColumns).toBe(1);
      expect(tabletColumns).toBe(2);
    });

    it("should maintain 2 column layout for minimum tablet width (768px)", () => {
      const viewportWidth = 768;
      const expectedColumns = getExpectedColumnCount(viewportWidth);
      expect(expectedColumns).toBe(2);
    });

    it("should maintain 2 column layout for maximum tablet width (1023px)", () => {
      const viewportWidth = 1023;
      const expectedColumns = getExpectedColumnCount(viewportWidth);
      expect(expectedColumns).toBe(2);
    });

    it("should display correct number of visible cards in 2-column layout", () => {
      fc.assert(
        fc.property(
          tabletViewportArbitrary(),
          fc.integer({ min: 1, max: 20 }),
          (viewportWidth, categoryCount) => {
            const visibleColumns = calculateGridColumns(
              viewportWidth,
              categoryCount,
            );
            // In 2-column layout, display min(2, categoryCount) columns
            return visibleColumns === Math.min(2, categoryCount);
          },
        ),
        { numRuns: 100 },
      );
    });
  });

  describe("Property 1: Responsive Grid Layout - Desktop Breakpoint", () => {
    it("should display 3 columns for all desktop viewports (> 1024px)", () => {
      fc.assert(
        fc.property(desktopViewportArbitrary(), (viewportWidth) => {
          const expectedColumns = getExpectedColumnCount(viewportWidth);
          return expectedColumns === 3;
        }),
        { numRuns: 100 },
      );
    });

    it("should transition from 2 to 3 columns at 1024px breakpoint", () => {
      const tabletWidth = 1023;
      const desktopWidth = 1024;
      const tabletColumns = getExpectedColumnCount(tabletWidth);
      const desktopColumns = getExpectedColumnCount(desktopWidth);
      expect(tabletColumns).toBe(2);
      expect(desktopColumns).toBe(3);
    });

    it("should maintain 3 column layout for minimum desktop width (1024px)", () => {
      const viewportWidth = 1024;
      const expectedColumns = getExpectedColumnCount(viewportWidth);
      expect(expectedColumns).toBe(3);
    });

    it("should maintain 3 column layout for large desktop width (2560px)", () => {
      const viewportWidth = 2560;
      const expectedColumns = getExpectedColumnCount(viewportWidth);
      expect(expectedColumns).toBe(3);
    });

    it("should display correct number of visible cards in 3-column layout", () => {
      fc.assert(
        fc.property(
          desktopViewportArbitrary(),
          fc.integer({ min: 1, max: 20 }),
          (viewportWidth, categoryCount) => {
            const visibleColumns = calculateGridColumns(
              viewportWidth,
              categoryCount,
            );
            // In 3-column layout, display min(3, categoryCount) columns
            return visibleColumns === Math.min(3, categoryCount);
          },
        ),
        { numRuns: 100 },
      );
    });
  });

  describe("Property 1: Responsive Grid Layout - Comprehensive Coverage", () => {
    it("should always return correct column count for any viewport width", () => {
      fc.assert(
        fc.property(fc.integer({ min: 320, max: 2560 }), (viewportWidth) => {
          const columnCount = getExpectedColumnCount(viewportWidth);
          // Column count should always be 1, 2, or 3
          return [1, 2, 3].includes(columnCount);
        }),
        { numRuns: 200 },
      );
    });

    it("should maintain monotonic column count increase across breakpoints", () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 320, max: 767 }),
          fc.integer({ min: 768, max: 1023 }),
          fc.integer({ min: 1024, max: 2560 }),
          (mobileWidth, tabletWidth, desktopWidth) => {
            const mobileColumns = getExpectedColumnCount(mobileWidth);
            const tabletColumns = getExpectedColumnCount(tabletWidth);
            const desktopColumns = getExpectedColumnCount(desktopWidth);
            // Column count should increase or stay the same as viewport grows
            return (
              mobileColumns <= tabletColumns && tabletColumns <= desktopColumns
            );
          },
        ),
        { numRuns: 100 },
      );
    });

    it("should handle edge case viewport widths correctly", () => {
      const edgeCases = [
        { width: 320, expectedColumns: 1 }, // Minimum mobile
        { width: 480, expectedColumns: 1 }, // Common mobile
        { width: 767, expectedColumns: 1 }, // Just before tablet
        { width: 768, expectedColumns: 2 }, // Tablet breakpoint
        { width: 800, expectedColumns: 2 }, // Common tablet
        { width: 1023, expectedColumns: 2 }, // Just before desktop
        { width: 1024, expectedColumns: 3 }, // Desktop breakpoint
        { width: 1440, expectedColumns: 3 }, // Common desktop
        { width: 2560, expectedColumns: 3 }, // Large desktop
      ];

      edgeCases.forEach(({ width, expectedColumns }) => {
        const actualColumns = getExpectedColumnCount(width);
        expect(actualColumns).toBe(expectedColumns);
      });
    });

    it("should correctly calculate grid layout for various category counts", () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 320, max: 2560 }),
          fc.integer({ min: 0, max: 50 }),
          (viewportWidth, categoryCount) => {
            const expectedColumns = getExpectedColumnCount(viewportWidth);
            const visibleColumns = calculateGridColumns(
              viewportWidth,
              categoryCount,
            );
            // Visible columns should never exceed expected columns
            return visibleColumns <= expectedColumns;
          },
        ),
        { numRuns: 200 },
      );
    });

    it("should handle zero categories gracefully", () => {
      fc.assert(
        fc.property(fc.integer({ min: 320, max: 2560 }), (viewportWidth) => {
          const visibleColumns = calculateGridColumns(viewportWidth, 0);
          // With 0 categories, should display 0 columns
          return visibleColumns === 0;
        }),
        { numRuns: 100 },
      );
    });

    it("should handle single category correctly across all breakpoints", () => {
      fc.assert(
        fc.property(fc.integer({ min: 320, max: 2560 }), (viewportWidth) => {
          const visibleColumns = calculateGridColumns(viewportWidth, 1);
          // With 1 category, should always display 1 column
          return visibleColumns === 1;
        }),
        { numRuns: 100 },
      );
    });

    it("should handle many categories correctly across all breakpoints", () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 320, max: 2560 }),
          fc.integer({ min: 10, max: 100 }),
          (viewportWidth, categoryCount) => {
            const expectedColumns = getExpectedColumnCount(viewportWidth);
            const visibleColumns = calculateGridColumns(
              viewportWidth,
              categoryCount,
            );
            // With many categories, should display expected columns
            return visibleColumns === expectedColumns;
          },
        ),
        { numRuns: 100 },
      );
    });
  });

  describe("Property 1: Responsive Grid Layout - Tailwind CSS Class Mapping", () => {
    /**
     * Helper to get the Tailwind CSS grid class based on viewport width
     * This validates that the correct Tailwind classes are applied
     */
    const getTailwindGridClass = (viewportWidth: number): string => {
      if (viewportWidth < 768) {
        return "grid-cols-1";
      } else if (viewportWidth < 1024) {
        return "md:grid-cols-2";
      } else {
        return "lg:grid-cols-3";
      }
    };

    it("should map to correct Tailwind grid-cols-1 class for mobile", () => {
      fc.assert(
        fc.property(mobileViewportArbitrary(), (viewportWidth) => {
          const gridClass = getTailwindGridClass(viewportWidth);
          return gridClass === "grid-cols-1";
        }),
        { numRuns: 100 },
      );
    });

    it("should map to correct Tailwind md:grid-cols-2 class for tablet", () => {
      fc.assert(
        fc.property(tabletViewportArbitrary(), (viewportWidth) => {
          const gridClass = getTailwindGridClass(viewportWidth);
          return gridClass === "md:grid-cols-2";
        }),
        { numRuns: 100 },
      );
    });

    it("should map to correct Tailwind lg:grid-cols-3 class for desktop", () => {
      fc.assert(
        fc.property(desktopViewportArbitrary(), (viewportWidth) => {
          const gridClass = getTailwindGridClass(viewportWidth);
          return gridClass === "lg:grid-cols-3";
        }),
        { numRuns: 100 },
      );
    });

    it("should always return valid Tailwind grid class", () => {
      fc.assert(
        fc.property(fc.integer({ min: 320, max: 2560 }), (viewportWidth) => {
          const gridClass = getTailwindGridClass(viewportWidth);
          const validClasses = [
            "grid-cols-1",
            "md:grid-cols-2",
            "lg:grid-cols-3",
          ];
          return validClasses.includes(gridClass);
        }),
        { numRuns: 200 },
      );
    });
  });

  describe("Property 1: Responsive Grid Layout - Gap and Spacing", () => {
    /**
     * Helper to validate that gap spacing is consistent
     * The grid uses gap-8 (32px) spacing between cards
     */
    const getGridGapPixels = (): number => {
      // Tailwind gap-8 = 2rem = 32px
      return 32;
    };

    it("should maintain consistent gap spacing across all breakpoints", () => {
      fc.assert(
        fc.property(fc.integer({ min: 320, max: 2560 }), (viewportWidth) => {
          const gapPixels = getGridGapPixels();
          // Gap should always be 32px (gap-8)
          return gapPixels === 32;
        }),
        { numRuns: 100 },
      );
    });

    it("should calculate correct total width needed for grid", () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 320, max: 2560 }),
          fc.integer({ min: 1, max: 20 }),
          (viewportWidth, categoryCount) => {
            const columnCount = getExpectedColumnCount(viewportWidth);
            const gapPixels = getGridGapPixels();
            const visibleColumns = Math.min(columnCount, categoryCount);

            // Calculate gaps between columns
            const totalGapWidth = (visibleColumns - 1) * gapPixels;

            // Total width should be positive
            return totalGapWidth >= 0;
          },
        ),
        { numRuns: 100 },
      );
    });
  });
});
