'use client';

import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useJournalStore } from '@/lib/store';
import { Profile } from '@/types';

export default function SessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const setProfile = useJournalStore((s) => s.setProfile);
  const clearAuth = useJournalStore((s) => s.clearAuth);

  useEffect(() => {
    const supabase = createClient();

    async function fetchAndSetProfile(userId: string) {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error || !data) {
        clearAuth();
        return;
      }

      setProfile(data as Profile);
    }

    // Hydrate on mount from existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchAndSetProfile(session.user.id);
      } else {
        clearAuth();
      }
    });

    // Keep store in sync with auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchAndSetProfile(session.user.id);
      } else {
        clearAuth();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setProfile, clearAuth]);

  return <>{children}</>;
}
