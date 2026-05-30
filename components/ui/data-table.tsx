"use client";

import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/Button";
import { ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export interface ColumnDef<T> {
  header: React.ReactNode;
  accessorKey?: keyof T;
  cell?: (row: T) => React.ReactNode;
  filterable?: boolean; // Using 'filterable' as 'sortable' to maintain compatibility
  filterValue?: (row: T) => string;
  className?: string;
  headerClassName?: string;
}

interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  itemsPerPage?: number;
}

type SortDirection = "asc" | "desc" | "newest" | null;

export function DataTable<T>({
  columns,
  data,
  itemsPerPage = 5,
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{
    colIndex: number;
    direction: SortDirection;
  } | null>(null);

  // 1. Sort Data
  const sortedData = useMemo(() => {
    let sortableData = [...data];
    if (sortConfig !== null && sortConfig.direction !== null) {
      sortableData.sort((a, b) => {
        const col = columns[sortConfig.colIndex];
        let valA: any = "";
        let valB: any = "";

        if (col.filterValue) {
          valA = col.filterValue(a);
          valB = col.filterValue(b);
        } else if (col.accessorKey) {
          valA = a[col.accessorKey];
          valB = b[col.accessorKey];
        }

        // Handle 'newest first' by attempting date parse, fallback to desc string sort
        if (sortConfig.direction === "newest") {
          const dateA = new Date(valA).getTime();
          const dateB = new Date(valB).getTime();
          if (!isNaN(dateA) && !isNaN(dateB)) {
            return dateB - dateA;
          }
          return valA < valB ? 1 : -1;
        }

        if (valA < valB) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (valA > valB) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableData;
  }, [data, columns, sortConfig]);

  // 2. Paginate Data
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(start, start + itemsPerPage);
  }, [sortedData, currentPage, itemsPerPage]);

  const handleSort = (colIndex: number, direction: SortDirection) => {
    setSortConfig({ colIndex, direction });
    setCurrentPage(1); // Reset to first page on sort
  };

  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-zinc-100 overflow-hidden bg-white shadow-none">
        <Table>
          <TableHeader className="bg-zinc-50/50">
            <TableRow className="hover:bg-transparent border-zinc-100">
              {columns.map((col, idx) => (
                <TableHead
                  key={idx}
                  className={cn(
                    "py-4 px-8 text-zinc-400 font-bold uppercase tracking-widest text-[10px]",
                    col.headerClassName,
                  )}
                >
                  <div
                    className={cn(
                      "flex items-center gap-2",
                      col.headerClassName?.includes("text-right")
                        ? "justify-end"
                        : "",
                    )}
                  >
                    <span>{col.header}</span>
                    {col.filterable && (
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 rounded-full hover:bg-zinc-200/50 p-0"
                            />
                          }
                        >
                          <ArrowUpDown className="h-3 w-3" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="start"
                          className="w-40 rounded-2xl"
                        >
                          <DropdownMenuItem
                            onClick={() => handleSort(idx, "asc")}
                            className="text-xs rounded-xl cursor-pointer"
                          >
                            Filter Ascending
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleSort(idx, "desc")}
                            className="text-xs rounded-xl cursor-pointer"
                          >
                            Filter Descending
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleSort(idx, "newest")}
                            className="text-xs rounded-xl cursor-pointer"
                          >
                            Newest First
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rowIndex) => (
                <TableRow
                  key={rowIndex}
                  className="hover:bg-zinc-50/50 border-zinc-100 transition-colors group"
                >
                  {columns.map((col, colIndex) => (
                    <TableCell
                      key={colIndex}
                      className={cn("py-5 px-8", col.className)}
                    >
                      {col.cell
                        ? col.cell(row)
                        : col.accessorKey
                          ? String(row[col.accessorKey])
                          : null}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="py-12 text-center text-sm text-zinc-500"
                >
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center gap-2">
            {currentPage > 1 && (
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="text-zinc-900 hover:opacity-70 transition-opacity p-2"
              >
                <ChevronLeft size={20} strokeWidth={2} />
              </button>
            )}

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={cn(
                  "flex items-center justify-center w-10 h-10 text-[15px] font-medium transition-colors",
                  currentPage === page
                    ? "bg-[#0066FF] text-white rounded-2xl"
                    : "text-zinc-900 hover:text-zinc-600",
                )}
              >
                {page}
              </button>
            ))}

            {currentPage < totalPages && (
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                className="text-zinc-900 hover:opacity-70 transition-opacity p-2 ml-1"
              >
                <ChevronRight size={20} strokeWidth={2} />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
