import { SortBy } from "@/app/lib/transactions/types";
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
import useExcel from "@/app/hooks/useExcel";
import { Button } from "@/components/ui/button";
import { transactionTypeToString } from "@/app/lib/transactions/helpers";
import _ from "lodash";
import SortByFilter from "../transactions/filters/sort-by-filter";
import { sortByOptions } from "@/app/lib/transactions/data";
import { formatNumber } from "@/app/lib/helpers";
import { Client, Operation } from "@/app/lib/clients/types";
import { useGetClientOperationsQuery } from "@/app/lib/clients/api";

const columns: ColumnDef<Operation>[] = [
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
      return formatNumber(amount, { style: "currency", currency: "ARS" });
    },
  },
  {
    accessorKey: "clientAmount",
    header: "A Cliente",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("clientAmount"));
      if (_.isNaN(amount)) return "-";
      const formatted = new Intl.NumberFormat("es-AR", {
        // Argetina formatting
        style: "currency",
        currency: "ARS",
      }).format(amount);

      return formatted;
    },
  },
];

export default function ClientTransactionTable({
  client,
}: {
  client?: Client;
}) {
  const { id } = useParams(); // Get the dynamic ID from the URL

  const { exportToExcel } = useExcel();

  // Filters
  const [sortByFilter, setSortByFilter] = useState<SortBy | undefined>(
    sortByOptions[0].value as SortBy | undefined
  );
  const [dateRange, setDateRange] = useState<DateRange>();
  // const [typeFilter, setTypeFilter] = useState<unknown>();

  // Pagination
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);

  const { data: operations, isLoading: loadingOperations } =
    useGetClientOperationsQuery({
      clientId: id as unknown as number,
      page: pageIndex + 1, // Current page
      limit: pageSize, // Amount of pages
      from: dateRange?.from?.toISOString(),
      to: dateRange?.to?.toISOString(),
      sort: sortByFilter,
      // status: typeFilter,
    });

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const table = useReactTable({
    data: operations?.data || [],
    columns,
    pageCount: operations?.pages,
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
    if (!operations || operations.data.length === 0 || !client) return;

    const exportData = operations.data.map((t) => ({
      "Nombre completo": `${client.firstName} ${client.lastName}`,
      Monto: t.amount,
      Fecha: new Date(t.date).toLocaleDateString("es-AR"),
      Tipo: transactionTypeToString(t.type),
    }));

    exportToExcel(
      [
        {
          name: `Transacciones ${client.firstName} ${client.lastName}`,
          data: exportData,
        },
      ],
      "Transacciones"
    );
  };
  return (
    <div className="flex flex-col gap-y-6.5">
      {/* Filters */}
      <div className="flex gap-4 justify-between items-center py-4">
        <SortByFilter
          sortByFilter={sortByFilter}
          setSortByFilter={setSortByFilter}
        />
        <DateRangeFilter dateRange={dateRange} setDateRange={setDateRange} />
      </div>
      {/* Table */}
      <CustomTable
        columns={columns}
        table={table}
        loading={loadingOperations}
        withPagination
        bottomLeftComponent={
          <Button
            className="self-start"
            disabled={operations && operations?.data.length === 0}
            onClick={handleExcelExport}
          >
            Exportar
          </Button>
        }
      />
    </div>
  );
}
