"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  Eye 
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { DataTable, ColumnDef } from '@/components/ui/data-table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { createClient } from '@/lib/supabase/client';
import { adminReviewPost, postRowToPost, type BlogPostRow } from '@/lib/services/postService';
import type { Post } from '@/types/post';

export function PostReviewManager() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [actionToConfirm, setActionToConfirm] = useState<{ id: string, action: 'approve' | 'reject', title: string } | null>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);
  
  // Preview post modal state
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const fetchPosts = async () => {
    setIsLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*, profiles:author_id(display_name, avatar_url)')
      .eq('status', 'Draft')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setPosts((data as BlogPostRow[]).map(postRowToPost));
    } else if (error) {
      console.error('Failed to fetch posts:', error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleReviewAction = (id: string, action: 'approve' | 'reject', title: string) => {
    setActionToConfirm({ id, action, title });
    setIsConfirmModalOpen(true);
  };

  const confirmReviewAction = async () => {
    if (!actionToConfirm) return;
    setIsActionLoading(true);
    const result = await adminReviewPost(actionToConfirm.id, actionToConfirm.action);
    if (result.success) {
      await fetchPosts(); // Refresh list after action
      setIsConfirmModalOpen(false);
      router.refresh();
    } else {
      console.error('Failed to review post:', result.error);
    }
    setIsActionLoading(false);
  };

  const handlePreviewPost = (post: Post) => {
    setSelectedPost(post);
    setIsPreviewOpen(true);
  };

  const columns = React.useMemo<ColumnDef<Post>[]>(() => [
    {
      header: 'Photo',
      accessorKey: 'image',
      headerClassName: 'w-[100px]',
      cell: (row) => (
        <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200">
          {row.image && (
            <Image src={row.image} alt={row.title} fill className="object-cover" />
          )}
        </div>
      )
    },
    {
      header: 'Post Details',
      filterable: true,
      filterValue: (row) => `${row.title} ${row.author}`,
      cell: (row) => (
        <div className="flex flex-col gap-0.5">
          <span className="font-bold text-zinc-900 line-clamp-1">{row.title}</span>
          <span className="text-xs text-zinc-400">by {row.author} • {row.category}</span>
        </div>
      )
    },
    {
      header: 'Status',
      accessorKey: 'status',
      filterable: true,
      cell: (row) => (
        <div className="flex items-center gap-1.5">
          {row.status === 'Draft' && (
            <Badge variant="outline" className="font-medium text-xs rounded-full px-3 text-blue-600 border-blue-200 bg-blue-50">
              Pending Admin
            </Badge>
          )}
          {row.status === 'Published' && (
            <Badge variant="default" className="font-medium text-xs rounded-full px-3 bg-green-500">
              Published
            </Badge>
          )}
        </div>
      )
    },
    {
      header: 'Actions',
      className: 'text-right',
      headerClassName: 'text-right',
      cell: (row) => (
        <div className="flex justify-end gap-2">
          {row.status === 'Draft' && (
            <>
              <Button 
                variant="ghost" 
                size="sm" 
                className="rounded-full px-3 text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 h-8 gap-1.5"
                onClick={() => handlePreviewPost(row)}
              >
                <Eye size={12} />
                View
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="rounded-full px-4 text-[10px] font-bold uppercase tracking-widest text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-200 h-8 gap-2"
                onClick={() => handleReviewAction(row.id, 'reject', row.title)}
              >
                <XCircle size={12} />
                Reject
              </Button>
              <Button 
                variant="primary" 
                size="sm" 
                className="rounded-full px-4 text-[10px] font-bold uppercase tracking-widest bg-[#0066FF] text-white hover:bg-blue-600 h-8 gap-2"
                onClick={() => handleReviewAction(row.id, 'approve', row.title)}
              >
                <CheckCircle2 size={12} />
                Approve
              </Button>
            </>
          )}
        </div>
      )
    }
  ], [router]);

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-full max-w-sm">
          <Input
            placeholder="Search posts..."
            icon={<Search size={16} />}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="py-12 text-center text-zinc-500 text-sm">Loading queue...</div>
      ) : (
        <DataTable columns={columns} data={posts} itemsPerPage={10} />
      )}

      {/* Confirmation Dialog */}
      <Dialog open={isConfirmModalOpen} onOpenChange={setIsConfirmModalOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl p-8 border-zinc-100 shadow-none bg-white">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-zinc-900">
              {actionToConfirm?.action === 'approve' ? 'Approve Post' : 'Reject Post'}
            </DialogTitle>
            <DialogDescription className="text-sm text-zinc-500 mt-2 leading-relaxed">
              Are you sure you want to {actionToConfirm?.action === 'approve' ? 'approve and publish' : 'reject'} <span className="font-semibold text-zinc-900">"{actionToConfirm?.title}"</span>? 
              {actionToConfirm?.action === 'approve' ? ' This will publish the article to the public journal feed.' : ' This will keep it as a draft visible only to the author.'}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-8 flex gap-4 w-full bg-transparent border-t-0 p-0 rounded-none sm:justify-start">
            <Button
              className="w-full py-3 px-6 rounded-full bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50 shadow-none font-bold uppercase tracking-widest text-[10px]"
              onClick={() => setIsConfirmModalOpen(false)}
              disabled={isActionLoading}
            >
              Cancel
            </Button>
            <Button
              className={`w-full py-3 px-6 rounded-full text-white font-bold uppercase tracking-widest text-[10px] shadow-none disabled:opacity-50 flex items-center justify-center ${actionToConfirm?.action === 'approve' ? 'bg-[#0066FF] hover:bg-blue-600' : 'bg-red-500 hover:bg-red-600'}`}
              onClick={confirmReviewAction}
              disabled={isActionLoading}
            >
              {isActionLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin mr-2" />
                  {actionToConfirm?.action === 'approve' ? 'Approving...' : 'Rejecting...'}
                </>
              ) : (
                actionToConfirm?.action === 'approve' ? 'Approve' : 'Reject'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Post Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto p-8 border border-zinc-200 bg-white rounded-[32px] outline-none">
          {selectedPost && (
            <div className="space-y-6">
              {/* Header Details */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="font-bold text-xs rounded-full px-3 py-1 bg-zinc-100 text-zinc-800 border-none">
                    {selectedPost.category}
                  </Badge>
                  <span className="text-zinc-300">•</span>
                  <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider">{selectedPost.readTime}</span>
                </div>
                
                <h2 className="text-3xl font-bold text-zinc-900 tracking-tight leading-tight">
                  {selectedPost.title}
                </h2>

                <DialogTitle className="sr-only">{selectedPost.title}</DialogTitle>

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
                    <span className="text-xs font-bold text-zinc-900">{selectedPost.author}</span>
                    <span className="text-[10px] text-zinc-400 font-medium">{selectedPost.date}</span>
                  </div>
                  <Badge 
                    variant="secondary" 
                    className="ml-auto text-[10px] font-bold uppercase tracking-wider rounded-full px-2.5 py-0.5 border-none bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
                  >
                    {selectedPost.status}
                  </Badge>
                </div>
              </div>

              {/* Featured Image */}
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

              {/* Divider */}
              <div className="h-[1px] bg-zinc-100 my-6" />

              {/* Dynamic Content Blocks */}
              <div className="space-y-6">
                {selectedPost.blocks?.map((block) => {
                  if (block.type === 'headline') {
                    return (
                      <h3 key={block.id} className="text-xl font-bold text-zinc-900 pt-2 tracking-tight">
                        {block.content}
                      </h3>
                    );
                  }
                  if (block.type === 'subtitle') {
                    return (
                      <p key={block.id} className="text-base text-zinc-800 font-medium leading-relaxed">
                        {block.content}
                      </p>
                    );
                  }
                  if (block.type === 'quote') {
                    return (
                      <blockquote key={block.id} className="border-l-4 border-[#0066FF] pl-4 italic text-zinc-900 text-lg font-medium bg-zinc-50/50 py-3 pr-3 rounded-r-2xl">
                        &quot;{block.content}&quot;
                      </blockquote>
                    );
                  }
                  // default to body
                  return (
                    <p key={block.id} className="text-zinc-600 leading-relaxed text-sm">
                      {block.content}
                    </p>
                  );
                })}
              </div>

              <div className="pt-4 flex justify-end">
                <Button 
                  onClick={() => setIsPreviewOpen(false)}
                  className="rounded-full bg-zinc-900 hover:bg-zinc-800 text-white font-bold uppercase tracking-widest text-[10px] px-6"
                >
                  Close Preview
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

