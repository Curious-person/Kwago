import { requireRole } from '@/lib/auth';

export default async function AuthorPostsPage() {
  await requireRole(['author', 'admin']);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">My Posts</h1>
        <p className="text-zinc-500 font-medium">Create and manage your collection guides.</p>
      </div>
      
      <div className="p-8 border border-zinc-200 rounded-3xl bg-white">
        <p className="text-sm text-zinc-400 font-medium italic">Coming soon</p>
      </div>
    </div>
  );
}
