import React from "react";
import PostForm from "@/components/blog/PostForm";
import { requireRole } from "@/lib/auth";
import { fetchPostById } from "@/lib/services/postService.server";

interface EditPostPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  // Ensure access
  await requireRole(["author", "admin"]);

  const { id } = await params;

  // Fetch detailed post from database on the server
  const response = await fetchPostById(id);

  if (!response.success || !response.data) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-8 text-center bg-zinc-50/50 rounded-3xl border border-zinc-100 mt-12">
        <p className="text-zinc-400 text-sm font-medium">
          Post not found or access denied.
        </p>
      </div>
    );
  }

  return <PostForm mode="edit" postId={id} initialData={response.data} />;
}
