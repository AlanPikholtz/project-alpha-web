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

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  table: TableInterface<TData>;
  withPagination?: boolean;
  bottomLeftComponent?: ReactNode;
  onRowClick?: (row: TData) => void;
}

export default function CustomTable<TData, TValue>({
  columns,
  table,
  withPagination,
  bottomLeftComponent,
  onRowClick,
}: DataTableProps<TData, TValue>) {
  return (
    <div className="flex flex-col gap-y-6">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
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
        </Table>
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
