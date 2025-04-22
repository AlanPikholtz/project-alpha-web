"use client";

import React, { useState } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Input } from "@/components/ui/input";
import { Checkbox } from "../../../components/ui/checkbox";

import { DateRange } from "react-day-picker";
import DateRangeFilter from "./filters/date-range-filter";
import StatusFilter from "./filters/status-filter";
import CustomTable from "../custom-table";
import { Transaction, TransactionStatus } from "@/app/lib/transactions/types";
import { useGetTransactionsQuery } from "@/app/lib/transactions/api";
import { transactionTypeToString } from "@/app/lib/transactions/helpers";
import _ from "lodash";
import { Button } from "@/components/ui/button";
import { assignedOptions } from "@/app/lib/transactions/data";
import AssignClientModal from "./assign-client-modal";

const columns: ColumnDef<Transaction>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
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
  {
    accessorKey: "amount",
    header: "Monto",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("es-AR", {
        // Argetina formatting
        style: "currency",
        currency: "ARS",
      }).format(amount);

      return formatted;
    },
  },
  {
    accessorKey: "clientFullName",
    header: "Cliente",
    cell: ({ row }) => {
      const clientId = row.getValue("clientFullName");
      return clientId || "Sin asignar";
    },
  },
];

export default function TransactionsTable() {
  // Filters
  const [amountFilter, setAmountFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<
    TransactionStatus | undefined
  >(assignedOptions[0].value as TransactionStatus | undefined);
  const [dateRange, setDateRange] = useState<DateRange>();
  // Pagination
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);

  const { data: transactions } = useGetTransactionsQuery(
    {
      page: pageIndex + 1, // Current page
      limit: pageSize, // Amount of pages
      amount: +amountFilter,
      status: statusFilter,
      from: dateRange?.from?.toISOString(),
      to: dateRange?.to?.toISOString(),
    },
    {
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
      refetchOnReconnect: true,
    }
  );

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

  const handleTransactionsAssignment = async () => {
    try {
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="flex flex-col gap-y-6.5">
      {/* Filters */}
      <div className="flex gap-4 justify-between items-center py-4">
        <DateRangeFilter dateRange={dateRange} setDateRange={setDateRange} />
        <Input
          className="max-w-sm"
          placeholder="Buscar monto"
          value={amountFilter}
          onChange={(e) => setAmountFilter(e.target.value)}
        />
        <StatusFilter status={statusFilter} setStatus={setStatusFilter} />
      </div>
      {/* Table */}
      <CustomTable
        columns={columns}
        table={table}
        withPagination
        bottomLeftComponent={
          table.getFilteredSelectedRowModel().rows.length > 0 && (
            <AssignClientModal
              transactionsAmount={
                table.getFilteredSelectedRowModel().rows.length
              }
            />
          )
        }
      />
    </div>
  );
}
