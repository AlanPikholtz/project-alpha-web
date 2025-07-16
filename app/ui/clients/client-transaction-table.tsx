import { SortBy } from "@/app/lib/transactions/types";
import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React, { useEffect, useState } from "react";
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
import { formatDate, formatNumber } from "@/app/lib/helpers";
import { Client, Operation } from "@/app/lib/clients/types";
import { useGetClientOperationsQuery } from "@/app/lib/clients/api";
import { paymentMethodToString } from "@/app/lib/payments/helpers";
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
      const formatted = new Date(row.getValue("assignedAt")).toLocaleString(
        "es-AR"
      );
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
      if (_.isNaN(amount)) return "-";
      return formatNumber(amount, { style: "currency", currency: "ARS" });
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
  const [typeFilter, setTypeFilter] = useState<
    "transactions" | "payments" | "all"
  >("all");
  const [dateRange, setDateRange] = useState<DateRange>();

  // Pagination
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);

  const {
    data: operations,
    isLoading: loadingOperations,
    isFetching: fetchingOperations,
  } = useGetClientOperationsQuery({
    clientId: id as unknown as number,
    type: typeFilter,
    page: pageIndex + 1, // Current page
    limit: pageSize, // Amount of pages
    from: dateRange?.from?.toISOString(),
    to: dateRange?.to?.toISOString(),
    sort: sortByFilter,
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

    const exportData = operations.data.map((t, i) => ({
      "Fecha/Hora": formatDate(t.date),
      "Fecha/Hora Asignación": formatDate(t.assignedAt),
      Tipo: transactionTypeToString(t.type),
      Monto: _.isNaN(parseFloat(t.amount))
        ? "-"
        : formatNumber(parseFloat(t.amount), {
            style: "currency",
            currency: "ARS",
          }),
      Método: t.method ? _.capitalize(paymentMethodToString(t.method)) : "",
      "A Cliente": _.isNaN(parseFloat(t.clientAmount))
        ? "-"
        : formatNumber(parseFloat(t.clientAmount), {
            style: "currency",
            currency: "ARS",
          }),
      "Saldo Actual":
        i === operations.data.length - 1
          ? formatNumber(+client.balance, {
              style: "currency",
              currency: "ARS",
            })
          : "",
    }));

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
          ],
        },
      ],
      excelName
    );
  };

  // Reset page on filters change
  useEffect(() => {
    setPageIndex(0);
  }, [sortByFilter, dateRange]);

  return (
    <div className="flex flex-col gap-y-6.5">
      {/* Filters */}
      <div className="flex gap-4 justify-between items-center py-4">
        <DateRangeFilter dateRange={dateRange} setDateRange={setDateRange} />
        <div className="flex items-center gap-4">
          <TypeFilter type={typeFilter} setType={setTypeFilter} />
          <SortByFilter
            sortByFilter={sortByFilter}
            setSortByFilter={setSortByFilter}
          />
        </div>
      </div>
      {/* Table */}
      <CustomTable
        columns={columns}
        table={table}
        loading={loadingOperations}
        fetching={fetchingOperations}
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
