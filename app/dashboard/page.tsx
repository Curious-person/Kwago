import { redirect } from 'next/navigation';
import { getUserRole } from '@/lib/auth';

export default async function DashboardPage() {
  const role = await getUserRole();

  if (role === 'admin') {
    redirect('/dashboard/admin');
  }

  if (role === 'author') {
    redirect('/dashboard/author/posts');
  }

  // Visitors or unauthenticated users shouldn't have reached here due to middleware,
  // but we redirect them just in case.
  redirect('/unauthorized');
}
