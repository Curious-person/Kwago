"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  FileText,
  Package,
  Users,
  MessageSquare,
  Layers,
  ShoppingBag,
  Folder,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { SidebarLink } from "./SidebarLink";
import { cn } from "@/lib/utils";
import { Button } from "../ui/Button";
import { useJournalStore } from "@/lib/store";

interface SidebarProps {
  isAdmin: boolean;
  isAuthor: boolean;
  role: string;
}

export const Sidebar = ({ isAdmin, isAuthor, role }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { isMobileSidebarOpen, setMobileSidebarOpen } = useJournalStore();
  const pathname = usePathname();

  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [pathname, setMobileSidebarOpen]);

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-zinc-900/40 z-40 md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 bg-white border-r border-zinc-200 flex flex-col pt-8 pb-6 px-4 transition-all duration-300 overflow-y-auto",
          "md:sticky md:top-[73px] md:h-[calc(100vh-73px)] md:z-auto",
          isMobileSidebarOpen ? "translate-x-0 w-56" : "-translate-x-full md:translate-x-0",
          isCollapsed ? "md:w-20 md:px-2" : "md:w-56",
        )}
      >
      {/* Role badge */}
      <div
        className={cn(
          "mb-6 px-2 flex justify-center",
          !isCollapsed && "justify-start",
        )}
      >
        <span
          className={cn(
            "inline-block rounded-full border border-zinc-200 px-3 py-0.5 text-xs font-medium text-zinc-500 capitalize transition-all",
            isCollapsed ? "px-1.5 text-[10px]" : "",
          )}
        >
          {isCollapsed ? role.charAt(0) : role}
        </span>
      </div>

      <nav className="flex flex-col gap-1 flex-1">
        {/* Author links */}
        {isAuthor && (
          <>
            <SidebarLink
              href="/dashboard/author/posts"
              icon={<FileText size={15} />}
              isCollapsed={isCollapsed}
            >
              My Posts
            </SidebarLink>
            <SidebarLink
              href="/dashboard/author/products"
              icon={<Package size={15} />}
              isCollapsed={isCollapsed}
            >
              My Products
            </SidebarLink>
            <SidebarLink
              href="/dashboard/author/categories"
              icon={<Folder size={15} />}
              isCollapsed={isCollapsed}
            >
              My Categories
            </SidebarLink>
            <SidebarLink
              href="/dashboard/author/sales"
              icon={<ShoppingBag size={15} />}
              isCollapsed={isCollapsed}
            >
              My Sales
            </SidebarLink>
          </>
        )}

        {/* Admin-only links */}
        {isAdmin && (
          <>
            <SidebarLink
              href="/dashboard/admin"
              icon={<LayoutGrid size={15} />}
              isCollapsed={isCollapsed}
            >
              Overview
            </SidebarLink>
            <SidebarLink
              href="/dashboard/admin/comments"
              icon={<MessageSquare size={15} />}
              isCollapsed={isCollapsed}
            >
              Comments
            </SidebarLink>
            <SidebarLink
              href="/dashboard/admin/posts"
              icon={<Layers size={15} />}
              isCollapsed={isCollapsed}
            >
              Review Posts
            </SidebarLink>
            <SidebarLink
              href="/dashboard/admin/products"
              icon={<Package size={15} />}
              isCollapsed={isCollapsed}
            >
              Review Products
            </SidebarLink>
            <SidebarLink
              href="/dashboard/admin/users"
              icon={<Users size={15} />}
              isCollapsed={isCollapsed}
            >
              Users
            </SidebarLink>
          </>
        )}
      </nav>

      {/* Collapse Toggle */}
      <div className="mt-auto pt-4 border-t border-zinc-100 hidden md:flex justify-center">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="rounded-full w-10 h-10 border-zinc-200 text-zinc-400 hover:text-zinc-900 hover:border-zinc-300 shadow-none transition-all"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </Button>
      </div>
    </aside>
  </>
);
};
