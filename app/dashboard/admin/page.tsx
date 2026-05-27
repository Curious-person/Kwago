"use client";

import React from 'react';
import Link from 'next/link';
import {
  Users,
  Pen,
  Flag,
  Clock,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  UserX,
  CheckCircle2,
  FileText,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── Static Data (lifted from manager mocks) ──────────────────────────────────

const USERS = [
  { id: 'u1', display_name: 'Alex Rivera',   email: 'alex.rivera@gmail.com',  role: 'member', status: 'active',    created_at: '2024-10-01T08:00:00Z' },
  { id: 'u2', display_name: 'Jamie Chen',    email: 'jamie.chen@outlook.com',  role: 'member', status: 'active',    created_at: '2024-10-05T14:20:00Z' },
  { id: 'u3', display_name: 'Morgan Liu',    email: 'morganl@proton.me',       role: 'member', status: 'suspended', created_at: '2024-09-18T09:45:00Z' },
  { id: 'u4', display_name: 'Sam Nakamura',  email: 'sam.naka@yahoo.com',      role: 'member', status: 'active',    created_at: '2024-10-12T11:30:00Z' },
  { id: 'u5', display_name: 'Riley Torres',  email: 'rileyt@icloud.com',       role: 'member', status: 'active',    created_at: '2024-10-19T16:00:00Z' },
  { id: 'u6', display_name: 'Casey Park',    email: 'caseylp@gmail.com',       role: 'member', status: 'active',    created_at: '2024-11-02T10:10:00Z' },
  { id: 'u7', display_name: 'Elena Vance',   email: 'elena.vance@kwago.com',   role: 'author', status: 'active',    created_at: '2024-08-14T07:00:00Z', posts_count: 12 },
  { id: 'u8', display_name: 'Marcus Webb',   email: 'marcus.webb@kwago.com',   role: 'author', status: 'active',    created_at: '2024-09-01T09:30:00Z', posts_count: 7  },
  { id: 'u9', display_name: 'Priya Sharma',  email: 'priya.s@kwago.com',       role: 'author', status: 'suspended', created_at: '2024-09-22T13:00:00Z', posts_count: 3  },
] as const;

const CONTENT_POSTS = [
  { id: '1', title: 'The Art of Intentional Digital Consumption', author: 'Elena Vance',   reviewStatus: 'reviewed', publishStatus: 'published' },
  { id: '2', title: 'Finding Silence in Architecture',            author: 'Elena Vance',   reviewStatus: 'pending',  publishStatus: 'draft'     },
  { id: '3', title: 'The Future of Calm UI',                     author: 'Elena Vance',   reviewStatus: 'pending',  publishStatus: 'draft'     },
  { id: '4', title: 'Stoicism in the Modern Age',                author: 'Marcus Aurelius',reviewStatus: 'reviewed', publishStatus: 'published' },
  { id: '5', title: 'The Power of Essentialism',                 author: 'Greg McKeown',  reviewStatus: 'pending',  publishStatus: 'draft'     },
] as const;

// Flagged comments (extracted from CommentsManager MOCK_DATA)
const FLAGGED_COMMENTS = [
  { id: 'c2', postTitle: 'Finding Silence in Architecture', author: 'Jane Smith',  text: 'I disagree with the point about shadows. Sometimes they add necessary depth.', reason: 'Potential spam' },
  { id: 'c3', postTitle: 'Finding Silence in Architecture', author: 'Bob Wilson',  text: 'Buy cheap crypto here! Best rates guaranteed at crypto-scam.com',               reason: 'Spam/Advertising' },
  { id: 'cf1', postTitle: 'Stoicism in the Modern Age',     author: 'Tom Bradley', text: 'This content is misleading and presents unverified claims as fact.',              reason: 'Misinformation' },
  { id: 'cf2', postTitle: 'Stoicism in the Modern Age',     author: 'Sue Kim',     text: 'Completely off-topic reply pasted from another thread.',                          reason: 'Off-topic' },
  { id: 'cf3', postTitle: 'Stoicism in the Modern Age',     author: 'Jan Webb',    text: 'DM me for promo codes! Big sale today only!!!',                                   reason: 'Spam/Advertising' },
];

// ─── Derived Stats ─────────────────────────────────────────────────────────────

const totalUsers      = USERS.length;
const activeAuthors   = USERS.filter(u => u.role === 'author' && u.status === 'active').length;
const suspendedUsers  = USERS.filter(u => u.status === 'suspended').length;
const pendingContent  = CONTENT_POSTS.filter(p => p.reviewStatus === 'pending').length;
const publishedContent = CONTENT_POSTS.filter(p => p.publishStatus === 'published').length;
const flaggedCount    = FLAGGED_COMMENTS.length;

// Monthly user signups (Aug–Nov 2024)
const MONTHLY_SIGNUPS = [
  { month: 'Aug', count: 1 },
  { month: 'Sep', count: 3 },
  { month: 'Oct', count: 4 },
  { month: 'Nov', count: 1 },
];
const maxSignups = Math.max(...MONTHLY_SIGNUPS.map(m => m.count));

// Content pipeline for donut
const PIPELINE = [
  { label: 'Published', count: publishedContent,                                         color: '#22c55e' },
  { label: 'Pending',   count: pendingContent,                                            color: '#f59e0b' },
  { label: 'Draft',     count: CONTENT_POSTS.filter(p => p.publishStatus === 'draft' && p.reviewStatus !== 'pending').length, color: '#a1a1aa' },
];

// Recent 5 users
const recentUsers = [...USERS]
  .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  .slice(0, 5);

// ─── Sub-components ────────────────────────────────────────────────────────────

function UserInitials({ name }: { name: string }) {
  const initials = name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  return (
    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-100 text-zinc-600 text-xs font-bold shrink-0 select-none">
      {initials}
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  sub: string;
  accent: string;
  href: string;
}

function StatCard({ icon, label, value, sub, accent, href }: StatCardProps) {
  return (
    <Link href={href} className="group block rounded-3xl border border-zinc-100 bg-white p-6 transition-colors hover:border-zinc-200">
      <div className="flex items-start justify-between mb-4">
        <div className={cn('flex items-center justify-center w-10 h-10 rounded-2xl', accent)}>
          {icon}
        </div>
        <ArrowRight className="w-4 h-4 text-zinc-300 group-hover:text-zinc-400 transition-colors mt-1" />
      </div>
      <p className="text-3xl font-bold text-zinc-900 tracking-tight">{value}</p>
      <p className="text-sm font-semibold text-zinc-500 mt-0.5">{label}</p>
      <p className="text-xs text-zinc-400 mt-2">{sub}</p>
    </Link>
  );
}

// ─── Bar Chart ────────────────────────────────────────────────────────────────

function UserGrowthChart() {
  const BAR_W = 40;
  const GAP   = 24;
  const H     = 100;
  const totalWidth = MONTHLY_SIGNUPS.length * (BAR_W + GAP) - GAP;

  return (
    <div className="rounded-3xl border border-zinc-100 bg-white p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm font-bold text-zinc-900">User Growth</p>
          <p className="text-xs text-zinc-400 mt-0.5">New signups per month</p>
        </div>
        <div className="flex items-center gap-1.5 text-[#0066FF]">
          <TrendingUp className="w-4 h-4" />
          <span className="text-xs font-bold">+{totalUsers} total</span>
        </div>
      </div>

      <svg
        viewBox={`0 0 ${totalWidth} ${H + 24}`}
        className="w-full"
        aria-label="User growth bar chart"
      >
        {/* Grid lines */}
        {[0, 0.5, 1].map(t => (
          <line
            key={t}
            x1={0} y1={H * (1 - t)} x2={totalWidth} y2={H * (1 - t)}
            stroke="#f4f4f5" strokeWidth={1}
          />
        ))}

        {MONTHLY_SIGNUPS.map((m, i) => {
          const x = i * (BAR_W + GAP);
          const barH = maxSignups > 0 ? (m.count / maxSignups) * H : 0;
          const y = H - barH;
          return (
            <g key={m.month}>
              {/* Background track */}
              <rect x={x} y={0} width={BAR_W} height={H} rx={8} fill="#f9fafb" />
              {/* Filled bar */}
              <rect x={x} y={y} width={BAR_W} height={barH} rx={8} fill="#0066FF" />
              {/* Value label */}
              <text x={x + BAR_W / 2} y={y - 6} textAnchor="middle" fontSize={10} fontWeight={700} fill="#0066FF">
                {m.count}
              </text>
              {/* Month label */}
              <text x={x + BAR_W / 2} y={H + 18} textAnchor="middle" fontSize={10} fill="#a1a1aa" fontWeight={600}>
                {m.month}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ─── Donut Chart ──────────────────────────────────────────────────────────────

function ContentPipelineChart() {
  const total = CONTENT_POSTS.length;
  const R = 44;
  const CX = 60;
  const CY = 60;
  const circumference = 2 * Math.PI * R;

  // Build segments
  let accumulated = 0;
  const segments = PIPELINE.filter(p => p.count > 0).map(p => {
    const fraction = p.count / total;
    const dash = fraction * circumference;
    const gap  = circumference - dash;
    const offset = circumference - accumulated * circumference;
    accumulated += fraction;
    return { ...p, dash, gap, offset };
  });

  return (
    <div className="rounded-3xl border border-zinc-100 bg-white p-6">
      <div className="mb-6">
        <p className="text-sm font-bold text-zinc-900">Content Pipeline</p>
        <p className="text-xs text-zinc-400 mt-0.5">Review & publish status</p>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative shrink-0">
          <svg width={120} height={120} viewBox="0 0 120 120" aria-label="Content pipeline donut chart">
            {/* Track */}
            <circle cx={CX} cy={CY} r={R} fill="none" stroke="#f4f4f5" strokeWidth={14} />
            {segments.map((seg, i) => (
              <circle
                key={i}
                cx={CX} cy={CY} r={R}
                fill="none"
                stroke={seg.color}
                strokeWidth={14}
                strokeDasharray={`${seg.dash} ${seg.gap}`}
                strokeDashoffset={seg.offset}
                strokeLinecap="round"
                style={{ transform: 'rotate(-90deg)', transformOrigin: `${CX}px ${CY}px` }}
              />
            ))}
            <text x={CX} y={CY - 4} textAnchor="middle" fontSize={20} fontWeight={800} fill="#18181b">{total}</text>
            <text x={CX} y={CY + 12} textAnchor="middle" fontSize={9} fill="#a1a1aa" fontWeight={600}>POSTS</text>
          </svg>
        </div>

        <div className="flex flex-col gap-3 flex-1">
          {PIPELINE.map(p => (
            <div key={p.label} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
                <span className="text-xs font-semibold text-zinc-500">{p.label}</span>
              </div>
              <span className="text-xs font-bold text-zinc-900">{p.count}</span>
            </div>
          ))}
          <Link
            href="/dashboard/admin/posts"
            className="mt-1 text-[10px] font-bold uppercase tracking-widest text-[#0066FF] hover:text-blue-700 transition-colors flex items-center gap-1"
          >
            Review Queue <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Priority Flags Table ─────────────────────────────────────────────────────

function PriorityFlagsTable() {
  return (
    <div className="rounded-3xl border border-zinc-100 bg-white p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm font-bold text-zinc-900">Flagged Comments</p>
          <p className="text-xs text-zinc-400 mt-0.5">Priority moderation queue</p>
        </div>
        <Link
          href="/dashboard/admin/comments"
          className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-[#0066FF] transition-colors"
        >
          View All <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="space-y-0">
        {FLAGGED_COMMENTS.map((comment, i) => (
          <div
            key={comment.id}
            className={cn(
              'flex items-start gap-4 py-4 border-l-2 pl-4',
              'border-red-200',
              i !== FLAGGED_COMMENTS.length - 1 && 'border-b border-b-zinc-50'
            )}
          >
            <div className="flex items-center justify-center w-7 h-7 rounded-full bg-red-50 shrink-0 mt-0.5">
              <Flag className="w-3 h-3 text-red-500" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-xs font-bold text-zinc-900 truncate">{comment.author}</span>
                <span className="text-[10px] text-zinc-400">on</span>
                <span className="text-[10px] font-semibold text-zinc-500 truncate">{comment.postTitle}</span>
              </div>
              <p className="text-xs text-zinc-400 line-clamp-1">{comment.text}</p>
            </div>
            <span className="shrink-0 text-[9px] font-bold uppercase tracking-widest bg-red-50 text-red-500 rounded-full px-2.5 py-1 whitespace-nowrap">
              {comment.reason}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Recent Users Table ───────────────────────────────────────────────────────

function RecentUsersTable() {
  return (
    <div className="rounded-3xl border border-zinc-100 bg-white p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm font-bold text-zinc-900">Recent Users</p>
          <p className="text-xs text-zinc-400 mt-0.5">Latest registrations</p>
        </div>
        <Link
          href="/dashboard/admin/users"
          className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-[#0066FF] transition-colors"
        >
          Manage All <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr>
            <th className="text-left text-[10px] font-bold uppercase tracking-widest text-zinc-400 pb-3">User</th>
            <th className="text-left text-[10px] font-bold uppercase tracking-widest text-zinc-400 pb-3">Role</th>
            <th className="text-left text-[10px] font-bold uppercase tracking-widest text-zinc-400 pb-3">Status</th>
            <th className="text-right text-[10px] font-bold uppercase tracking-widest text-zinc-400 pb-3">Joined</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-50">
          {recentUsers.map(user => (
            <tr key={user.id} className="group">
              <td className="py-3">
                <div className="flex items-center gap-2.5">
                  <UserInitials name={user.display_name} />
                  <div>
                    <p className="font-bold text-zinc-900 text-xs">{user.display_name}</p>
                    <p className="text-[10px] text-zinc-400">{user.email}</p>
                  </div>
                </div>
              </td>
              <td className="py-3">
                <span className={cn(
                  'inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full',
                  user.role === 'author'
                    ? 'bg-blue-50 text-[#0066FF]'
                    : 'bg-zinc-100 text-zinc-500'
                )}>
                  {user.role === 'author' ? <Pen className="w-2.5 h-2.5" /> : <Users className="w-2.5 h-2.5" />}
                  {user.role}
                </span>
              </td>
              <td className="py-3">
                <div className="flex items-center gap-1.5">
                  <div className={cn(
                    'w-1.5 h-1.5 rounded-full',
                    user.status === 'active' ? 'bg-green-500' : 'bg-zinc-300'
                  )} />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                    {user.status}
                  </span>
                </div>
              </td>
              <td className="py-3 text-right text-xs text-zinc-400">
                {new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminOverviewPage() {
  const now = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
  });

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex items-end justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Admin Overview</h1>
          <p className="text-sm text-zinc-500">Platform health at a glance.</p>
        </div>
        <p className="text-xs text-zinc-400 font-medium">{now}</p>
      </div>

      {/* ── Alert Banner (if flagged comments exist) ── */}
      {flaggedCount > 0 && (
        <div className="flex items-center gap-3 rounded-2xl border border-red-100 bg-red-50 px-5 py-3.5">
          <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
          <p className="text-sm font-medium text-red-700">
            <span className="font-bold">{flaggedCount} comments</span> are awaiting moderation across your blog posts.
          </p>
          <Link
            href="/dashboard/admin/comments"
            className="ml-auto text-[10px] font-bold uppercase tracking-widest text-red-500 hover:text-red-700 flex items-center gap-1 shrink-0"
          >
            Review Now <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      )}

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Users className="w-5 h-5 text-zinc-600" />}
          label="Total Users"
          value={totalUsers}
          sub={`${suspendedUsers} suspended`}
          accent="bg-zinc-100"
          href="/dashboard/admin/users"
        />
        <StatCard
          icon={<Pen className="w-5 h-5 text-[#0066FF]" />}
          label="Active Authors"
          value={activeAuthors}
          sub={`${USERS.filter(u => u.role === 'author').length} total authors`}
          accent="bg-blue-50"
          href="/dashboard/admin/users"
        />
        <StatCard
          icon={<Clock className="w-5 h-5 text-amber-500" />}
          label="Pending Review"
          value={pendingContent}
          sub={`${publishedContent} published`}
          accent="bg-amber-50"
          href="/dashboard/admin/posts"
        />
        <StatCard
          icon={<Flag className="w-5 h-5 text-red-500" />}
          label="Flagged Comments"
          value={flaggedCount}
          sub="Needs moderation"
          accent="bg-red-50"
          href="/dashboard/admin/comments"
        />
      </div>

      {/* ── Charts Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <UserGrowthChart />
        </div>
        <div className="lg:col-span-1">
          <ContentPipelineChart />
        </div>
      </div>

      {/* ── Priority Flags Table ── */}
      <PriorityFlagsTable />

      {/* ── Recent Users Table ── */}
      <RecentUsersTable />

    </div>
  );
}
