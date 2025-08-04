"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import _ from "lodash";
import { Download } from "lucide-react";
import { useCallback, useState } from "react";

import {
  FetchPageFn,
  useMinimalInfinite,
} from "@/app/hooks/use-minimal-infinite";
import useExcel from "@/app/hooks/useExcel";
import { useLazyGetClientOperationsQuery } from "@/app/lib/clients/api";
import { Client, Operation } from "@/app/lib/clients/types";
import { formatDate, formatNumber } from "@/app/lib/helpers";
import { paymentMethodToString } from "@/app/lib/payments/helpers";
import { sortByOptions } from "@/app/lib/transactions/data";
import { transactionTypeToString } from "@/app/lib/transactions/helpers";
import { SortBy, TransactionType } from "@/app/lib/transactions/types";
import { DateRange } from "react-day-picker";
import SimpleInfiniteTable from "../simple-infinite-table";
import DateRangeFilter from "../transactions/filters/date-range-filter";
import SortByFilter from "../transactions/filters/sort-by-filter";
import TypeFilter from "../transactions/filters/type-filter";

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

export default function ClientTransactionTable({ client }: { client: Client }) {
  // Filters
  const [dateRange, setDateRange] = useState<DateRange>();
  const [sortBy, setSortBy] = useState<SortBy>(
    sortByOptions[0].value as SortBy
  );
  const [type, setType] = useState<"transactions" | "payments" | "all">("all");
  const [exportingOperations, setExportOperations] = useState(false);

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
      clientId: client.id,
      ...(dateRange?.from && { from: dateRange.from.toISOString() }),
      ...(dateRange?.to && { to: dateRange.to.toISOString() }),
      ...(type && { type }),
      ...(sortBy && { sort: sortBy }),
    },
    { pageSize: 30 }
  ); // Optimized for complex data & multiple filters

  const { exportToExcel } = useExcel();

  const handleDownload = async () => {
    try {
      setExportOperations(true);

      const { data: operationsWithoutLimit } = await fetchOperations({
        clientId: client.id,
        from: dateRange?.from?.toISOString(),
        to: dateRange?.to?.toISOString(),
        sort: sortBy,
        type: type,
        limit: 0,
      }).unwrap();

      if (
        !operationsWithoutLimit ||
        operationsWithoutLimit.length === 0 ||
        !client
      )
        return;

      const exportData = operationsWithoutLimit.map((op, i) => ({
        "Fecha/Hora": formatDate(op.date),
        "Fecha/Hora Asignación": formatDate(op.assignedAt),
        Tipo: _.capitalize(transactionTypeToString(op.type as TransactionType)),
        Monto: parseFloat(op.amount),
        Método: op.method ? _.capitalize(paymentMethodToString(op.method)) : "",
        "A Cliente": _.isNaN(parseFloat(op.clientAmount))
          ? "-"
          : parseFloat(op.clientAmount),
        "Saldo Actual":
          i === operationsWithoutLimit.length - 1 ? +client.balance : "",
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
    } catch (error) {
    } finally {
      setExportOperations(false);
    }
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
                loading={exportingOperations}
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
