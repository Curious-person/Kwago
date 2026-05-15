/**
 * Category Cache Service
 *
 * Implements local caching for categories data to reduce unnecessary API calls.
 * Uses localStorage for persistence across page navigation.
 *
 * Requirements: 14.4, 14.5
 */

import { Category } from '@/lib/types/category';

const CACHE_KEY = 'category_management_cache';
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds

interface CategoryCache {
    categories: Category[];
    timestamp: number;
    version: string;
}

const CACHE_VERSION = '1.0.0';

/**
 * Get cached categories data
 * Returns cached data if it exists and is not expired
 * Returns null if cache is expired or doesn't exist
 */
export function getCachedCategories(): Category[] | null {
    try {
        const cachedData = localStorage.getItem(CACHE_KEY);
        if (!cachedData) {
            return null;
        }

        const cache: CategoryCache = JSON.parse(cachedData);

        // Check cache version
        if (cache.version !== CACHE_VERSION) {
            console.log('Cache version mismatch, clearing cache');
            clearCategoryCache();
            return null;
        }

        // Check if cache is expired
        const now = Date.now();
        const cacheAge = now - cache.timestamp;

        if (cacheAge > CACHE_TTL) {
            console.log('Cache expired, age:', cacheAge, 'ms');
            return null;
        }

        console.log('Using cached categories, age:', cacheAge, 'ms');
        return cache.categories;
    } catch (error) {
        console.error('Error reading from cache:', error);
        // If there's an error reading cache, clear it
        clearCategoryCache();
        return null;
    }
}

/**
 * Save categories to cache
 */
export function saveCategoriesToCache(categories: Category[]): void {
    try {
        const cache: CategoryCache = {
            categories,
            timestamp: Date.now(),
            version: CACHE_VERSION,
        };

        localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
        console.log('Categories saved to cache');
    } catch (error) {
        console.error('Error saving to cache:', error);
        // Don't throw error - caching is a performance optimization, not critical functionality
    }
}

/**
 * Update a single category in cache
 */
export function updateCategoryInCache(updatedCategory: Category): void {
    try {
        const cachedData = localStorage.getItem(CACHE_KEY);
        if (!cachedData) {
            return;
        }

        const cache: CategoryCache = JSON.parse(cachedData);

        // Update the category in the cached array
        const updatedCategories = cache.categories.map(category =>
            category.id === updatedCategory.id ? updatedCategory : category
        );

        saveCategoriesToCache(updatedCategories);
    } catch (error) {
        console.error('Error updating category in cache:', error);
    }
}

/**
 * Add a new category to cache
 */
export function addCategoryToCache(newCategory: Category): void {
    try {
        const cachedData = localStorage.getItem(CACHE_KEY);
        if (!cachedData) {
            saveCategoriesToCache([newCategory]);
            return;
        }

        const cache: CategoryCache = JSON.parse(cachedData);
        const updatedCategories = [...cache.categories, newCategory];

        saveCategoriesToCache(updatedCategories);
    } catch (error) {
        console.error('Error adding category to cache:', error);
    }
}

/**
 * Remove a category from cache
 */
export function removeCategoryFromCache(categoryId: string): void {
    try {
        const cachedData = localStorage.getItem(CACHE_KEY);
        if (!cachedData) {
            return;
        }

        const cache: CategoryCache = JSON.parse(cachedData);
        const updatedCategories = cache.categories.filter(category => category.id !== categoryId);

        saveCategoriesToCache(updatedCategories);
    } catch (error) {
        console.error('Error removing category from cache:', error);
    }
}

/**
 * Clear the category cache
 */
export function clearCategoryCache(): void {
    try {
        localStorage.removeItem(CACHE_KEY);
        console.log('Category cache cleared');
    } catch (error) {
        console.error('Error clearing cache:', error);
    }
}

/**
 * Check if cache is stale (needs refresh)
 * Returns true if cache exists but is older than TTL
 */
export function isCacheStale(): boolean {
    try {
        const cachedData = localStorage.getItem(CACHE_KEY);
        if (!cachedData) {
            return true; // No cache means we need to fetch
        }

        const cache: CategoryCache = JSON.parse(cachedData);
        const now = Date.now();
        const cacheAge = now - cache.timestamp;

        return cacheAge > CACHE_TTL;
    } catch (error) {
        console.error('Error checking cache staleness:', error);
        return true; // On error, assume cache is stale
    }
}

/**
 * Get cache age in seconds
 */
export function getCacheAge(): number | null {
    try {
        const cachedData = localStorage.getItem(CACHE_KEY);
        if (!cachedData) {
            return null;
        }

        const cache: CategoryCache = JSON.parse(cachedData);
        const now = Date.now();
        return Math.floor((now - cache.timestamp) / 1000); // Convert to seconds
    } catch (error) {
        console.error('Error getting cache age:', error);
        return null;
    }
}
