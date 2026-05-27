import { requireRole } from '@/lib/auth';
import { UsersManager } from './UsersManager';

export default async function AdminUsersPage() {
  await requireRole(['admin']);

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">User Management</h1>
        <p className="text-sm text-zinc-500">View and manage all registered user accounts.</p>
      </div>

      <UsersManager />
    </div>
  );
}

