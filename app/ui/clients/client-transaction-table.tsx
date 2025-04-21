import { Transaction } from "@/app/lib/transactions/types";
import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React, { useState } from "react";
import { DateRange } from "react-day-picker";
import DateRangeFilter from "../transactions/filters/date-range-filter";
import CustomTable from "../custom-table";
import { useParams } from "next/navigation";
import { useGetTransactionsQuery } from "@/app/lib/transactions/api";
import useExcel from "@/app/hooks/useExcel";
import { Button } from "@/components/ui/button";
import { transactionTypeToString } from "@/app/lib/transactions/helpers";
import _ from "lodash";

const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "date",
    header: "Fecha/Hora",
    cell: ({ row }) => {
      const formatted = new Date(row.getValue("date")).toLocaleString("es-AR");
      return formatted;
    },
  },
  {
    accessorKey: "type",
    header: "Tipo",
    cell: ({ row }) => {
      return _.capitalize(transactionTypeToString(row.getValue("type")));
    },
  },
];

export default function ClientTransactionTable() {
  const { id } = useParams(); // Get the dynamic ID from the URL
  const { exportToExcel } = useExcel();

  // Filters
  const [dateRange, setDateRange] = useState<DateRange>();
  // Pagination
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);

  const { data: transactions } = useGetTransactionsQuery({
    clientId: id as unknown as number,
    page: pageIndex + 1, // Current page
    limit: pageSize, // Amount of pages
    from: dateRange?.from?.toISOString(),
    to: dateRange?.to?.toISOString(),
  });

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const table = useReactTable({
    data: transactions?.data || [],
    columns,
    pageCount: transactions?.pages,
    state: {
      columnFilters,
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    manualPagination: true,
    manualFiltering: true,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onPaginationChange: (updater) => {
      const newPagination =
        typeof updater === "function"
          ? updater({ pageIndex, pageSize })
          : updater;
      setPageIndex(newPagination.pageIndex);
      setPageSize(newPagination.pageSize);
    },
  });

  const handleExcelExport = () => {
    if (!transactions || transactions.data.length === 0) return;
    exportToExcel(transactions?.data, "Clientes");
  };

  return (
    <div className="flex flex-col gap-y-6.5">
      {/* Filters */}
      <DateRangeFilter dateRange={dateRange} setDateRange={setDateRange} />
      {/* Table */}
      <CustomTable columns={columns} table={table} withPagination />
      {/* Export button */}
      <Button className="self-start" onClick={handleExcelExport}>
        Exportar
      </Button>
    </div>
  );
}
