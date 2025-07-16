"use client";

import React, { useEffect, useMemo, useState } from "react";
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
import { assignedOptions } from "@/app/lib/transactions/data";
import AssignClientModal from "./assign-client-modal";
import { formatDate, formatNumber } from "@/app/lib/helpers";
import { useAccountId } from "@/app/context/account-provider";
import DeleteTransactionsModal from "./delete-transactions-modal";
import AssignClientDropdown from "./assign_client_dropdown/assign-client-dropdown";

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
    meta: { className: "w-10" },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "date",
    header: "Fecha/Hora",
    cell: ({ row }) => {
      const formatted = formatDate(row.getValue("date"));
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
      return formatNumber(amount, { style: "currency", currency: "ARS" });
    },
  },
];

export default function TransactionsTable() {
  const { selectedAccountId } = useAccountId();
  // Filters
  const [amountFilter, setAmountFilter] = useState<string>("");
  const [debouncedAmountFilter, setDebouncedAmountFilter] =
    useState<string>("");

  const [statusFilter, setStatusFilter] = useState<
    TransactionStatus | undefined
  >(assignedOptions[0].value as TransactionStatus | undefined);
  const [dateRange, setDateRange] = useState<DateRange>();
  // Pagination
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);

  const {
    data: transactions,
    isLoading: loadingTransactions,
    isFetching: fetchingTransactions,
  } = useGetTransactionsQuery(
    {
      accountId: selectedAccountId,
      ...(debouncedAmountFilter !== "" && { amount: +debouncedAmountFilter }),
      status: statusFilter,
      page: pageIndex + 1, // Current page
      limit: pageSize, // Amount of pages
      from: dateRange?.from?.toISOString(),
      to: dateRange?.to?.toISOString(),
      sort: "date",
    },
    {
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
      refetchOnReconnect: true,
      skip: !selectedAccountId,
    }
  );

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const dynamicColumns = useMemo(() => {
    const dynamicCols = [...columns];
    dynamicCols.push({
      accessorKey: "clientFullName",
      header: "Cliente",
      cell: ({ row }) => {
        return <AssignClientDropdown transaction={row.original} />;
      },
    });
    return dynamicCols;
  }, []);

  const table = useReactTable({
    data: transactions?.data || [],
    columns: dynamicColumns,
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

  // Amount Search
  useEffect(() => {
    const handler = _.debounce((value: string) => {
      setDebouncedAmountFilter(value);
    }, 400); // 400ms debounce

    handler(amountFilter);

    // Cancelar debounce si el componente se desmonta o cambia
    return () => {
      handler.cancel();
    };
  }, [amountFilter]);

  // Reset page on filters change
  useEffect(() => {
    setPageIndex(0);
  }, [debouncedAmountFilter, statusFilter, dateRange]);

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
        loading={loadingTransactions}
        fetching={fetchingTransactions}
        bottomLeftComponent={
          <div className="flex items-center gap-4">
            {table.getFilteredSelectedRowModel().rows.length > 0 && (
              <AssignClientModal
                transactions={table
                  .getFilteredSelectedRowModel()
                  .rows.map((row) => row.original)}
                onSuccessAssign={() => table.resetRowSelection()}
              />
            )}
            {table.getFilteredSelectedRowModel().rows.length > 0 &&
              table
                .getFilteredSelectedRowModel()
                .rows.every((row) => row.original.clientId === null) && (
                <DeleteTransactionsModal
                  transactions={table
                    .getFilteredSelectedRowModel()
                    .rows.map((row) => row.original)}
                  onSuccessDelete={() => table.resetRowSelection()}
                />
              )}
          </div>
        }
      />
    </div>
  );
}
