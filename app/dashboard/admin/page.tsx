import { requireRole } from '@/lib/auth';

export default async function AdminOverviewPage() {
  await requireRole(['admin']);

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Admin Overview</h1>
        <p className="text-sm text-zinc-500">Platform-wide statistics and quick actions.</p>
      </div>

      <div className="rounded-3xl border border-zinc-200 px-8 py-16 text-center">
        <p className="text-sm font-medium text-zinc-400">Coming soon</p>
      </div>
    </div>
  );
}
