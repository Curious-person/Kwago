"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
import {
  getUsersAction,
  promoteUserAction,
  demoteUserAction,
  suspendUserAction,
  reactivateUserAction,
} from './actions';
import type {
  User,
  UserQueryFilters,
  PaginationParams,
  ErrorResponse,
} from '@/lib/services/userService';

// ─── Types ───────────────────────────────────────────────────────────────────

type UserRole = 'member' | 'author';
type UserStatus = 'active' | 'suspended';
type ActionType = 'promote' | 'demote' | 'suspend' | 'reactivate';

interface PendingAction {
  type: ActionType;
  user: User;
}

// ─── Action config (copy + colors per action type) ────────────────────────────

const ACTION_CONFIG: Record<
  ActionType,
  {
    title: string;
    description: (name: string | null) => string;
    confirmLabel: string;
    confirmClass: string;
  }
> = {
  promote: {
    title: 'Promote to Author',
    description: (name) =>
      `${name || 'This user'} will gain the ability to publish blog posts and manage their own content. This can be undone at any time.`,
    confirmLabel: 'Yes, Promote',
    confirmClass: 'bg-[#0066FF] text-white hover:bg-[#0052CC]',
  },
  demote: {
    title: 'Demote to Member',
    description: (name) =>
      `${name || 'This user'} will lose author privileges and can no longer publish or edit posts. Their existing posts will remain intact.`,
    confirmLabel: 'Yes, Demote',
    confirmClass: 'bg-amber-500 text-white hover:bg-amber-600',
  },
  suspend: {
    title: 'Suspend Account',
    description: (name) =>
      `${name || 'This user'}'s account will be suspended. They will not be able to log in or interact with the platform until reactivated.`,
    confirmLabel: 'Yes, Suspend',
    confirmClass: 'bg-red-500 text-white hover:bg-red-600',
  },
  reactivate: {
    title: 'Reactivate Account',
    description: (name) =>
      `${name || 'This user'}'s account will be reactivated and they will regain full access to the platform.`,
    confirmLabel: 'Yes, Reactivate',
    confirmClass: 'bg-[#0066FF] text-white hover:bg-[#0052CC]',
  },
};



// ─── Sub-components ───────────────────────────────────────────────────────────

function UserAvatar({ name }: { name: string | null }) {
  const initials = (name || 'U')
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
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
  // ── State Management ──
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ErrorResponse | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('members');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<UserQueryFilters>({});
  const [pagination, setPagination] = useState<PaginationParams>({ page: 1, limit: 10 });
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);

  // ── Initial Data Fetch ──
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);

      const queryFilters: UserQueryFilters = {
        ...filters,
        sortOrder,
      };

      const result = await getUsersAction(queryFilters, pagination);

      if (result.success) {
        setUsers(result.data.data);
      } else {
        setError(result as ErrorResponse);
        console.error('[UsersManager] Error fetching users:', (result as any).error);
      }

      setLoading(false);
    };

    fetchUsers();
  }, [filters, pagination, sortOrder]);

  // ── Filter users based on active tab and search ──
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesTab = activeTab === 'members' ? u.role === 'member' : u.role === 'author';
      const matchesSearch = searchQuery === '' ||
        (u.display_name?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [users, activeTab, searchQuery]);

  const members = useMemo(() => filteredUsers.filter((u) => u.role === 'member'), [filteredUsers]);
  const authors = useMemo(() => filteredUsers.filter((u) => u.role === 'author'), [filteredUsers]);

  // ── Memoized callbacks ──
  const requestAction = useCallback((type: ActionType, user: User) => {
    setPendingAction({ type, user });
  }, []);

  const closeModal = useCallback(() => setPendingAction(null), []);

  const handleTabSwitch = useCallback((tab: ActiveTab) => {
    setActiveTab(tab);
    // Don't filter by role in the query - fetch all users and filter client-side
    setFilters((prev) => ({ ...prev, role: undefined }));
    setPagination({ page: 1, limit: 10 });
  }, []);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setFilters((prev) => ({ ...prev, search: query || undefined }));
    setPagination({ page: 1, limit: 10 });
  }, []);

  // ── Confirm → execute the action ──
  const confirmAction = async () => {
    if (!pendingAction) return;
    const { type, user } = pendingAction;

    try {
      let result;
      switch (type) {
        case 'promote':
          result = await promoteUserAction(user.id);
          break;
        case 'demote':
          result = await demoteUserAction(user.id);
          break;
        case 'suspend':
          result = await suspendUserAction(user.id);
          break;
        case 'reactivate':
          result = await reactivateUserAction(user.id);
          break;
      }

      if (result.success) {
        // Update local state with the updated user
        setUsers((prev) =>
          prev.map((u) => (u.id === result.data.id ? result.data : u))
        );

        // Move to appropriate tab if role changed
        if (type === 'promote') {
          handleTabSwitch('authors');
        } else if (type === 'demote') {
          handleTabSwitch('members');
        }

        console.log(`[UsersManager] Action confirmed: ${type} → ${user.display_name}`);
      } else {
        setError(result as ErrorResponse);
        console.error(`[UsersManager] Action failed: ${type}`, result.error);
      }
    } catch (err) {
      console.error(`[UsersManager] Error executing action: ${type}`, err);
      setError({
        success: false,
        error: {
          code: 'UNKNOWN_ERROR',
          message: 'An unexpected error occurred. Please try again later.',
        },
      });
    }

    closeModal();
  };

  // ── Shared cell renderers ──
  const userInfoCell = useCallback((row: User) => (
    <div className="flex items-center gap-3">
      <UserAvatar name={row.display_name || 'User'} />
      <div className="flex flex-col gap-0.5">
        <span className="font-bold text-zinc-900 text-sm">{row.display_name || 'Unknown'}</span>
        <span className="text-xs text-zinc-400">{row.email}</span>
      </div>
    </div>
  ), []);

  const joinedCell = useCallback((row: User) => (
    <span className="text-sm text-zinc-500">
      {new Date(row.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
    </span>
  ), []);

  // ── Column Definitions ──
  const memberColumns: ColumnDef<User>[] = useMemo(() => [
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
  ], [requestAction]);

  const authorColumns: ColumnDef<User>[] = useMemo(() => [
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
  ], [requestAction]);

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
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>

          {/* ── Tab Switcher ── */}
          {/* Calculate counts from all users, not filtered */}
          {(() => {
            const memberCount = users.filter((u) => u.role === 'member').length;
            const authorCount = users.filter((u) => u.role === 'author').length;
            return (
              <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-full w-fit">
                <button
                  onClick={() => handleTabSwitch('members')}
                  className={cn(
                    'flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200',
                    activeTab === 'members' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'
                  )}
                >
                  <Users className="w-3.5 h-3.5" />
                  Members
                  <span className={cn('text-[10px] font-bold px-1.5 py-0.5 rounded-full', activeTab === 'members' ? 'bg-[#0066FF] text-white' : 'bg-zinc-200 text-zinc-500')}>
                    {memberCount}
                  </span>
                </button>
                <button
                  onClick={() => handleTabSwitch('authors')}
                  className={cn(
                    'flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200',
                    activeTab === 'authors' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'
                  )}
                >
                  <Pen className="w-3.5 h-3.5" />
                  Authors
                  <span className={cn('text-[10px] font-bold px-1.5 py-0.5 rounded-full', activeTab === 'authors' ? 'bg-[#0066FF] text-white' : 'bg-zinc-200 text-zinc-500')}>
                    {authorCount}
                  </span>
                </button>
              </div>
            );
          })()}
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
