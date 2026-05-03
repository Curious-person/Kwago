import { requireRole } from '@/lib/auth';

export default async function AuthorProductsPage() {
  await requireRole(['author', 'admin']);

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">My Products</h1>
        <p className="text-sm text-zinc-500">Manage your collectible listings.</p>
      </div>

      <div className="rounded-3xl border border-zinc-200 px-8 py-16 text-center">
        <p className="text-sm font-medium text-zinc-400">Coming soon</p>
      </div>
    </div>
  );
}
