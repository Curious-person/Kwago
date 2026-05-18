import React from 'react';
import Link from 'next/link';
import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { requireRole } from '@/lib/auth';
import { fetchAuthorPosts } from '@/lib/services/postService.server';
import AuthorPostsTable from '@/components/blog/AuthorPostsTable';

export default async function AuthorPostsPage() {
  // 1. Authenticate user on server side before rendering anything
  await requireRole(['author', 'admin']);

  // 2. Fetch author posts directly from database
  const response = await fetchAuthorPosts();
  const posts = response.success && response.data ? response.data : [];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">My Posts</h1>
          <p className="text-sm text-zinc-500">Manage your published and draft guides.</p>
        </div>

        <Link href="/dashboard/author/posts/new">
          <Button className="gap-2">
            <Plus size={16} />
            <span>Create Post</span>
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <div className="w-full max-w-sm">
          <Input
            placeholder="Search posts..."
            icon={<Search size={16} />}
          />
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-20 bg-zinc-50/50 rounded-3xl border border-zinc-100">
          <p className="text-zinc-400 text-sm font-medium mb-4">No posts yet.</p>
          <Link href="/dashboard/author/posts/new">
            <Button variant="secondary" className="rounded-full text-xs uppercase tracking-widest font-bold">
              Create your first post
            </Button>
          </Link>
        </div>
      ) : (
        <AuthorPostsTable initialPosts={posts} />
      )}
    </div>
  );
}
