import React from "react";
import PostForm from "@/components/blog/PostForm";
import { requireRole } from "@/lib/auth";

export default async function NewPostPage() {
  // Ensure access early before rendering UI
  await requireRole(["author", "admin"]);

  return <PostForm mode="create" />;
}
