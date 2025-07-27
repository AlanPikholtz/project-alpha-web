"use client";

import React, { useState, useCallback } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import _ from "lodash";

import SimpleInfiniteTable from "../simple-infinite-table";
import {
  useMinimalInfinite,
  FetchPageFn,
} from "@/app/hooks/use-minimal-infinite";
import { useLazyGetClientOperationsQuery } from "@/app/lib/clients/api";
import { Operation, Client } from "@/app/lib/clients/types";
import { formatDate, formatNumber } from "@/app/lib/helpers";
import useExcel from "@/app/hooks/useExcel";
import { SortBy, TransactionType } from "@/app/lib/transactions/types";
import { DateRange } from "react-day-picker";
import DateRangeFilter from "../transactions/filters/date-range-filter";
import SortByFilter from "../transactions/filters/sort-by-filter";
import TypeFilter from "../transactions/filters/type-filter";
import { sortByOptions } from "@/app/lib/transactions/data";
import { paymentMethodToString } from "@/app/lib/payments/helpers";
import { transactionTypeToString } from "@/app/lib/transactions/helpers";

const columns: ColumnDef<Operation>[] = [
  {
    accessorKey: "date",
    header: "Fecha/Hora",
    cell: ({ row }) => {
      const formatted = formatDate(row.getValue("date"));
      return formatted;
    },
  },
  {
    accessorKey: "assignedAt",
    header: "Fecha/Hora Asignación",
    cell: ({ row }) => {
      const formatted = formatDate(row.getValue("assignedAt"));
      return formatted;
    },
  },
  {
    accessorKey: "type",
    header: "Tipo",
    cell: ({ row }) => {
      const type = row.getValue("type") as TransactionType;
      return _.capitalize(transactionTypeToString(type));
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
  {
    accessorKey: "method",
    header: "Método",
    cell: ({ row }) => {
      const method = row.getValue("method");
      return method
        ? _.capitalize(paymentMethodToString(row.getValue("method")))
        : "";
    },
  },
  {
    accessorKey: "clientAmount",
    header: "A Cliente",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("clientAmount"));
      return _.isNaN(amount)
        ? "-"
        : formatNumber(amount, { style: "currency", currency: "ARS" });
    },
  },
];

export default function ClientTransactionTable({
  client,
}: {
  client?: Client;
}) {
  const { id } = useParams(); // Get the dynamic ID from the URL
  const clientId = parseInt(id as string, 10);

  // Filters
  const [dateRange, setDateRange] = useState<DateRange>();
  const [sortBy, setSortBy] = useState<SortBy>(
    sortByOptions[0].value as SortBy
  );
  const [type, setType] = useState<"transactions" | "payments" | "all">("all");

  // Create lazy query trigger
  const [fetchOperations] = useLazyGetClientOperationsQuery();

  // Create fetchPage function
  const fetchPage: FetchPageFn<Operation> = useCallback(
    async (params) => {
      const result = await fetchOperations({
        clientId: params.clientId as number,
        page: params.page,
        limit: params.limit,
        from: params.from as string,
        to: params.to as string,
        sort: params.sort as SortBy,
        ...(params.type && params.type !== "all"
          ? { type: params.type as "transactions" | "payments" }
          : {}),
      }).unwrap();

      return result;
    },
    [fetchOperations]
  );

  // Use the new React Native-style infinite hook
  const {
    data: operations,
    loading,
    loadingMore,
    hasMore,
    total,
    error,
    loadMore,
  } = useMinimalInfinite<Operation>(
    fetchPage,
    {
      clientId,
      from: dateRange?.from?.toISOString(),
      to: dateRange?.to?.toISOString(),
      sort: sortBy,
      ...(type !== "all" && { type }),
    },
    { pageSize: 20 }
  );

  const { exportToExcel } = useExcel();

  const handleDownload = () => {
    if (!operations || operations.length === 0 || !client) return;

    const exportData = operations.map((op, i) => ({
      "Fecha/Hora": formatDate(op.date),
      "Fecha/Hora Asignación": formatDate(op.assignedAt),
      Tipo: _.capitalize(transactionTypeToString(op.type as TransactionType)),
      Monto: parseFloat(op.amount),
      Método: op.method ? _.capitalize(paymentMethodToString(op.method)) : "",
      "A Cliente": _.isNaN(parseFloat(op.clientAmount))
        ? "-"
        : parseFloat(op.clientAmount),
      "Saldo Actual": i === operations.length - 1 ? +client.balance : "",
    }));

    // Use client name for personalized filename
    const excelName = `Transacciones - ${client.firstName} ${client.lastName}`;

    exportToExcel(
      [
        {
          name: "Transacciones",
          data: exportData,
          columns: [
            { wch: 25 }, // "Fecha/Hora"
            { wch: 25 }, // "Fecha/Hora Asignación"
            { wch: 20 }, // Tipo
            { wch: 15 }, // Monto
            { wch: 15 }, // Método
            { wch: 15 }, // A Cliente
            { wch: 15 }, // Saldo Actual
          ],
        },
      ],
      excelName
    );
  };

  return (
    <div className="h-full flex flex-col gap-y-6">
      {/* Filters */}
      <div className="flex gap-4 justify-between items-center py-4 flex-shrink-0">
        <DateRangeFilter dateRange={dateRange} setDateRange={setDateRange} />
        <div className="flex items-center gap-4">
          <TypeFilter type={type} setType={setType} />
          <SortByFilter sortByFilter={sortBy} setSortByFilter={setSortBy} />
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 min-h-0">
        <SimpleInfiniteTable
          columns={columns}
          data={operations}
          loading={loading}
          loadingMore={loadingMore}
          hasMore={hasMore}
          onLoadMore={loadMore}
          total={total}
          bottomLeftComponent={
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                disabled={operations.length === 0}
              >
                <Download className="h-4 w-4 mr-2" />
                Descargar Excel
              </Button>
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
