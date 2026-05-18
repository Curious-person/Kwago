'use client';

import { useRouter } from 'next/navigation';
import { useJournalStore } from '@/lib/store';

/**
 * Hook for handling collection-related actions (e.g., Add to Collection).
 * Ensures the user is authenticated before performing actions.
 */
export function useCollectionActions() {
  const router = useRouter();
  const { profile } = useJournalStore();

  const addToCollection = (productId: string) => {
    // 1. Check authentication
    if (!profile) {
      // Not logged in -> Redirect to login page
      // We could also pass a redirect query param here: router.push(`/login?redirect=/shop`)
      router.push('/login');
      return;
    }

    // 2. Logged in -> Placeholder for "Coming Soon"
    // In a real implementation, this would call an API service to save the product
    alert('Feature Coming Soon! We are working on letting you build your personal collection.');
    console.log(`[Collection] Adding product ${productId} to user ${profile.id}'s collection`);
  };

  return {
    addToCollection,
    isAuthenticated: !!profile,
  };
}
