'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { MoreHorizontal, Plus, Search, Eye, Edit, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { useRouter } from 'next/navigation';

// Sample data based on app/blog/[slug]/page.tsx
const INITIAL_POSTS = [
  {
    id: "1",
    title: "The Art of Intentional Digital Consumption",
    category: "Design",
    date: "Oct 24, 2024",
    image: "https://images.unsplash.com/photo-1544391682-177d4c9d3ddb?q=80&w=1200&auto=format&fit=crop",
    author: "Elena Vance",
    status: "Published"
  },
  {
    id: "2",
    title: "Finding Silence in Architecture",
    category: "Architecture",
    date: "Oct 21, 2024",
    image: "https://images.unsplash.com/photo-1518005020250-685949320299?q=80&w=800&auto=format&fit=crop",
    author: "Elena Vance",
    status: "Published"
  },
  {
    id: "3",
    title: "The Future of Calm UI",
    category: "Technology",
    date: "Oct 19, 2024",
    image: "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=800&auto=format&fit=crop",
    author: "Elena Vance",
    status: "Draft"
  }
];

export default function AuthorPostsPage() {
  const router = useRouter();
  const [posts] = useState(INITIAL_POSTS);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">My Posts</h1>
          <p className="text-sm text-zinc-500">Manage your published and draft guides.</p>
        </div>

        <Button className="gap-2" onClick={() => router.push('/dashboard/author/posts/new')}>
          <Plus size={16} />
          <span>Create Post</span>
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="w-full max-w-sm">
          <Input 
            placeholder="Search posts..." 
            icon={<Search size={16} />}
          />
        </div>
      </div>

      <div className="rounded-3xl border border-zinc-100 overflow-hidden bg-white shadow-none">
        <Table>
          <TableHeader className="bg-zinc-50/50">
            <TableRow className="hover:bg-transparent border-zinc-100">
              <TableHead className="w-[100px] text-zinc-400 font-bold uppercase tracking-widest text-[10px]">Photo</TableHead>
              <TableHead className="text-zinc-400 font-bold uppercase tracking-widest text-[10px]">Post Details</TableHead>
              <TableHead className="text-zinc-400 font-bold uppercase tracking-widest text-[10px]">Category</TableHead>
              <TableHead className="text-zinc-400 font-bold uppercase tracking-widest text-[10px]">Date</TableHead>
              <TableHead className="text-zinc-400 font-bold uppercase tracking-widest text-[10px]">Status</TableHead>
              <TableHead className="text-right text-zinc-400 font-bold uppercase tracking-widest text-[10px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((post) => (
              <TableRow key={post.id} className="hover:bg-zinc-50/50 border-zinc-100 transition-colors">
                <TableCell>
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200">
                    <Image 
                      src={post.image} 
                      alt={post.title} 
                      fill 
                      className="object-cover"
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-bold text-zinc-900 line-clamp-1">{post.title}</span>
                    <span className="text-xs text-zinc-400">by {post.author}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="font-medium text-xs rounded-full px-3">
                    {post.category}
                  </Badge>
                </TableCell>
                <TableCell className="text-zinc-500 text-sm font-medium">
                  {post.date}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${post.status === 'Published' ? 'bg-[#0066FF]' : 'bg-zinc-300'}`} />
                    <span className={`text-xs font-bold ${post.status === 'Published' ? 'text-zinc-900' : 'text-zinc-400'}`}>
                      {post.status}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger render={
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-zinc-100" />
                    }>
                      <MoreHorizontal size={16} className="text-zinc-400" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-2xl w-48 p-2">
                      <DropdownMenuLabel className="px-3 py-2 text-xs font-bold text-zinc-400 uppercase tracking-widest">Options</DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-zinc-100" />
                      <DropdownMenuItem className="gap-2 px-3 py-2 rounded-xl cursor-pointer">
                        <Eye size={14} className="text-zinc-400" />
                        <span className="font-medium">View Post</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="gap-2 px-3 py-2 rounded-xl cursor-pointer"
                        onClick={() => router.push(`/dashboard/author/posts/${post.id}/edit`)}
                      >
                        <Edit size={14} className="text-zinc-400" />
                        <span className="font-medium">Edit Content</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-zinc-100" />
                      <DropdownMenuItem className="gap-2 px-3 py-2 rounded-xl cursor-pointer text-red-500 hover:text-red-600 hover:bg-red-50 focus:bg-red-50">
                        <Trash2 size={14} />
                        <span className="font-medium">Delete Post</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
