import { requireRole } from "@/lib/auth";
import { CommentsManager } from "./CommentsManager";

export default async function AdminCommentsPage() {
  await requireRole(["admin"]);

  return (
    <div className="space-y-10">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
          Comment Moderation
        </h1>
        <p className="text-zinc-500 max-w-2xl">
          Review and manage discussion across your blog posts. Flagged comments
          are highlighted for priority review.
        </p>
      </div>

      <CommentsManager />
    </div>
  );
}
