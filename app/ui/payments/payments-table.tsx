import { Payment } from "@/app/lib/payments/types";
import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React, { useState } from "react";
import CustomTable from "../custom-table";
import { useGetPaymentsQuery } from "@/app/lib/payments/api";
import _ from "lodash";
import { paymentMethodToString } from "@/app/lib/payments/helpers";

const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "paymentRequestDate",
    header: "Fecha/Hora",
    cell: ({ row }) => {
      const formatted = new Date(row.getValue("paymentRequestDate")).toLocaleString("es-AR");
      return formatted;
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
  { accessorKey: "currency", header: "Moneda" },
  { accessorKey: "method", header: "Metodo", cell: ({row}) => { return _.capitalize(paymentMethodToString(row.getValue("method")));}},
  { accessorKey: "clientId", header: "ID Cliente" },
];

export default function PaymentsTable() {
  // Pagination
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);

  const { data: payments, isLoading: loadingPayments, isFetching:fetchingPayments } = useGetPaymentsQuery({
    page: pageIndex + 1, // Current page
    limit: pageSize, // Amount of pages
  }, {
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true,
  })


  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const table = useReactTable({
    data: payments?.data || [],
    columns,
    pageCount: payments?.pages,
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

  return (
    <CustomTable
      columns={columns}
      table={table}
      loading={loadingPayments}
      fetching={fetchingPayments}
      withPagination
    />
  );
}
