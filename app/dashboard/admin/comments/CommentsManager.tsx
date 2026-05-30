"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { DataTable, ColumnDef } from "@/components/ui/data-table";
import {
  MessageSquare,
  Flag,
  Trash2,
  ArrowLeft,
  MoreHorizontal,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Comment {
  id: string;
  author: string;
  text: string;
  date: string;
  status: "approved" | "flagged";
  reason?: string;
}

interface Post {
  id: string;
  title: string;
  category: string;
  date: string;
  image: string;
  author: string;
  totalComments: number;
  flaggedComments: number;
  comments: Comment[];
}

const MOCK_DATA: Post[] = [
  {
    id: "p1",
    title: "Finding Silence in Architecture",
    category: "Design",
    date: "Oct 21, 2024",
    image:
      "https://images.unsplash.com/photo-1518005020250-685949320299?q=80&w=800&auto=format&fit=crop",
    author: "Elena Vance",
    totalComments: 12,
    flaggedComments: 2,
    comments: [
      {
        id: "c1",
        author: "John Doe",
        text: "Great insights on minimalism! I really love how you explained the use of space.",
        status: "approved",
        date: "2 hours ago",
      },
      {
        id: "c2",
        author: "Jane Smith",
        text: "I disagree with the point about shadows. Sometimes they add necessary depth.",
        status: "flagged",
        date: "5 hours ago",
        reason: "Potential spam",
      },
      {
        id: "c3",
        author: "Bob Wilson",
        text: "Buy cheap crypto here! Best rates guaranteed at crypto-scam.com",
        status: "flagged",
        date: "1 day ago",
        reason: "Spam/Advertising",
      },
    ],
  },
  {
    id: "p2",
    title: "The Future of Calm UI",
    category: "Technology",
    date: "Oct 19, 2024",
    image:
      "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=800&auto=format&fit=crop",
    author: "Elena Vance",
    totalComments: 8,
    flaggedComments: 0,
    comments: [
      {
        id: "c4",
        author: "Alice Brown",
        text: "This is exactly what the industry needs right now.",
        status: "approved",
        date: "3 hours ago",
      },
    ],
  },
  {
    id: "p3",
    title: "Stoicism in the Modern Age",
    category: "Philosophy",
    date: "Oct 15, 2024",
    image:
      "https://images.unsplash.com/photo-1505664194779-8beaceb93744?q=80&w=800&auto=format&fit=crop",
    author: "Elena Vance",
    totalComments: 24,
    flaggedComments: 5,
    comments: [],
  },
  {
    id: "p4",
    title: "The Power of Essentialism",
    category: "Productivity",
    date: "Oct 12, 2024",
    image:
      "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?q=80&w=800&auto=format&fit=crop",
    author: "Elena Vance",
    totalComments: 15,
    flaggedComments: 1,
    comments: [],
  },
  {
    id: "p5",
    title: "Deep Work and Creative Flow",
    category: "Creativity",
    date: "Oct 08, 2024",
    image:
      "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=800&auto=format&fit=crop",
    author: "Elena Vance",
    totalComments: 31,
    flaggedComments: 0,
    comments: [],
  },
  {
    id: "p6",
    title: "Slow Travel Manifesto",
    category: "Lifestyle",
    date: "Oct 05, 2024",
    image:
      "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=800&auto=format&fit=crop",
    author: "Marcus Webb",
    totalComments: 9,
    flaggedComments: 3,
    comments: [],
  },
  {
    id: "p7",
    title: "Minimalism in Motion",
    category: "Design",
    date: "Oct 01, 2024",
    image:
      "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?q=80&w=800&auto=format&fit=crop",
    author: "Marcus Webb",
    totalComments: 5,
    flaggedComments: 0,
    comments: [],
  },
];

export function CommentsManager() {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [flaggingCommentId, setFlaggingCommentId] = useState<string | null>(
    null,
  );
  const [flagReason, setFlagReason] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [authorFilter, setAuthorFilter] = useState("all");

  const authors = Array.from(new Set(MOCK_DATA.map((p) => p.author)));

  const filteredPosts = MOCK_DATA.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAuthor =
      authorFilter === "all" || post.author === authorFilter;
    return matchesSearch && matchesAuthor;
  });

  const handlePostClick = (post: Post) => {
    setSelectedPost(post);
  };

  const handleBack = () => {
    setSelectedPost(null);
    setFlaggingCommentId(null);
  };

  const handleDeleteComment = (commentId: string) => {
    // Static UI logic
    console.log(`Deleting comment ${commentId}`);
  };

  const handleFlagComment = (commentId: string) => {
    setFlaggingCommentId(commentId);
  };

  const submitFlag = (commentId: string) => {
    console.log(`Flagging comment ${commentId} with reason: ${flagReason}`);
    setFlaggingCommentId(null);
    setFlagReason("");
  };

  if (selectedPost) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={handleBack}
            className="rounded-full w-10 h-10 border-zinc-200"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h2 className="text-xl font-bold text-zinc-900">
              {selectedPost.title}
            </h2>
            <p className="text-sm text-zinc-500">
              Managing {selectedPost.comments.length} comments
            </p>
          </div>
        </div>

        <DataTable
          columns={[
            {
              header: "Author",
              filterable: true,
              filterValue: (row) => row.author,
              cell: (row) => (
                <div className="flex flex-col gap-0.5">
                  <div className="font-bold text-zinc-900">{row.author}</div>
                  <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-1">
                    {row.date}
                  </div>
                </div>
              ),
            },
            {
              header: "Comment",
              filterable: true,
              filterValue: (row) => row.text,
              cell: (row) => (
                <div className="max-w-md">
                  <p className="text-zinc-500 text-sm leading-relaxed">
                    {row.text}
                  </p>
                  {row.status === "flagged" && row.reason && (
                    <div className="mt-2 flex items-start gap-2 p-3 bg-red-50 rounded-2xl border border-red-100">
                      <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-red-700 uppercase tracking-wider">
                          Reason
                        </p>
                        <p className="text-xs text-red-600 mt-0.5">
                          {row.reason}
                        </p>
                      </div>
                    </div>
                  )}
                  {flaggingCommentId === row.id && (
                    <div className="mt-4 flex flex-col gap-3 p-4 bg-zinc-50 rounded-2xl border border-zinc-200">
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                        Reason for flagging
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Inappropriate content, Spam..."
                        className="bg-white border border-zinc-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent"
                        value={flagReason}
                        onChange={(e) => setFlagReason(e.target.value)}
                        autoFocus
                      />
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setFlaggingCommentId(null)}
                          className="text-xs h-8 px-4"
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => submitFlag(row.id)}
                          className="text-xs h-8 px-4 bg-[#0066FF] text-white hover:bg-blue-600"
                        >
                          Submit
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ),
            },
            {
              header: "Status",
              accessorKey: "status",
              filterable: true,
              cell: (row) => (
                <Badge
                  variant={row.status === "flagged" ? "secondary" : "active"}
                  className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1"
                >
                  {row.status}
                </Badge>
              ),
            },
            {
              header: "Actions",
              className: "text-right",
              headerClassName: "text-right",
              cell: (row) => (
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full w-8 h-8 text-zinc-400 hover:text-[#0066FF] hover:border-[#0066FF]"
                    onClick={() => handleFlagComment(row.id)}
                    title="Flag comment"
                  >
                    <Flag className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full w-8 h-8 text-zinc-400 hover:text-red-500 hover:border-red-500"
                    onClick={() => handleDeleteComment(row.id)}
                    title="Delete comment"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              ),
            },
          ]}
          data={selectedPost.comments}
          itemsPerPage={5}
        />
      </div>
    );
  }

  const postColumns: ColumnDef<Post>[] = [
    {
      header: "Photo",
      accessorKey: "image",
      headerClassName: "w-[80px]",
      cell: (row) => (
        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200">
          <Image
            src={row.image}
            alt={row.title}
            fill
            className="object-cover"
          />
        </div>
      ),
    },
    {
      header: "Post Title",
      filterable: true,
      filterValue: (row) => `${row.title} ${row.author}`,
      cell: (row) => (
        <div className="flex flex-col gap-0.5">
          <div className="font-bold text-zinc-900 group-hover:text-[#0066FF] transition-colors">
            {row.title}
          </div>
          <div className="text-xs text-zinc-400 mt-1">by {row.author}</div>
        </div>
      ),
    },
    {
      header: "Category",
      accessorKey: "category",
      filterable: true,
      cell: (row) => (
        <Badge
          variant="secondary"
          className="font-medium text-xs rounded-full px-3"
        >
          {row.category}
        </Badge>
      ),
    },
    {
      header: "Total",
      accessorKey: "totalComments",
      className: "text-center",
      headerClassName: "text-center",
      cell: (row) => (
        <span className="font-medium text-zinc-500 text-sm">
          {row.totalComments}
        </span>
      ),
    },
    {
      header: "Flagged",
      accessorKey: "flaggedComments",
      className: "text-center",
      headerClassName: "text-center",
      cell: (row) => (
        <div
          className={cn(
            "inline-flex items-center justify-center min-w-8 h-8 rounded-full text-xs font-bold",
            row.flaggedComments > 0
              ? "bg-red-50 text-red-500"
              : "bg-zinc-50 text-zinc-400",
          )}
        >
          {row.flaggedComments}
        </div>
      ),
    },
    {
      header: "Actions",
      className: "text-right",
      headerClassName: "text-right",
      cell: (row) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePostClick(row)}
          className="rounded-full px-4 text-[10px] font-bold uppercase tracking-widest text-zinc-400 group-hover:text-[#0066FF] group-hover:border-[#0066FF] h-8"
        >
          Manage
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1 max-w-2xl">
          <div className="w-full max-w-sm">
            <Input
              placeholder="Search posts..."
              icon={<Search size={16} />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="relative">
            <select
              className="appearance-none bg-white border border-zinc-200 rounded-full pl-10 pr-8 py-2.5 text-sm font-medium text-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent transition-all cursor-pointer"
              value={authorFilter}
              onChange={(e) => setAuthorFilter(e.target.value)}
            >
              <option value="all">All Authors</option>
              {authors.map((author) => (
                <option key={author} value={author}>
                  {author}
                </option>
              ))}
            </select>
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
          </div>
        </div>
      </div>

      <DataTable columns={postColumns} data={filteredPosts} itemsPerPage={5} />
    </div>
  );
}
