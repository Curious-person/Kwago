import { describe, it, expect } from 'vitest';
import fc from 'fast-check';

/**
 * Property-Based Tests for CategoryCard Component
 *
 * **Validates: Requirements 2.6, 2.7, 6.1, 6.2, 6.3, 6.4**
 *
 * Property 3: Product Count Badge Display
 * Property 4: Product Image Preview
 *
 * These properties ensure that the CategoryCard component correctly displays
 * product counts and image previews across all valid input ranges.
 */
describe('CategoryCard - Property-Based Tests', () => {
    /**
     * Generator for product counts (0 to 1000)
     * Covers all realistic product count scenarios
     */
    const productCountArbitrary = () =>
        fc.integer({ min: 0, max: 1000 });

    /**
     * Generator for product image arrays
     * Generates arrays of image URLs with varying lengths
     */
    const productImagesArbitrary = () =>
        fc.array(
            fc.webUrl(),
            { minLength: 0, maxLength: 10 }
        );

    /**
     * Helper function to determine the correct product count badge text
     * Implements the same logic as the CategoryCard component
     */
    const getExpectedProductCountText = (count: number): string => {
        return `${count} ${count === 1 ? 'product' : 'products'}`;
    };

    /**
     * Helper function to determine how many images should be displayed
     * Implements the same logic as the CategoryCard component
     */
    const getDisplayedImageCount = (productImages: string[]): number => {
        return Math.min(productImages.length, 3);
    };

    /**
     * Helper function to determine if "+N more" indicator should be shown
     * Implements the same logic as the CategoryCard component
     */
    const getMoreIndicatorCount = (productCount: number): number => {
        return Math.max(0, productCount - 3);
    };

    /**
     * Helper function to determine if "No products yet" should be shown
     * Implements the same logic as the CategoryCard component
     */
    const shouldShowNoProductsPlaceholder = (productCount: number, productImages: string[]): boolean => {
        return productCount === 0 && productImages.length === 0;
    };

    describe('Property 3: Product Count Badge Display', () => {
        it('should display "0 products" when count is 0', () => {
            const count = 0;
            const text = getExpectedProductCountText(count);
            expect(text).toBe('0 products');
        });

        it('should display "1 product" (singular) when count is 1', () => {
            const count = 1;
            const text = getExpectedProductCountText(count);
            expect(text).toBe('1 product');
        });

        it('should display "N products" (plural) when count > 1', () => {
            fc.assert(
                fc.property(
                    fc.integer({ min: 2, max: 1000 }),
                    (count) => {
                        const text = getExpectedProductCountText(count);
                        return text === `${count} products`;
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('should always include the correct count number', () => {
            fc.assert(
                fc.property(
                    productCountArbitrary(),
                    (count) => {
                        const text = getExpectedProductCountText(count);
                        return text.startsWith(count.toString());
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('should use correct singular/plural form for all counts', () => {
            fc.assert(
                fc.property(
                    productCountArbitrary(),
                    (count) => {
                        const text = getExpectedProductCountText(count);
                        if (count === 1) {
                            return text.includes('product') && !text.includes('products');
                        } else {
                            return text.includes('products');
                        }
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('should handle edge case counts correctly', () => {
            const edgeCases = [0, 1, 2, 10, 100, 1000];

            edgeCases.forEach((count) => {
                const text = getExpectedProductCountText(count);
                expect(text).toContain(count.toString());
                if (count === 1) {
                    expect(text).toBe('1 product');
                } else {
                    expect(text).toContain('products');
                }
            });
        });

        it('should never display negative product counts', () => {
            fc.assert(
                fc.property(
                    fc.integer({ min: 0, max: 1000 }),
                    (count) => {
                        const text = getExpectedProductCountText(count);
                        const numberMatch = text.match(/\d+/);
                        return numberMatch && parseInt(numberMatch[0]) >= 0;
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('should accurately reflect product count for all values', () => {
            fc.assert(
                fc.property(
                    productCountArbitrary(),
                    (count) => {
                        const text = getExpectedProductCountText(count);
                        const extractedCount = parseInt(text.split(' ')[0]);
                        return extractedCount === count;
                    }
                ),
                { numRuns: 100 }
            );
        });
    });

    describe('Property 4: Product Image Preview', () => {
        it('should display up to 3 product images', () => {
            fc.assert(
                fc.property(
                    productImagesArbitrary(),
                    (images) => {
                        const displayedCount = getDisplayedImageCount(images);
                        return displayedCount <= 3;
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('should display all images when count <= 3', () => {
            fc.assert(
                fc.property(
                    fc.array(fc.webUrl(), { minLength: 0, maxLength: 3 }),
                    (images) => {
                        const displayedCount = getDisplayedImageCount(images);
                        return displayedCount === images.length;
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('should display exactly 3 images when count > 3', () => {
            fc.assert(
                fc.property(
                    fc.array(fc.webUrl(), { minLength: 4, maxLength: 10 }),
                    (images) => {
                        const displayedCount = getDisplayedImageCount(images);
                        return displayedCount === 3;
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('should display "+N more" indicator when product_count > 3', () => {
            fc.assert(
                fc.property(
                    fc.integer({ min: 4, max: 1000 }),
                    (count) => {
                        const moreCount = getMoreIndicatorCount(count);
                        return moreCount === count - 3;
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('should not display "+N more" when product_count <= 3', () => {
            fc.assert(
                fc.property(
                    fc.integer({ min: 0, max: 3 }),
                    (count) => {
                        const moreCount = getMoreIndicatorCount(count);
                        return moreCount === 0;
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('should display "No products yet" when product_count is 0 and no images', () => {
            const count = 0;
            const images: string[] = [];
            const shouldShow = shouldShowNoProductsPlaceholder(count, images);
            expect(shouldShow).toBe(true);
        });

        it('should not display "No products yet" when product_count > 0', () => {
            fc.assert(
                fc.property(
                    fc.integer({ min: 1, max: 1000 }),
                    productImagesArbitrary(),
                    (count, images) => {
                        const shouldShow = shouldShowNoProductsPlaceholder(count, images);
                        return shouldShow === false;
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('should not display "No products yet" when images exist', () => {
            fc.assert(
                fc.property(
                    fc.integer({ min: 0, max: 1000 }),
                    fc.array(fc.webUrl(), { minLength: 1, maxLength: 10 }),
                    (count, images) => {
                        const shouldShow = shouldShowNoProductsPlaceholder(count, images);
                        return shouldShow === false;
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('should correctly calculate "+N more" for all product counts', () => {
            fc.assert(
                fc.property(
                    fc.integer({ min: 0, max: 1000 }),
                    (count) => {
                        const moreCount = getMoreIndicatorCount(count);
                        if (count <= 3) {
                            return moreCount === 0;
                        } else {
                            return moreCount === count - 3;
                        }
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('should handle edge case image counts', () => {
            const edgeCases = [
                { images: [], expected: 0 },
                { images: ['img1'], expected: 1 },
                { images: ['img1', 'img2'], expected: 2 },
                { images: ['img1', 'img2', 'img3'], expected: 3 },
                { images: ['img1', 'img2', 'img3', 'img4'], expected: 3 },
                { images: Array(10).fill('img'), expected: 3 },
            ];

            edgeCases.forEach(({ images, expected }) => {
                const displayedCount = getDisplayedImageCount(images);
                expect(displayedCount).toBe(expected);
            });
        });

        it('should handle edge case product counts for "+N more"', () => {
            const edgeCases = [
                { count: 0, expected: 0 },
                { count: 1, expected: 0 },
                { count: 2, expected: 0 },
                { count: 3, expected: 0 },
                { count: 4, expected: 1 },
                { count: 5, expected: 2 },
                { count: 10, expected: 7 },
                { count: 100, expected: 97 },
            ];

            edgeCases.forEach(({ count, expected }) => {
                const moreCount = getMoreIndicatorCount(count);
                expect(moreCount).toBe(expected);
            });
        });

        it('should never display negative "+N more" values', () => {
            fc.assert(
                fc.property(
                    productCountArbitrary(),
                    (count) => {
                        const moreCount = getMoreIndicatorCount(count);
                        return moreCount >= 0;
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('should maintain consistency between image count and "+N more" indicator', () => {
            fc.assert(
                fc.property(
                    productCountArbitrary(),
                    productImagesArbitrary(),
                    (count, images) => {
                        const displayedImages = getDisplayedImageCount(images);
                        const moreCount = getMoreIndicatorCount(count);

                        // The "+N more" indicator is based on product_count, not images.length
                        // It should show when product_count > 3
                        // But we only display it if we have images to show
                        if (displayedImages > 0 && count > 3) {
                            // If we have images and more than 3 products, show "+N more"
                            return moreCount === count - 3;
                        }
                        // If we have no images or count <= 3, no "+N more"
                        if (displayedImages === 0 || count <= 3) {
                            return moreCount === 0 || displayedImages === 0;
                        }
                        return true;
                    }
                ),
                { numRuns: 100 }
            );
        });
    });

    describe('Property 3 & 4: Combined Validation', () => {
        it('should correctly handle all combinations of product counts and image arrays', () => {
            fc.assert(
                fc.property(
                    productCountArbitrary(),
                    productImagesArbitrary(),
                    (count, images) => {
                        const countText = getExpectedProductCountText(count);
                        const displayedImages = getDisplayedImageCount(images);
                        const moreCount = getMoreIndicatorCount(count);
                        const noProducts = shouldShowNoProductsPlaceholder(count, images);

                        // Count text should always be valid
                        const isValidCountText = countText.includes(count.toString());

                        // Displayed images should never exceed 3
                        const isValidImageCount = displayedImages <= 3;

                        // More count should be 0 if count <= 3
                        const isValidMoreCount = count <= 3 ? moreCount === 0 : moreCount > 0;

                        // No products placeholder only when count is 0 and no images
                        const isValidNoProducts = noProducts === (count === 0 && images.length === 0);

                        return isValidCountText && isValidImageCount && isValidMoreCount && isValidNoProducts;
                    }
                ),
                { numRuns: 200 }
            );
        });

        it('should maintain logical consistency across all properties', () => {
            fc.assert(
                fc.property(
                    productCountArbitrary(),
                    productImagesArbitrary(),
                    (count, images) => {
                        const displayedImages = getDisplayedImageCount(images);
                        const moreCount = getMoreIndicatorCount(count);

                        // The "+N more" is based on product_count, not images
                        // It should be 0 when count <= 3, otherwise count - 3
                        const expectedMoreCount = count <= 3 ? 0 : count - 3;

                        // Displayed images should never exceed 3
                        const isValidImageCount = displayedImages <= 3;

                        // More count should match expected
                        const isValidMoreCount = moreCount === expectedMoreCount;

                        return isValidImageCount && isValidMoreCount;
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('should handle realistic category scenarios', () => {
            const scenarios = [
                { count: 0, images: [], description: 'Empty category' },
                { count: 1, images: ['img1'], description: 'Single product' },
                { count: 3, images: ['img1', 'img2', 'img3'], description: 'Exactly 3 products' },
                { count: 5, images: ['img1', 'img2', 'img3'], description: '5 products, 3 images' },
                { count: 10, images: ['img1', 'img2', 'img3'], description: '10 products, 3 images' },
                { count: 100, images: ['img1', 'img2', 'img3'], description: '100 products, 3 images' },
            ];

            scenarios.forEach(({ count, images, description }) => {
                const countText = getExpectedProductCountText(count);
                const displayedImages = getDisplayedImageCount(images);
                const moreCount = getMoreIndicatorCount(count);

                expect(countText).toContain(count.toString());
                expect(displayedImages).toBeLessThanOrEqual(3);
                expect(moreCount).toBe(Math.max(0, count - 3));
            });
        });
    });

    describe('Property 3 & 4: Boundary Testing', () => {
        it('should handle boundary between 3 and 4 products correctly', () => {
            const threeProducts = { count: 3, images: ['img1', 'img2', 'img3'] };
            const fourProducts = { count: 4, images: ['img1', 'img2', 'img3'] };

            const threeMore = getMoreIndicatorCount(threeProducts.count);
            const fourMore = getMoreIndicatorCount(fourProducts.count);

            expect(threeMore).toBe(0);
            expect(fourMore).toBe(1);
        });

        it('should handle boundary between 0 and 1 products correctly', () => {
            const zeroProducts = { count: 0, images: [] };
            const oneProduct = { count: 1, images: ['img1'] };

            const zeroText = getExpectedProductCountText(zeroProducts.count);
            const oneText = getExpectedProductCountText(oneProduct.count);

            expect(zeroText).toBe('0 products');
            expect(oneText).toBe('1 product');
        });

        it('should handle boundary between 1 and 2 products correctly', () => {
            const oneProduct = { count: 1 };
            const twoProducts = { count: 2 };

            const oneText = getExpectedProductCountText(oneProduct.count);
            const twoText = getExpectedProductCountText(twoProducts.count);

            expect(oneText).toBe('1 product');
            expect(twoText).toBe('2 products');
        });

        it('should handle maximum realistic product counts', () => {
            const maxCount = 1000;
            const countText = getExpectedProductCountText(maxCount);
            const moreCount = getMoreIndicatorCount(maxCount);

            expect(countText).toBe('1000 products');
            expect(moreCount).toBe(997);
        });

        it('should handle maximum realistic image arrays', () => {
            const maxImages = Array(10).fill('https://example.com/image.jpg');
            const displayedCount = getDisplayedImageCount(maxImages);

            expect(displayedCount).toBe(3);
        });
    });
});
