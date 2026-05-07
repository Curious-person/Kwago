'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, User, LogOut } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { cn } from '@/lib/utils';
import { useJournalStore } from '@/lib/store';
import { createClient } from '@/lib/supabase/client';

const NavbarItems = [
  {
    title: "Home",
    link: "/"
  },
  {
    title: "Shop",
    link: "/shop"
  },
  {
    title: "Categories",
    link: "/categories"
  },
  {
    title: "About",
    link: "/about"
  }
]

export const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { profile, role, clearAuth } = useJournalStore();

  const isManagement = role === 'admin' || role === 'author';

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    clearAuth();
    router.push('/');
    router.refresh();
  };

  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-white border-b border-zinc-100">
      <div className="flex items-center gap-12">
        <Link href="/" className="text-xl font-bold tracking-tight text-zinc-900">
          Journal
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-500">
          {NavbarItems.map((item, index) => {
            const isActive = pathname === item.link;
            return (
              <Link
                key={index}
                href={item.link}
                className={cn(
                  "hover:text-zinc-900 transition-colors",
                  isActive ? "text-[#0066FF] border-b-2 border-[#0066FF] pb-0.5" : ""
                )}
              >
                {item.title}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-4 max-w-md w-full justify-end">
        <div className="hidden lg:block w-64">
          <Input
            placeholder={pathname === '/categories' ? 'Search categories...' : 'Search...'}
            icon={<Search size={16} />}
          />
        </div>
        {profile ? (
          <Button 
            variant="secondary"
            onClick={() => {
              if (isManagement) {
                router.push(role === 'admin' ? '/dashboard/admin' : '/dashboard/author/posts');
              } else {
                handleLogout();
              }
            }}
            className="gap-2"
          >
            {isManagement ? <User size={16} /> : <LogOut size={16} />}
            <span>{isManagement ? 'Account' : 'Log Out'}</span>
          </Button>
        ) : (
          <Button onClick={() => router.push(`/login?next=${pathname}`)}>
            Sign In
          </Button>
        )}
      </div>
    </nav>
  );
};
