"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface SidebarLinkProps {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isCollapsed?: boolean;
}

export const SidebarLink = ({
  href,
  icon,
  children,
  isCollapsed,
}: SidebarLinkProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      title={
        isCollapsed
          ? typeof children === "string"
            ? children
            : undefined
          : undefined
      }
      className={cn(
        "flex items-center gap-2.5 rounded-full px-3 py-2 text-sm transition-all duration-200",
        isCollapsed ? "justify-center px-0 w-10 h-10 mx-auto" : "",
        isActive
          ? "bg-[#0066FF] text-white font-bold"
          : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900",
      )}
    >
      <span
        className={cn(
          isActive ? "text-white" : "text-zinc-400",
          isCollapsed ? "mr-0" : "",
        )}
      >
        {icon}
      </span>
      {!isCollapsed && children}
    </Link>
  );
};
