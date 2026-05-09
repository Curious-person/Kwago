"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  Eye, 
  CheckCircle2, 
  XCircle, 
  Search,
  MoreHorizontal,
  Clock,
  ExternalLink
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

interface ReviewPost {
  id: string;
  title: string;
  category: string;
  date: string;
  image: string;
  author: string;
  reviewStatus: 'pending' | 'reviewed' | 'rejected';
  publishStatus: 'draft' | 'published';
}

const INITIAL_REVIEW_POSTS: ReviewPost[] = [
  {
    id: "1",
    title: "The Art of Intentional Digital Consumption",
    category: "Design",
    date: "Oct 24, 2024",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=800&auto=format&fit=crop",
    author: "Elena Vance",
    reviewStatus: 'reviewed',
    publishStatus: 'published'
  },
  {
    id: "2",
    title: "Finding Silence in Architecture",
    category: "Architecture",
    date: "Oct 21, 2024",
    image: "https://images.unsplash.com/photo-1518005020250-685949320299?q=80&w=800&auto=format&fit=crop",
    author: "Elena Vance",
    reviewStatus: 'pending',
    publishStatus: 'draft'
  },
  {
    id: "3",
    title: "The Future of Calm UI",
    category: "Technology",
    date: "Oct 19, 2024",
    image: "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=800&auto=format&fit=crop",
    author: "Elena Vance",
    reviewStatus: 'pending',
    publishStatus: 'draft'
  },
  {
    id: "4",
    title: "Stoicism in the Modern Age",
    category: "Philosophy",
    date: "Oct 15, 2024",
    image: "https://images.unsplash.com/photo-1505664194779-8beaceb93744?q=80&w=800&auto=format&fit=crop",
    author: "Marcus Aurelius",
    reviewStatus: 'reviewed',
    publishStatus: 'published'
  },
  {
    id: "5",
    title: "The Power of Essentialism",
    category: "Productivity",
    date: "Oct 12, 2024",
    image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?q=80&w=800&auto=format&fit=crop",
    author: "Greg McKeown",
    reviewStatus: 'pending',
    publishStatus: 'draft'
  }
];

import { DataTable, ColumnDef } from '@/components/ui/data-table';

export function ContentReviewManager() {
  const router = useRouter();
  const [posts, setPosts] = useState(INITIAL_REVIEW_POSTS);

  const handleApprove = (id: string) => {
    setPosts(prev => prev.map(post => 
      post.id === id 
        ? { ...post, reviewStatus: 'reviewed', publishStatus: 'published' } 
        : post
    ));
    console.log(`Approved post ${id}`);
  };

  const columns = React.useMemo<ColumnDef<ReviewPost>[]>(() => [
    {
      header: 'Photo',
      accessorKey: 'image',
      headerClassName: 'w-[100px]',
      cell: (row) => (
        <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200">
          <Image src={row.image} alt={row.title} fill className="object-cover" />
        </div>
      )
    },
    {
      header: 'Post Details',
      filterable: true,
      filterValue: (row) => `${row.title} ${row.author}`,
      cell: (row) => (
        <div className="flex flex-col gap-0.5">
          <span className="font-bold text-zinc-900 group-hover:text-[#0066FF] transition-colors line-clamp-1">{row.title}</span>
          <span className="text-xs text-zinc-400">by {row.author} • {row.date}</span>
        </div>
      )
    },
    {
      header: 'Category',
      accessorKey: 'category',
      filterable: true,
      cell: (row) => (
        <Badge variant="secondary" className="font-medium text-xs rounded-full px-3">
          {row.category}
        </Badge>
      )
    },
    {
      header: 'Review Status',
      accessorKey: 'reviewStatus',
      filterable: true,
      cell: (row) => (
        <div className="flex items-center gap-1.5">
          {row.reviewStatus === 'reviewed' ? (
            <>
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
              <span className="text-xs font-bold text-zinc-900 uppercase tracking-widest">Reviewed</span>
            </>
          ) : (
            <>
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Pending</span>
            </>
          )}
        </div>
      )
    },
    {
      header: 'Publish Status',
      accessorKey: 'publishStatus',
      filterable: true,
      cell: (row) => (
        <div className="flex items-center gap-1.5">
          <div className={`w-1.5 h-1.5 rounded-full ${row.publishStatus === 'published' ? 'bg-[#0066FF]' : 'bg-zinc-200'}`} />
          <span className={`text-xs font-bold ${row.publishStatus === 'published' ? 'text-zinc-900' : 'text-zinc-400'} uppercase tracking-widest`}>
            {row.publishStatus}
          </span>
        </div>
      )
    },
    {
      header: 'Actions',
      className: 'text-right',
      headerClassName: 'text-right',
      cell: (row) => (
        <div className="flex justify-end gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="rounded-full px-4 text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-[#0066FF] hover:border-[#0066FF] h-8 gap-2"
            onClick={() => router.push(`/dashboard/admin/content/review/${row.id}`)}
          >
            <Eye size={12} />
            Review
          </Button>
          
          {row.publishStatus !== 'published' && (
            <Button 
              variant="primary" 
              size="sm" 
              className="rounded-full px-4 text-[10px] font-bold uppercase tracking-widest bg-[#0066FF] text-white hover:bg-blue-600 h-8 gap-2"
              onClick={() => handleApprove(row.id)}
            >
              <CheckCircle2 size={12} />
              Approve
            </Button>
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
            placeholder="Search content..."
            icon={<Search size={16} />}
          />
        </div>
      </div>

      <DataTable columns={columns} data={posts} itemsPerPage={5} />
    </div>
  );
}
