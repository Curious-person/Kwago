import React from 'react';
import Link from 'next/link';
import { getUserProfile } from '@/lib/auth';
import { 
  FileText, 
  Package, 
  MessageSquare, 
  Layout, 
  Users, 
  ArrowLeft,
  LayoutDashboard
} from 'lucide-react';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getUserProfile();

  if (!profile) return null;

  const isAdmin = profile.role === 'admin';
  const isAuthor = profile.role === 'author' || isAdmin;

  const navLinks = [
    {
      title: 'Author',
      show: isAuthor,
      links: [
        { href: '/dashboard/author/posts', label: 'My Posts', icon: FileText },
        { href: '/dashboard/author/products', label: 'My Products', icon: Package },
      ]
    },
    {
      title: 'Admin',
      show: isAdmin,
      links: [
        { href: '/dashboard/admin/comments', label: 'Comments', icon: MessageSquare },
        { href: '/dashboard/admin/content', label: 'Content', icon: Layout },
        { href: '/dashboard/admin/users', label: 'Users', icon: Users },
      ]
    }
  ];

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <aside className="w-64 border-r border-zinc-200 bg-white flex flex-col sticky top-0 h-screen">
        <div className="p-6">
          <Link href="/dashboard" className="flex items-center gap-2 mb-8">
            <span className="text-xl font-bold tracking-tight text-zinc-900">Kwago</span>
            <span className="text-[10px] bg-zinc-100 text-zinc-500 px-2 py-0.5 rounded-full uppercase font-bold tracking-wider">
              {profile.role}
            </span>
          </Link>

          <nav className="space-y-8">
            <div>
              <Link 
                href="/" 
                className="flex items-center gap-3 px-4 py-2 rounded-full text-sm font-medium text-zinc-600 hover:bg-zinc-50 hover:text-[#0066FF] transition-colors"
              >
                <ArrowLeft size={18} />
                <span>Back to site</span>
              </Link>
              <Link 
                href="/dashboard" 
                className="flex items-center gap-3 px-4 py-2 mt-1 rounded-full text-sm font-medium text-zinc-600 hover:bg-zinc-50 hover:text-[#0066FF] transition-colors"
              >
                <LayoutDashboard size={18} />
                <span>Dashboard Home</span>
              </Link>
            </div>

            {navLinks.map((section, idx) => section.show && (
              <div key={idx} className="space-y-2">
                <h3 className="px-4 text-[11px] font-bold uppercase tracking-widest text-zinc-400">
                  {section.title}
                </h3>
                <div className="space-y-1">
                  {section.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="flex items-center gap-3 px-4 py-2 rounded-full text-sm font-medium text-zinc-600 hover:bg-zinc-50 hover:text-[#0066FF] transition-colors"
                    >
                      <link.icon size={18} />
                      <span>{link.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* User Info Footer */}
        <div className="mt-auto p-6 border-t border-zinc-100">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-xs font-bold text-zinc-500">
              {profile.display_name?.[0]?.toUpperCase() ?? profile.email[0].toUpperCase()}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold text-zinc-900 truncate">
                {profile.display_name || 'Collector'}
              </span>
              <span className="text-[11px] text-zinc-500 truncate">{profile.email}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-zinc-50/30">
        <div className="p-12 max-w-5xl">
          {children}
        </div>
      </main>
    </div>
  );
}
