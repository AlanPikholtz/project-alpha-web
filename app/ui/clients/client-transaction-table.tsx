"use client";

import React, { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

import SimpleInfiniteTable from "../simple-infinite-table";
import { useMinimalInfinite } from "@/app/hooks/use-minimal-infinite";
import { useGetClientOperationsQuery } from "@/app/lib/clients/api";
import { Operation } from "@/app/lib/clients/types";
import { formatDate, formatNumber } from "@/app/lib/helpers";
import useExcel from "@/app/hooks/useExcel";
import { SortBy } from "@/app/lib/transactions/types";
import { DateRange } from "react-day-picker";
import DateRangeFilter from "../transactions/filters/date-range-filter";
import SortByFilter from "../transactions/filters/sort-by-filter";
import TypeFilter from "../transactions/filters/type-filter";
import { sortByOptions } from "@/app/lib/transactions/data";

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
    accessorKey: "type",
    header: "Tipo",
    cell: ({ row }) => {
      const type = row.getValue("type") as string;
      return type === "transaction" ? "Transacción" : "Pago";
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

export default function ClientTransactionTable() {
  const { id } = useParams(); // Get the dynamic ID from the URL
  const { exportToExcel } = useExcel();

  // Filters
  const [sortByFilter, setSortByFilter] = useState<SortBy | undefined>(
    sortByOptions[0].value as SortBy | undefined
  );
  const [typeFilter, setTypeFilter] = useState<
    "transactions" | "payments" | "all"
  >("all");
  const [dateRange, setDateRange] = useState<DateRange>();

  // Use the new MINIMAL infinite scroll
  const {
    data: operations,
    loading,
    loadingMore,
    hasMore,
    loadMore,
    total,
  } = useMinimalInfinite<
    Operation,
    Parameters<typeof useGetClientOperationsQuery>[0]
  >(
    useGetClientOperationsQuery,
    {
      clientId: id as unknown as number,
      type: typeFilter,
      from: dateRange?.from?.toISOString(),
      to: dateRange?.to?.toISOString(),
      sort: sortByFilter,
    },
    { pageSize: 20 }
  );

  return (
    <div className="h-full flex flex-col gap-y-6">
      {/* Filters */}
      <div className="flex gap-4 justify-between items-center py-4 flex-shrink-0">
        <DateRangeFilter dateRange={dateRange} setDateRange={setDateRange} />
        <SortByFilter
          sortByFilter={sortByFilter}
          setSortByFilter={setSortByFilter}
        />
        <TypeFilter type={typeFilter} setType={setTypeFilter} />
        <Button
          className="flex gap-2 items-center"
          variant="outline"
          onClick={() =>
            exportToExcel(
              [
                {
                  name: "Operaciones",
                  data: operations.map((op) => ({
                    "Fecha/Hora": formatDate(op.date),
                    Tipo: op.type,
                    Monto: parseFloat(op.amount),
                  })),
                },
              ],
              "client-operations"
            )
          }
          disabled={operations.length === 0}
        >
          <Download className="w-4 h-4" />
          Exportar
        </Button>
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
        />
      </div>
    </div>
  );
}
