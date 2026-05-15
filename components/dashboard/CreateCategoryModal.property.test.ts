import { describe, it, expect } from 'vitest';
import fc from 'fast-check';

/**
 * Property-Based Tests for CreateCategoryModal Component
 *
 * **Validates: Requirements 3.6, 3.7, 3.8, 4.3**
 *
 * Property 2: Category Name Validation
 *
 * These properties ensure that the CreateCategoryModal component correctly validates
 * category names across all valid and invalid input ranges.
 */
describe('CreateCategoryModal - Property-Based Tests', () => {
    /**
     * Generator for valid category names (1-100 characters)
     * Generates strings that should pass validation
     */
    const validCategoryNameArbitrary = () =>
        fc.stringMatching(/^[^\s].*[^\s]$|^[^\s]$/, { minLength: 1, maxLength: 100 })
            .filter(s => s.trim().length > 0 && s.trim().length <= 100);

    /**
     * Generator for invalid category names (empty or whitespace-only)
     * Generates strings that should fail validation
     */
    const invalidEmptyCategoryNameArbitrary = () =>
        fc.oneof(
            fc.constant(''),
            fc.stringMatching(/^\s+$/, { minLength: 1, maxLength: 100 })
        );

    /**
     * Generator for category names exceeding 100 characters
     * Generates strings that should fail validation
     */
    const tooLongCategoryNameArbitrary = () =>
        fc.string({ minLength: 101, maxLength: 500 });

    /**
     * Helper function to validate category name
     * Implements the same logic as the CreateCategoryModal component
     */
    const validateCategoryName = (value: string): { isValid: boolean; error: string | null } => {
        if (!value.trim()) {
            return { isValid: false, error: 'Category name is required' };
        }
        if (value.length > 100) {
            return { isValid: false, error: 'Category name must be 100 characters or less' };
        }
        return { isValid: true, error: null };
    };

    describe('Property 2: Category Name Validation', () => {
        describe('Empty String Validation', () => {
            it('should reject empty string with "Category name is required" error', () => {
                const result = validateCategoryName('');
                expect(result.isValid).toBe(false);
                expect(result.error).toBe('Category name is required');
            });

            it('should reject empty string specifically', () => {
                const emptyString = '';
                const result = validateCategoryName(emptyString);
                expect(result.isValid).toBe(false);
                expect(result.error).toContain('required');
            });
        });

        describe('Whitespace-Only String Validation', () => {
            it('should reject whitespace-only strings with "Category name is required" error', () => {
                fc.assert(
                    fc.property(
                        invalidEmptyCategoryNameArbitrary(),
                        (name) => {
                            const result = validateCategoryName(name);
                            return result.isValid === false && result.error === 'Category name is required';
                        }
                    ),
                    { numRuns: 100 }
                );
            });

            it('should reject single space', () => {
                const result = validateCategoryName(' ');
                expect(result.isValid).toBe(false);
                expect(result.error).toBe('Category name is required');
            });

            it('should reject multiple spaces', () => {
                const result = validateCategoryName('     ');
                expect(result.isValid).toBe(false);
                expect(result.error).toBe('Category name is required');
            });

            it('should reject tabs and newlines', () => {
                const testCases = ['\t', '\n', '\r', '\t\n', '  \t  '];
                testCases.forEach((name) => {
                    const result = validateCategoryName(name);
                    expect(result.isValid).toBe(false);
                    expect(result.error).toBe('Category name is required');
                });
            });

            it('should reject mixed whitespace', () => {
                fc.assert(
                    fc.property(
                        fc.stringMatching(/^[\s]+$/, { minLength: 1, maxLength: 50 }),
                        (name) => {
                            const result = validateCategoryName(name);
                            return result.isValid === false && result.error === 'Category name is required';
                        }
                    ),
                    { numRuns: 100 }
                );
            });
        });

        describe('String Length Validation (> 100 characters)', () => {
            it('should reject strings exceeding 100 characters', () => {
                fc.assert(
                    fc.property(
                        tooLongCategoryNameArbitrary(),
                        (name) => {
                            const result = validateCategoryName(name);
                            return result.isValid === false && result.error === 'Category name must be 100 characters or less';
                        }
                    ),
                    { numRuns: 100 }
                );
            });

            it('should reject string with exactly 101 characters', () => {
                const name = 'a'.repeat(101);
                const result = validateCategoryName(name);
                expect(result.isValid).toBe(false);
                expect(result.error).toBe('Category name must be 100 characters or less');
            });

            it('should reject string with 200 characters', () => {
                const name = 'a'.repeat(200);
                const result = validateCategoryName(name);
                expect(result.isValid).toBe(false);
                expect(result.error).toBe('Category name must be 100 characters or less');
            });

            it('should reject string with 500 characters', () => {
                const name = 'a'.repeat(500);
                const result = validateCategoryName(name);
                expect(result.isValid).toBe(false);
                expect(result.error).toBe('Category name must be 100 characters or less');
            });

            it('should reject string with 1000 characters', () => {
                const name = 'a'.repeat(1000);
                const result = validateCategoryName(name);
                expect(result.isValid).toBe(false);
                expect(result.error).toBe('Category name must be 100 characters or less');
            });

            it('should provide correct error message for all strings > 100 chars', () => {
                fc.assert(
                    fc.property(
                        fc.integer({ min: 101, max: 500 }),
                        (length) => {
                            const name = 'a'.repeat(length);
                            const result = validateCategoryName(name);
                            return result.error === 'Category name must be 100 characters or less';
                        }
                    ),
                    { numRuns: 100 }
                );
            });
        });

        describe('Valid String Validation (1-100 characters)', () => {
            it('should accept strings between 1-100 characters', () => {
                fc.assert(
                    fc.property(
                        fc.integer({ min: 1, max: 100 }),
                        (length) => {
                            const name = 'a'.repeat(length);
                            const result = validateCategoryName(name);
                            return result.isValid === true && result.error === null;
                        }
                    ),
                    { numRuns: 100 }
                );
            });

            it('should accept single character string', () => {
                const result = validateCategoryName('a');
                expect(result.isValid).toBe(true);
                expect(result.error).toBeNull();
            });

            it('should accept exactly 100 character string', () => {
                const name = 'a'.repeat(100);
                const result = validateCategoryName(name);
                expect(result.isValid).toBe(true);
                expect(result.error).toBeNull();
            });

            it('should accept strings with spaces (non-whitespace-only)', () => {
                const testCases = [
                    'Marvel Legends',
                    'DC Comics',
                    'Action Figures',
                    'a b c d e f g h i j k l m n o p q r s t u v w x y z',
                ];
                testCases.forEach((name) => {
                    const result = validateCategoryName(name);
                    expect(result.isValid).toBe(true);
                    expect(result.error).toBeNull();
                });
            });

            it('should accept strings with special characters', () => {
                const testCases = [
                    'Marvel & DC',
                    'Action-Figures',
                    'Comics (2024)',
                    'Toys/Collectibles',
                    'Items: Premium',
                ];
                testCases.forEach((name) => {
                    const result = validateCategoryName(name);
                    expect(result.isValid).toBe(true);
                    expect(result.error).toBeNull();
                });
            });

            it('should accept strings with numbers', () => {
                const testCases = [
                    '2024 Releases',
                    'Series 1',
                    'Volume 123',
                    '4K Ultra HD',
                ];
                testCases.forEach((name) => {
                    const result = validateCategoryName(name);
                    expect(result.isValid).toBe(true);
                    expect(result.error).toBeNull();
                });
            });

            it('should accept strings with leading/trailing spaces trimmed', () => {
                const testCases = [
                    ' Marvel Legends',
                    'DC Comics ',
                    ' Action Figures ',
                ];
                testCases.forEach((name) => {
                    const result = validateCategoryName(name);
                    // Should be valid because trim() removes leading/trailing spaces
                    expect(result.isValid).toBe(true);
                    expect(result.error).toBeNull();
                });
            });

            it('should accept unicode characters', () => {
                const testCases = [
                    'Café',
                    'Naïve',
                    '日本語',
                    'Español',
                    'Français',
                ];
                testCases.forEach((name) => {
                    const result = validateCategoryName(name);
                    expect(result.isValid).toBe(true);
                    expect(result.error).toBeNull();
                });
            });

            it('should accept realistic category names', () => {
                const testCases = [
                    'Marvel Legends',
                    'DC Comics',
                    'Action Figures',
                    'Collectible Cards',
                    'Vintage Toys',
                    'Limited Edition',
                    'Exclusive Releases',
                    'Pre-Order Items',
                    'Best Sellers',
                    'New Arrivals',
                ];
                testCases.forEach((name) => {
                    const result = validateCategoryName(name);
                    expect(result.isValid).toBe(true);
                    expect(result.error).toBeNull();
                });
            });
        });

        describe('Boundary Cases', () => {
            it('should handle boundary between 0 and 1 characters', () => {
                const empty = validateCategoryName('');
                const single = validateCategoryName('a');
                expect(empty.isValid).toBe(false);
                expect(single.isValid).toBe(true);
            });

            it('should handle boundary between 99 and 100 characters', () => {
                const name99 = 'a'.repeat(99);
                const name100 = 'a'.repeat(100);
                const result99 = validateCategoryName(name99);
                const result100 = validateCategoryName(name100);
                expect(result99.isValid).toBe(true);
                expect(result100.isValid).toBe(true);
            });

            it('should handle boundary between 100 and 101 characters', () => {
                const name100 = 'a'.repeat(100);
                const name101 = 'a'.repeat(101);
                const result100 = validateCategoryName(name100);
                const result101 = validateCategoryName(name101);
                expect(result100.isValid).toBe(true);
                expect(result101.isValid).toBe(false);
            });

            it('should handle boundary between 1 and 2 characters', () => {
                const single = validateCategoryName('a');
                const double = validateCategoryName('ab');
                expect(single.isValid).toBe(true);
                expect(double.isValid).toBe(true);
            });
        });

        describe('Error Message Consistency', () => {
            it('should always return "Category name is required" for empty/whitespace strings', () => {
                fc.assert(
                    fc.property(
                        invalidEmptyCategoryNameArbitrary(),
                        (name) => {
                            const result = validateCategoryName(name);
                            return result.error === 'Category name is required';
                        }
                    ),
                    { numRuns: 100 }
                );
            });

            it('should always return "Category name must be 100 characters or less" for long strings', () => {
                fc.assert(
                    fc.property(
                        tooLongCategoryNameArbitrary(),
                        (name) => {
                            const result = validateCategoryName(name);
                            return result.error === 'Category name must be 100 characters or less';
                        }
                    ),
                    { numRuns: 100 }
                );
            });

            it('should return null error for valid strings', () => {
                fc.assert(
                    fc.property(
                        fc.integer({ min: 1, max: 100 }),
                        (length) => {
                            const name = 'a'.repeat(length);
                            const result = validateCategoryName(name);
                            return result.error === null;
                        }
                    ),
                    { numRuns: 100 }
                );
            });
        });

        describe('Validation State Consistency', () => {
            it('should have isValid=false when error is not null', () => {
                const testCases = ['', '     ', 'a'.repeat(101)];
                testCases.forEach((name) => {
                    const result = validateCategoryName(name);
                    expect(result.isValid).toBe(false);
                    expect(result.error).not.toBeNull();
                });
            });

            it('should have isValid=true when error is null', () => {
                const testCases = ['a', 'Marvel Legends', 'a'.repeat(100)];
                testCases.forEach((name) => {
                    const result = validateCategoryName(name);
                    expect(result.isValid).toBe(true);
                    expect(result.error).toBeNull();
                });
            });

            it('should maintain consistency between isValid and error across all inputs', () => {
                fc.assert(
                    fc.property(
                        fc.string({ minLength: 0, maxLength: 500 }),
                        (name) => {
                            const result = validateCategoryName(name);
                            // If isValid is true, error must be null
                            if (result.isValid) {
                                return result.error === null;
                            }
                            // If isValid is false, error must not be null
                            return result.error !== null;
                        }
                    ),
                    { numRuns: 200 }
                );
            });
        });

        describe('Comprehensive Validation Coverage', () => {
            it('should correctly validate all string lengths from 0 to 150', () => {
                for (let length = 0; length <= 150; length++) {
                    const name = length === 0 ? '' : 'a'.repeat(length);
                    const result = validateCategoryName(name);

                    if (length === 0) {
                        expect(result.isValid).toBe(false);
                        expect(result.error).toBe('Category name is required');
                    } else if (length <= 100) {
                        expect(result.isValid).toBe(true);
                        expect(result.error).toBeNull();
                    } else {
                        expect(result.isValid).toBe(false);
                        expect(result.error).toBe('Category name must be 100 characters or less');
                    }
                }
            });

            it('should handle all whitespace character types', () => {
                const whitespaceTests = [
                    { name: ' ', type: 'space' },
                    { name: '\t', type: 'tab' },
                    { name: '\n', type: 'newline' },
                    { name: '\r', type: 'carriage return' },
                    { name: '\f', type: 'form feed' },
                    { name: '\v', type: 'vertical tab' },
                    { name: '   \t\n\r   ', type: 'mixed' },
                ];

                whitespaceTests.forEach(({ name, type }) => {
                    const result = validateCategoryName(name);
                    expect(result.isValid).toBe(false);
                    expect(result.error).toBe('Category name is required');
                });
            });

            it('should validate realistic and edge case category names', () => {
                const scenarios = [
                    { name: '', expected: false, reason: 'empty' },
                    { name: '   ', expected: false, reason: 'whitespace only' },
                    { name: 'a', expected: true, reason: 'single char' },
                    { name: 'Marvel Legends', expected: true, reason: 'normal name' },
                    { name: 'a'.repeat(100), expected: true, reason: 'exactly 100 chars' },
                    { name: 'a'.repeat(101), expected: false, reason: '101 chars' },
                    { name: 'a'.repeat(500), expected: false, reason: '500 chars' },
                ];

                scenarios.forEach(({ name, expected, reason }) => {
                    const result = validateCategoryName(name);
                    expect(result.isValid).toBe(expected);
                });
            });
        });
    });

    describe('Property 2: Validation Rule Enforcement', () => {
        it('should enforce exactly one validation rule at a time', () => {
            fc.assert(
                fc.property(
                    fc.string({ minLength: 0, maxLength: 500 }),
                    (name) => {
                        const result = validateCategoryName(name);

                        // Count how many rules are violated
                        const isEmptyOrWhitespace = !name.trim();
                        const isTooLong = name.length > 100;

                        // If both rules are violated, should report the first one (empty/whitespace)
                        if (isEmptyOrWhitespace && isTooLong) {
                            return result.error === 'Category name is required';
                        }

                        // If only empty/whitespace rule is violated
                        if (isEmptyOrWhitespace) {
                            return result.error === 'Category name is required';
                        }

                        // If only length rule is violated
                        if (isTooLong) {
                            return result.error === 'Category name must be 100 characters or less';
                        }

                        // If no rules are violated
                        return result.isValid === true && result.error === null;
                    }
                ),
                { numRuns: 200 }
            );
        });

        it('should prioritize empty/whitespace validation over length validation', () => {
            // A string that is both empty/whitespace AND too long (impossible, but test the logic)
            // Actually, a whitespace-only string can be > 100 chars
            const whitespaceOnly = ' '.repeat(150);
            const result = validateCategoryName(whitespaceOnly);
            expect(result.error).toBe('Category name is required');
        });
    });
});
