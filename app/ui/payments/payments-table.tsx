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
import { formatNumber } from "@/app/lib/helpers";

const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "paymentRequestDate",
    header: "Fecha/Hora",
    cell: ({ row }) => {
      const formatted = new Date(
        row.getValue("paymentRequestDate")
      ).toLocaleString("es-AR");
      return formatted;
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
  { accessorKey: "currency", header: "Moneda" },
  {
    accessorKey: "method",
    header: "Metodo",
    cell: ({ row }) => {
      return _.capitalize(paymentMethodToString(row.getValue("method")));
    },
  },
  { accessorKey: "clientCode", header: "Codigo de cliente" },
];

export default function PaymentsTable() {
  // Pagination
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);

  const {
    data: payments,
    isLoading: loadingPayments,
    isFetching: fetchingPayments,
  } = useGetPaymentsQuery(
    {
      page: pageIndex + 1, // Current page
      limit: pageSize, // Amount of pages
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
