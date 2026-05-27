'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useJournalStore } from '@/lib/store';
import { cn } from '@/lib/utils';

import { Button } from '../ui/Button';

interface LogoutButtonProps {
  className?: string;
}

export default function LogoutButton({ className }: LogoutButtonProps) {
  const router = useRouter();
  const clearAuth = useJournalStore((s) => s.clearAuth);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    clearAuth();
    // Use hard redirect for auth transitions to ensure clean state
    window.location.href = '/';
  };

  return (
    <Button
      variant="outline"
      onClick={handleLogout}
      className={cn(
        "flex items-center justify-start gap-3 w-full border-zinc-100 hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all group",
        className
      )}
    >
      <LogOut size={18} className="group-hover:rotate-12 transition-transform" />
      <span>Sign out</span>
    </Button>
  );
}
