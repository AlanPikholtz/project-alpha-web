"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";

import { Input } from "@/components/ui/input";
import { Checkbox } from "../../../components/ui/checkbox";

import { DateRange } from "react-day-picker";
import DateRangeFilter from "./filters/date-range-filter";
import StatusFilter from "./filters/status-filter";
import SimpleInfiniteTable from "../simple-infinite-table";
import { Transaction, TransactionStatus } from "@/app/lib/transactions/types";
import { useMinimalInfinite } from "@/app/hooks/use-minimal-infinite";
import { useGetTransactionsQuery } from "@/app/lib/transactions/api";
import { transactionTypeToString } from "@/app/lib/transactions/helpers";
import _ from "lodash";
import { assignedOptions } from "@/app/lib/transactions/data";
import { formatDate, formatNumber } from "@/app/lib/helpers";
import { useAccountId } from "@/app/context/account-provider";
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

  // Use the new MINIMAL infinite scroll
  const {
    data: transactions,
    loading,
    loadingMore,
    hasMore,
    total,
    loadMore,
  } = useMinimalInfinite<
    Transaction,
    Parameters<typeof useGetTransactionsQuery>[0]
  >(
    useGetTransactionsQuery,
    {
      accountId: selectedAccountId,
      ...(debouncedAmountFilter !== "" && { amount: +debouncedAmountFilter }),
      status: statusFilter,
      from: dateRange?.from?.toISOString(),
      to: dateRange?.to?.toISOString(),
      sort: "date",
    },
    { pageSize: 20 }
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

  // Show loading when account is not selected yet
  if (selectedAccountId === null) {
    return (
      <div className="h-full flex flex-col gap-y-6">
        <div className="flex-1 min-h-0 flex items-center justify-center">
          <div className="text-muted-foreground">Cargando cuenta...</div>
        </div>
      </div>
    );
  }

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
          loading={loading}
          loadingMore={loadingMore}
          hasMore={hasMore}
          onLoadMore={loadMore}
          total={total}
          bottomLeftComponent={
            <div className="flex items-center gap-4">
              {/* Note: Row selection with infinite scroll */}
            </div>
          }
        />
      </div>
    </div>
  );
}
