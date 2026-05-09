import { redirect } from 'next/navigation';
import { getUserProfile } from '@/lib/auth';
import { DashboardNavbar } from '@/components/dashboard/DashboardNavbar';
import { Sidebar } from '@/components/dashboard/Sidebar';

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
  const isAuthor = profile.role === 'author';

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <DashboardNavbar profile={profile} />
      <div className="flex flex-1 items-start">
        {/* ── Sidebar ── */}
        <Sidebar isAdmin={isAdmin} isAuthor={isAuthor} role={profile.role} />

        {/* ── Main content ── */}
        <main className="flex-1 p-8 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
