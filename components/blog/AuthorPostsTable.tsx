'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { MoreHorizontal, Eye, Edit, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { DataTable, ColumnDef } from '@/components/ui/data-table';
import { deletePost } from '@/lib/services/postService';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import type { Post } from '@/types/post';

interface AuthorPostsTableProps {
  initialPosts: Post[];
}

export default function AuthorPostsTable({ initialPosts }: AuthorPostsTableProps) {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = React.useCallback(async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    setIsDeleting(true);
    const response = await deletePost(id);
    if (response.success) {
      setPosts((prev) => prev.filter((p) => p.id !== id));
      router.refresh(); // Purges Next.js route caches
    } else {
      alert(response.error?.message || 'Failed to delete post.');
    }
    setIsDeleting(false);
  }, [router]);

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
      ),
    },
    {
      header: 'Post Details',
      filterable: true,
      filterValue: (row) => `${row.title} ${row.author}`,
      cell: (row) => (
        <div className="flex flex-col gap-0.5">
          <span className="font-bold text-zinc-900 line-clamp-1">{row.title}</span>
          <span className="text-xs text-zinc-400">by {row.author}</span>
        </div>
      ),
    },
    {
      header: 'Category',
      accessorKey: 'category',
      filterable: true,
      cell: (row) => (
        <Badge variant="secondary" className="font-medium text-xs rounded-full px-3">
          {row.category}
        </Badge>
      ),
    },
    {
      header: 'Date',
      accessorKey: 'date',
      cell: (row) => <span className="text-zinc-500 text-sm font-medium">{row.date}</span>,
    },
    {
      header: 'Status',
      accessorKey: 'status',
      filterable: true,
      cell: (row) => {
        const s = row.status?.toLowerCase();
        if (s === 'published') {
          return (
            <Badge variant="default" className="font-bold text-[10px] uppercase tracking-widest rounded-full px-3 py-1 bg-green-500 text-white border-none">
              Published
            </Badge>
          );
        }
        if (s === 'ai_rejected' || s === 'ai-declined' || s === 'rejected') {
          return (
            <Badge variant="outline" className="font-bold text-[10px] uppercase tracking-widest rounded-full px-3 py-1 text-red-600 border-red-200 bg-red-50">
              AI Rejected
            </Badge>
          );
        }
        if (s === 'ai_approved' || s === 'ai-approved') {
          return (
            <Badge variant="outline" className="font-bold text-[10px] uppercase tracking-widest rounded-full px-3 py-1 text-blue-600 border-blue-200 bg-blue-50">
              AI Approved
            </Badge>
          );
        }
        if (s === 'pending_review' || s === 'pending_admin' || s === 'pending') {
          return (
            <Badge variant="outline" className="font-bold text-[10px] uppercase tracking-widest rounded-full px-3 py-1 text-amber-600 border-amber-200 bg-amber-50">
              Pending Admin
            </Badge>
          );
        }
        // Fallback for 'Draft' (standard draft pending admin approval since AI check already passed in UI)
        return (
          <Badge variant="outline" className="font-bold text-[10px] uppercase tracking-widest rounded-full px-3 py-1 text-blue-600 border-blue-200 bg-blue-50">
            AI Approved • Pending Admin
          </Badge>
        );
      },
    },
    {
      header: 'Actions',
      className: 'text-right',
      headerClassName: 'text-right',
      cell: (row) => (
        <DropdownMenu>
          <DropdownMenuTrigger render={
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-zinc-100" />
          }>
            <MoreHorizontal size={16} className="text-zinc-400" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-2xl w-48 p-2">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="px-3 py-2 text-xs font-bold text-zinc-400 uppercase tracking-widest">Options</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-zinc-100" />
              <DropdownMenuItem 
                className="gap-2 px-3 py-2 rounded-xl cursor-pointer"
                onClick={() => {
                  setSelectedPost(row);
                  setIsViewModalOpen(true);
                }}
              >
                <Eye size={14} className="text-zinc-400" />
                <span className="font-medium">View Post</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="gap-2 px-3 py-2 rounded-xl cursor-pointer"
                onClick={() => router.push(`/dashboard/author/posts/${row.id}/edit`)}
              >
                <Edit size={14} className="text-zinc-400" />
                <span className="font-medium">Edit Content</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="bg-zinc-100" />
            <DropdownMenuItem 
              disabled={isDeleting}
              onClick={() => handleDelete(row.id)}
              className="gap-2 px-3 py-2 rounded-xl cursor-pointer text-red-500 hover:text-red-600 hover:bg-red-50 focus:bg-red-50"
            >
              <Trash2 size={14} />
              <span className="font-medium">Delete Post</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ], [router, isDeleting, handleDelete]);

  return (
    <>
      <DataTable columns={columns} data={posts} itemsPerPage={5} />

      {/* View Post Dialog */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
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
                    variant="outline"
                    className={`ml-auto text-[10px] font-bold uppercase tracking-wider rounded-full px-2.5 py-0.5 ${
                      selectedPost.status === 'Published' 
                        ? 'bg-green-500 text-white border-none' 
                        : ['ai_rejected', 'ai-declined', 'rejected'].includes(selectedPost.status?.toLowerCase() || '')
                        ? 'bg-red-50 text-red-600 border border-red-200'
                        : ['ai_approved', 'ai-approved'].includes(selectedPost.status?.toLowerCase() || '')
                        ? 'bg-blue-50 text-blue-600 border border-blue-200'
                        : ['pending_review', 'pending_admin', 'pending'].includes(selectedPost.status?.toLowerCase() || '')
                        ? 'bg-amber-50 text-amber-600 border border-amber-200'
                        : 'bg-blue-50 text-blue-600 border border-blue-200'
                    }`}
                  >
                    {(() => {
                      const s = selectedPost.status?.toLowerCase();
                      if (s === 'published') return 'Published';
                      if (s === 'ai_rejected' || s === 'ai-declined' || s === 'rejected') return 'AI Rejected';
                      if (s === 'ai_approved' || s === 'ai-approved') return 'AI Approved';
                      if (s === 'pending_review' || s === 'pending_admin' || s === 'pending') return 'Pending Admin';
                      return 'AI Approved • Pending Admin';
                    })()}
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
                  onClick={() => setIsViewModalOpen(false)}
                  className="rounded-full bg-zinc-900 hover:bg-zinc-800 text-white font-bold uppercase tracking-widest text-[10px] px-6"
                >
                  Close Preview
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
