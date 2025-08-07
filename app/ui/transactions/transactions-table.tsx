"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import { ColumnDef, RowSelectionState } from "@tanstack/react-table";

import { Input } from "@/components/ui/input";
import { Checkbox } from "../../../components/ui/checkbox";

import { DateRange } from "react-day-picker";
import DateRangeFilter from "./filters/date-range-filter";
import StatusFilter from "./filters/status-filter";
import SimpleInfiniteTable from "../simple-infinite-table";
import {
  Transaction,
  TransactionStatus,
  SortBy,
} from "@/app/lib/transactions/types";
import {
  useMinimalInfinite,
  FetchPageFn,
} from "@/app/hooks/use-minimal-infinite";
import { useLazyGetTransactionsQuery } from "@/app/lib/transactions/api";
import { transactionTypeToString } from "@/app/lib/transactions/helpers";
import _ from "lodash";
import { assignedOptions } from "@/app/lib/transactions/data";
import { formatDate, formatNumber } from "@/app/lib/helpers";
import { useAccountId } from "@/app/context/account-provider";
import AssignClientDropdown from "./assign_client_dropdown/assign-client-dropdown";
import AssignClientModal from "./assign-client-modal";
import DeleteTransactionsModal from "./delete-transactions-modal";

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
  const { selectedAccountId, loadingAccounts } = useAccountId();

  // Filters
  const [amountFilter, setAmountFilter] = useState<string>("");
  const [debouncedAmountFilter, setDebouncedAmountFilter] =
    useState<string>("");
  const [statusFilter, setStatusFilter] = useState<
    TransactionStatus | undefined
  >(assignedOptions[0].value as TransactionStatus | undefined);
  const [dateRange, setDateRange] = useState<DateRange>();

  // Row selection state
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  // Amount Search debouncing
  useEffect(() => {
    const handler = _.debounce((value: string) => {
      setDebouncedAmountFilter(value);
    }, 400);

    handler(amountFilter);

    return () => {
      handler.cancel();
    };
  }, [amountFilter]);

  // Create lazy query trigger - like your React Native pattern
  const [fetchTransactions] = useLazyGetTransactionsQuery();

  // Create fetchPage function - similar to your getSubCollections
  const fetchPage: FetchPageFn<Transaction> = useCallback(
    async (params) => {
      console.log("🔥 fetchPage called with:", params);

      const result = await fetchTransactions({
        page: params.page,
        limit: params.limit,
        accountId: params.accountId as number,
        ...(params.amount ? { amount: params.amount as number } : {}),
        status: params.status as TransactionStatus,
        from: params.from as string,
        to: params.to as string,
        sort: params.sort as SortBy,
      }).unwrap();

      return result;
    },
    [fetchTransactions]
  );

  // Use the new React Native-style infinite hook
  const {
    data: transactions,
    loading,
    loadingMore,
    hasMore,
    total,
    error,
    loadMore,
    optimisticUpdate,
    optimisticDelete,
  } = useMinimalInfinite<Transaction>(
    fetchPage,
    {
      accountId: selectedAccountId,
      ...(debouncedAmountFilter !== "" && { amount: +debouncedAmountFilter }),
      status: statusFilter,
      from: dateRange?.from?.toISOString(),
      to: dateRange?.to?.toISOString(),
      sort: "date",
    },
    { pageSize: 25 }
  ); // Optimized for complex interactions & components

  // Smart optimistic functions that consider current filter
  const smartOptimisticUpdate = useCallback(
    (
      id: number | string,
      updater: (item: Transaction) => Transaction,
      isAssigning: boolean = true
    ) => {
      const transaction = transactions.find((t) => t.id === id);
      if (!transaction) return;

      if (statusFilter === "unassigned" && isAssigning) {
        // Assigning client while filtering unassigned -> remove from view
        console.log(
          "🎯 Transaction assigned while filtering 'unassigned' - removing from view"
        );
        optimisticDelete(id);
      } else if (statusFilter === "assigned" && !isAssigning) {
        // Unassigning client while filtering assigned -> remove from view
        console.log(
          "🎯 Transaction unassigned while filtering 'assigned' - removing from view"
        );
        optimisticDelete(id);
      } else {
        // Normal update for other cases
        optimisticUpdate(id, updater);
      }
    },
    [statusFilter, optimisticUpdate, optimisticDelete, transactions]
  );

  const dynamicColumns = useMemo(() => {
    const dynamicCols = [...columns];
    dynamicCols.push({
      accessorKey: "clientFullName",
      header: "Cliente",
      cell: ({ row }) => {
        return (
          <AssignClientDropdown
            transaction={row.original}
            onOptimisticUpdate={smartOptimisticUpdate}
            onOptimisticDelete={optimisticDelete}
            statusFilter={statusFilter}
          />
        );
      },
    });
    return dynamicCols;
  }, [smartOptimisticUpdate, optimisticDelete, statusFilter]);

  // Get selected transactions
  const selectedTransactions = useMemo(() => {
    return transactions.filter((_, index) => rowSelection[index]);
  }, [transactions, rowSelection]);

  // Handle successful bulk assign
  const handleSuccessAssign = useCallback(() => {
    setRowSelection({});
    // No refresh needed - optimistic updates already handled the data changes
  }, []);

  // Handle successful bulk delete
  const handleSuccessDelete = useCallback(() => {
    setRowSelection({});
    // No refresh needed - optimistic updates already handled the data changes
  }, []);

  return (
    <div className="h-full flex flex-col gap-y-6">
      {/* Filters */}
      <div className="flex gap-4 justify-between items-center py-4 flex-shrink-0">
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
      <div className="flex-1 min-h-0">
        <SimpleInfiniteTable
          columns={dynamicColumns}
          data={transactions}
          loading={loadingAccounts || loading}
          loadingMore={loadingMore}
          hasMore={hasMore}
          onLoadMore={loadMore}
          total={total}
          rowSelection={rowSelection}
          onRowSelectionChange={setRowSelection}
          bottomLeftComponent={
            <div className="flex items-center gap-4">
              {selectedTransactions.length > 0 && (
                <AssignClientModal
                  transactions={selectedTransactions}
                  onSuccessAssign={handleSuccessAssign}
                  onOptimisticUpdate={smartOptimisticUpdate}
                />
              )}
              {selectedTransactions.length > 0 &&
                selectedTransactions.every(
                  (t) => !t.clientId || t.clientId === 0
                ) && (
                  <DeleteTransactionsModal
                    transactions={selectedTransactions}
                    onSuccessDelete={handleSuccessDelete}
                    onOptimisticDelete={optimisticDelete}
                  />
                )}
              {error && (
                <div className="text-red-500 text-sm">Error cargando datos</div>
              )}
            </div>
          }
        />
      </div>
    </div>
  );
}
