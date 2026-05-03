import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getUserProfile } from '@/lib/auth';
import { LayoutGrid, FileText, Package, Users, MessageSquare, Layers } from 'lucide-react';
import LogoutButton from '@/components/auth/LogoutButton';


export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getUserProfile();

  // Member or unauthenticated users don't get a dashboard
  if (!profile || profile.role === 'member') {
    redirect('/');
  }

  const isAdmin = profile.role === 'admin';

  return (
    <div className="flex min-h-screen bg-white">
      {/* ── Sidebar ── */}
      <aside className="w-56 shrink-0 border-r border-zinc-200 flex flex-col pt-8 pb-6 px-4">
        {/* Wordmark */}
        <Link
          href="/"
          className="mb-8 px-2 text-xl font-bold tracking-tight text-zinc-900"
        >
          Kwago
        </Link>

        {/* Role badge */}
        <span className="mb-6 px-2">
          <span className="inline-block rounded-full border border-zinc-200 px-3 py-0.5 text-xs font-medium text-zinc-500 capitalize">
            {profile.role}
          </span>
        </span>

        <nav className="flex flex-col gap-1 flex-1">
          {/* Author + Admin links */}
          <p className="px-2 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-widest text-zinc-400">
            Content
          </p>

          <SidebarLink href="/dashboard/author/posts" icon={<FileText size={15} />}>
            My Posts
          </SidebarLink>
          <SidebarLink href="/dashboard/author/products" icon={<Package size={15} />}>
            My Products
          </SidebarLink>

          {/* Admin-only links */}
          {isAdmin && (
            <>
              <p className="px-2 pb-1 pt-4 text-[11px] font-semibold uppercase tracking-widest text-zinc-400">
                Admin
              </p>
              <SidebarLink href="/dashboard/admin" icon={<LayoutGrid size={15} />}>
                Overview
              </SidebarLink>
              <SidebarLink href="/dashboard/admin/comments" icon={<MessageSquare size={15} />}>
                Comments
              </SidebarLink>
              <SidebarLink href="/dashboard/admin/content" icon={<Layers size={15} />}>
                Content
              </SidebarLink>
              <SidebarLink href="/dashboard/admin/users" icon={<Users size={15} />}>
                Users
              </SidebarLink>
            </>
          )}
        </nav>

        {/* Logout */}
        <div className="mt-auto pt-4 border-t border-zinc-100">
          <LogoutButton className="mt-0" />
        </div>
      </aside>


      {/* ── Main content ── */}
      <main className="flex-1 p-8 min-w-0">
        {children}
      </main>
    </div>
  );
}

// ── Reusable sidebar nav link ──────────────────────────────────────────────
function SidebarLink({
  href,
  icon,
  children,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2.5 rounded-full px-3 py-2 text-sm text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
    >
      <span className="text-zinc-400">{icon}</span>
      {children}
    </Link>
  );
}
