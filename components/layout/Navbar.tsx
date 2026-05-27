'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, User, LogOut, Settings, LayoutGrid } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { cn } from '@/lib/utils';
import { useJournalStore } from '@/lib/store';
import { createClient } from '@/lib/supabase/client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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

  const initials = profile?.display_name
    ? profile.display_name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    : 'U';

  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-white border-b border-zinc-100 sticky top-0 z-50">
      <div className="flex items-center gap-12">
        <Link href="/" className="text-xl font-bold tracking-tight text-zinc-900 hover:text-[#0066FF] transition-colors">
          Kwago
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
          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger className="outline-none rounded-full ring-0 focus:ring-2 focus:ring-[#0066FF] focus:ring-offset-2 transition-all">
                {profile.avatar_url ? (
                  <img 
                    src={profile.avatar_url} 
                    alt="Avatar" 
                    className="w-10 h-10 rounded-full border border-zinc-200 object-cover hover:border-zinc-300 transition-colors"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-sm font-bold text-zinc-600 border border-zinc-200 hover:border-zinc-300 transition-colors">
                    {initials}
                  </div>
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 p-2 rounded-3xl shadow-none border border-zinc-200 mt-2 bg-white">
                <div className="px-3 py-3 flex flex-col gap-0.5">
                  <span className="font-bold text-sm text-zinc-900">{profile.display_name || 'User'}</span>
                  <span className="text-xs text-zinc-500 truncate">{profile.email}</span>
                </div>
                <DropdownMenuSeparator className="bg-zinc-100 my-1 mx-2" />
                
                {isManagement && (
                  <DropdownMenuItem 
                    onClick={() => router.push(role === 'admin' ? '/dashboard/admin' : '/dashboard/author/posts')}
                    className="rounded-full cursor-pointer hover:bg-zinc-50 py-2.5 px-3 mx-1 mt-1 transition-colors"
                  >
                    <LayoutGrid className="w-4 h-4 mr-2.5 text-zinc-500" />
                    <span className="text-sm font-medium text-zinc-700">Dashboard</span>
                  </DropdownMenuItem>
                )}
                
                <DropdownMenuItem className="rounded-full cursor-pointer hover:bg-zinc-50 py-2.5 px-3 mx-1 transition-colors">
                  <Settings className="w-4 h-4 mr-2.5 text-zinc-500" />
                  <span className="text-sm font-medium text-zinc-700">Display Settings</span>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator className="bg-zinc-100 my-1 mx-2" />
                
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="rounded-full cursor-pointer hover:bg-red-50 py-2.5 px-3 mx-1 mb-1 transition-colors focus:bg-red-50"
                >
                  <LogOut className="w-4 h-4 mr-2.5 text-red-500" />
                  <span className="text-sm font-medium text-red-600">Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <Button onClick={() => router.push(`/login?next=${pathname}`)}>
            Sign In
          </Button>
        )}
      </div>
    </nav>
  );
};
