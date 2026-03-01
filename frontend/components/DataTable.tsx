"use client";

import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { LevelBadge } from "@/components/Badge";
import type { LogEntry } from "@/types";
import { cn } from "@/lib/cn";

// reusable table component with sorting and pagination
interface DataTableProps<TData> {
  columns: ColumnDef<TData>[]
  data: TData[]
  pagination?: boolean
  sorting?: boolean
}

export function DataTable<TData>({
  columns,
  data,
  pagination = true,
  sorting = true,
}: DataTableProps<TData>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: pagination ? getPaginationRowModel() : undefined,
    getSortedRowModel: sorting ? getSortedRowModel() : undefined,
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-border">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row, idx) => (
              <tr
                key={row.id}
                className={cn(
                  "border-b border-border/60 hover:bg-accent/40 transition-colors",
                  idx % 2 === 0 && "bg-background"
                )}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-6 py-4 text-sm">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div className="flex items-center justify-between border-t border-border/60 px-6 py-4">
          <div className="text-sm text-muted-foreground">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft size={16} />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}

// table columns - what info to show for each log
const defaultLogColumns: ColumnDef<LogEntry>[] = [
  {
    accessorKey: "timestamp",
    header: "Time",
    cell: (info) => new Date(info.getValue<string>()).toLocaleTimeString(),
  },
  {
    accessorKey: "service",
    header: "Service",
    cell: (info) => (
      <span className="font-medium text-primary">{info.getValue<string>()}</span>
    ),
  },
  {
    accessorKey: "level",
    header: "Level",
    cell: (info) => <LevelBadge level={info.getValue<LogEntry["level"]>()} />,
  },
  {
    accessorKey: "endpoint",
    header: "Endpoint",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: (info) => {
      const status = info.getValue<number>();
      const color =
        status < 300
          ? "text-green-400"
          : status < 400
            ? "text-blue-400"
            : status < 500
              ? "text-yellow-400"
              : "text-red-400";
      return <span className={cn("font-mono font-semibold", color)}>{status}</span>;
    },
  },
  {
    accessorKey: "latency_ms",
    header: "Latency",
    cell: (info) => `${info.getValue<number>()} ms`,
  },
];

export function LogsTable({ logs }: { logs: LogEntry[] }) {
  return <DataTable columns={defaultLogColumns} data={logs} />;
}
