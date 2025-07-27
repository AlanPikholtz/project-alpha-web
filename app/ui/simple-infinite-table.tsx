import React, { ReactNode, useCallback, useRef, useEffect } from "react";
import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  flexRender,
  RowSelectionState,
} from "@tanstack/react-table";

import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import clsx from "clsx";

interface SimpleInfiniteTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  loading?: boolean;
  loadingMore?: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  total?: number;
  onRowClick?: (row: TData) => void;
  bottomLeftComponent?: ReactNode;
  rowSelection?: RowSelectionState;
  onRowSelectionChange?: (
    updater: RowSelectionState | ((old: RowSelectionState) => RowSelectionState)
  ) => void;
}

export default function SimpleInfiniteTable<TData, TValue>({
  columns,
  data,
  loading,
  loadingMore,
  hasMore,
  onLoadMore,
  total,
  onRowClick,
  bottomLeftComponent,
  rowSelection = {},
  onRowSelectionChange,
}: SimpleInfiniteTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    enableRowSelection: true,
    state: {
      rowSelection,
    },
    onRowSelectionChange,
  });

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false);

  // Simple scroll-based infinite loading
  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container || !hasMore || loadingRef.current || loadingMore) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const threshold = 800; // Load when 800px from bottom

    if (scrollHeight - scrollTop - clientHeight < threshold) {
      loadingRef.current = true;
      onLoadMore();

      // Reset loading flag after a short delay
      setTimeout(() => {
        loadingRef.current = false;
      }, 1000);
    }
  }, [hasMore, loadingMore, onLoadMore]);

  // Attach scroll listener
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  // Loading skeleton for initial load
  if (loading) {
    return (
      <div className="h-full flex flex-col gap-4">
        <Skeleton className="w-full flex-1" />
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

          {/* Scrollable Body with infinite scroll */}
          <div
            ref={scrollContainerRef}
            className="flex-1 min-h-0 overflow-auto"
          >
            <Table>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  <>
                    {table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                        className={onRowClick ? "cursor-pointer" : ""}
                        onClick={() => onRowClick?.(row.original)}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell
                            key={cell.id}
                            className={clsx(
                              (
                                cell.column.columnDef.meta as {
                                  className?: string;
                                }
                              )?.className
                            )}
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}

                    {/* Loading indicator at the bottom */}
                    {loadingMore && (
                      <TableRow>
                        <TableCell
                          colSpan={columns.length}
                          className="h-16 text-center"
                        >
                          <div className="flex items-center justify-center">
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            <span>Cargando más datos...</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No hay resultados.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Fixed Counter Section */}
      <div className="flex items-center justify-between flex-shrink-0">
        {bottomLeftComponent && <div>{bottomLeftComponent}</div>}

        <div className="flex items-center gap-4 ml-auto">
          <div className="text-sm text-muted-foreground">
            {total
              ? `Mostrando ${data.length} de ${total} resultados`
              : `${data.length} resultados`}
            {hasMore && " (desplázate para cargar más)"}
          </div>
        </div>
      </div>
    </div>
  );
}
