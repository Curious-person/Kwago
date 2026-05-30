"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Search,
  CheckCircle2,
  XCircle,
  Loader2,
  Eye,
  AlertCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { DataTable, ColumnDef } from "@/components/ui/data-table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { createClient } from "@/lib/supabase/client";
import {
  adminReviewPost,
  postRowToPost,
  type BlogPostRow,
} from "@/lib/services/postService";
import type { Post, PostStatus } from "@/types/post";

// ─── Status badge config ──────────────────────────────────────────────────────

const STATUS_BADGE: Record<PostStatus, { label: string; className: string }> = {
  admin_pending: {
    label: "Pending Review",
    className: "text-amber-700 border-amber-200 bg-amber-50",
  },
  ai_approved: {
    label: "AI Approved",
    className: "text-violet-700 border-violet-200 bg-violet-50",
  },
  Published: {
    label: "Published",
    className: "text-green-700 border-green-200 bg-green-50",
  },
  Rejected: {
    label: "Rejected",
    className: "text-red-700 border-red-200 bg-red-50",
  },
  Draft: {
    label: "Draft",
    className: "text-zinc-600 border-zinc-200 bg-zinc-50",
  },
};

// ─── Component ────────────────────────────────────────────────────────────────

export function PostReviewManager() {
  const router = useRouter();

  // ── List state ──
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // ── Action loading ──
  const [isActionLoading, setIsActionLoading] = useState(false);

  // ── Preview modal ──
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // ── Reject modal ──
  const [rejectTarget, setRejectTarget] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectRemarks, setRejectRemarks] = useState("");

  // ── Approve modal ──
  const [approveTarget, setApproveTarget] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);

  // ─── Data fetch ────────────────────────────────────────────────────────────

  const fetchPosts = async () => {
    setIsLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*, profiles:author_id(display_name, avatar_url)")
      .in("status", ["ai_approved", "admin_pending"])
      .order("created_at", { ascending: false });

    if (!error && data) {
      setPosts((data as BlogPostRow[]).map(postRowToPost));
    } else if (error) {
      console.error("Failed to fetch posts:", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // ─── Handlers ──────────────────────────────────────────────────────────────

  const handlePreviewPost = (post: Post) => {
    setSelectedPost(post);
    setIsPreviewOpen(true);
  };

  const handleOpenReject = (post: Post) => {
    setRejectTarget({ id: post.id, title: post.title });
    setRejectRemarks("");
    setIsRejectModalOpen(true);
  };

  const handleOpenApprove = (post: Post) => {
    setApproveTarget({ id: post.id, title: post.title });
    setIsApproveModalOpen(true);
  };

  const handleConfirmReject = async () => {
    if (!rejectTarget) return;
    setIsActionLoading(true);
    const result = await adminReviewPost(
      rejectTarget.id,
      "reject",
      rejectRemarks,
    );
    if (result.success) {
      await fetchPosts();
      setIsRejectModalOpen(false);
      router.refresh();
    } else {
      console.error("Failed to reject post:", result.error);
    }
    setIsActionLoading(false);
  };

  const handleConfirmApprove = async () => {
    if (!approveTarget) return;
    setIsActionLoading(true);
    const result = await adminReviewPost(approveTarget.id, "approve");
    if (result.success) {
      await fetchPosts();
      setIsApproveModalOpen(false);
      router.refresh();
    } else {
      console.error("Failed to approve post:", result.error);
    }
    setIsActionLoading(false);
  };

  // ─── Table columns ─────────────────────────────────────────────────────────

  const columns = React.useMemo<ColumnDef<Post>[]>(
    () => [
      {
        header: "Photo",
        accessorKey: "image",
        headerClassName: "w-[100px]",
        cell: (row) => (
          <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200">
            {row.image && (
              <Image
                src={row.image}
                alt={row.title}
                fill
                className="object-cover"
              />
            )}
          </div>
        ),
      },
      {
        header: "Post Details",
        filterable: true,
        filterValue: (row) => `${row.title} ${row.author}`,
        cell: (row) => (
          <div className="flex flex-col gap-0.5">
            <span className="font-bold text-zinc-900 line-clamp-1">
              {row.title}
            </span>
            <span className="text-xs text-zinc-400">
              by {row.author} • {row.category}
            </span>
          </div>
        ),
      },
      {
        header: "Status",
        accessorKey: "status",
        filterable: true,
        cell: (row) => {
          const cfg =
            STATUS_BADGE[row.status as PostStatus] ?? STATUS_BADGE.Draft;
          return (
            <Badge
              variant="outline"
              className={`font-medium text-xs rounded-full px-3 ${cfg.className}`}
            >
              {cfg.label}
            </Badge>
          );
        },
      },
      {
        header: "Actions",
        className: "text-right",
        headerClassName: "text-right",
        cell: (row) => (
          <div className="flex justify-end gap-2">
            {/* View */}
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full px-3 text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 h-8 gap-1.5"
              onClick={() => handlePreviewPost(row)}
            >
              <Eye size={12} />
              View
            </Button>

            {/* Reject */}
            <Button
              variant="outline"
              size="sm"
              className="rounded-full px-4 text-[10px] font-bold uppercase tracking-widest text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-200 h-8 gap-2"
              onClick={() => handleOpenReject(row)}
            >
              <XCircle size={12} />
              Reject
            </Button>

            {/* Approve */}
            <Button
              variant="primary"
              size="sm"
              className="rounded-full px-4 text-[10px] font-bold uppercase tracking-widest bg-[#0066FF] text-white hover:bg-blue-600 h-8 gap-2"
              onClick={() => handleOpenApprove(row)}
            >
              <CheckCircle2 size={12} />
              Approve
            </Button>
          </div>
        ),
      },
    ],
    [],
  );

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-8">
      {/* Search bar */}
      <div className="flex items-center gap-4">
        <div className="w-full max-w-sm">
          <Input placeholder="Search posts..." icon={<Search size={16} />} />
        </div>
      </div>

      {isLoading ? (
        <div className="py-12 text-center text-zinc-500 text-sm">
          Loading queue...
        </div>
      ) : (
        <DataTable columns={columns} data={posts} itemsPerPage={10} />
      )}

      {/* ── Reject Modal ──────────────────────────────────────────────────── */}
      <Dialog open={isRejectModalOpen} onOpenChange={setIsRejectModalOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl p-8 border-zinc-100 shadow-none bg-white">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-zinc-900">
              Reject Post
            </DialogTitle>
            <DialogDescription className="text-sm text-zinc-500 mt-2 leading-relaxed">
              You are about to reject{" "}
              <span className="font-semibold text-zinc-900">
                &ldquo;{rejectTarget?.title}&rdquo;
              </span>
              . Provide a brief reason so the author knows what to improve.
            </DialogDescription>
          </DialogHeader>

          {/* Remarks textarea */}
          <div className="mt-6">
            <label
              htmlFor="reject-remarks"
              className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2"
            >
              Rejection Remarks
            </label>
            <textarea
              id="reject-remarks"
              rows={4}
              placeholder="e.g. Content needs more detail, images are missing, incorrect category…"
              value={rejectRemarks}
              onChange={(e) => setRejectRemarks(e.target.value)}
              className="w-full resize-none rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF] transition-colors"
            />
            <p className="mt-1.5 text-[11px] text-zinc-400">
              Remarks are optional but strongly recommended.
            </p>
          </div>

          <DialogFooter className="mt-8 flex gap-4 w-full bg-transparent border-t-0 p-0 rounded-none sm:justify-start">
            <Button
              className="w-full py-3 px-6 rounded-full bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50 shadow-none font-bold uppercase tracking-widest text-[10px]"
              onClick={() => setIsRejectModalOpen(false)}
              disabled={isActionLoading}
            >
              Cancel
            </Button>
            <Button
              className="w-full py-3 px-6 rounded-full text-white font-bold uppercase tracking-widest text-[10px] shadow-none disabled:opacity-50 flex items-center justify-center bg-red-500 hover:bg-red-600"
              onClick={handleConfirmReject}
              disabled={isActionLoading}
            >
              {isActionLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin mr-2" />
                  Rejecting…
                </>
              ) : (
                "Reject Post"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Approve Modal ─────────────────────────────────────────────────── */}
      <Dialog open={isApproveModalOpen} onOpenChange={setIsApproveModalOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl p-8 border-zinc-100 shadow-none bg-white">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-zinc-900">
              Publish Post
            </DialogTitle>
            <DialogDescription className="mt-2 space-y-4 block">
              <span className="block text-sm text-zinc-500 leading-relaxed">
                You are about to approve{" "}
                <span className="font-semibold text-zinc-900">
                  &ldquo;{approveTarget?.title}&rdquo;
                </span>
                .
              </span>
              {/* Informational alert */}
              <span className="flex gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-4 mt-3">
                <AlertCircle
                  size={18}
                  className="mt-0.5 shrink-0 text-[#0066FF]"
                />
                <span className="text-sm text-blue-800 leading-relaxed">
                  <span className="font-semibold">Heads up:</span> This post
                  will become publicly visible on the homepage alongside other
                  approved articles. You can unpublish it at any time from this
                  dashboard.
                </span>
              </span>
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-8 flex gap-4 w-full bg-transparent border-t-0 p-0 rounded-none sm:justify-start">
            <Button
              className="w-full py-3 px-6 rounded-full bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50 shadow-none font-bold uppercase tracking-widest text-[10px]"
              onClick={() => setIsApproveModalOpen(false)}
              disabled={isActionLoading}
            >
              Cancel
            </Button>
            <Button
              className="w-full py-3 px-6 rounded-full text-white font-bold uppercase tracking-widest text-[10px] shadow-none disabled:opacity-50 flex items-center justify-center bg-[#0066FF] hover:bg-blue-600"
              onClick={handleConfirmApprove}
              disabled={isActionLoading}
            >
              {isActionLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin mr-2" />
                  Publishing…
                </>
              ) : (
                "Approve & Publish"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── View Post Preview Modal ───────────────────────────────────────── */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto p-8 border border-zinc-200 bg-white rounded-[32px] outline-none">
          {selectedPost && (
            <div className="space-y-6">
              {/* Header */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className="font-bold text-xs rounded-full px-3 py-1 bg-zinc-100 text-zinc-800 border-none"
                  >
                    {selectedPost.category}
                  </Badge>
                  <span className="text-zinc-300">•</span>
                  <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider">
                    {selectedPost.readTime}
                  </span>
                  {/* Status badge in preview */}
                  {(() => {
                    const cfg =
                      STATUS_BADGE[selectedPost.status as PostStatus] ??
                      STATUS_BADGE.Draft;
                    return (
                      <Badge
                        variant="outline"
                        className={`ml-auto font-bold text-[10px] rounded-full px-2.5 border ${cfg.className}`}
                      >
                        {cfg.label}
                      </Badge>
                    );
                  })()}
                </div>

                <h2 className="text-3xl font-bold text-zinc-900 tracking-tight leading-tight">
                  {selectedPost.title}
                </h2>

                <DialogTitle className="sr-only">
                  {selectedPost.title}
                </DialogTitle>

                <div className="flex items-center gap-3 pt-2">
                  {selectedPost.authorImage && (
                    <div className="relative w-8 h-8 rounded-full overflow-hidden border border-zinc-200">
                      <Image
                        src={selectedPost.authorImage}
                        alt={selectedPost.author}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-zinc-900">
                      {selectedPost.author}
                    </span>
                    <span className="text-[10px] text-zinc-400 font-medium">
                      {selectedPost.date}
                    </span>
                  </div>
                </div>
              </div>

              {/* Featured image */}
              {selectedPost.image && (
                <div className="relative aspect-[21/9] w-full rounded-2xl overflow-hidden border border-zinc-200">
                  <Image
                    src={selectedPost.image}
                    alt={selectedPost.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              <div className="h-[1px] bg-zinc-100 my-6" />

              {/* Content blocks */}
              <div className="space-y-6">
                {selectedPost.blocks?.map((block) => {
                  if (block.type === "headline") {
                    return (
                      <h3
                        key={block.id}
                        className="text-xl font-bold text-zinc-900 pt-2 tracking-tight"
                      >
                        {block.content}
                      </h3>
                    );
                  }
                  if (block.type === "subtitle") {
                    return (
                      <p
                        key={block.id}
                        className="text-base text-zinc-800 font-medium leading-relaxed"
                      >
                        {block.content}
                      </p>
                    );
                  }
                  if (block.type === "quote") {
                    return (
                      <blockquote
                        key={block.id}
                        className="border-l-4 border-[#0066FF] pl-4 italic text-zinc-900 text-lg font-medium bg-zinc-50/50 py-3 pr-3 rounded-r-2xl"
                      >
                        &ldquo;{block.content}&rdquo;
                      </blockquote>
                    );
                  }
                  return (
                    <p
                      key={block.id}
                      className="text-zinc-600 leading-relaxed text-sm"
                    >
                      {block.content}
                    </p>
                  );
                })}
              </div>

              {/* Quick-action row inside preview */}
              <div className="pt-4 flex justify-end gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full px-5 text-[10px] font-bold uppercase tracking-widest text-red-600 hover:bg-red-50 hover:border-red-200 h-9 gap-1.5"
                  onClick={() => {
                    setIsPreviewOpen(false);
                    handleOpenReject(selectedPost);
                  }}
                >
                  <XCircle size={12} />
                  Reject
                </Button>
                <Button
                  size="sm"
                  className="rounded-full px-5 text-[10px] font-bold uppercase tracking-widest bg-[#0066FF] text-white hover:bg-blue-600 h-9 gap-1.5"
                  onClick={() => {
                    setIsPreviewOpen(false);
                    handleOpenApprove(selectedPost);
                  }}
                >
                  <CheckCircle2 size={12} />
                  Approve
                </Button>
                <Button
                  onClick={() => setIsPreviewOpen(false)}
                  className="rounded-full bg-zinc-900 hover:bg-zinc-800 text-white font-bold uppercase tracking-widest text-[10px] px-6 h-9"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
