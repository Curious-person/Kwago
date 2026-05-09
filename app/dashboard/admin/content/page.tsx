import { requireRole } from '@/lib/auth';
import { ContentReviewManager } from './ContentReviewManager';

export default async function AdminContentPage() {
  await requireRole(['admin']);

  return (
    <div className="space-y-10">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Content Review</h1>
        <p className="text-zinc-500 max-w-2xl">
          Audit and approve community-submitted posts. Ensure all content meets quality standards before publishing to the public feed.
        </p>
      </div>

      <ContentReviewManager />
    </div>
  );
}
