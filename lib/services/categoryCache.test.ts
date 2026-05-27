/**
 * Tests for Category Cache Service
 *
 * Tests local caching functionality for categories data.
 *
 * Requirements: 14.4, 14.5
 */

import {
    getCachedCategories,
    saveCategoriesToCache,
    updateCategoryInCache,
    addCategoryToCache,
    removeCategoryFromCache,
    clearCategoryCache,
    isCacheStale,
    getCacheAge,
} from './categoryCache';

// Mock localStorage
const mockLocalStorage = (() => {
    let store: Record<string, string> = {};
    return {
        getItem: jest.fn((key: string) => store[key] || null),
        setItem: jest.fn((key: string, value: string) => {
            store[key] = value;
        }),
        removeItem: jest.fn((key: string) => {
            delete store[key];
        }),
        clear: jest.fn(() => {
            store = {};
        }),
    };
})();

// Mock Date.now for consistent timestamps
const mockDateNow = jest.fn();

// Mock categories for testing
const mockCategories = [
    {
        id: '1',
        name: 'Test Category 1',
        description: 'Test description 1',
        author_id: 'user-123',
        product_count: 5,
        product_images: ['image1.jpg', 'image2.jpg'],
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-01-15T10:00:00Z',
    },
    {
        id: '2',
        name: 'Test Category 2',
        description: 'Test description 2',
        author_id: 'user-123',
        product_count: 3,
        product_images: ['image3.jpg'],
        created_at: '2024-01-16T10:00:00Z',
        updated_at: '2024-01-16T10:00:00Z',
    },
];

describe('Category Cache Service', () => {
    beforeEach(() => {
        // Clear mocks and localStorage before each test
        jest.clearAllMocks();
        mockLocalStorage.clear();

        // Mock global objects
        Object.defineProperty(global, 'localStorage', {
            value: mockLocalStorage,
            writable: true,
        });

        Object.defineProperty(global, 'Date', {
            value: {
                now: mockDateNow,
            },
            writable: true,
        });

        // Set initial timestamp
        mockDateNow.mockReturnValue(1000000);
    });

    describe('getCachedCategories', () => {
        it('should return null when cache is empty', () => {
            const result = getCachedCategories();
            expect(result).toBeNull();
        });

        it('should return cached categories when cache exists and is not expired', () => {
            const cacheData = {
                categories: mockCategories,
                timestamp: 1000000,
                version: '1.0.0',
            };

            mockLocalStorage.getItem.mockReturnValue(JSON.stringify(cacheData));
            mockDateNow.mockReturnValue(1000000 + 1000); // 1 second later

            const result = getCachedCategories();
            expect(result).toEqual(mockCategories);
        });

        it('should return null when cache is expired', () => {
            const cacheData = {
                categories: mockCategories,
                timestamp: 1000000,
                version: '1.0.0',
            };

            mockLocalStorage.getItem.mockReturnValue(JSON.stringify(cacheData));
            mockDateNow.mockReturnValue(1000000 + 5 * 60 * 1000 + 1000); // 5 minutes + 1 second

            const result = getCachedCategories();
            expect(result).toBeNull();
        });

        it('should return null when cache version mismatch', () => {
            const cacheData = {
                categories: mockCategories,
                timestamp: 1000000,
                version: '0.9.0', // Different version
            };

            mockLocalStorage.getItem.mockReturnValue(JSON.stringify(cacheData));

            const result = getCachedCategories();
            expect(result).toBeNull();
        });

        it('should handle JSON parse error gracefully', () => {
            mockLocalStorage.getItem.mockReturnValue('invalid json');

            const result = getCachedCategories();
            expect(result).toBeNull();
        });
    });

    describe('saveCategoriesToCache', () => {
        it('should save categories to cache with correct structure', () => {
            saveCategoriesToCache(mockCategories);

            expect(mockLocalStorage.setItem).toHaveBeenCalledTimes(1);

            const savedData = JSON.parse(mockLocalStorage.setItem.mock.calls[0][1]);
            expect(savedData.categories).toEqual(mockCategories);
            expect(savedData.timestamp).toBe(1000000);
            expect(savedData.version).toBe('1.0.0');
        });

        it('should handle localStorage error gracefully', () => {
            mockLocalStorage.setItem.mockImplementation(() => {
                throw new Error('Storage error');
            });

            // Should not throw error
            expect(() => saveCategoriesToCache(mockCategories)).not.toThrow();
        });
    });

    describe('updateCategoryInCache', () => {
        it('should update existing category in cache', () => {
            const initialCache = {
                categories: mockCategories,
                timestamp: 1000000,
                version: '1.0.0',
            };

            mockLocalStorage.getItem.mockReturnValue(JSON.stringify(initialCache));

            const updatedCategory = {
                ...mockCategories[0],
                name: 'Updated Category Name',
            };

            updateCategoryInCache(updatedCategory);

            expect(mockLocalStorage.setItem).toHaveBeenCalledTimes(1);
            const savedData = JSON.parse(mockLocalStorage.setItem.mock.calls[0][1]);
            expect(savedData.categories[0].name).toBe('Updated Category Name');
            expect(savedData.categories[1]).toEqual(mockCategories[1]); // Unchanged
        });

        it('should do nothing when cache is empty', () => {
            mockLocalStorage.getItem.mockReturnValue(null);

            const updatedCategory = {
                ...mockCategories[0],
                name: 'Updated Category Name',
            };

            updateCategoryInCache(updatedCategory);

            expect(mockLocalStorage.setItem).not.toHaveBeenCalled();
        });
    });

    describe('addCategoryToCache', () => {
        it('should add new category to existing cache', () => {
            const initialCache = {
                categories: [mockCategories[0]],
                timestamp: 1000000,
                version: '1.0.0',
            };

            mockLocalStorage.getItem.mockReturnValue(JSON.stringify(initialCache));

            addCategoryToCache(mockCategories[1]);

            expect(mockLocalStorage.setItem).toHaveBeenCalledTimes(1);
            const savedData = JSON.parse(mockLocalStorage.setItem.mock.calls[0][1]);
            expect(savedData.categories).toHaveLength(2);
            expect(savedData.categories[1]).toEqual(mockCategories[1]);
        });

        it('should create new cache when none exists', () => {
            mockLocalStorage.getItem.mockReturnValue(null);

            addCategoryToCache(mockCategories[0]);

            expect(mockLocalStorage.setItem).toHaveBeenCalledTimes(1);
            const savedData = JSON.parse(mockLocalStorage.setItem.mock.calls[0][1]);
            expect(savedData.categories).toEqual([mockCategories[0]]);
        });
    });

    describe('removeCategoryFromCache', () => {
        it('should remove category from cache', () => {
            const initialCache = {
                categories: mockCategories,
                timestamp: 1000000,
                version: '1.0.0',
            };

            mockLocalStorage.getItem.mockReturnValue(JSON.stringify(initialCache));

            removeCategoryFromCache('1');

            expect(mockLocalStorage.setItem).toHaveBeenCalledTimes(1);
            const savedData = JSON.parse(mockLocalStorage.setItem.mock.calls[0][1]);
            expect(savedData.categories).toHaveLength(1);
            expect(savedData.categories[0].id).toBe('2');
        });

        it('should do nothing when cache is empty', () => {
            mockLocalStorage.getItem.mockReturnValue(null);

            removeCategoryFromCache('1');

            expect(mockLocalStorage.setItem).not.toHaveBeenCalled();
        });
    });

    describe('clearCategoryCache', () => {
        it('should clear the cache', () => {
            clearCategoryCache();

            expect(mockLocalStorage.removeItem).toHaveBeenCalledTimes(1);
            expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('category_management_cache');
        });
    });

    describe('isCacheStale', () => {
        it('should return true when cache is empty', () => {
            mockLocalStorage.getItem.mockReturnValue(null);

            const result = isCacheStale();
            expect(result).toBe(true);
        });

        it('should return false when cache is fresh', () => {
            const cacheData = {
                categories: mockCategories,
                timestamp: 1000000,
                version: '1.0.0',
            };

            mockLocalStorage.getItem.mockReturnValue(JSON.stringify(cacheData));
            mockDateNow.mockReturnValue(1000000 + 1000); // 1 second later

            const result = isCacheStale();
            expect(result).toBe(false);
        });

        it('should return true when cache is expired', () => {
            const cacheData = {
                categories: mockCategories,
                timestamp: 1000000,
                version: '1.0.0',
            };

            mockLocalStorage.getItem.mockReturnValue(JSON.stringify(cacheData));
            mockDateNow.mockReturnValue(1000000 + 5 * 60 * 1000 + 1000); // 5 minutes + 1 second

            const result = isCacheStale();
            expect(result).toBe(true);
        });
    });

    describe('getCacheAge', () => {
        it('should return null when cache is empty', () => {
            mockLocalStorage.getItem.mockReturnValue(null);

            const result = getCacheAge();
            expect(result).toBeNull();
        });

        it('should return cache age in seconds', () => {
            const cacheData = {
                categories: mockCategories,
                timestamp: 1000000,
                version: '1.0.0',
            };

            mockLocalStorage.getItem.mockReturnValue(JSON.stringify(cacheData));
            mockDateNow.mockReturnValue(1000000 + 2500); // 2.5 seconds later

            const result = getCacheAge();
            expect(result).toBe(2); // 2 seconds (floor of 2.5)
        });
    });
});
