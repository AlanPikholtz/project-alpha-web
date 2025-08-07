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
      <div className="h-full flex flex-col gap-4">
        <Skeleton className="flex-1" />
        {withPagination && <Skeleton className="self-end w-117 h-8" />}
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="flex-1 min-h-0 relative overflow-hidden rounded-md border">
        <div className="h-full flex flex-col">
          {/* Fixed Header */}
          <div className="flex-shrink-0 sticky top-0 z-10 bg-white border-b">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead
                          key={header.id}
                          className={clsx(
                            (
                              header.column.columnDef.meta as {
                                className?: string;
                              }
                            )?.className
                          )}
                        >
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

          {/* Scrollable Body */}
          <div
            className={clsx(
              "flex-1 min-h-0 overflow-auto relative",
              tableBodyClassName
            )}
          >
            <Table>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      className={onRowClick && "cursor-pointer hover:bg-muted"}
                      data-state={row.getIsSelected() && "selected"}
                      onClick={() => onRowClick?.(row.original)}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          className={clsx(
                            (
                              cell.column.columnDef.meta as {
                                className?: string;
                              }
                            )?.className
                          )}
                          key={cell.id}
                        >
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
                      No se encontraron resultados.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            {/* Fetching overlay */}
            {fetching && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/10 z-10">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fixed Footer */}
      <div
        className={clsx("flex items-center flex-shrink-0", {
          "justify-end": !bottomLeftComponent,
          "justify-between": bottomLeftComponent !== undefined,
        })}
      >
        {bottomLeftComponent}
        {/* Pagination */}
        {withPagination && <TablePagination table={table} />}
      </div>
    </div>
  );
}
