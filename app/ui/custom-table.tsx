import React, { ReactNode } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  ColumnDef,
  flexRender,
  Table as TableInterface,
} from "@tanstack/react-table";
import { TablePagination } from "./table-pagination";
import clsx from "clsx";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DataTableProps<TData, TValue> {
  tableBodyClassName?: string;
  columns: ColumnDef<TData, TValue>[];
  table: TableInterface<TData>;
  withPagination?: boolean;
  bottomLeftComponent?: ReactNode;
  loading?: boolean;
  fetching?: boolean;
  onRowClick?: (row: TData) => void;
}

export default function CustomTable<TData, TValue>({
  tableBodyClassName,
  columns,
  table,
  withPagination,
  bottomLeftComponent,
  loading, // Lets show skeleton on this case
  fetching, // We will use it to handle some overlay over the table
  onRowClick,
}: DataTableProps<TData, TValue>) {
  if (loading) {
    return (
      <div className="flex flex-col gap-y-6">
        <Skeleton className="w-full h-110" />
        {withPagination ? <Skeleton className="self-end w-117 h-8" /> : null}
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-y-6">
      <div className="relative overflow-hidden rounded-md border">
        <div className="sticky top-0 z-10 bg-white">
          <Table>
            <TableHeader className="sticky top-0">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
          </Table>
        </div>
        <ScrollArea className={clsx("w-full h-full", tableBodyClassName)}>
          <Table>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className={onRowClick && "cursor-pointer hover:bg-muted"} // This will just add a pointer mouse when we are enable to click
                    data-state={row.getIsSelected() && "selected"}
                    onClick={() => onRowClick?.(row.original)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>

            {fetching ? (
              <div className="absolute top-0 flex items-center justify-center right-0 left-0 bottom-0 z-10 bg-black/10">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            ) : null}
          </Table>
        </ScrollArea>
      </div>

      <div
        className={clsx("flex items-center", {
          "justify-end": !bottomLeftComponent,
          "justify-between": bottomLeftComponent !== undefined,
        })}
      >
        {bottomLeftComponent}
        {/* Pagination */}
        {withPagination ? <TablePagination table={table} /> : null}
      </div>
    </div>
  );
}
