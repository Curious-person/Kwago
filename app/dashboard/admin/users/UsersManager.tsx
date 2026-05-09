"use client";

import React, { useState } from 'react';
import { DataTable, ColumnDef } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Dialog as DialogPrimitive } from '@base-ui/react/dialog';
import { ShieldCheck, ShieldMinus, UserX, UserCheck, Users, Pen, AlertTriangle, Search } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';

// ─── Types ───────────────────────────────────────────────────────────────────

type UserRole = 'member' | 'author';
type UserStatus = 'active' | 'suspended';
type ActionType = 'promote' | 'demote' | 'suspend' | 'reactivate';

interface User {
  id: string;
  display_name: string;
  email: string;
  avatar_url: string | null;
  role: UserRole;
  status: UserStatus;
  created_at: string;
  posts_count?: number;
}

interface PendingAction {
  type: ActionType;
  user: User;
}

// ─── Action config (copy + colors per action type) ────────────────────────────

const ACTION_CONFIG: Record<
  ActionType,
  {
    title: string;
    description: (name: string) => string;
    confirmLabel: string;
    confirmClass: string;
  }
> = {
  promote: {
    title: 'Promote to Author',
    description: (name) =>
      `${name} will gain the ability to publish blog posts and manage their own content. This can be undone at any time.`,
    confirmLabel: 'Yes, Promote',
    confirmClass: 'bg-[#0066FF] text-white hover:bg-[#0052CC]',
  },
  demote: {
    title: 'Demote to Member',
    description: (name) =>
      `${name} will lose author privileges and can no longer publish or edit posts. Their existing posts will remain intact.`,
    confirmLabel: 'Yes, Demote',
    confirmClass: 'bg-amber-500 text-white hover:bg-amber-600',
  },
  suspend: {
    title: 'Suspend Account',
    description: (name) =>
      `${name}'s account will be suspended. They will not be able to log in or interact with the platform until reactivated.`,
    confirmLabel: 'Yes, Suspend',
    confirmClass: 'bg-red-500 text-white hover:bg-red-600',
  },
  reactivate: {
    title: 'Reactivate Account',
    description: (name) =>
      `${name}'s account will be reactivated and they will regain full access to the platform.`,
    confirmLabel: 'Yes, Reactivate',
    confirmClass: 'bg-[#0066FF] text-white hover:bg-[#0052CC]',
  },
};

// ─── Static Mock Data ─────────────────────────────────────────────────────────

const INITIAL_USERS: User[] = [
  { id: 'u1', display_name: 'Alex Rivera', email: 'alex.rivera@gmail.com', avatar_url: null, role: 'member', status: 'active', created_at: '2024-10-01T08:00:00Z' },
  { id: 'u2', display_name: 'Jamie Chen', email: 'jamie.chen@outlook.com', avatar_url: null, role: 'member', status: 'active', created_at: '2024-10-05T14:20:00Z' },
  { id: 'u3', display_name: 'Morgan Liu', email: 'morganl@proton.me', avatar_url: null, role: 'member', status: 'suspended', created_at: '2024-09-18T09:45:00Z' },
  { id: 'u4', display_name: 'Sam Nakamura', email: 'sam.naka@yahoo.com', avatar_url: null, role: 'member', status: 'active', created_at: '2024-10-12T11:30:00Z' },
  { id: 'u5', display_name: 'Riley Torres', email: 'rileyt@icloud.com', avatar_url: null, role: 'member', status: 'active', created_at: '2024-10-19T16:00:00Z' },
  { id: 'u6', display_name: 'Casey Park', email: 'caseylp@gmail.com', avatar_url: null, role: 'member', status: 'active', created_at: '2024-11-02T10:10:00Z' },
  { id: 'u7', display_name: 'Elena Vance', email: 'elena.vance@kwago.com', avatar_url: null, role: 'author', status: 'active', created_at: '2024-08-14T07:00:00Z', posts_count: 12 },
  { id: 'u8', display_name: 'Marcus Webb', email: 'marcus.webb@kwago.com', avatar_url: null, role: 'author', status: 'active', created_at: '2024-09-01T09:30:00Z', posts_count: 7 },
  { id: 'u9', display_name: 'Priya Sharma', email: 'priya.s@kwago.com', avatar_url: null, role: 'author', status: 'suspended', created_at: '2024-09-22T13:00:00Z', posts_count: 3 },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function UserAvatar({ name }: { name: string }) {
  const initials = name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();
  return (
    <div className="flex items-center justify-center w-9 h-9 rounded-full bg-zinc-100 text-zinc-600 text-xs font-bold shrink-0 select-none">
      {initials}
    </div>
  );
}

function StatusBadge({ status }: { status: UserStatus }) {
  return status === 'active' ? (
    <Badge variant="active" className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 pointer-events-none">Active</Badge>
  ) : (
    <Badge variant="secondary" className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 text-zinc-500 pointer-events-none">Suspended</Badge>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

type ActiveTab = 'members' | 'authors';

export function UsersManager() {
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [activeTab, setActiveTab] = useState<ActiveTab>('members');
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = users.filter((u) =>
    u.display_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const members = filteredUsers.filter((u) => u.role === 'member');
  const authors = filteredUsers.filter((u) => u.role === 'author');

  // ── Request an action → opens the modal ──
  const requestAction = (type: ActionType, user: User) => {
    setPendingAction({ type, user });
  };

  const closeModal = () => setPendingAction(null);

  // ── Confirm → execute the action ──
  const confirmAction = () => {
    if (!pendingAction) return;
    const { type, user } = pendingAction;

    setUsers((prev) => prev.map((u) => {
      if (u.id !== user.id) return u;
      switch (type) {
        case 'promote': return { ...u, role: 'author' as UserRole, posts_count: 0 };
        case 'demote': return { ...u, role: 'member' as UserRole, posts_count: undefined };
        case 'suspend': return { ...u, status: 'suspended' as UserStatus };
        case 'reactivate': return { ...u, status: 'active' as UserStatus };
      }
    }));

    if (type === 'promote') setActiveTab('authors');
    if (type === 'demote') setActiveTab('members');

    console.log(`[UsersManager] Action confirmed: ${type} → ${user.display_name}`);
    closeModal();
  };

  // ── Shared cell renderers ──
  const userInfoCell = (row: User) => (
    <div className="flex items-center gap-3">
      <UserAvatar name={row.display_name} />
      <div className="flex flex-col gap-0.5">
        <span className="font-bold text-zinc-900 text-sm">{row.display_name}</span>
        <span className="text-xs text-zinc-400">{row.email}</span>
      </div>
    </div>
  );

  const joinedCell = (row: User) => (
    <span className="text-sm text-zinc-500">
      {new Date(row.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
    </span>
  );

  // ── Column Definitions ──
  const memberColumns: ColumnDef<User>[] = [
    { header: 'User', filterable: true, filterValue: (row) => `${row.display_name} ${row.email}`, cell: userInfoCell },
    { header: 'Joined', filterable: true, filterValue: (row) => row.created_at, cell: joinedCell },
    { header: 'Status', cell: (row) => <StatusBadge status={row.status} /> },
    {
      header: 'Actions',
      className: 'text-right',
      headerClassName: 'text-right',
      cell: (row) => (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="outline" size="sm"
            onClick={() => requestAction(row.status === 'active' ? 'suspend' : 'reactivate', row)}
            className={cn(
              'rounded-full text-[10px] font-bold uppercase tracking-widest h-8 px-4 shadow-none',
              row.status === 'active'
                ? 'text-zinc-400 hover:text-red-500 hover:border-red-300'
                : 'text-zinc-400 hover:text-[#0066FF] hover:border-[#0066FF]'
            )}
          >
            {row.status === 'active'
              ? <><UserX className="w-3 h-3 mr-1.5" />Suspend</>
              : <><UserCheck className="w-3 h-3 mr-1.5" />Reactivate</>}
          </Button>
          <Button
            variant="outline" size="sm"
            onClick={() => requestAction('promote', row)}
            className="rounded-full text-[10px] font-bold uppercase tracking-widest h-8 px-4 shadow-none text-zinc-400 hover:text-[#0066FF] hover:border-[#0066FF]"
          >
            <ShieldCheck className="w-3 h-3 mr-1.5" />Promote
          </Button>
        </div>
      ),
    },
  ];

  const authorColumns: ColumnDef<User>[] = [
    { header: 'User', filterable: true, filterValue: (row) => `${row.display_name} ${row.email}`, cell: userInfoCell },
    { header: 'Joined', filterable: true, filterValue: (row) => row.created_at, cell: joinedCell },
    {
      header: 'Posts',
      className: 'text-center',
      headerClassName: 'text-center',
      cell: (row) => (
        <div className="flex items-center justify-center gap-1.5">
          <Pen className="w-3 h-3 text-zinc-400" />
          <span className="font-medium text-zinc-500 text-sm">{row.posts_count ?? 0}</span>
        </div>
      ),
    },
    { header: 'Status', cell: (row) => <StatusBadge status={row.status} /> },
    {
      header: 'Actions',
      className: 'text-right',
      headerClassName: 'text-right',
      cell: (row) => (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="outline" size="sm"
            onClick={() => requestAction(row.status === 'active' ? 'suspend' : 'reactivate', row)}
            className={cn(
              'rounded-full text-[10px] font-bold uppercase tracking-widest h-8 px-4 shadow-none',
              row.status === 'active'
                ? 'text-zinc-400 hover:text-red-500 hover:border-red-300'
                : 'text-zinc-400 hover:text-[#0066FF] hover:border-[#0066FF]'
            )}
          >
            {row.status === 'active'
              ? <><UserX className="w-3 h-3 mr-1.5" />Suspend</>
              : <><UserCheck className="w-3 h-3 mr-1.5" />Reactivate</>}
          </Button>
          <Button
            variant="outline" size="sm"
            onClick={() => requestAction('demote', row)}
            className="rounded-full text-[10px] font-bold uppercase tracking-widest h-8 px-4 shadow-none text-zinc-400 hover:text-amber-500 hover:border-amber-300"
          >
            <ShieldMinus className="w-3 h-3 mr-1.5" />Demote
          </Button>
        </div>
      ),
    },
  ];

  // ── Modal config for the pending action ──
  const actionConfig = pendingAction ? ACTION_CONFIG[pendingAction.type] : null;

  return (
    <div className="space-y-6">
      {/* ── Confirmation Dialog ── */}
      <Dialog open={!!pendingAction} onOpenChange={(open) => { if (!open) closeModal(); }}>
        <DialogContent
          showCloseButton={false}
          className="rounded-3xl p-8 max-w-md border-0 ring-0 shadow-none bg-white"
        >
          {actionConfig && pendingAction && (
            <>
              <DialogHeader className="gap-3">
                {/* Icon accent */}
                <div className={cn(
                  'flex items-center justify-center w-12 h-12 rounded-2xl mb-1',
                  pendingAction.type === 'suspend' ? 'bg-red-50' :
                    pendingAction.type === 'demote' ? 'bg-amber-50' : 'bg-blue-50'
                )}>
                  <AlertTriangle className={cn(
                    'w-5 h-5',
                    pendingAction.type === 'suspend' ? 'text-red-500' :
                      pendingAction.type === 'demote' ? 'text-amber-500' : 'text-[#0066FF]'
                  )} />
                </div>
                <DialogTitle className="text-xl font-bold text-zinc-900">
                  {actionConfig.title}
                </DialogTitle>
                <DialogDescription className="text-sm text-zinc-500 leading-relaxed">
                  {actionConfig.description(pendingAction.user.display_name)}
                </DialogDescription>
              </DialogHeader>

              {/* User preview pill */}
              <div className="flex items-center gap-3 px-4 py-3 bg-zinc-50 rounded-2xl border border-zinc-100 mt-2">
                <UserAvatar name={pendingAction.user.display_name} />
                <div>
                  <p className="text-sm font-bold text-zinc-900">{pendingAction.user.display_name}</p>
                  <p className="text-xs text-zinc-400">{pendingAction.user.email}</p>
                </div>
              </div>

              {/* Action buttons — flat per DESIGN.md modal spec */}
              <div className="flex gap-3 w-full mt-8">
                <DialogPrimitive.Close
                  className="flex-1 inline-flex items-center justify-center rounded-full border border-zinc-200 bg-white px-6 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
                >
                  Cancel
                </DialogPrimitive.Close>
                <button
                  onClick={confirmAction}
                  className={cn(
                    'flex-1 inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-medium transition-colors',
                    actionConfig.confirmClass
                  )}
                >
                  {actionConfig.confirmLabel}
                </button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex justify-between w-full">
          {/* ── Search ── */}
          <div className="w-full max-w-sm">
            <Input
              placeholder="Search users..."
              icon={<Search size={16} />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* ── Tab Switcher ── */}
          <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-full w-fit">
            <button
              onClick={() => setActiveTab('members')}
              className={cn(
                'flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200',
                activeTab === 'members' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'
              )}
            >
              <Users className="w-3.5 h-3.5" />
              Members
              <span className={cn('text-[10px] font-bold px-1.5 py-0.5 rounded-full', activeTab === 'members' ? 'bg-[#0066FF] text-white' : 'bg-zinc-200 text-zinc-500')}>
                {members.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('authors')}
              className={cn(
                'flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200',
                activeTab === 'authors' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'
              )}
            >
              <Pen className="w-3.5 h-3.5" />
              Authors
              <span className={cn('text-[10px] font-bold px-1.5 py-0.5 rounded-full', activeTab === 'authors' ? 'bg-[#0066FF] text-white' : 'bg-zinc-200 text-zinc-500')}>
                {authors.length}
              </span>
            </button>
          </div>
        </div>

      </div>

      {/* ── Data Table ── */}
      {activeTab === 'members' ? (
        <DataTable key="members-table" columns={memberColumns} data={members} itemsPerPage={5} />
      ) : (
        <DataTable key="authors-table" columns={authorColumns} data={authors} itemsPerPage={5} />
      )}
    </div>
  );
}
